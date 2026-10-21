/**
 * SolOS Page: Financial Ledger (자금 정리)
 * Transaction journal, bulk editing (Excel mode), pagination & search filters, fixed expense scheduling, CSV export
 */

    // ==================== LEDGER BULK EDIT (EXCEL MODE) LOGIC ====================
    function toggleLedgerBulkEdit(forceState) {
      if (typeof forceState === 'boolean') {
        isLedgerBulkEditing = forceState;
      } else {
        isLedgerBulkEditing = !isLedgerBulkEditing;
      }
      renderLedgerTable();
    }

    function saveLedgerBulkEdit() {
      const dateInputs = document.querySelectorAll('.bulk-tx-date');
      dateInputs.forEach(dateEl => {
        const id = Number(dateEl.dataset.id);
        const tx = appState.transactions.find(t => t.id === id);
        if (tx) {
          tx.date = dateEl.value;
          const domainEl = document.querySelector(`.bulk-tx-domain[data-id="${id}"]`);
          if (domainEl) tx.domain = domainEl.value;
          const titleEl = document.querySelector(`.bulk-tx-title[data-id="${id}"]`);
          if (titleEl) tx.title = titleEl.value.trim();
          const catEl = document.querySelector(`.bulk-tx-category[data-id="${id}"]`);
          if (catEl) tx.category = catEl.value.trim();
          const grossEl = document.querySelector(`.bulk-tx-gross[data-id="${id}"]`);
          if (grossEl) {
            const val = grossEl.value.trim();
            tx.gross = val === '' ? '' : (parseFloat(val) || 0);
          }
          const taxEl = document.querySelector(`.bulk-tx-tax[data-id="${id}"]`);
          if (taxEl) {
            const val = taxEl.value.trim();
            tx.tax = val === '' ? '' : (parseFloat(val) || 0);
          }
          const netEl = document.querySelector(`.bulk-tx-net[data-id="${id}"]`);
          if (netEl) {
            const val = netEl.value.trim();
            tx.net = val === '' ? '' : (parseFloat(val) || 0);
          }
          const statusEl = document.querySelector(`.bulk-tx-status[data-id="${id}"]`);
          if (statusEl) tx.status = normalizeReceiptStatus(statusEl.value);
        }
      });

      isLedgerBulkEditing = false;
      renderLedgerTable();
      updateKPICards();
      updateVisualStatements();
      showToast('거래 내역이 엑셀 모드에서 일괄 저장되었습니다.');
    }

    function cancelLedgerBulkEdit() {
      isLedgerBulkEditing = false;
      renderLedgerTable();
      showToast('엑셀 편집이 취소되었습니다.');
    }

    function addLedgerBlankRow() {
      const today = new Date().toISOString().split('T')[0];
      const newId = Date.now();
      isLedgerBulkEditing = true;
      appState.transactions.unshift({
        id: newId,
        date: today,
        domain: '',
        title: '',
        category: '',
        gross: '',
        tax: '',
        net: '',
        status: ''
      });
      if (typeof ledgerCurrentPage !== 'undefined') ledgerCurrentPage = 1;
      renderLedgerTable();
      setTimeout(() => {
        const titleInput = document.querySelector(`.bulk-tx-title[data-id="${newId}"]`);
        if (titleInput) titleInput.focus();
      }, 50);
      showToast('새로운 빈 거래 행이 추가되었습니다. 거래 정보를 입력해주세요.');
    }

    function deleteLedgerRow(txId) {
      if (confirm('해당 거래 내역을 삭제하시겠습니까?')) {
        appState.transactions = appState.transactions.filter(t => t.id !== txId);
        renderLedgerTable();
        updateKPICards();
        updateVisualStatements();
        showToast('거래 내역이 삭제되었습니다.');
      }
    }


    function exportLedgerCSV() {
      let csv = "거래일자,업무도메인,적요,계정과목,공급가액,원천세,실입출금액,공제영수증\n";
      appState.transactions.forEach(t => {
        csv += `${t.date || ''},${t.domain || ''},"${(t.title || '').replace(/"/g, '""')}",${t.category || ''},${t.gross !== undefined ? t.gross : ''},${t.tax !== undefined ? t.tax : ''},${t.net !== undefined ? t.net : ''},${normalizeReceiptStatus(t.status)}\n`;
      });
      const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SolOS_3대세무_분개장_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }


