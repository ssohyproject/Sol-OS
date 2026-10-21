/**
 * SoloOS Page: Client Management (클라이언트 관리)
 * Client profile cards, tier evaluation (우수/양호/주의/위험), document verification checklist, communication guides
 */

    // ==================== CLIENT MANAGEMENT & SETTLEMENT TABLE LOGIC ====================
    let selectedClientId = 1;
    let currentClientTierFilter = 'all';
    let currentClientSearchQuery = '';

    const tierBadgeStyles = {
      '우수': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      '양호': 'bg-blue-50 text-blue-700 border-blue-200',
      '주의': 'bg-amber-50 text-amber-700 border-amber-200',
      '위험': 'bg-rose-50 text-rose-700 border-rose-200'
    };

    function renderClientList() {
      const container = document.getElementById('clientListBox');
      if (!container) return;

      let list = appState.clients || [];

      // Filter by tier
      if (currentClientTierFilter !== 'all') {
        list = list.filter(c => c.tier === currentClientTierFilter);
      }

      // Filter by search query
      if (currentClientSearchQuery) {
        list = list.filter(c => 
          c.name.toLowerCase().includes(currentClientSearchQuery) ||
          (c.shortName && c.shortName.toLowerCase().includes(currentClientSearchQuery)) ||
          (c.bizNum && c.bizNum.includes(currentClientSearchQuery)) ||
          (c.manager && c.manager.toLowerCase().includes(currentClientSearchQuery))
        );
      }

      const countBadge = document.getElementById('clientCountBadge');
      if (countBadge) {
        countBadge.textContent = `${appState.clients.length}개사 등록`;
      }
      if (!isLedgerBulkEditing) {
        saveCurrentWorkspaceData();
      }

      if (list.length === 0) {
        container.innerHTML = `
          <div class="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            검색 조건에 일치하는 기업이 없습니다.
          </div>
        `;
        return;
      }

      let html = '';
      list.forEach(client => {
        const isSelected = client.id === selectedClientId;
        const tierClass = tierBadgeStyles[client.tier] || 'bg-slate-100 text-slate-700 border-slate-200';
        
        html += `
          <button type="button" onclick="selectClient(${client.id})" class="w-full text-left p-3.5 rounded-2xl border transition-all shadow-xs flex flex-col justify-between gap-2 cursor-pointer ${
            isSelected 
              ? 'bg-indigo-50/50 border-indigo-400 ring-2 ring-indigo-200' 
              : 'bg-white hover:bg-slate-50 border-slate-200'
          }">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="font-bold text-slate-900 text-xs truncate leading-tight">${client.name}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded font-bold border shrink-0 whitespace-nowrap leading-tight ${tierClass}">${client.tier}</span>
              </div>
              <span class="text-[10px] text-slate-400 font-mono shrink-0">${client.bizNum || ''}</span>
            </div>
            
            <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span class="truncate">${client.settlementCycle || '약정 정산일 미지정'}</span>
              <span class="font-mono font-bold shrink-0 ${client.tier === '위험' ? 'text-rose-600' : 'text-slate-800'}">₩${Number(client.totalRevenue || 0).toLocaleString()}</span>
            </div>
          </button>
        `;
      });

      container.innerHTML = html;
      lucide.createIcons();
    }

    function selectClient(clientId) {
      selectedClientId = clientId;
      renderClientList();
      renderClientDetail(clientId);
    }

    function filterClientList(query) {
      currentClientSearchQuery = (query || '').toLowerCase().trim();
      renderClientList();
    }

    function filterClientByTier(tier) {
      currentClientTierFilter = tier;
      
      const buttons = document.querySelectorAll('.client-tier-filter-btn');
      buttons.forEach(btn => {
        if (btn.getAttribute('data-tier') === tier) {
          btn.className = 'client-tier-filter-btn px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-slate-900 text-white';
        } else {
          const t = btn.getAttribute('data-tier');
          let color = 'text-slate-700';
          if (t === '우수') color = 'text-emerald-700';
          else if (t === '양호') color = 'text-blue-700';
          else if (t === '주의') color = 'text-amber-700';
          else if (t === '위험') color = 'text-rose-700';
          btn.className = `client-tier-filter-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition-all bg-white hover:bg-slate-100 ${color} border border-slate-200`;
        }
      });

      renderClientList();
    }

    function renderClientDetail(clientId) {
      const container = document.getElementById('clientDetailBox');
      if (!container) return;

      const client = (appState.clients || []).find(c => c.id === clientId) || (appState.clients && appState.clients[0]);
      if (!client) {
        container.innerHTML = `<div class="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">등록된 기업이 없습니다.</div>`;
        return;
      }

      selectedClientId = client.id;
      const tierClass = tierBadgeStyles[client.tier] || 'bg-slate-100 text-slate-700 border-slate-200';

      // Checklist calculation
      const checklist = client.checklist || [];
      const checkedCount = checklist.filter(c => c.checked).length;
      const totalChecks = checklist.length;
      const checkPercent = totalChecks > 0 ? Math.round((checkedCount / totalChecks) * 100) : 0;

      let checklistItemsHtml = '';
      checklist.forEach(item => {
        checklistItemsHtml += `
          <label class="flex items-center gap-2 p-2.5 rounded-xl border transition-colors cursor-pointer ${
            item.checked ? 'bg-slate-50 border-slate-200' : 'bg-white border-dashed border-slate-300'
          }">
            <input type="checkbox" ${item.checked ? 'checked' : ''} onchange="toggleClientChecklist(${client.id}, '${item.id}')" class="rounded text-indigo-600 w-3.5 h-3.5 cursor-pointer">
            <span class="text-xs ${item.checked ? 'text-slate-800 font-medium' : 'text-slate-400'}">${item.label}</span>
          </label>
        `;
      });

      container.innerHTML = `
        <div class="space-y-4">
          <!-- Top Header with Edit Button (흰색 클린 배경) -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3.5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-black text-slate-900 text-base sm:text-lg">${client.name}</span>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold border shrink-0 ${tierClass}">${client.tier}</span>
                <span class="text-xs text-slate-400 font-mono">사업자번호: ${client.bizNum || '미등록'}</span>
              </div>
              <button type="button" onclick="openClientModal(${client.id})" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto shrink-0">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                <span>기업 정보 수정</span>
              </button>
            </div>

            <!-- Key Info 4 Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
              <div class="flex justify-between items-center py-0.5">
                <span class="text-slate-500">정기 결제일:</span>
                <strong class="text-slate-800">${client.settlementCycle || '협의 필요'}</strong>
              </div>
              <div class="flex justify-between items-center py-0.5">
                <span class="text-slate-500">담당자:</span>
                <span class="font-medium text-slate-700">${client.manager || '미등록'}</span>
              </div>
              <div class="flex justify-between items-center py-0.5">
                <span class="text-slate-500">누적 수주액:</span>
                <span class="font-mono font-bold text-slate-900">₩${Number(client.totalRevenue || 0).toLocaleString()} (${client.completedCount || 0}건 완료)</span>
              </div>
              <div class="flex justify-between items-center py-0.5">
                <span class="text-slate-500">평균 정산 지연:</span>
                <span class="font-semibold ${client.tier === '위험' ? 'text-rose-600' : 'text-slate-700'}">${client.avgDelay || '0일'}</span>
              </div>
            </div>

            ${client.specialClause ? `
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                <i data-lucide="shield-alert" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
                <div>
                  <strong class="text-slate-900">계약 권장 특약:</strong> ${client.specialClause}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- 2 Grid: 필요 서류 체크리스트 & 업무/소통 방식 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 필요 서류 체크리스트 -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <i data-lucide="file-check-2" class="w-4 h-4 text-blue-600"></i>
                  <span>필요 서류 체크리스트</span>
                </h4>
                <span class="text-[11px] font-bold ${checkPercent === 100 ? 'text-emerald-600' : 'text-indigo-600'}">${checkPercent}% 완료 (${checkedCount}/${totalChecks})</span>
              </div>

              <div class="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                ${checklistItemsHtml}
              </div>
            </div>

            <!-- 업무 및 소통 방식 -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 class="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <i data-lucide="message-square-share" class="w-4 h-4 text-indigo-600"></i>
                  <span>업무 및 소통 방식</span>
                </h4>
                <span class="text-[10px] text-slate-400">사전 조율</span>
              </div>

              <div class="space-y-2 text-xs text-slate-600">
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span class="text-[10px] text-slate-400 block mb-0.5">소통 채널</span>
                  <strong class="text-slate-800">${(client.communication && client.communication.channel) || '이메일 / 메신저'}</strong>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span class="text-[10px] text-slate-400 block mb-0.5">보고 및 미팅 주기</span>
                  <strong class="text-slate-800">${(client.communication && client.communication.meeting) || '수시 협의'}</strong>
                </div>
                <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span class="text-[10px] text-slate-400 block mb-0.5">산출물 공유 방식</span>
                  <strong class="text-slate-800">${(client.communication && client.communication.sharing) || '클라우드 공유 링크'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      lucide.createIcons();
    }

    function toggleClientChecklist(clientId, checkId) {
      const client = (appState.clients || []).find(c => c.id === clientId);
      if (!client || !client.checklist) return;
      const item = client.checklist.find(c => c.id === checkId);
      if (item) {
        item.checked = !item.checked;
        renderClientDetail(clientId);
      }
    }



// Expose clients functions to global window
window.renderClientList = renderClientList;
window.selectClient = selectClient;
window.filterClientList = filterClientList;
window.filterClientByTier = filterClientByTier;
window.renderClientDetail = renderClientDetail;
window.toggleClientChecklist = toggleClientChecklist;
