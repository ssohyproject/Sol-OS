/**
 * SoloOS Page: Settlement Management (정산 관리)
 * Receivables tracking table, pre-agreed deferral toggle
 */

    function handleClientDeferToggle(checked) {
      const delayedRec = (appState.receivables || []).find(r => r.statusType === 'delayed');
      if (delayedRec) {
        delayedRec.deferred = checked;
        renderReceivablesTable();
      }
      showToast(checked ? '사전 협의 유예가 설정되었습니다. 정산 독촉 알림이 보류됩니다.' : '사전 협의 유예가 해제되었습니다.');
    }


    function renderSettlementView() {
      renderReceivablesTable();
      lucide.createIcons();
    }


    // ==================== RECEIVABLES (정산관리표) LOGIC ====================
    function renderReceivablesTable() {
      if (!isLedgerBulkEditing) {
        saveCurrentWorkspaceData();
      }
      const tbody = document.getElementById('receivablesTableBody');
      if (!tbody) return;

      const list = appState.receivables || [];
      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-xs text-slate-400">등록된 청구 내역이 없습니다.</td></tr>`;
        return;
      }

      let html = '';
      list.forEach(rec => {
        const clientName = rec.clientName || rec.client || '거래처 미상';
        const itemTitle = rec.itemTitle || rec.project || '프로젝트 미지정';
        const isDelayed = (rec.statusType === 'delayed' || rec.status === '지연' || (rec.delayDays && rec.delayDays > 0));

        let statusBadge = '<span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[10px]">정상</span>';
        if (isDelayed && !rec.deferred) {
          statusBadge = '<span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">지연 발생</span>';
        } else if (rec.deferred) {
          statusBadge = '<span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">사전 협의 유예 중</span>';
        }

        html += `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3 px-3 font-bold text-slate-900">${escapeHtml(clientName)}</td>
            <td class="py-3 px-3 text-slate-600">${escapeHtml(itemTitle)}</td>
            <td class="py-3 px-3 text-right font-mono font-bold ${isDelayed && !rec.deferred ? 'text-rose-700' : 'text-slate-900'}">₩${Number(rec.amount || 0).toLocaleString()}</td>
            <td class="py-3 px-3 text-center text-slate-500 font-mono">${escapeHtml(rec.dueDate || '-')}</td>
            <td class="py-3 px-3 text-center">${statusBadge}</td>
            <td class="py-3 px-3 text-center">
              <label class="inline-flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" ${rec.deferred ? 'checked' : ''} onchange="toggleReceivableDefer(${rec.id}, this.checked)" class="rounded text-indigo-600 w-3.5 h-3.5 cursor-pointer">
                <span class="text-[11px] ${rec.deferred ? 'text-indigo-600 font-semibold' : 'text-slate-500'}">${rec.deferred ? '유예 활성' : '미유예'}</span>
              </label>
            </td>
            <td class="py-3 px-3 text-center">
              <div class="flex items-center justify-center gap-1">
                <button type="button" onclick="openReceivableModal(${rec.id})" title="수정" class="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-colors">
                  <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
                </button>
                <button type="button" onclick="deleteReceivable(${rec.id})" title="삭제" class="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                  <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      });

      tbody.innerHTML = html;
      if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      }
    }

    function deleteReceivable(recId) {
      if (confirm('해당 청구 내역을 삭제하시겠습니까?')) {
        appState.receivables = (appState.receivables || []).filter(r => r.id !== recId);
        renderReceivablesTable();
        showToast('청구 내역이 삭제되었습니다.');
      }
    }

    function toggleReceivableDefer(recId, checked) {
      const rec = (appState.receivables || []).find(r => r.id === recId);
      if (rec) {
        rec.deferred = checked;
        renderReceivablesTable();
        showToast(checked ? '사전 협의 유예가 설정되었습니다. 정산 독촉 알림이 보류됩니다.' : '사전 협의 유예가 해제되었습니다.');
      }
    }



// Expose settlement functions to global window
window.handleClientDeferToggle = handleClientDeferToggle;
window.renderSettlementView = renderSettlementView;
window.renderReceivablesTable = renderReceivablesTable;
window.deleteReceivable = deleteReceivable;
window.toggleReceivableDefer = toggleReceivableDefer;