// ==================== LEDGER & TRANSACTION FILTERING / PAGINATION ====================
let ledgerPageSize = 20;
let ledgerCurrentPage = 1;
let ledgerSearchQuery = '';
let ledgerStartDate = '';
let ledgerEndDate = '';
let ledgerFixedExpenseOnly = false;

function onLedgerPageSizeChange(val) {
  ledgerPageSize = parseInt(val, 10) || 20;
  ledgerCurrentPage = 1;
  renderLedgerTable();
}

function onLedgerSearchInput(val) {
  ledgerSearchQuery = (val || '').trim();
  ledgerCurrentPage = 1;
  renderLedgerTable();
}

function onLedgerDateRangeChange() {
  const startEl = document.getElementById('ledgerStartDate');
  const endEl = document.getElementById('ledgerEndDate');
  ledgerStartDate = startEl ? startEl.value : '';
  ledgerEndDate = endEl ? endEl.value : '';
  ledgerCurrentPage = 1;
  renderLedgerTable();
}

function resetLedgerDateRange() {
  const startEl = document.getElementById('ledgerStartDate');
  const endEl = document.getElementById('ledgerEndDate');
  if (startEl) startEl.value = '';
  if (endEl) endEl.value = '';
  ledgerStartDate = '';
  ledgerEndDate = '';
  ledgerCurrentPage = 1;
  renderLedgerTable();
}

function toggleLedgerFixedExpenseFilter(checked) {
  ledgerFixedExpenseOnly = Boolean(checked);
  ledgerCurrentPage = 1;
  renderLedgerTable();
}

function goToLedgerPage(page) {
  ledgerCurrentPage = page;
  renderLedgerTable();
  const table = document.getElementById('ledgerTableBody');
  if (table) table.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderLedgerPagination(totalItems, pageSize, currentPage) {
  const summaryEl = document.getElementById('ledgerPaginationSummary');
  const buttonsEl = document.getElementById('ledgerPaginationButtons');
  if (!summaryEl || !buttonsEl) return;

  if (totalItems === 0) {
    summaryEl.textContent = '조회된 거래 내역이 없습니다.';
    buttonsEl.innerHTML = '';
    return;
  }

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalItems);

  summaryEl.innerHTML = `총 <strong class="text-slate-800 font-bold">${totalItems.toLocaleString()}건</strong> 중 ${startIndex}~${endIndex}건 표시 (${currentPage}/${totalPages} 페이지)`;

  let buttonsHtml = '';
  // Previous button
  buttonsHtml += `
    <button type="button" onclick="goToLedgerPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled class="px-2.5 py-1 rounded-lg text-slate-300 border border-slate-200 text-xs cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs"'}>
      이전
    </button>
  `;

  // Page numbers
  const maxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxButtons - 1);
  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  for (let p = startPage; p <= endPage; p++) {
    if (p === currentPage) {
      buttonsHtml += `<button type="button" class="w-7 h-7 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">${p}</button>`;
    } else {
      buttonsHtml += `<button type="button" onclick="goToLedgerPage(${p})" class="w-7 h-7 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center cursor-pointer shadow-2xs">${p}</button>`;
    }
  }

  // Next button
  buttonsHtml += `
    <button type="button" onclick="goToLedgerPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled class="px-2.5 py-1 rounded-lg text-slate-300 border border-slate-200 text-xs cursor-not-allowed"' : 'class="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer shadow-2xs"'}>
      다음
    </button>
  `;

  buttonsEl.innerHTML = buttonsHtml;
}

