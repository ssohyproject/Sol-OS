/**
 * SoloOS Core: Router & Navigation Controller
 * Subview switching, view mode switching (Dashboard vs Conversational Agent), sidebar drawer, workstreams
 */

const navGroupState = {
      schedule: true,
      finance: true,
      legal: true
    };

    function toggleNavGroup(groupKey) {
      const content = document.getElementById(`navGroupContent-${groupKey}`);
      const icon = document.getElementById(`navGroupIcon-${groupKey}`);
      if (!content) return;
      
      const isHidden = content.classList.contains('hidden');
      if (isHidden) {
        content.classList.remove('hidden');
        if (icon) icon.classList.remove('-rotate-90');
        navGroupState[groupKey] = true;
      } else {
        content.classList.add('hidden');
        if (icon) icon.classList.add('-rotate-90');
        navGroupState[groupKey] = false;
      }
    }

    // Sub-view Switcher (메인 대시보드 2대 핵심 집중 & 세부 서브뷰 전환 제어)
    let currentActiveSubView = 'overview';
    const subviewParentGroup = {
      schedule: 'schedule',
      settlement: 'schedule',
      clients: 'schedule',
      statements: 'finance',
      ledger: 'finance',
      tax: 'finance',
      contract: 'legal',
      legal: 'legal'
    };

    function switchSubView(viewId) {
      currentActiveSubView = viewId;
      
      // Ensure Dashboard mode is shown if in conversational mode
      if (appState.viewMode !== 'dashboard') {
        switchViewMode('dashboard', false);
      }

      // Automatically expand parent group if a 2-depth item is selected
      const parentGroup = subviewParentGroup[viewId];
      if (parentGroup) {
        const parentContent = document.getElementById(`navGroupContent-${parentGroup}`);
        const parentIcon = document.getElementById(`navGroupIcon-${parentGroup}`);
        if (parentContent && parentContent.classList.contains('hidden')) {
          parentContent.classList.remove('hidden');
          if (parentIcon) parentIcon.classList.remove('-rotate-90');
          navGroupState[parentGroup] = true;
        }
      }

      const subviews = ['overview', 'schedule', 'settlement', 'clients', 'statements', 'ledger', 'tax', 'contract', 'legal'];
      subviews.forEach(id => {
        const el = document.getElementById(`subview-${id}`);
        const navBtn = document.getElementById(`nav-${id}`);
        if (el) {
          if (id === viewId) {
            el.classList.remove('hidden');
          } else {
            el.classList.add('hidden');
          }
        }
        if (navBtn) {
          if (id === 'overview') {
            if (id === viewId) {
              navBtn.className = 'sidebar-nav-link flex items-center gap-2.5 px-3 py-2 rounded-xl bg-brand-50 text-brand-700 font-bold border border-brand-200 transition-all text-left';
            } else {
              navBtn.className = 'sidebar-nav-link flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all text-left';
            }
          } else {
            const hashSpan = navBtn.querySelector('span');
            if (id === viewId) {
              navBtn.className = 'sidebar-nav-link w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-brand-50 text-brand-700 font-bold border border-brand-200 transition-all text-left';
              if (hashSpan && hashSpan.textContent.trim() === '#') {
                hashSpan.className = 'text-brand-600 font-mono text-[11px] font-bold';
              }
            } else {
              navBtn.className = 'sidebar-nav-link w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent transition-all text-left';
              if (hashSpan && hashSpan.textContent.trim() === '#') {
                hashSpan.className = 'text-slate-400 font-mono text-[11px]';
              }
            }
          }
        }
      });

      const navConv = document.getElementById('nav-conversational');
      if (navConv) {
        navConv.className = 'sidebar-nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all text-left';
      }

      const mainContent = document.getElementById('mainContentArea');
      if (mainContent) mainContent.scrollTop = 0;

      if (viewId === 'overview' && cashflowChartInstance) {
        setTimeout(() => {
          cashflowChartInstance.resize();
        }, 60);
      } else if (viewId === 'schedule') {
        renderFullMonthlyCalendar();
        renderGanttTimeline();
        renderFullScheduleTasks();
      } else if (viewId === 'settlement') {
        renderSettlementView();
      } else if (viewId === 'tax') {
        renderTaxView();
      } else if (viewId === 'clients') {
        renderClientList();
        renderClientDetail(selectedClientId);
      }

      closeSidebarDrawer();
      lucide.createIcons();
    }

    // Responsive Sidebar Drawer Toggle (모바일/태블릿 오프캔버스 드로어)
    function toggleSidebarDrawer() {
      const sidebar = document.getElementById('mainSidebar');
      const backdrop = document.getElementById('sidebarBackdrop');
      if (!sidebar) return;
      const isClosed = sidebar.classList.contains('-translate-x-full');
      if (isClosed) {
        sidebar.classList.remove('-translate-x-full');
        if (backdrop) backdrop.classList.remove('hidden');
      } else {
        sidebar.classList.add('-translate-x-full');
        if (backdrop) backdrop.classList.add('hidden');
      }
    }

    function closeSidebarDrawer() {
      const sidebar = document.getElementById('mainSidebar');
      const backdrop = document.getElementById('sidebarBackdrop');
      if (sidebar) sidebar.classList.add('-translate-x-full');
      if (backdrop) backdrop.classList.add('hidden');
    }

    // Global Workstream Dropdown Control (업무 도메인 드롭다운 토글 및 선택)
    function toggleWorkstreamDropdown(event) {
      if (event) event.stopPropagation();
      const menu = document.getElementById('wsDropdownMenu');
      if (menu) {
        menu.classList.toggle('hidden');
      }
    }

    function selectWorkstream(domain, label, icon, iconColor) {
      setWorkstream(domain);
      const labelEl = document.getElementById('currentWsLabel');
      const iconEl = document.getElementById('currentWsIcon');
      if (labelEl) labelEl.textContent = label;
      if (iconEl) {
        iconEl.setAttribute('data-lucide', icon);
        iconEl.className = `w-3.5 h-3.5 ${iconColor || 'text-brand-600'}`;
      }
      const menu = document.getElementById('wsDropdownMenu');
      if (menu) menu.classList.add('hidden');
      lucide.createIcons();
    }

    // Close Dropdown when clicking outside
    window.addEventListener('click', (e) => {
      const menu = document.getElementById('wsDropdownMenu');
      const btn = document.getElementById('wsDropdownBtn');
      if (menu && !menu.classList.contains('hidden')) {
        if (btn && !btn.contains(e.target) && !menu.contains(e.target)) {
          menu.classList.add('hidden');
        }
      }
    });

    // PWS (Progressive Web Service) Install & Shortcut Prompt handling
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      const installBtn = document.getElementById('pwsInstallBtn') || document.getElementById('pwaInstallBtn');
      if (installBtn) installBtn.classList.remove('hidden');
    });


    // Workstream Toggle
    function setWorkstream(domain) {
      appState.currentWorkstream = domain;

      const domainMap = {
        all: '전체 통합 뷰',
        client: '외주 프로젝트 전용',
        publishing: '디지털 출판 전용',
        knowledge: '지식창업·강의 전용'
      };
      const badgeEl = document.getElementById('currentDomainBadge');
      if (badgeEl) badgeEl.textContent = domainMap[domain];
      const revDomainEl = document.getElementById('kpiRevenueDomain');
      if (revDomainEl) revDomainEl.textContent = domainMap[domain];

      renderLedgerTable();
      renderMonthlyCalendar();
      renderScheduleTasks();
      renderFullMonthlyCalendar();
      renderFullScheduleTasks();
      updateKPICards();
      updateVisualStatements();
      updateChartData();
    }

    // View Mode Switcher (대시보드형 <-> 대화형 AI)
    function switchViewMode(mode, retainSubView = true) {
      appState.viewMode = mode;
      const dashboardView = document.getElementById('dashboardView');
      const conversationalView = document.getElementById('conversationalView');
      const btnDashboard = document.getElementById('mode-btn-dashboard');
      const btnConversational = document.getElementById('mode-btn-conversational');
      const navConv = document.getElementById('nav-conversational');

      if (mode === 'dashboard') {
        dashboardView.classList.remove('hidden');
        conversationalView.classList.add('hidden');
        if (btnDashboard) btnDashboard.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-white text-brand-700 shadow-sm';
        if (btnConversational) btnConversational.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-slate-600 hover:text-slate-900';
        if (navConv) navConv.className = 'sidebar-nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all text-left';
        
        if (retainSubView) {
          switchSubView(currentActiveSubView || 'overview');
        }
      } else {
        dashboardView.classList.add('hidden');
        conversationalView.classList.remove('hidden');
        if (btnConversational) btnConversational.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-white text-brand-700 shadow-sm';
        if (btnDashboard) btnDashboard.className = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all text-slate-600 hover:text-slate-900';
        
        // Inactivate all dashboard nav buttons
        ['overview', 'schedule', 'settlement', 'clients', 'statements', 'ledger', 'tax', 'contract', 'legal'].forEach(id => {
          const navBtn = document.getElementById(`nav-${id}`);
          if (navBtn) {
            if (id === 'overview') {
              navBtn.className = 'sidebar-nav-link flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent transition-all text-left';
            } else {
              navBtn.className = 'sidebar-nav-link w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent transition-all text-left';
              const hashSpan = navBtn.querySelector('span');
              if (hashSpan && hashSpan.textContent.trim() === '#') {
                hashSpan.className = 'text-slate-400 font-mono text-[11px]';
              }
            }
          }
        });
        if (navConv) navConv.className = 'sidebar-nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-brand-50 text-brand-700 font-bold border border-brand-200 transition-all text-left';
        closeSidebarDrawer();
      }
      lucide.createIcons();
    }

    // Onboarding Modal Handlers (첫 접속 시 대시보드형 vs 대화형 선택)


// Expose router functions to global window
window.navGroupState = navGroupState;
window.toggleNavGroup = toggleNavGroup;
window.switchSubView = switchSubView;
window.switchViewMode = switchViewMode;
window.toggleSidebarDrawer = toggleSidebarDrawer;
window.closeSidebarDrawer = closeSidebarDrawer;
window.toggleWorkstreamDropdown = toggleWorkstreamDropdown;
window.selectWorkstream = selectWorkstream;
window.setWorkstream = setWorkstream;
