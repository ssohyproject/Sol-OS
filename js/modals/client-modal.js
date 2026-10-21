/**
 * SolOS Modal: Client Profile & Checklist Editor Modal
 * Register/edit clients, document submission checklist, preferred communication channel selectors
 */

    // ==================== CLIENT MODAL & CHECKLIST / CHANNELS LOGIC ====================
    let modalChecklist = [];
    let selectedModalChannels = new Set();

    function getDefaultClientChecklist() {
      return [
        { id: 'c1', label: '사업자등록증', checked: false },
        { id: 'c2', label: '통장 사본', checked: false },
        { id: 'c3', label: '견적서 원본', checked: false },
        { id: 'c4', label: '용역 계약서', checked: false },
        { id: 'c5', label: '비밀유지계약(NDA)', checked: false },
        { id: 'c6', label: '개인정보동의서', checked: false }
      ];
    }

    function renderClientModalChecklist() {
      const container = document.getElementById('clientModalChecklistGrid');
      if (!container) return;

      if (!modalChecklist || modalChecklist.length === 0) {
        modalChecklist = getDefaultClientChecklist();
      }

      if (modalChecklist.length === 0) {
        container.innerHTML = '<div class="col-span-full p-4 text-center text-xs text-slate-400">등록된 서류가 없습니다. 아래에서 서류를 추가해 주세요.</div>';
        return;
      }

      let html = '';
      modalChecklist.forEach((item, idx) => {
        html += `
          <div class="flex items-center justify-between px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs hover:border-slate-300 transition-all">
            <span class="truncate font-medium text-slate-800" title="${item.label}">${item.label}</span>
            <button type="button" onclick="removeModalChecklistItem(${idx})" class="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors ml-1.5 shrink-0 cursor-pointer" title="서류 삭제">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        `;
      });

      container.innerHTML = html;
      lucide.createIcons();
    }

    function addClientModalDocItem() {
      const input = document.getElementById('clientModalNewDocInput');
      if (!input) return;
      const val = input.value.trim();
      if (!val) {
        showToast('추가할 서류명을 입력해주세요.');
        return;
      }
      modalChecklist.push({
        id: 'doc_' + Date.now(),
        label: val,
        checked: false
      });
      input.value = '';
      renderClientModalChecklist();
      showToast(`'${val}' 서류가 목록에 추가되었습니다.`);
    }

    function removeModalChecklistItem(idx) {
      if (modalChecklist && modalChecklist[idx]) {
        const removedLabel = modalChecklist[idx].label;
        modalChecklist.splice(idx, 1);
        renderClientModalChecklist();
        showToast(`'${removedLabel}' 서류가 삭제되었습니다.`);
      }
    }

    function toggleChannelBtn(channelName) {
      if (selectedModalChannels.has(channelName)) {
        selectedModalChannels.delete(channelName);
      } else {
        selectedModalChannels.add(channelName);
      }
      updateChannelButtonsUI();
    }

    function updateChannelButtonsUI() {
      const btns = document.querySelectorAll('.channel-select-btn');
      btns.forEach(btn => {
        const ch = btn.getAttribute('data-channel');
        if (selectedModalChannels.has(ch)) {
          btn.className = 'channel-select-btn px-3 py-1.5 rounded-xl border border-indigo-500 bg-indigo-50 text-xs font-bold text-indigo-700 shadow-xs transition-all';
        } else {
          btn.className = 'channel-select-btn px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all';
        }
      });

      const customWrap = document.getElementById('clientChannelCustomWrap');
      if (customWrap) {
        if (selectedModalChannels.has('기타')) {
          customWrap.classList.remove('hidden');
        } else {
          customWrap.classList.add('hidden');
        }
      }
    }

    function openClientModal(clientId = null) {
      const modal = document.getElementById('clientModal');
      const titleEl = document.getElementById('clientModalTitle');
      const form = document.getElementById('clientForm');
      if (!modal || !form) return;

      form.reset();
      document.getElementById('clientFormId').value = '';
      selectedModalChannels.clear();

      if (clientId) {
        const client = (appState.clients || []).find(c => c.id === clientId);
        if (client) {
          titleEl.textContent = '기업 정보 수정';
          document.getElementById('clientFormId').value = client.id;
          document.getElementById('clientInputName').value = client.name || '';
          document.getElementById('clientInputShortName').value = client.shortName || '';
          document.getElementById('clientInputBizNum').value = client.bizNum || '';
          document.getElementById('clientInputTier').value = client.tier || '양호';
          document.getElementById('clientInputCycle').value = client.settlementCycle || '';
          document.getElementById('clientInputManager').value = client.manager || '';
          document.getElementById('clientInputMeeting').value = (client.communication && client.communication.meeting) || '';
          document.getElementById('clientInputSharing').value = (client.communication && client.communication.sharing) || '';
          document.getElementById('clientInputClause').value = client.specialClause || '';

          // Parse communication channels
          const rawChannel = (client.communication && client.communication.channel) || '';
          const knownChannels = ['슬랙', '카카오톡', '이메일', '노션', '전화'];
          let hasCustom = false;
          let customText = '';

          const parts = rawChannel.split(/[,/·+]/).map(s => s.trim()).filter(Boolean);
          parts.forEach(part => {
            const matched = knownChannels.find(k => part.includes(k));
            if (matched) {
              selectedModalChannels.add(matched);
            } else {
              hasCustom = true;
              customText += (customText ? ', ' : '') + part;
            }
          });

          if (hasCustom) {
            selectedModalChannels.add('기타');
            const customInput = document.getElementById('clientCustomChannelInput');
            if (customInput) customInput.value = customText;
          } else {
            const customInput = document.getElementById('clientCustomChannelInput');
            if (customInput) customInput.value = '';
          }

          modalChecklist = (client.checklist && client.checklist.length > 0)
            ? JSON.parse(JSON.stringify(client.checklist))
            : getDefaultClientChecklist();
        }
      } else {
        titleEl.textContent = '거래처 기업 등록';
        modalChecklist = getDefaultClientChecklist();
        const customInput = document.getElementById('clientCustomChannelInput');
        if (customInput) customInput.value = '';
      }

      updateChannelButtonsUI();
      renderClientModalChecklist();
      modal.classList.remove('hidden');
      lucide.createIcons();
    }

    function closeClientModal() {
      const modal = document.getElementById('clientModal');
      if (modal) modal.classList.add('hidden');
    }

    function handleClientFormSubmit(e) {
      e.preventDefault();
      const formId = document.getElementById('clientFormId').value;
      const name = document.getElementById('clientInputName').value.trim();
      const shortName = document.getElementById('clientInputShortName').value.trim() || name;
      const bizNum = document.getElementById('clientInputBizNum').value.trim();
      const tier = document.getElementById('clientInputTier').value;
      const settlementCycle = document.getElementById('clientInputCycle').value.trim();
      const manager = document.getElementById('clientInputManager').value.trim();
      const meeting = document.getElementById('clientInputMeeting').value.trim();
      const sharing = document.getElementById('clientInputSharing').value.trim();
      const clause = document.getElementById('clientInputClause').value.trim();

      const channelList = [];
      ['슬랙', '카카오톡', '이메일', '노션', '전화'].forEach(ch => {
        if (selectedModalChannels.has(ch)) channelList.push(ch);
      });
      if (selectedModalChannels.has('기타')) {
        const customVal = document.getElementById('clientCustomChannelInput')?.value.trim();
        if (customVal) channelList.push(customVal);
      }
      const channel = channelList.join(', ') || '이메일';

      if (formId) {
        const client = (appState.clients || []).find(c => c.id === parseInt(formId, 10));
        if (client) {
          client.name = name;
          client.shortName = shortName;
          client.bizNum = bizNum;
          client.tier = tier;
          client.settlementCycle = settlementCycle;
          client.manager = manager;
          client.specialClause = clause;
          client.checklist = JSON.parse(JSON.stringify(modalChecklist));
          client.communication = { channel, meeting, sharing };
          showToast('기업 정보가 성공적으로 수정되었습니다.');
        }
      } else {
        const newId = Date.now();
        const newClient = {
          id: newId,
          name,
          shortName,
          tier,
          bizNum,
          settlementCycle,
          manager,
          totalRevenue: 3000000,
          completedCount: 0,
          avgDelay: '0일',
          avgRevision: 1.0,
          spentHours: 50,
          hourlyRate: 60000,
          specialClause: clause,
          checklist: JSON.parse(JSON.stringify(modalChecklist)),
          communication: { channel, meeting, sharing }
        };
        appState.clients.push(newClient);
        selectedClientId = newId;
        showToast('새 기업이 성공적으로 등록되었습니다.');
      }

      closeClientModal();
      renderClientList();
      renderClientDetail(selectedClientId);
      if (currentActiveSubView === 'settlement') {
        renderSettlementView();
      }
    }



// Expose client modal functions to global window
window.getDefaultClientChecklist = getDefaultClientChecklist;
window.renderClientModalChecklist = renderClientModalChecklist;
window.addClientModalDocItem = addClientModalDocItem;
window.removeModalChecklistItem = removeModalChecklistItem;
window.toggleChannelBtn = toggleChannelBtn;
window.updateChannelButtonsUI = updateChannelButtonsUI;
window.openClientModal = openClientModal;
window.closeClientModal = closeClientModal;
window.handleClientFormSubmit = handleClientFormSubmit;