// Render Ledger Table (Light Theme & Excel Bulk Edit Mode + Pagination & Filtering)
function renderLedgerTable() {
  if (!isLedgerBulkEditing) {
    saveCurrentWorkspaceData();
  }
  const tbody = document.getElementById('ledgerTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  let list = appState.transactions || [];

  // 1. Filter by Domain
  if (appState.currentWorkstream !== 'all') {
    list = list.filter(t => t.domain === appState.currentWorkstream);
  }

  // 2. Filter by Fixed Expense Only
  if (ledgerFixedExpenseOnly) {
    list = list.filter(t => t.isFixedExpense === true || (t.category && t.category.includes('고정비')) || (t.title && t.title.includes('고정비')));
  }

  // 3. Filter by Date Range
  if (ledgerStartDate) {
    list = list.filter(t => t.date && t.date >= ledgerStartDate);
  }
  if (ledgerEndDate) {
    list = list.filter(t => t.date && t.date <= ledgerEndDate);
  }

  // 4. Filter by Search Query
  if (ledgerSearchQuery) {
    const q = ledgerSearchQuery.toLowerCase();
    list = list.filter(t =>
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.category && t.category.toLowerCase().includes(q)) ||
      (t.status && t.status.toLowerCase().includes(q)) ||
      (t.date && t.date.includes(q)) ||
      (t.gross && String(t.gross).includes(q)) ||
      (t.net && String(t.net).includes(q))
    );
  }

  // Update bulk edit banner and toggle button
  const bulkBar = document.getElementById('ledgerBulkActionsBar');
  const toggleBtn = document.getElementById('btnToggleBulkEdit');
  if (bulkBar) {
    if (isLedgerBulkEditing) {
      bulkBar.classList.remove('hidden');
    } else {
      bulkBar.classList.add('hidden');
    }
  }
  if (toggleBtn) {
    if (isLedgerBulkEditing) {
      toggleBtn.className = 'px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all';
      toggleBtn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i><span>일괄 저장 완료</span>';
    } else {
      toggleBtn.className = 'px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all';
      toggleBtn.innerHTML = '<i data-lucide="file-spreadsheet" class="w-3.5 h-3.5 text-indigo-600"></i><span>전체 편집 모드</span>';
    }
  }

  const totalItems = list.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ledgerPageSize));
  if (ledgerCurrentPage > totalPages) ledgerCurrentPage = totalPages;
  if (ledgerCurrentPage < 1) ledgerCurrentPage = 1;

  renderLedgerPagination(totalItems, ledgerPageSize, ledgerCurrentPage);

  if (totalItems === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="text-center py-8 text-slate-400">조건에 일치하는 거래 내역이 없습니다.</td></tr>`;
    lucide.createIcons();
    return;
  }

  const startIndex = (ledgerCurrentPage - 1) * ledgerPageSize;
  const endIndex = Math.min(startIndex + ledgerPageSize, totalItems);
  const pagedList = isLedgerBulkEditing ? list : list.slice(startIndex, endIndex);

  const domainBadge = {
    client: '<span class="inline-block px-2.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold whitespace-nowrap shrink-0">외주</span>',
    publishing: '<span class="inline-block px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold whitespace-nowrap shrink-0">출판</span>',
    knowledge: '<span class="inline-block px-2.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold whitespace-nowrap shrink-0">지식창업</span>',
    operation: '<span class="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold whitespace-nowrap shrink-0">운영</span>',
  };

  pagedList.forEach(tx => {
    const grossNum = parseFloat(tx.gross);
    const taxNum = parseFloat(tx.tax);
    const netNum = parseFloat(tx.net);
    const hasGross = !isNaN(grossNum) && tx.gross !== '';
    const hasTax = !isNaN(taxNum) && tx.tax !== '';
    const hasNet = !isNaN(netNum) && tx.net !== '';
    const isExpense = (hasNet && netNum < 0) || (hasGross && grossNum < 0);
    const isFixed = tx.isFixedExpense || (tx.category && tx.category.includes('고정비')) || (tx.title && tx.title.includes('고정비'));

    const tr = document.createElement('tr');
    tr.className = isLedgerBulkEditing ? 'bg-indigo-50/20 hover:bg-indigo-50/40 transition-colors' : 'hover:bg-slate-50 transition-colors';

    const normStatus = normalizeReceiptStatus(tx.status);

    if (isLedgerBulkEditing) {
      // Excel Bulk Edit Mode
      tr.innerHTML = `
            <td class="py-2.5 px-3 whitespace-nowrap">
              <input type="date" class="bulk-tx-date w-28 p-1 text-xs font-mono bg-white border border-slate-300 rounded focus:border-indigo-500" value="${tx.date || ''}" data-id="${tx.id}">
            </td>
            <td class="py-2.5 px-2 text-center whitespace-nowrap">
              <select class="bulk-tx-domain p-1 text-xs bg-white border border-slate-300 rounded focus:border-indigo-500" data-id="${tx.id}">
                <option value="" ${!tx.domain ? 'selected' : ''}>선택</option>
                <option value="client" ${tx.domain === 'client' ? 'selected' : ''}>외주</option>
                <option value="publishing" ${tx.domain === 'publishing' ? 'selected' : ''}>출판</option>
                <option value="knowledge" ${tx.domain === 'knowledge' ? 'selected' : ''}>지식창업</option>
                <option value="operation" ${tx.domain === 'operation' ? 'selected' : ''}>운영</option>
              </select>
            </td>
            <td class="py-2.5 px-3">
              <input type="text" class="bulk-tx-title w-full min-w-[150px] p-1 text-xs bg-white border border-slate-300 rounded font-bold text-slate-800 focus:border-indigo-500" placeholder="적요 또는 거래처명" value="${escapeHtml(tx.title || '')}" data-id="${tx.id}">
            </td>
            <td class="py-2.5 px-2 whitespace-nowrap">
              <input type="text" class="bulk-tx-category w-full min-w-[110px] p-1 text-xs bg-white border border-slate-300 rounded text-slate-600 focus:border-indigo-500" placeholder="계정과목" value="${escapeHtml(tx.category || '')}" data-id="${tx.id}">
            </td>
            <td class="py-2.5 px-3 text-right whitespace-nowrap">
              <input type="number" class="bulk-tx-gross w-24 p-1 text-xs font-mono text-right bg-white border border-slate-300 rounded focus:border-indigo-500" placeholder="0" value="${tx.gross !== '' && tx.gross !== undefined ? tx.gross : ''}" data-id="${tx.id}">
            </td>
            <td class="py-2.5 px-3 text-right whitespace-nowrap">
              <input type="number" class="bulk-tx-tax w-20 p-1 text-xs font-mono text-right bg-white border border-slate-300 rounded text-amber-700 focus:border-indigo-500" placeholder="0" value="${tx.tax !== '' && tx.tax !== undefined ? tx.tax : ''}" data-id="${tx.id}">
            </td>
            <td class="py-2.5 px-3 text-right whitespace-nowrap">
              <input type="number" class="bulk-tx-net w-24 p-1 text-xs font-mono text-right font-black bg-white border border-slate-300 rounded focus:border-indigo-500 ${isExpense ? 'text-rose-600' : 'text-emerald-700'}" placeholder="0" value="${tx.net !== '' && tx.net !== undefined ? tx.net : ''}" data-id="${tx.id}">
            </td>
            <td class="py-2.5 px-2 text-center whitespace-nowrap">
              <select class="bulk-tx-status p-1 text-[11px] bg-white border border-slate-300 rounded focus:border-indigo-500" data-id="${tx.id}">
                <option value="" ${!normStatus ? 'selected' : ''}>선택</option>
                <option value="세금계산서" ${normStatus === '세금계산서' ? 'selected' : ''}>세금계산서</option>
                <option value="계산서(면세)" ${normStatus === '계산서(면세)' ? 'selected' : ''}>계산서(면세)</option>
                <option value="신용카드전표" ${normStatus === '신용카드전표' ? 'selected' : ''}>신용카드전표</option>
                <option value="현금영수증" ${normStatus === '현금영수증' ? 'selected' : ''}>현금영수증</option>
                <option value="원천징수영수증" ${normStatus === '원천징수영수증' ? 'selected' : ''}>원천징수영수증</option>
                <option value="간이영수증" ${normStatus === '간이영수증' ? 'selected' : ''}>간이영수증</option>
              </select>
            </td>
            <td class="py-2.5 px-2 text-center whitespace-nowrap">
              <button type="button" onclick="deleteLedgerRow(${tx.id})" title="행 삭제" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </td>
          `;
    } else {
      // Normal Display Mode
      const domainHtml = domainBadge[tx.domain] || '<span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200 text-[10px] font-medium whitespace-nowrap shrink-0">미선택</span>';
      
      // Fixed expense badge
      const fixedTag = isFixed ? `<span class="inline-block ml-1.5 px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 text-[9.5px] font-bold border border-rose-200">고정비${tx.paymentDay ? ` · 매월 ${tx.paymentDay}일` : ''}</span>` : '';
      
      const statusHtml = normStatus
        ? `<span class="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200 whitespace-nowrap shrink-0">${escapeHtml(normStatus)}</span>`
        : `<span class="inline-block px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-400 text-[10px] font-medium border border-dashed border-slate-200 whitespace-nowrap shrink-0">선택</span>`;
      const grossDisplay = hasGross ? `₩${Math.abs(grossNum).toLocaleString()}` : '-';
      const taxDisplay = hasTax && taxNum !== 0 ? `₩${Math.abs(taxNum).toLocaleString()}` : '-';
      const netDisplay = hasNet
        ? `${(isExpense ? '-₩' : '+₩') + Math.abs(netNum).toLocaleString()}`
        : '-';

      tr.innerHTML = `
            <td class="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">${tx.date || '-'}</td>
            <td class="py-3 px-3 text-center whitespace-nowrap">${domainHtml}</td>
            <td class="py-3 px-4 font-bold text-slate-800 break-keep leading-snug">
              <span>${escapeHtml(tx.title || '-')}</span>
              ${fixedTag}
            </td>
            <td class="py-3 px-3 text-slate-600 font-medium whitespace-nowrap">${escapeHtml(tx.category || '-')}</td>
            <td class="py-3 px-4 text-right font-mono font-semibold whitespace-nowrap ${isExpense ? 'text-slate-500' : 'text-slate-800'}">${grossDisplay}</td>
            <td class="py-3 px-3 text-right font-mono font-bold text-amber-700 whitespace-nowrap">${taxDisplay}</td>
            <td class="py-3 px-4 text-right font-mono font-black whitespace-nowrap tracking-tight ${isExpense ? 'text-rose-600' : 'text-emerald-700'}">
              ${netDisplay}
            </td>
            <td class="py-3 px-3 text-center whitespace-nowrap">
              ${statusHtml}
            </td>
            <td class="py-3 px-3 text-center whitespace-nowrap">
              <div class="flex items-center justify-center gap-1">
                <button type="button" onclick="toggleLedgerBulkEdit(true)" title="엑셀 전체 편집" class="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors">
                  <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                </button>
                <button type="button" onclick="deleteLedgerRow(${tx.id})" title="삭제" class="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </td>
          `;
    }
    tbody.appendChild(tr);
  });
  lucide.createIcons();
}

// --- 고정 지출 출금일 설정 모달 핸들러 ---
function openFixedExpenseScheduleModal() {
  const modal = document.getElementById('fixedExpenseScheduleModal');
  if (!modal) return;
  modal.classList.remove('hidden');
  renderFixedExpenseScheduleRows();
  lucide.createIcons();
}

function closeFixedExpenseScheduleModal() {
  const modal = document.getElementById('fixedExpenseScheduleModal');
  if (modal) modal.classList.add('hidden');
}

function renderFixedExpenseScheduleRows() {
  const tbody = document.getElementById('fesTableBody');
  const countEl = document.getElementById('fesItemCount');
  if (!tbody) return;

  const txs = appState.transactions || [];
  let fixedTxs = txs.filter(t => t.isFixedExpense === true || (t.category && t.category.includes('고정비')) || (t.title && t.title.includes('고정비')));

  // 기본 고정비가 없으면 초기 5대 고정비 탑재
  if (fixedTxs.length === 0) {
    fixedTxs = [
      { id: 6, title: '패스트파이브 공유오피스 월 임차료 (고정비)', paymentDay: 25, net: -1100000 },
      { id: 7, title: 'Adobe/Figma/GitHub/Notion 등 업무 SW 구독료 (고정비)', paymentDay: 25, net: -480000 },
      { id: 8, title: 'KT 기업인터넷 & 업무용 모바일 회선 (고정비)', paymentDay: 25, net: -150000 },
      { id: 9, title: '국민연금 & 건강보험 1인사업자 납부 (고정비)', paymentDay: 10, net: -400000 },
      { id: 10, title: '사업장 기본 운영비 및 세무 기장료 (고정비)', paymentDay: 25, net: -600000 }
    ];
  }

  if (countEl) countEl.textContent = fixedTxs.length;

  let html = '';
  fixedTxs.forEach(tx => {
    const rawAmt = Math.abs(parseFloat(tx.net) || parseFloat(tx.gross) || 0);
    const day = tx.paymentDay || (tx.date ? parseInt(tx.date.split('-')[2], 10) : 25);

    let dayOptions = '';
    for (let d = 1; d <= 31; d++) {
      dayOptions += `<option value="${d}" ${d === day ? 'selected' : ''}>매월 ${d}일</option>`;
    }

    html += `
      <tr class="hover:bg-slate-50/70 transition-colors fes-item-row" data-id="${tx.id}">
        <td class="py-2.5 px-3">
          <input type="text" class="fes-row-title w-full p-1.5 text-xs font-bold rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500" value="${escapeHtml(tx.title || '')}" placeholder="항목명">
        </td>
        <td class="py-2.5 px-3 whitespace-nowrap">
          <select class="fes-row-day p-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 cursor-pointer">
            ${dayOptions}
          </select>
        </td>
        <td class="py-2.5 px-3 text-right whitespace-nowrap">
          <input type="number" class="fes-row-amount w-28 p-1.5 text-xs font-mono font-bold text-right text-rose-700 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500" value="${rawAmt}" oninput="calcFesTotal()">
        </td>
        <td class="py-2.5 px-2 text-center whitespace-nowrap">
          <button type="button" onclick="deleteFesRow(this)" title="항목 삭제" class="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
  calcFesTotal();
  lucide.createIcons();
}

