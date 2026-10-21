/**
 * SoloOS Page: Schedule & Task Management
 * Monthly calendar, 2-week task cards, Kanban board, Gantt timeline, Buffer days
 */

    // ==================== MONTHLY CALENDAR LOGIC ====================
    function renderMonthlyCalendar() {
      const monthTitle = document.getElementById('calMonthTitle');
      const daysContainer = document.getElementById('monthlyCalDays');
      if (!monthTitle || !daysContainer) return;

      monthTitle.textContent = `${calYear}년 ${calMonth + 1}월`;
      daysContainer.innerHTML = '';

      const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay(); // 0(Sun) ~ 6(Sat)
      const lastDateCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
      const lastDatePrevMonth = new Date(calYear, calMonth, 0).getDate();

      // Previous month days
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const d = lastDatePrevMonth - i;
        const div = document.createElement('div');
        div.className = 'py-1 px-0.5 text-slate-300 text-xs select-none flex flex-col items-center justify-between min-h-[30px] sm:min-h-[32px]';
        div.innerHTML = `<span class="opacity-40 text-xs">${d}</span><div class="h-1"></div>`;
        daysContainer.appendChild(div);
      }

      // Current month days
      for (let day = 1; day <= lastDateCurrentMonth; day++) {
        const formattedDate = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = formattedDate === '2026-10-14';
        const isSelected = selectedCalDate === formattedDate;

        // Check tasks on this date matching workstream
        const dayTasks = appState.tasks.filter(t => {
          const matchDomain = appState.currentWorkstream === 'all' || t.domain === appState.currentWorkstream;
          return t.dueDate === formattedDate && matchDomain;
        });

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.onclick = () => filterTaskByDate(formattedDate);

        // Day button styling (h-[280px] 컨테이너에 완벽히 정합되는 콤팩트 규격)
        let btnClasses = 'relative py-1 px-0.5 rounded-lg flex flex-col items-center justify-between transition-all cursor-pointer min-h-[30px] sm:min-h-[32px] ';
        if (isSelected) {
          btnClasses += 'bg-indigo-600 text-white font-bold shadow-md ring-2 ring-indigo-400';
        } else if (isToday) {
          btnClasses += 'bg-indigo-50 text-indigo-700 font-extrabold border border-indigo-300 hover:bg-indigo-100';
        } else {
          btnClasses += 'hover:bg-slate-100 text-slate-700 font-medium';
        }
        btn.className = btnClasses;

        // Day of week color for weekends
        const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
        let dayNumClass = 'text-xs font-semibold leading-none';
        if (!isSelected) {
          if (dayOfWeek === 0) dayNumClass += ' text-rose-500 font-bold';
          else if (dayOfWeek === 6) dayNumClass += ' text-blue-500 font-bold';
        }

        // Domain dots
        let dotsHtml = '';
        if (dayTasks.length > 0) {
          const dots = dayTasks.map(t => {
            if (t.domain === 'client') return isSelected ? '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>' : '<span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>';
            if (t.domain === 'publishing') return isSelected ? '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>' : '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>';
            if (t.domain === 'knowledge') return isSelected ? '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>' : '<span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span>';
            return isSelected ? '<span class="w-1.5 h-1.5 rounded-full bg-white"></span>' : '<span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>';
          }).slice(0, 3).join('');
          dotsHtml = dots;
        }

        btn.innerHTML = `
          <span class="${dayNumClass}">${day}</span>
          <div class="flex items-center gap-0.5 mt-0.5 h-1">${dotsHtml}</div>
        `;
        daysContainer.appendChild(btn);
      }

      // Next month trailing days to complete rows (35 or 42 cells)
      const totalCells = firstDayOfWeek + lastDateCurrentMonth;
      const remainingCells = (7 - (totalCells % 7)) % 7;
      for (let nextDay = 1; nextDay <= remainingCells; nextDay++) {
        const div = document.createElement('div');
        div.className = 'py-1 px-0.5 text-slate-300 text-xs select-none flex flex-col items-center justify-between min-h-[30px] sm:min-h-[32px]';
        div.innerHTML = `<span class="opacity-40 text-xs">${nextDay}</span><div class="h-1"></div>`;
        daysContainer.appendChild(div);
      }
    }

    function changeCalMonth(offset) {
      calMonth += offset;
      if (calMonth < 0) {
        calMonth = 11;
        calYear--;
      } else if (calMonth > 11) {
        calMonth = 0;
        calYear++;
      }
      renderMonthlyCalendar();
      renderFullMonthlyCalendar();
    }

    function resetCalToday() {
      calYear = 2026;
      calMonth = 9; // 10월
      selectedCalDate = null;
      const label = document.getElementById('selectedCalDateLabel');
      const resetBtn = document.getElementById('btnResetDateFilter');
      if (label) label.textContent = '최근 2주 일정 표시 중';
      if (resetBtn) resetBtn.classList.add('hidden');

      const fullLabel = document.getElementById('fullCalSelectedLabel');
      const fullResetBtn = document.getElementById('btnFullResetFilter');
      if (fullLabel) fullLabel.textContent = '전체 등록된 모든 일정을 표시 중입니다.';
      if (fullResetBtn) fullResetBtn.classList.add('hidden');

      renderMonthlyCalendar();
      renderScheduleTasks();
      renderFullMonthlyCalendar();
      renderFullScheduleTasks();
    }

    function filterTaskByDate(dateStr) {
      if (!dateStr || selectedCalDate === dateStr) {
        selectedCalDate = null;
        const label = document.getElementById('selectedCalDateLabel');
        const resetBtn = document.getElementById('btnResetDateFilter');
        if (label) label.textContent = '최근 2주 일정 표시 중';
        if (resetBtn) resetBtn.classList.add('hidden');

        const fullLabel = document.getElementById('fullCalSelectedLabel');
        const fullResetBtn = document.getElementById('btnFullResetFilter');
        if (fullLabel) fullLabel.textContent = '전체 등록된 모든 일정을 표시 중입니다.';
        if (fullResetBtn) fullResetBtn.classList.add('hidden');
      } else {
        selectedCalDate = dateStr;
        const label = document.getElementById('selectedCalDateLabel');
        const resetBtn = document.getElementById('btnResetDateFilter');
        if (label) label.textContent = `${dateStr} 일정`;
        if (resetBtn) resetBtn.classList.remove('hidden');

        const fullLabel = document.getElementById('fullCalSelectedLabel');
        const fullResetBtn = document.getElementById('btnFullResetFilter');
        if (fullLabel) fullLabel.textContent = `${dateStr} 일정`;
        if (fullResetBtn) fullResetBtn.classList.remove('hidden');
      }
      renderMonthlyCalendar();
      renderScheduleTasks();
      renderFullMonthlyCalendar();
      renderFullScheduleTasks();
    }

    // ==================== SCHEDULE TASKS LIST (최근 2주 일정 콤팩트 카드) ====================
    function renderScheduleTasks() {
      if (!isLedgerBulkEditing) {
        saveCurrentWorkspaceData();
      }
      const container = document.getElementById('scheduleTaskList');
      if (!container) return;
      container.innerHTML = '';

      let list = appState.tasks;
      if (appState.currentWorkstream !== 'all') {
        list = list.filter(t => t.domain === appState.currentWorkstream);
      }

      // 날짜 필터링: 선택 날짜가 있으면 해당 날짜, 없으면 최근 2주간(2026-10-14 ~ 2026-10-28) 일정만 표시
      if (selectedCalDate) {
        list = list.filter(t => t.dueDate === selectedCalDate);
      } else {
        list = list.filter(t => t.dueDate >= '2026-10-14' && t.dueDate <= '2026-10-28');
      }

      list.sort((a, b) => {
        const dateComp = a.dueDate.localeCompare(b.dueDate);
        if (dateComp !== 0) return dateComp;
        return (a.dueTime || '').localeCompare(b.dueTime || '');
      });

      if (list.length === 0) {
        container.innerHTML = `
          <div class="p-8 text-center text-xs text-slate-400 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
            ${selectedCalDate ? selectedCalDate + ' 날짜' : '최근 2주 간'} 등록된 일정이 없습니다.
          </div>
        `;
        return;
      }

      const domainBadge = {
        client: '<span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold shrink-0 whitespace-nowrap leading-tight">외주</span>',
        publishing: '<span class="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold shrink-0 whitespace-nowrap leading-tight">출판</span>',
        knowledge: '<span class="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold shrink-0 whitespace-nowrap leading-tight">지식창업</span>',
        operation: '<span class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold shrink-0 whitespace-nowrap leading-tight">운영</span>'
      };

      list.forEach(task => {
        const item = document.createElement('div');
        item.className = `h-[64px] px-3.5 py-2.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 shadow-xs transition-all ${task.completed ? 'bg-slate-50/80 opacity-60' : 'bg-white hover:bg-slate-50'}`;
        
        const statusBadge = `
          <span class="px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 whitespace-nowrap leading-tight ${
            task.status === '완료' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
            task.status === '진행중' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
            task.status === '지연검수' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
            'bg-slate-100 text-slate-700 border border-slate-200'
          }">${task.status}</span>
        `;

        item.innerHTML = `
          <div class="flex items-center gap-3 min-w-0 flex-1">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskDone(this, ${task.id})" class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0 self-center">
            <div class="space-y-1 min-w-0 flex-1">
              <!-- 윗줄: 제목(말줄임) + 발주처 배지 + 분야 배지 -->
              <div class="flex items-center gap-1.5 min-w-0">
                <span class="font-bold text-slate-900 text-xs truncate max-w-[125px] sm:max-w-[160px] shrink leading-tight" title="${task.title}">${task.title}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold shrink-0 whitespace-nowrap leading-tight">${task.client}</span>
                ${domainBadge[task.domain] || ''}
              </div>
              <!-- 아랫줄: 마감일시 + 진행상태 배지 -->
              <div class="text-[11px] text-slate-500 flex items-center gap-2 leading-tight">
                <span class="whitespace-nowrap">마감: <strong class="text-slate-700 font-mono">${task.dueDate}${task.dueTime ? ' ' + task.dueTime : ''}</strong></span>
                ${statusBadge}
              </div>
            </div>
          </div>
          <!-- 우측: 금액 (검정색 텍스트!) + 정산 예정 라벨 -->
          <div class="text-right shrink-0 flex flex-col items-end justify-center">
            ${task.amount ? `
              <div class="text-base sm:text-lg font-black text-slate-900 font-mono leading-tight">₩${Number(task.amount).toLocaleString()}</div>
              <div class="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">정산 예정</div>
            ` : `
              <div class="text-base sm:text-lg font-black text-slate-400 font-mono leading-tight">-</div>
              <div class="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">일반 업무</div>
            `}
          </div>
        `;
        container.appendChild(item);
      });
      lucide.createIcons();
    }

    // ==================== FULL SCHEDULE SUBVIEW FUNCTIONS ====================
    function renderFullMonthlyCalendar() {
      const monthTitle = document.getElementById('fullCalMonthTitle');
      const daysContainer = document.getElementById('fullMonthlyCalDays');
      if (!monthTitle || !daysContainer) return;

      monthTitle.textContent = `${calYear}년 ${calMonth + 1}월`;
      daysContainer.innerHTML = '';

      const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
      const lastDateCurrentMonth = new Date(calYear, calMonth + 1, 0).getDate();
      const lastDatePrevMonth = new Date(calYear, calMonth, 0).getDate();

      // Prev month (disabled cells with uniform height)
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const d = lastDatePrevMonth - i;
        const div = document.createElement('div');
        div.className = 'p-2 rounded-xl bg-slate-50/60 border border-slate-100/80 text-slate-300 text-xs select-none flex flex-col justify-between min-h-[82px] sm:min-h-[88px] opacity-60';
        div.innerHTML = `<span class="font-medium">${d}</span><div></div>`;
        daysContainer.appendChild(div);
      }

      // Current month (expanded cells showing task title badges)
      for (let day = 1; day <= lastDateCurrentMonth; day++) {
        const formattedDate = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = formattedDate === '2026-10-14';
        const isSelected = selectedCalDate === formattedDate;

        const dayTasks = appState.tasks.filter(t => {
          const matchDomain = appState.currentWorkstream === 'all' || t.domain === appState.currentWorkstream;
          return t.dueDate === formattedDate && matchDomain;
        });

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.onclick = () => filterTaskByDate(formattedDate);

        let btnClasses = 'relative p-2 rounded-xl border flex flex-col justify-between items-start transition-all cursor-pointer min-h-[82px] sm:min-h-[88px] text-left w-full overflow-hidden ';
        if (isSelected) {
          btnClasses += 'bg-indigo-600 text-white font-bold shadow-md ring-2 ring-indigo-400 border-indigo-600';
        } else if (isToday) {
          btnClasses += 'bg-indigo-50/70 text-indigo-900 border-indigo-300 hover:bg-indigo-100/60 shadow-2xs';
        } else {
          btnClasses += 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 hover:border-slate-300';
        }
        btn.className = btnClasses;

        const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
        let dayNumClass = 'text-xs font-bold leading-none inline-flex items-center justify-center';
        if (!isSelected) {
          if (dayOfWeek === 0) dayNumClass += ' text-rose-500';
          else if (dayOfWeek === 6) dayNumClass += ' text-blue-500';
          else dayNumClass += ' text-slate-700';
        }

        // Header inside cell: day number + today tag
        let cellHeaderHtml = `<div class="flex items-center justify-between w-full">`;
        if (isToday && !isSelected) {
          cellHeaderHtml += `<span class="${dayNumClass} w-5 h-5 rounded-full bg-indigo-600 text-white font-mono">${day}</span><span class="text-[9px] px-1 py-0.2 rounded font-extrabold bg-indigo-600 text-white">오늘</span>`;
        } else if (isSelected) {
          cellHeaderHtml += `<span class="${dayNumClass} text-white font-mono">${day}</span><span class="text-[9px] px-1 py-0.2 rounded font-bold bg-white/20 text-white">선택</span>`;
        } else {
          cellHeaderHtml += `<span class="${dayNumClass} font-mono">${day}</span>`;
        }
        cellHeaderHtml += `</div>`;

        // Task content badge list
        let tasksHtml = '';
        if (dayTasks.length > 0) {
          tasksHtml = '<div class="space-y-1 mt-1.5 w-full">';
          dayTasks.slice(0, 2).forEach(t => {
            let badgeStyle = 'bg-blue-50 text-blue-700 border border-blue-200';
            if (t.domain === 'publishing') badgeStyle = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
            else if (t.domain === 'knowledge') badgeStyle = 'bg-purple-50 text-purple-700 border border-purple-200';

            if (isSelected) {
              badgeStyle = 'bg-white/20 text-white border border-white/30';
            }

            const taskTime = t.dueTime ? `<span class="font-mono text-[9px] font-bold shrink-0 opacity-80">${t.dueTime}</span>` : '';
            tasksHtml += `
              <div class="px-1.5 py-0.5 rounded text-[10px] font-semibold truncate leading-tight flex items-center gap-1 ${badgeStyle}" title="${t.title} (${t.dueTime || '마감'})">
                ${taskTime}
                <span class="truncate">${t.title}</span>
              </div>
            `;
          });

          if (dayTasks.length > 2) {
            tasksHtml += `<div class="text-[9px] font-bold ${isSelected ? 'text-white/80' : 'text-slate-400'} pl-0.5">+${dayTasks.length - 2}건 더보기</div>`;
          }
          tasksHtml += '</div>';
        } else {
          tasksHtml = `<div class="h-4"></div>`;
        }

        btn.innerHTML = `${cellHeaderHtml}${tasksHtml}`;
        daysContainer.appendChild(btn);
      }

      // Next month (disabled cells with uniform height)
      const totalCells = firstDayOfWeek + lastDateCurrentMonth;
      const remainingCells = (7 - (totalCells % 7)) % 7;
      for (let nextDay = 1; nextDay <= remainingCells; nextDay++) {
        const div = document.createElement('div');
        div.className = 'p-2 rounded-xl bg-slate-50/60 border border-slate-100/80 text-slate-300 text-xs select-none flex flex-col justify-between min-h-[82px] sm:min-h-[88px] opacity-60';
        div.innerHTML = `<span class="font-medium">${nextDay}</span><div></div>`;
        daysContainer.appendChild(div);
      }
    }

    function renderFullScheduleTasks() {
      const container = document.getElementById('fullScheduleTaskList');
      if (!container) return;
      container.innerHTML = '';

      let list = appState.tasks;
      if (appState.currentWorkstream !== 'all') {
        list = list.filter(t => t.domain === appState.currentWorkstream);
      }

      // Update metrics
      const totalCount = list.length;
      const activeCount = list.filter(t => !t.completed).length;
      const doneCount = list.filter(t => t.completed).length;
      const totalAmt = list.reduce((acc, t) => acc + (t.amount || 0), 0);

      const metricTotalTasks = document.getElementById('metricTotalTasks');
      if (metricTotalTasks) metricTotalTasks.textContent = totalCount + '건';
      const metricActiveTasks = document.getElementById('metricActiveTasks');
      if (metricActiveTasks) metricActiveTasks.textContent = activeCount + '건';
      const metricTotalAmount = document.getElementById('metricTotalAmount');
      if (metricTotalAmount) metricTotalAmount.textContent = '₩' + totalAmt.toLocaleString();
      const metricDoneTasks = document.getElementById('metricDoneTasks');
      if (metricDoneTasks) metricDoneTasks.textContent = doneCount + '건';

      if (selectedCalDate) {
        list = list.filter(t => t.dueDate === selectedCalDate);
      }

      list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

      if (list.length === 0) {
        container.innerHTML = `
          <div class="p-12 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            선택된 필터에 해당하는 일정이 없습니다.
          </div>
        `;
        return;
      }

      const domainBadge = {
        client: '<span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">외주</span>',
        publishing: '<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">출판</span>',
        knowledge: '<span class="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">지식창업</span>',
        operation: '<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">운영</span>'
      };

      list.forEach(task => {
        const item = document.createElement('div');
        item.className = `p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-sm transition-all ${task.completed ? 'bg-slate-50/80 opacity-60' : 'bg-white hover:bg-slate-50'}`;
        item.innerHTML = `
          <div class="flex items-start gap-3.5 flex-1">
            <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskDone(this, ${task.id})" class="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0">
            <div class="space-y-1.5 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="font-bold text-slate-900 text-sm ${task.completed ? 'line-through text-slate-400' : ''}">${task.title}</span>
                <span class="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-semibold">${task.client}</span>
                ${domainBadge[task.domain] || ''}
                ${task.priority === '높음' ? '<span class="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-semibold">높음</span>' : ''}
                ${appState.scheduleBufferEnabled ? '<span class="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">+1.5일 비상 여유일 권장</span>' : ''}
              </div>
              <div class="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>마감: <strong class="text-slate-800">${task.dueDate}${task.dueTime ? ' ' + task.dueTime : ''}</strong></span>
                ${task.amount ? `<span class="text-indigo-600 font-bold font-mono">정산예정: ₩${Number(task.amount).toLocaleString()}</span>` : ''}
              </div>
              ${task.memo ? `<p class="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed mt-1">${task.memo}</p>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold ${task.status === '완료' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : task.status === '진행중' ? 'bg-blue-50 text-blue-700 border border-blue-200' : task.status === '지연검수' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}">${task.status}</span>
            <button type="button" onclick="openEditTaskModal(${task.id})" class="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="일정 수정">
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
            <button type="button" onclick="deleteTask(${task.id})" class="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors" title="일정 삭제">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        `;
        container.appendChild(item);
      });
      lucide.createIcons();
    }

    function toggleTaskDone(cb, taskId) {
      const task = appState.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = cb.checked;
        task.status = cb.checked ? '완료' : '진행중';
        renderScheduleTasks();
        renderMonthlyCalendar();
        renderFullScheduleTasks();
        renderFullMonthlyCalendar();
        showToast(cb.checked ? '태스크를 완료 처리했습니다.' : '태스크를 진행중으로 변경했습니다.');
      }
    }

    function deleteTask(taskId) {
      appState.tasks = appState.tasks.filter(t => t.id !== taskId);
      renderMonthlyCalendar();
      renderScheduleTasks();
      renderFullMonthlyCalendar();
      renderFullScheduleTasks();
      showToast('일정이 삭제되었습니다.');
    }


    // ==================== SUBVIEW INTERACTION HANDLERS ====================
    let currentKanbanStageHighlight = 'all';

    // 1. 세부 일정 2단 뷰 모드 전환 (월간 캘린더&타임라인 통합뷰 / 노트북 인덱스 칸반 보드)
    function setScheduleViewMode(mode) {
      appState.scheduleViewMode = mode;
      const modes = ['calendar', 'kanban'];
      modes.forEach(m => {
        const panel = document.getElementById(`panelSched-${m}`);
        const btn = document.getElementById(`btnSchedMode-${m}`);
        if (panel) panel.classList.toggle('hidden', m !== mode);
        if (btn) {
          if (m === mode) {
            btn.className = 'px-3.5 py-1.5 rounded-lg font-bold bg-white text-indigo-700 shadow-xs flex items-center gap-1.5 transition-all';
            const icon = btn.querySelector('i');
            if (icon) icon.className = 'w-3.5 h-3.5 text-indigo-600';
          } else {
            btn.className = 'px-3.5 py-1.5 rounded-lg font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-all';
            const icon = btn.querySelector('i');
            if (icon) icon.className = 'w-3.5 h-3.5 text-slate-500';
          }
        }
      });

      if (mode === 'calendar') {
        renderFullMonthlyCalendar();
        renderFullScheduleTasks();
      } else if (mode === 'kanban') {
        renderGanttTimeline();
        renderKanbanBoard();
      }
      lucide.createIcons();
    }

    // 2. 마감 여유일(+1.5일) 제안 토글 핸들러
    function handleScheduleBufferToggle(checked) {
      appState.scheduleBufferEnabled = checked;
      renderFullScheduleTasks();
      renderGanttTimeline();
      showToast(checked ? '마감 여유일(+1.5일) 제안이 적용되었습니다.' : '마감 여유일 제안이 해제되었습니다.');
    }

    let currentKanbanSubView = 'all';

    // 단일 통합 보드 서브 뷰 전환 (전체 통합 / 간트 타임라인 / 5단계 칸반)
    function setKanbanSubView(subView) {
      currentKanbanSubView = subView;
      const ganttSec = document.getElementById('sectionGanttTimeline');
      const bridgeSec = document.getElementById('sectionKanbanBridge');
      const kanbanSec = document.getElementById('sectionKanbanColumns');
      
      const btnAll = document.getElementById('subViewBtn-all');
      const btnGantt = document.getElementById('subViewBtn-gantt');
      const btnKanban = document.getElementById('subViewBtn-kanban');

      if (btnAll) btnAll.className = subView === 'all' ? 'px-3 py-1 rounded-lg font-bold bg-white text-indigo-700 shadow-2xs transition-all' : 'px-3 py-1 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition-all';
      if (btnGantt) btnGantt.className = subView === 'gantt' ? 'px-3 py-1 rounded-lg font-bold bg-white text-indigo-700 shadow-2xs transition-all' : 'px-3 py-1 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition-all';
      if (btnKanban) btnKanban.className = subView === 'kanban' ? 'px-3 py-1 rounded-lg font-bold bg-white text-indigo-700 shadow-2xs transition-all' : 'px-3 py-1 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition-all';

      if (subView === 'all') {
        if (ganttSec) ganttSec.classList.remove('hidden');
        if (bridgeSec) bridgeSec.classList.remove('hidden');
        if (kanbanSec) kanbanSec.classList.remove('hidden');
      } else if (subView === 'gantt') {
        if (ganttSec) ganttSec.classList.remove('hidden');
        if (bridgeSec) bridgeSec.classList.add('hidden');
        if (kanbanSec) kanbanSec.classList.add('hidden');
      } else if (subView === 'kanban') {
        if (ganttSec) ganttSec.classList.add('hidden');
        if (bridgeSec) bridgeSec.classList.remove('hidden');
        if (kanbanSec) kanbanSec.classList.remove('hidden');
      }
      lucide.createIcons();
    }

    // 3. 월간 마감 타임라인 (간트 차트 트랙) 렌더러 (하단 5단계 칸반과 상호 연동)
    function renderGanttTimeline() {
      const container = document.getElementById('ganttChartContainer');
      if (!container) return;

      const projects = [
        { id: 'proj-tech', stageId: 'inprogress', stageName: '02 작업 진행', stageBadge: 'bg-indigo-100 text-indigo-800 border-indigo-200', name: '(주)테크솔루션즈 MVP 프론트엔드 반응형', domain: '외주', client: '테크솔루션즈', start: '10-05', end: '10-18', progress: 85, color: 'bg-blue-600', amount: '₩2,500,000' },
        { id: 'proj-ecom', stageId: 'review', stageName: '03 피드백·검수', stageBadge: 'bg-amber-100 text-amber-800 border-amber-200', name: '글로벌이커머스 결제 모듈 연동 납품', domain: '외주', client: '글로벌이커머스', start: '09-25', end: '10-14', progress: 100, color: 'bg-amber-500', amount: '₩1,200,000', note: '상법 제69조 검수 진행' },
        { id: 'proj-book', stageId: 'inprogress', stageName: '02 작업 진행', stageBadge: 'bg-indigo-100 text-indigo-800 border-indigo-200', name: '디지털북스 완벽 가이드 원고 4장 교정', domain: '출판', client: '디지털북스', start: '10-10', end: '10-22', progress: 50, color: 'bg-emerald-600', amount: '₩1,200,000' },
        { id: 'proj-notion', stageId: 'todo', stageName: '01 기획·접수', stageBadge: 'bg-blue-100 text-blue-800 border-blue-200', name: '노션 프리랜서 회계 템플릿 배포 준비', domain: '지식창업', client: '자체런칭', start: '10-15', end: '10-26', progress: 40, color: 'bg-purple-600', amount: '₩800,000' },
        { id: 'proj-tax', stageId: 'invoiced', stageName: '04 검수 완료', stageBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200', name: '테크솔루션즈 착수금 세금계산서', domain: '외주', client: '테크솔루션즈', start: '10-01', end: '10-12', progress: 100, color: 'bg-emerald-600', amount: '₩3,000,000', note: '10% VAT 분리 보관' }
      ];

      let html = `
        <div class="space-y-2 text-xs">
          <div class="grid grid-cols-12 gap-2 text-[11px] text-slate-400 font-bold border-b border-slate-200/60 pb-1.5 px-2">
            <div class="col-span-5 text-slate-700">프로젝트명 / 발주처</div>
            <div class="col-span-4 text-center">10월 타임라인 (간트 진행바)</div>
            <div class="col-span-3 text-right">진행 단계 / 정산액</div>
          </div>
      `;

      projects.forEach(p => {
        const bufferText = appState.scheduleBufferEnabled ? '<span class="text-[9px] px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold ml-1">+1.5일 버퍼</span>' : '';
        html += `
          <div onclick="highlightKanbanStage('${p.stageId}')" class="p-3 rounded-xl bg-white border border-slate-200/90 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group space-y-2">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-1.5 font-bold text-slate-900 truncate">
                <span class="text-[10px] px-1.5 py-0.5 rounded ${p.domain === '외주' ? 'bg-blue-100 text-blue-800' : p.domain === '출판' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'} font-semibold">${p.domain}</span>
                <span class="group-hover:text-indigo-600 transition-colors truncate">${p.name}</span>
                ${bufferText}
              </div>
              <div class="flex items-center gap-2 shrink-0 ml-2">
                <span class="text-[10px] px-2 py-0.5 rounded-full border ${p.stageBadge} font-bold">${p.stageName}</span>
                <span class="font-mono font-bold text-slate-900 text-xs">${p.amount}</span>
              </div>
            </div>
            
            <div class="grid grid-cols-12 gap-2 items-center text-[10px]">
              <div class="col-span-5 text-slate-500 truncate">
                발주처: <span class="text-slate-800 font-medium">${p.client}</span> ${p.note ? `• <span class="text-amber-600 font-semibold">${p.note}</span>` : ''}
              </div>
              <div class="col-span-5">
                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden relative">
                  <div class="${p.color} h-2 rounded-full transition-all duration-500" style="width: ${p.progress}%"></div>
                </div>
              </div>
              <div class="col-span-2 text-right font-mono text-slate-500">
                <span class="text-slate-400">${p.start}~${p.end}</span> (<strong class="text-slate-800">${p.progress}%</strong>)
              </div>
            </div>
          </div>
        `;
      });

      html += `</div>`;
      container.innerHTML = html;
    }

    // 4. 5단계 프로젝트 칸반 보드 렌더러 (타임라인 내장 카드)
    function renderKanbanBoard() {
      const container = document.getElementById('kanbanBoardContainer');
      if (!container) return;

      const cols = [
        {
          id: 'todo',
          num: '01',
          title: '기획·접수',
          themeColor: 'blue',
          highlightBg: 'bg-blue-50/70',
          badgeClass: 'bg-blue-100 text-blue-800 border border-blue-200',
          items: [
            { title: '노션 프리랜서 회계 템플릿 상세 페이지 집필', client: '자체런칭', domain: '지식창업', start: '10-15', due: '10-26', progress: 40, color: 'bg-purple-600', amount: '₩800,000' }
          ]
        },
        {
          id: 'inprogress',
          num: '02',
          title: '작업 진행',
          themeColor: 'indigo',
          highlightBg: 'bg-indigo-50/70',
          badgeClass: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
          items: [
            { title: 'MVP 프론트엔드 반응형 마무리', client: '테크솔루션즈', domain: '외주', start: '10-05', due: '10-18', progress: 85, color: 'bg-blue-600', amount: '₩2,500,000' },
            { title: '원고 4장 예제 코드 교정', client: '디지털북스', domain: '출판', start: '10-10', due: '10-22', progress: 50, color: 'bg-emerald-600', amount: '₩1,200,000' }
          ]
        },
        {
          id: 'review',
          num: '03',
          title: '피드백·검수',
          themeColor: 'amber',
          highlightBg: 'bg-amber-50/70',
          badgeClass: 'bg-amber-100 text-amber-800 border border-amber-200',
          items: [
            { title: '프로모션 결제 모듈 연동 납품 건', client: '글로벌이커머스', domain: '외주', start: '09-25', due: '10-14', progress: 100, color: 'bg-amber-500', amount: '₩1,200,000', note: '상법 제69조 검수 진행' }
          ]
        },
        {
          id: 'invoiced',
          num: '04',
          title: '검수 완료',
          themeColor: 'emerald',
          highlightBg: 'bg-emerald-50/70',
          badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
          items: [
            { title: '테크솔루션즈 착수금 세금계산서', client: '테크솔루션즈', domain: '외주', start: '10-01', due: '10-12', progress: 100, color: 'bg-emerald-600', amount: '₩3,000,000', note: '10% VAT 분리 보관' }
          ]
        },
        {
          id: 'done',
          num: '05',
          title: '정산 완료',
          themeColor: 'slate',
          highlightBg: 'bg-slate-200/60',
          badgeClass: 'bg-slate-200 text-slate-800 border border-slate-300',
          items: [
            { title: '교보eBook 9월 인세 정산', client: '교보eBook', domain: '출판', start: '09-10', due: '10-10', progress: 100, color: 'bg-slate-600', amount: '₩1,160,400', note: '3.3% 원천징수' },
            { title: '스타트업 기술특강료 정산', client: '인프런', domain: '지식창업', start: '09-15', due: '10-08', progress: 100, color: 'bg-slate-600', amount: '₩912,000', note: '8.8% 기타소득' }
          ]
        }
      ];

      let html = '';
      cols.forEach(col => {
        const isHighlighted = currentKanbanStageHighlight === col.id;
        const bgStyle = isHighlighted ? col.highlightBg : 'bg-transparent';

        html += `
          <div id="kanbanCol-${col.id}" class="kanban-col-stage p-3.5 space-y-3 transition-all duration-200 min-h-[460px] flex flex-col ${bgStyle}">
            <!-- Column Stage Header -->
            <div class="flex items-center justify-between pb-2 border-b border-slate-200/70 shrink-0">
              <div class="flex items-center gap-1.5">
                <span class="font-mono font-black text-xs text-slate-400">${col.num}</span>
                <span class="font-bold text-slate-900 text-xs">${col.title}</span>
              </div>
              <span class="text-[10px] font-bold px-1.5 py-0.2 rounded-full ${col.badgeClass}">${col.items.length}</span>
            </div>

            <!-- Task Items Inside Column -->
            <div class="space-y-2.5 flex-1">
        `;

        if (col.items.length === 0) {
          html += `<div class="p-4 text-center text-slate-300 text-[11px] border border-dashed border-slate-200 rounded-xl my-auto">비어 있음</div>`;
        } else {
          col.items.forEach(it => {
            html += `
              <div class="p-3 bg-white rounded-xl border border-slate-200/90 space-y-2 shadow-2xs hover:shadow-xs hover:border-indigo-300 transition-all">
                <div class="flex items-center justify-between text-[10px]">
                  <span class="font-semibold px-1.5 py-0.5 rounded ${it.domain === '외주' ? 'bg-blue-50 text-blue-700 border border-blue-200' : it.domain === '출판' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-purple-50 text-purple-700 border border-purple-200'}">${it.domain}</span>
                  <span class="text-slate-400 font-mono flex items-center gap-1">
                    <i data-lucide="clock" class="w-3 h-3 text-slate-400"></i>
                    <span>마감 ${it.due}</span>
                  </span>
                </div>
                <div class="font-bold text-slate-900 text-[11px] leading-snug">${it.title}</div>
                <div class="text-[10px] text-slate-500">${it.client}</div>
                
                <!-- 연계된 미니 간트 타임라인 트랙 -->
                <div class="pt-1.5 space-y-1">
                  <div class="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                    <span>간트: ${it.start}~${it.due}</span>
                    <span class="font-bold text-slate-700">${it.progress}%</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div class="${it.color} h-1.5 rounded-full" style="width: ${it.progress}%"></div>
                  </div>
                </div>

                <div class="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span class="font-mono font-bold text-slate-900">${it.amount}</span>
                  ${it.note ? `<span class="text-[9px] text-slate-500 bg-slate-100 px-1 py-0.2 rounded">${it.note}</span>` : ''}
                </div>
              </div>
            `;
          });
        }

        html += `
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
      lucide.createIcons();
    }

    // 5. 5단계 워크플로우 하이라이트 인터랙션
    function highlightKanbanStage(stageId) {
      if (currentKanbanStageHighlight === stageId && stageId !== 'all') {
        currentKanbanStageHighlight = 'all';
      } else {
        currentKanbanStageHighlight = stageId;
      }

      const stages = [
        { id: 'todo', bg: 'bg-blue-50/70', border: 'border-blue-400' },
        { id: 'inprogress', bg: 'bg-indigo-50/70', border: 'border-indigo-400' },
        { id: 'review', bg: 'bg-amber-50/70', border: 'border-amber-400' },
        { id: 'invoiced', bg: 'bg-emerald-50/70', border: 'border-emerald-400' },
        { id: 'done', bg: 'bg-slate-200/60', border: 'border-slate-400' }
      ];

      stages.forEach(s => {
        const colEl = document.getElementById(`kanbanCol-${s.id}`);
        if (colEl) {
          if (currentKanbanStageHighlight === s.id) {
            colEl.className = `kanban-col-stage p-3.5 space-y-3 transition-all duration-200 min-h-[460px] flex flex-col ${s.bg} ring-2 ring-indigo-400/40 rounded-lg`;
          } else if (currentKanbanStageHighlight === 'all') {
            colEl.className = 'kanban-col-stage p-3.5 space-y-3 transition-all duration-200 min-h-[460px] flex flex-col bg-transparent';
          } else {
            colEl.className = 'kanban-col-stage p-3.5 space-y-3 transition-all duration-200 min-h-[460px] flex flex-col bg-transparent opacity-40';
          }
        }
      });
    }



// Expose schedule functions to global window
window.renderMonthlyCalendar = renderMonthlyCalendar;
window.changeCalMonth = changeCalMonth;
window.resetCalToday = resetCalToday;
window.filterTaskByDate = filterTaskByDate;
window.renderScheduleTasks = renderScheduleTasks;
window.renderFullMonthlyCalendar = renderFullMonthlyCalendar;
window.renderFullScheduleTasks = renderFullScheduleTasks;
window.toggleTaskDone = toggleTaskDone;
window.deleteTask = deleteTask;
window.setScheduleViewMode = setScheduleViewMode;
window.handleScheduleBufferToggle = handleScheduleBufferToggle;
window.setKanbanSubView = setKanbanSubView;
window.renderGanttTimeline = renderGanttTimeline;
window.renderKanbanBoard = renderKanbanBoard;
window.highlightKanbanStage = highlightKanbanStage;
