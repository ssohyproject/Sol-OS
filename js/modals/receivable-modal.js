/**
 * SolOS Modal: Receivable & Settlement Item Modal
 * Register/edit accounts receivable with due dates, client association, and delay calculation
 */

    function openReceivableModal(recId = null) {
      const modal = document.getElementById('receivableModal');
      const titleEl = document.getElementById('receivableModalTitle');
      const form = document.getElementById('receivableForm');
      const clientSelect = document.getElementById('recInputClient');
      const taskSelect = document.getElementById('recInputTask');
      if (!modal || !form || !clientSelect || !taskSelect) return;

      form.reset();
      document.getElementById('recFormId').value = '';

      // Populate client dropdown
      clientSelect.innerHTML = (appState.clients || []).map(c => `<option value="${c.id}">${c.name}</option>`).join('');

      // Populate tasks dropdown (연동 일정)
      taskSelect.innerHTML = '<option value="">연동 안 함 (직접 입력)</option>' + 
        (appState.tasks || []).map(t => `<option value="${t.id}">[${t.dueDate}] ${t.title} (₩${Number(t.amount || 0).toLocaleString()})</option>`).join('');

      if (recId) {
        const rec = (appState.receivables || []).find(r => r.id === recId);
        if (rec) {
          titleEl.textContent = '청구 내역 수정';
          document.getElementById('recFormId').value = rec.id;
          clientSelect.value = rec.clientId;
          document.getElementById('recInputTitle').value = rec.itemTitle;
          document.getElementById('recInputAmount').value = rec.amount;
          document.getElementById('recInputDueDate').value = rec.dueDate;
          document.getElementById('recInputDeferred').checked = !!rec.deferred;
        }
      } else {
        titleEl.textContent = '청구 내역 등록';
      }

      modal.classList.remove('hidden');
      lucide.createIcons();
    }

    function closeReceivableModal() {
      const modal = document.getElementById('receivableModal');
      if (modal) modal.classList.add('hidden');
    }

    function handleRecClientChange(clientId) {
      // Optional client change hook
    }

    function handleRecTaskChange(taskId) {
      if (!taskId) return;
      const task = (appState.tasks || []).find(t => t.id === parseInt(taskId, 10));
      if (task) {
        document.getElementById('recInputTitle').value = `${task.title} 잔금 정산`;
        document.getElementById('recInputAmount').value = task.amount || 0;
        document.getElementById('recInputDueDate').value = task.dueDate || '2026-10-25';

        // Match client if possible
        const matchedClient = (appState.clients || []).find(c => c.name.includes(task.client) || (c.shortName && c.shortName.includes(task.client)));
        if (matchedClient) {
          document.getElementById('recInputClient').value = matchedClient.id;
        }
      }
    }

    function handleReceivableFormSubmit(e) {
      e.preventDefault();
      const formId = document.getElementById('recFormId').value;
      const clientId = parseInt(document.getElementById('recInputClient').value, 10);
      const client = (appState.clients || []).find(c => c.id === clientId);
      const clientName = client ? client.name : '기타 거래처';
      const itemTitle = document.getElementById('recInputTitle').value.trim();
      const amount = parseInt(document.getElementById('recInputAmount').value, 10) || 0;
      const dueDate = document.getElementById('recInputDueDate').value;
      const deferred = document.getElementById('recInputDeferred').checked;

      if (formId) {
        const rec = (appState.receivables || []).find(r => r.id === parseInt(formId, 10));
        if (rec) {
          rec.clientId = clientId;
          rec.clientName = clientName;
          rec.itemTitle = itemTitle;
          rec.amount = amount;
          rec.dueDate = dueDate;
          rec.deferred = deferred;
          showToast('청구 내역이 수정되었습니다.');
        }
      } else {
        const newRec = {
          id: Date.now(),
          clientId,
          clientName,
          itemTitle,
          amount,
          dueDate,
          status: '정상 (정산 예정)',
          statusType: 'normal',
          deferred
        };
        appState.receivables.push(newRec);
        showToast('새 청구 내역이 등록되었습니다.');
      }

      closeReceivableModal();
      renderReceivablesTable();
    }

    // 6. 비상 런웨이(Runway) 슬라이더 실시간 계산 핸들러


// Expose receivable modal functions to global window
window.openReceivableModal = openReceivableModal;
window.closeReceivableModal = closeReceivableModal;
window.handleRecClientChange = handleRecClientChange;
window.handleRecTaskChange = handleRecTaskChange;
window.handleReceivableFormSubmit = handleReceivableFormSubmit;