function addFixedExpenseRow() {
  const tbody = document.getElementById('fesTableBody');
  if (!tbody) return;

  let dayOptions = '';
  for (let d = 1; d <= 31; d++) {
    dayOptions += `<option value="${d}" ${d === 25 ? 'selected' : ''}>매월 ${d}일</option>`;
  }

  const tr = document.createElement('tr');
  tr.className = 'hover:bg-slate-50/70 transition-colors fes-item-row bg-indigo-50/30';
  tr.dataset.id = 'new_' + Date.now();
  tr.innerHTML = `
    <td class="py-2.5 px-3">
      <input type="text" class="fes-row-title w-full p-1.5 text-xs font-bold rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500" placeholder="새 고정비 항목명 (예: 작업실 임차료)">
    </td>
    <td class="py-2.5 px-3 whitespace-nowrap">
      <select class="fes-row-day p-1.5 text-xs font-mono font-bold rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 cursor-pointer">
        ${dayOptions}
      </select>
    </td>
    <td class="py-2.5 px-3 text-right whitespace-nowrap">
      <input type="number" class="fes-row-amount w-28 p-1.5 text-xs font-mono font-bold text-right text-rose-700 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500" value="0" oninput="calcFesTotal()">
    </td>
    <td class="py-2.5 px-2 text-center whitespace-nowrap">
      <button type="button" onclick="deleteFesRow(this)" title="항목 삭제" class="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
        <i data-lucide="trash-2" class="w-4 h-4"></i>
      </button>
    </td>
  `;
  tbody.appendChild(tr);
  calcFesTotal();
  lucide.createIcons();
}

