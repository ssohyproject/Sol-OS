/**
 * SoloOS Modal: Task & Schedule Editor Modal
 * Create/edit tasks, ICS calendar import simulation, Google Calendar & Notion MCP sync
 */

    // ==================== TASK MODAL & MCP INTEGRATION ====================
    function openTaskModal() {
      const modal = document.getElementById('taskModal');
      if (modal) {
        modal.classList.remove('hidden');
        switchTaskModalTab('direct');
        const editId = document.getElementById('taskEditId');
        if (editId) editId.value = '';
        const titleEl = document.getElementById('taskModalTitle');
        if (titleEl) titleEl.textContent = '새 업무 일정 등록 및 연동';
        const subEl = document.getElementById('taskModalSub');
        if (subEl) subEl.textContent = '세부 항목 직접 작성 또는 구글 캘린더·노션 MCP 연동';
        const btnText = document.getElementById('taskSubmitBtnText');
        if (btnText) btnText.textContent = '일정 등록하기';
        const form = document.getElementById('taskDirectForm');
        if (form) form.reset();
        const dateInput = document.getElementById('taskInputDueDate');
        if (dateInput) {
          dateInput.value = selectedCalDate || '2026-10-18';
        }
        const timeInput = document.getElementById('taskInputDueTime');
        if (timeInput) timeInput.value = '18:00';
      }
    }

    function openEditTaskModal(taskId) {
      const task = appState.tasks.find(t => t.id === taskId);
      if (!task) return;

      const modal = document.getElementById('taskModal');
      if (!modal) return;
      modal.classList.remove('hidden');
      switchTaskModalTab('direct');

      const editId = document.getElementById('taskEditId');
      if (editId) editId.value = task.id;
      const titleEl = document.getElementById('taskModalTitle');
      if (titleEl) titleEl.textContent = '업무 일정 수정';
      const subEl = document.getElementById('taskModalSub');
      if (subEl) subEl.textContent = '등록된 프로젝트의 세부 마감일정 및 정보를 수정합니다.';
      const btnText = document.getElementById('taskSubmitBtnText');
      if (btnText) btnText.textContent = '수정 완료하기';

      const titleInput = document.getElementById('taskInputTitle');
      if (titleInput) titleInput.value = task.title || '';
      const domainInput = document.getElementById('taskInputDomain');
      if (domainInput) domainInput.value = task.domain || 'client';
      const clientInput = document.getElementById('taskInputClient');
      if (clientInput) clientInput.value = task.client || '';
      const dateInput = document.getElementById('taskInputDueDate');
      if (dateInput) dateInput.value = task.dueDate || '2026-10-18';
      const timeInput = document.getElementById('taskInputDueTime');
      if (timeInput) timeInput.value = task.dueTime || '18:00';
      const priorityInput = document.getElementById('taskInputPriority');
      if (priorityInput) priorityInput.value = task.priority || '보통';
      const amountInput = document.getElementById('taskInputAmount');
      if (amountInput) amountInput.value = task.amount || '';
      const descInput = document.getElementById('taskInputDesc');
      if (descInput) descInput.value = task.memo || '';
    }

    function closeTaskModal() {
      const modal = document.getElementById('taskModal');
      if (modal) modal.classList.add('hidden');
    }

    function switchTaskModalTab(tab) {
      const btnDirect = document.getElementById('taskTabBtnDirect');
      const btnMcp = document.getElementById('taskTabBtnMcp');
      const formContainer = document.getElementById('taskDirectForm');
      const mcpContainer = document.getElementById('taskMcpContainer');

      if (tab === 'direct') {
        if (btnDirect) btnDirect.className = 'px-3.5 py-2 font-bold text-indigo-600 border-b-2 border-indigo-600 flex items-center gap-1.5';
        if (btnMcp) btnMcp.className = 'px-3.5 py-2 font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5';
        if (formContainer) formContainer.classList.remove('hidden');
        if (mcpContainer) mcpContainer.classList.add('hidden');
      } else {
        if (btnMcp) btnMcp.className = 'px-3.5 py-2 font-bold text-indigo-600 border-b-2 border-indigo-600 flex items-center gap-1.5';
        if (btnDirect) btnDirect.className = 'px-3.5 py-2 font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5';
        if (formContainer) formContainer.classList.add('hidden');
        if (mcpContainer) mcpContainer.classList.remove('hidden');
      }
      lucide.createIcons();
    }

    function handleTaskFormSubmit(e) {
      e.preventDefault();
      const editId = document.getElementById('taskEditId') ? document.getElementById('taskEditId').value : '';
      const title = document.getElementById('taskInputTitle').value.trim();
      const domain = document.getElementById('taskInputDomain').value;
      const client = document.getElementById('taskInputClient').value.trim() || '자체 프로젝트';
      const dueDate = document.getElementById('taskInputDueDate').value;
      const dueTime = document.getElementById('taskInputDueTime').value || '18:00';
      const priority = document.getElementById('taskInputPriority').value;
      const amount = parseFloat(document.getElementById('taskInputAmount').value) || 0;
      const memo = document.getElementById('taskInputDesc').value.trim();

      if (editId) {
        const existing = appState.tasks.find(t => t.id == editId);
        if (existing) {
          existing.title = title;
          existing.domain = domain;
          existing.client = client;
          existing.dueDate = dueDate;
          existing.dueTime = dueTime;
          existing.priority = priority;
          existing.amount = amount;
          existing.memo = memo;
        }
        showToast('업무 일정이 성공적으로 수정되었습니다.');
      } else {
        appState.tasks.push({
          id: Date.now(),
          title,
          domain,
          client,
          dueDate,
          dueTime,
          priority,
          amount,
          memo,
          status: '진행중',
          completed: false
        });
        showToast('신규 업무 일정이 등록되었습니다.');
      }

      closeTaskModal();
      renderMonthlyCalendar();
      renderScheduleTasks();
      renderFullMonthlyCalendar();
      renderFullScheduleTasks();
      renderGanttTimeline();
      renderKanbanBoard();
    }

    function syncGoogleCalendarMCP() {
      const sampleTasks = [
        {
          id: Date.now(),
          domain: 'client',
          client: '테크솔루션즈',
          title: '구글캘린더: 테크솔 주간 스프린트 회의',
          dueDate: '2026-10-19',
          dueTime: '14:00',
          priority: '높음',
          amount: 0,
          memo: 'Google Calendar MCP 연동: 주간 기능 릴리즈 점검 회의',
          status: '대기',
          completed: false
        },
        {
          id: Date.now() + 1,
          domain: 'publishing',
          client: '디지털북스',
          title: '구글캘린더: 출판사 최종 편집 교정 미팅',
          dueDate: '2026-10-21',
          dueTime: '16:00',
          priority: '보통',
          amount: 0,
          memo: 'Google Calendar MCP 연동: 4장 원고 최종 인쇄 감수 회의',
          status: '대기',
          completed: false
        }
      ];

      sampleTasks.forEach(t => appState.tasks.push(t));
      closeTaskModal();
      renderMonthlyCalendar();
      renderScheduleTasks();
      renderFullMonthlyCalendar();
      renderFullScheduleTasks();
      alert('구글 캘린더(Google Calendar MCP)로부터 2건의 회의 및 마감 일정을 성공적으로 동기화했습니다.');
    }

    function syncNotionMCP() {
      const sampleTasks = [
        {
          id: Date.now() + 2,
          domain: 'knowledge',
          client: '인프런',
          title: '노션DB: 인프런 3챕터 강의 영상 녹화',
          dueDate: '2026-10-23',
          dueTime: '11:00',
          priority: '높음',
          amount: 0,
          memo: 'Notion Database MCP 연동: 프리랜서 세무 파트 영상 챕터 녹화 및 편집',
          status: '대기',
          completed: false
        },
        {
          id: Date.now() + 3,
          domain: 'publishing',
          client: '자체 런칭',
          title: '노션DB: 회계 템플릿 배포 페이지 검수',
          dueDate: '2026-10-27',
          dueTime: '17:00',
          priority: '보통',
          amount: 0,
          memo: 'Notion Database MCP 연동: 상세 가이드 문서 및 다운로드 링크 테스트',
          status: '대기',
          completed: false
        }
      ];

      sampleTasks.forEach(t => appState.tasks.push(t));
      closeTaskModal();
      renderMonthlyCalendar();
      renderScheduleTasks();
      renderFullMonthlyCalendar();
      renderFullScheduleTasks();
      alert('노션(Notion MCP) 태스크 데이터베이스로부터 2건의 스프린트 일정을 불러왔습니다.');
    }

    function simulateIcsUpload() {
      appState.tasks.push({
        id: Date.now() + 4,
        domain: 'operation',
        client: '세무서',
        title: 'ICS 일정: 3분기 부가가치세 예정 고지 마감',
        dueDate: '2026-10-25',
        dueTime: '18:00',
        priority: '높음',
        amount: 0,
        memo: '표준 .ics 캘린더 파일 업로드: 홈택스 납부 마감일정',
        status: '대기',
        completed: false
      });
      closeTaskModal();
      renderMonthlyCalendar();
      renderScheduleTasks();
      renderFullMonthlyCalendar();
      renderFullScheduleTasks();
      alert('.ics 표준 캘린더 파일에서 1건의 일정을 성공적으로 등록했습니다.');
    }



// Expose task modal functions to global window
window.openTaskModal = openTaskModal;
window.openEditTaskModal = openEditTaskModal;
window.closeTaskModal = closeTaskModal;
window.switchTaskModalTab = switchTaskModalTab;
window.handleTaskFormSubmit = handleTaskFormSubmit;
window.syncGoogleCalendarMCP = syncGoogleCalendarMCP;
window.syncNotionMCP = syncNotionMCP;
window.simulateIcsUpload = simulateIcsUpload;