function deleteFesRow(btn) {
  const tr = btn.closest('tr');
  if (tr) {
    tr.remove();
    calcFesTotal();
  }
}

function calcFesTotal() {
  const rows = document.querySelectorAll('#fesTableBody .fes-item-row');
  let total = 0;
  rows.forEach(r => {
    const amtInput = r.querySelector('.fes-row-amount');
    if (amtInput) {
      total += Math.abs(parseFloat(amtInput.value) || 0);
    }
  });

  const totalEl = document.getElementById('fesModalTotal');
  if (totalEl) totalEl.textContent = `₩${total.toLocaleString()}`;

  const countEl = document.getElementById('fesItemCount');
  if (countEl) countEl.textContent = rows.length;
}

function saveFixedExpenseSchedule() {
  const rows = document.querySelectorAll('#fesTableBody .fes-item-row');
  const newFixedExpenses = [];
  let totalFixed = 0;

  rows.forEach(r => {
    const titleInput = r.querySelector('.fes-row-title');
    const daySelect = r.querySelector('.fes-row-day');
    const amtInput = r.querySelector('.fes-row-amount');

    const title = titleInput ? titleInput.value.trim() : '';
    const day = daySelect ? parseInt(daySelect.value, 10) : 25;
    const amt = amtInput ? Math.abs(parseFloat(amtInput.value) || 0) : 0;

    if (title && amt > 0) {
      const rowId = r.dataset.id;
      newFixedExpenses.push({
        id: rowId && !String(rowId).startsWith('new_') ? parseInt(rowId, 10) : Date.now() + Math.floor(Math.random() * 1000),
        title: title.includes('고정비') ? title : `${title} (고정비)`,
        paymentDay: day,
        amount: amt,
        date: `2026-10-${String(day).padStart(2, '0')}`
      });
      totalFixed += amt;
    }
  });

  if (newFixedExpenses.length === 0) {
    alert('최소 1개 이상의 고정 지출 항목과 금액을 입력해 주세요.');
    return;
  }

  // Remove existing fixed expense transactions and replace with newFixedExpenses
  const nonFixed = (appState.transactions || []).filter(t => !(t.isFixedExpense === true || (t.category && t.category.includes('고정비')) || (t.title && t.title.includes('고정비'))));

  const updatedFixedTxs = newFixedExpenses.map(fe => ({
    id: fe.id,
    date: fe.date,
    domain: 'operation',
    title: fe.title,
    category: '지급임차료/고정비',
    gross: -fe.amount,
    tax: 0,
    net: -fe.amount,
    status: '고정비/공제',
    isFixedExpense: true,
    paymentDay: fe.paymentDay
  }));

  appState.transactions = [...nonFixed, ...updatedFixedTxs];
  appState.monthlyFixedExpense = totalFixed > 0 ? totalFixed : 2730000;

  // Sync to calendar task
  const fixedTask = (appState.tasks || []).find(t => t.id === 103);
  if (fixedTask) {
    fixedTask.amount = -totalFixed;
  }

  saveCurrentWorkspaceData();
  updateKPICards();
  updateVisualStatements();
  renderLedgerTable();
  if (typeof renderScheduleTasks === 'function') renderScheduleTasks();
  closeFixedExpenseScheduleModal();
  showToast(`월 고정 지출(₩${appState.monthlyFixedExpense.toLocaleString()}) 및 출금일 설정이 저장되었습니다.`);
}



// Expose ledger functions to global window
window.toggleLedgerBulkEdit = toggleLedgerBulkEdit;
window.saveLedgerBulkEdit = saveLedgerBulkEdit;
window.cancelLedgerBulkEdit = cancelLedgerBulkEdit;
window.addLedgerBlankRow = addLedgerBlankRow;
window.deleteLedgerRow = deleteLedgerRow;
window.exportLedgerCSV = exportLedgerCSV;
window.onLedgerPageSizeChange = onLedgerPageSizeChange;
window.onLedgerSearchInput = onLedgerSearchInput;
window.onLedgerDateRangeChange = onLedgerDateRangeChange;
window.resetLedgerDateRange = resetLedgerDateRange;
window.toggleLedgerFixedExpenseFilter = toggleLedgerFixedExpenseFilter;
window.goToLedgerPage = goToLedgerPage;
window.renderLedgerPagination = renderLedgerPagination;
window.renderLedgerTable = renderLedgerTable;
window.openFixedExpenseScheduleModal = openFixedExpenseScheduleModal;
window.closeFixedExpenseScheduleModal = closeFixedExpenseScheduleModal;
window.renderFixedExpenseScheduleRows = renderFixedExpenseScheduleRows;
window.addFixedExpenseRow = addFixedExpenseRow;
window.deleteFesRow = deleteFesRow;
window.calcFesTotal = calcFesTotal;
window.saveFixedExpenseSchedule = saveFixedExpenseSchedule;
