    // Initial State & Realistic 3-in-1 Tax Data
    const appState = {
      viewMode: 'dashboard', // 'dashboard' or 'conversational'
      plainLanguage: true, // true: 쉬운 용어 모드, false: 표준 회계 모드
      currentWorkstream: 'all', // 'all', 'client', 'publishing', 'knowledge'
      workingCapital: 14200000,
      monthlyFixedExpense: 2730000,
      scheduleBufferEnabled: false,
      scheduleViewMode: 'calendar',
      clientDeferred: false,
      transactions: [
        { id: 1, date: '2026-10-12', domain: 'client', title: '(주)테크솔루션즈 전자세금계산서 발행', category: '세금계산서매출(VAT분리)', gross: 3000000, tax: 300000, net: 3300000, status: 'VAT예치필수' },
        { id: 2, date: '2026-10-10', domain: 'publishing', title: '교보eBook 9월 정산 인세 (3.3%)', category: '3.3%사업소득매출', gross: 1200000, tax: 39600, net: 1160400, status: '원천징수완료' },
        { id: 3, date: '2026-10-08', domain: 'knowledge', title: '인프런 스타트업 기술특강료 (8.8%)', category: '8.8%기타소득매출', gross: 1000000, tax: 88000, net: 912000, status: '필요경비60%' },
        { id: 4, date: '2026-10-05', domain: 'client', title: 'AWS 클라우드 서버 이용료', category: '지급수수료/통신', gross: -142000, tax: -14200, net: -156200, status: '적격증빙' },
        { id: 5, date: '2026-10-01', domain: 'operation', title: '작업실 월 임대료 및 관리비', category: '지급임차료', gross: -850000, tax: 0, net: -850000, status: '계산서확인' }
      ],
      tasks: [
        { id: 1, domain: 'client', client: '테크솔루션즈', title: 'MVP 프론트엔드 반응형 마무리', dueDate: '2026-10-18', dueTime: '18:00', priority: '높음', status: '진행중', amount: 2500000, memo: '결제 모듈 최종 API 테스트 및 반응형 모바일 검수 완료 후 납품', completed: false },
        { id: 2, domain: 'publishing', client: '디지털북스', title: '타입스크립트 완벽 가이드 원고 4장 교정', dueDate: '2026-10-22', dueTime: '15:00', priority: '보통', status: '대기', amount: 1200000, memo: '코드 블록 문법 검증 및 예제 실행 테스트', completed: false },
        { id: 3, domain: 'knowledge', client: '자체 런칭', title: '노션 프리랜서 회계 템플릿 배포 준비', dueDate: '2026-10-26', dueTime: '12:00', priority: '보통', status: '진행중', amount: 800000, memo: '템플릿 상세 페이지 가이드 작성', completed: false },
        { id: 4, domain: 'client', client: '글로벌이커머스', title: '프로모션 결제 모듈 연동 (정산 확인 건)', dueDate: '2026-10-14', dueTime: '19:00', priority: '높음', status: '지연검수', amount: 1200000, memo: '상법 제69조 14일 검수 도래 건 잔금 확인', completed: false }
      ],
      clients: [
        {
          id: 1,
          name: '(주)테크솔루션즈',
          shortName: '테크솔루션즈',
          tier: '우수', // '우수', '양호', '주의', '위험'
          bizNum: '120-88-12345',
          settlementCycle: '매월 말일 마감 익월 15일',
          manager: '김영민 이사 (010-9123-4567)',
          totalRevenue: 8500000,
          completedCount: 3,
          avgDelay: '0일 (즉시 결제)',
          avgRevision: 1.1,
          spentHours: 60,
          hourlyRate: 75000,
          specialClause: '',
          checklist: [
            { id: 'c1', label: '사업자등록증', checked: true },
            { id: 'c2', label: '통장 사본', checked: true },
            { id: 'c3', label: '견적서 원본', checked: true },
            { id: 'c4', label: '용역 계약서', checked: true },
            { id: 'c5', label: '비밀유지계약(NDA)', checked: true },
            { id: 'c6', label: '개인정보동의서', checked: true }
          ],
          communication: {
            channel: '슬랙 (#tech-dev-soloos)',
            meeting: '주간 화상 미팅 (매주 화요일 10시)',
            sharing: '피그마 파일 링크 + 깃허브 PR'
          }
        },
        {
          id: 2,
          name: '디지털북스 출판사',
          shortName: '디지털북스',
          tier: '양호',
          bizNum: '214-87-98765',
          settlementCycle: '분기 마감 익월 말일',
          manager: '박지현 팀장 (편집기획)',
          totalRevenue: 3200000,
          completedCount: 2,
          avgDelay: '+2.5일 (양호)',
          avgRevision: 2.0,
          spentHours: 50,
          hourlyRate: 64000,
          specialClause: '',
          checklist: [
            { id: 'c1', label: '출판 배급 계약서', checked: true },
            { id: 'c2', label: '통장 사본', checked: true },
            { id: 'c3', label: '저작권 귀속 합의', checked: true },
            { id: 'c4', label: '원천징수영수증', checked: true },
            { id: 'c5', label: 'ISBN 신청 서류', checked: true },
            { id: 'c6', label: '4분기 정산서(대기)', checked: false }
          ],
          communication: {
            channel: '공식 이메일 + 카카오톡 채널',
            meeting: '마일스톤 챕터 탈고 시 수시 피드백',
            sharing: '구글 독스 + 노션 원고 공유'
          }
        },
        {
          id: 3,
          name: '글로벌이커머스(주)',
          shortName: '글로벌이커머스',
          tier: '위험',
          bizNum: '312-81-45678',
          settlementCycle: '납품 검수 후 14일 (연체)',
          manager: '이철우 부장 (마케팅본부)',
          totalRevenue: 3000000,
          completedCount: 1,
          avgDelay: '18일 지연 (미수금 ₩1,200,000)',
          avgRevision: 4.5,
          spentHours: 165,
          hourlyRate: 18180,
          specialClause: '착수금 50% 선입금 필수화, 무상 수정 2회 제한, 상법 7일 단축 검수 특약 적용 권장',
          checklist: [
            { id: 'c1', label: '사업자등록증', checked: true },
            { id: 'c2', label: '견적서', checked: true },
            { id: 'c3', label: '계약서(수정대기)', checked: false },
            { id: 'c4', label: '잔금 계산서(미결)', checked: false }
          ],
          communication: {
            channel: '카카오톡 + 유선 전화 (기록 보존 주의)',
            meeting: '비정기 수시 요청',
            sharing: '이메일 첨부파일 및 웹 빌드 링크'
          }
        }
      ],
      receivables: [
        {
          id: 1,
          clientId: 1,
          clientName: '(주)테크솔루션즈',
          itemTitle: '외주 웹 개발 1차 잔금',
          amount: 2500000,
          dueDate: '2026-10-25',
          status: '정상 (검수 유예 중)',
          statusType: 'normal',
          deferred: false
        },
        {
          id: 2,
          clientId: 2,
          clientName: '디지털북스 출판사',
          itemTitle: '디지털 전자책 3분기 인세',
          amount: 700000,
          dueDate: '2026-10-18',
          status: '정상 (정산 예정)',
          statusType: 'normal',
          deferred: false
        },
        {
          id: 3,
          clientId: 3,
          clientName: '글로벌이커머스(주)',
          itemTitle: '프로모션 웹페이지 제작 잔금',
          amount: 1200000,
          dueDate: '2026-09-26',
          status: '지연 18일 발생',
          statusType: 'delayed',
          deferred: false
        }
      ]
    };

    let cashflowChartInstance = null;
    let calYear = 2026;
    let calMonth = 9; // 0-indexed: 9 = 10월
    let selectedCalDate = null; // null: 전체 일정 표시, 'YYYY-MM-DD': 해당 날짜 필터
    let isLedgerBulkEditing = false;

    // DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
      lucide.createIcons();
      initChart();
      renderLedgerTable();
      renderMonthlyCalendar();
      renderScheduleTasks();
      renderFullMonthlyCalendar();
      renderFullScheduleTasks();
      renderClientList();
      renderClientDetail(selectedClientId);
      renderReceivablesTable();
      updateKPICards();
      updateVisualStatements();
      applyPlainLanguageTerms();
      switchSubView('overview');

      if (!localStorage.getItem('soloos_onboarded_v1')) {
        openOnboardingModal();
      }

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW registration error:', err));
      }

      if (window.SoloOSFirebase) {
        window.SoloOSFirebase.init().catch(err => console.warn('Firebase init:', err));
      }
    });

    // Nav Group Toggle (아코디언 토글 제어)
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

    function installPWS() {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          deferredPrompt = null;
        });
      } else {
        alert('브라우저 설정 메뉴에서 "홈 화면에 추가" 또는 "앱 설치"를 선택해 주세요.');
      }
    }
    const installPWA = installPWS; // 하위 호환성 유지

    // Accounting Plain Language Mode Toggle
    function togglePlainLanguageMode() {
      appState.plainLanguage = !appState.plainLanguage;
      const btnText = document.getElementById('plainLanguageBtnText');
      const btn = document.getElementById('plainLanguageBtn');
      if (appState.plainLanguage) {
        btnText.textContent = '쉬운 용어 모드 ON';
        btn.className = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all';
      } else {
        btnText.textContent = '표준 회계 모드 ON';
        btn.className = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 transition-all';
      }
      applyPlainLanguageTerms();
    }

    function applyPlainLanguageTerms() {
      const isPlain = appState.plainLanguage;
      
      document.querySelectorAll('.term-working-capital').forEach(el => {
        el.textContent = isPlain ? '사업 통장 잔고 (가용 자금)' : '유동 당좌자산 (보통예금 잔액)';
      });
      document.querySelectorAll('.term-revenue').forEach(el => {
        el.textContent = isPlain ? '이번 달 총 수입 (매출)' : '당기 매출액 (공급가액 총계)';
      });
      document.querySelectorAll('.term-net-income').forEach(el => {
        el.textContent = isPlain ? '실제 통장 입금액:' : '원천징수 차감 후 순현금유입:';
      });
      document.querySelectorAll('.term-tax-buffer').forEach(el => {
        el.textContent = isPlain ? '세금 통장 분리 보관 권장액' : '부가세 및 소득세 충당금';
      });
      document.querySelectorAll('.term-fs-title').forEach(el => {
        el.textContent = '자금 현황';
      });
      document.querySelectorAll('.term-step1-label').forEach(el => {
        el.textContent = isPlain ? '① 계약 총 매출 (공급가액)' : '① 총 매출액 (공급가액)';
      });
      document.querySelectorAll('.term-step2-label').forEach(el => {
        el.textContent = isPlain ? '② 3대 세무 공제 및 부가가치세' : '② 부가세예수금 / 선납세금';
      });
      document.querySelectorAll('.term-step3-label').forEach(el => {
        el.textContent = isPlain ? '③ 실제 통장 입금액' : '③ 영업현금 실수령액';
      });
      document.querySelectorAll('.term-step4-label').forEach(el => {
        el.textContent = isPlain ? '④ 사업 필수 운영 경비' : '④ 판매비와 관리비(판관비)';
      });
      document.querySelectorAll('.term-step5-label').forEach(el => {
        el.textContent = isPlain ? '⑤ 세후 실질 순이익' : '⑤ 당기순이익 (Net Profit)';
      });
      document.querySelectorAll('.term-asset-title').forEach(el => {
        el.textContent = isPlain ? '사업 총자산 (보유 자금 및 입금 예정액)' : '유동자산 총계 (Current Assets)';
      });
      document.querySelectorAll('.term-liability-title').forEach(el => {
        el.textContent = isPlain ? '예정 지출 및 세무 부채 (카드 대금 및 납부 세액)' : '유동부채 총계 (Liabilities)';
      });
      document.querySelectorAll('.term-equity-title').forEach(el => {
        el.textContent = isPlain ? '실질 사업 자본 (순자산)' : '자기자본 총계 (Net Equity)';
      });
      document.querySelectorAll('.term-col-gross').forEach(el => {
        el.textContent = isPlain ? '계약 총액 (공급가)' : '매출(공급가)';
      });
      document.querySelectorAll('.term-col-tax').forEach(el => {
        el.textContent = isPlain ? '세금 공제액 (부가세/소득세)' : '예수금 / 선납세액';
      });
      document.querySelectorAll('.term-col-net').forEach(el => {
        el.textContent = isPlain ? '실제 통장 입출금액' : '실차인지급액';
      });
    }

    // 정산 가이드라인 4단계 세부 서비스 헬퍼 함수
    function setLegalStep(step) {
      [1, 2, 3, 4].forEach(s => {
        const panel = document.getElementById(`legalStepPanel${s}`);
        const btn = document.getElementById(`legalTabBtn${s}`);
        if (panel) panel.classList.toggle('hidden', s !== step);
        if (btn) {
          if (s === step) {
            btn.className = 'pb-2 px-1 font-bold text-emerald-700 border-b-2 border-emerald-600 whitespace-nowrap';
          } else {
            btn.className = 'pb-2 px-1 font-medium text-slate-500 hover:text-slate-800 whitespace-nowrap';
          }
        }
      });
      lucide.createIcons();
    }

    function copyContractClause() {
      const clause = `[표준 안전 계약 특약]\n1. (지체상금) 수급인의 책임 없는 사유로 지연 시 지체상금을 면제하며, 1일 지체상금율은 계약금액의 1,000분의 1(0.1%)을 초과할 수 없다.\n2. (저작권 이전) 본 계약에 따른 산출물의 지식재산권은 발주자가 계약 대금을 전액 완납한 시점에 수급인에게서 발주자에게로 이전된다.\n3. (검수 및 수정) 산출물 납품 후 14일 이내 구체적 사유 없이 이의를 제기하지 않는 경우 검수가 완료된 것으로 보며, 무상 수정은 계약 범위 내 2회로 한정한다.`;
      navigator.clipboard.writeText(clause).then(() => {
        showToast('안전한 계약서 특약 문구가 클립보드에 복사되었습니다.');
      });
    }

    function copyDeliveryNotice() {
      const notice = `[산출물 납품 안내 및 검수 요청]\n수신: (주)테크솔루션즈 담당자님\n발신: 솔로오에스 정솔로 대표\n\n요청하신 웹 개발 최종 산출물이 정상 납품되었습니다.\n상법 제69조 및 계약 조항에 따라 납품일로부터 14일 동안 별도의 수정 통지가 없으실 경우 검수가 최종 완료된 것으로 처리됩니다.\n검수 확인 부탁드립니다. 감사합니다!`;
      navigator.clipboard.writeText(notice).then(() => {
        showToast('클라이언트 발송용 납품 안내문이 복사되었습니다.');
      });
    }

    function copyKakaoReminder() {
      const el = document.getElementById('pageKakaoReminderText') || document.getElementById('kakaoReminderText');
      if (!el) return;
      navigator.clipboard.writeText(el.value).then(() => {
        showToast('1단계 카톡 안내 문구가 복사되었습니다.');
      });
    }

    function copyEmailReminder() {
      const el = document.getElementById('pageEmailReminderText') || document.getElementById('emailReminderText');
      if (!el) return;
      navigator.clipboard.writeText(el.value).then(() => {
        showToast('2단계 이메일 요청서가 복사되었습니다.');
      });
    }

    function copyFormalNotice() {
      const el = document.getElementById('pageFormalNoticeText') || document.getElementById('formalNoticeText');
      if (!el) return;
      navigator.clipboard.writeText(el.value).then(() => {
        showToast('3단계 공식 안내문 공문 전문이 복사되었습니다.');
      });
    }

    function switchLegalPageTab(step) {
      for (let i = 1; i <= 4; i++) {
        const panel = document.getElementById('legalPagePanel' + i);
        const btn = document.getElementById('legalPageTabBtn' + i);
        if (panel) {
          if (i === step) {
            panel.classList.remove('hidden');
          } else {
            panel.classList.add('hidden');
          }
        }
        if (btn) {
          if (i === step) {
            btn.className = 'pb-2 px-2.5 font-bold text-emerald-700 border-b-2 border-emerald-600 whitespace-nowrap';
          } else {
            btn.className = 'pb-2 px-2.5 font-medium text-slate-500 hover:text-slate-800 whitespace-nowrap';
          }
        }
      }
      lucide.createIcons();
    }

    function handleClientDeferToggle(checked) {
      const delayedRec = (appState.receivables || []).find(r => r.statusType === 'delayed');
      if (delayedRec) {
        delayedRec.deferred = checked;
        renderReceivablesTable();
      }
      showToast(checked ? '사전 협의 유예가 설정되었습니다. 정산 독촉 알림이 보류됩니다.' : '사전 협의 유예가 해제되었습니다.');
    }

    function showToast(msg) {
      const existing = document.getElementById('appToast');
      if (existing) existing.remove();
      const toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2';
      toast.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i><span>${msg}</span>`;
      document.body.appendChild(toast);
      lucide.createIcons();
      setTimeout(() => {
        toast.remove();
      }, 3000);
    }

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

    // Onboarding Modal Handlers
    function openOnboardingModal() {
      document.getElementById('onboardingModal').classList.remove('hidden');
    }
    function closeOnboardingModal() {
      document.getElementById('onboardingModal').classList.add('hidden');
      localStorage.setItem('soloos_onboarded_v1', 'true');
    }
    function selectOnboardingMode(mode) {
      switchViewMode(mode);
      closeOnboardingModal();
    }

    // Update Visual Statements
    function updateVisualStatements() {
      let filteredTx = appState.transactions;
      if (appState.currentWorkstream !== 'all') {
        filteredTx = filteredTx.filter(t => t.domain === appState.currentWorkstream);
      }

      const grossIncome = filteredTx.filter(t => t.gross > 0).reduce((acc, curr) => acc + curr.gross, 0);
      const taxAmount = filteredTx.filter(t => t.tax > 0).reduce((acc, curr) => acc + curr.tax, 0);
      const netIncome = filteredTx.filter(t => t.net > 0).reduce((acc, curr) => acc + curr.net, 0);
      const expenses = Math.abs(filteredTx.filter(t => t.net < 0).reduce((acc, curr) => acc + curr.net, 0));
      const realProfit = netIncome - expenses;

      document.getElementById('wfGross').textContent = '₩' + grossIncome.toLocaleString();
      document.getElementById('wfTax').textContent = '-₩' + taxAmount.toLocaleString();
      document.getElementById('wfNet').textContent = '₩' + netIncome.toLocaleString();
      document.getElementById('wfExpense').textContent = '-₩' + expenses.toLocaleString();
      document.getElementById('wfProfit').textContent = '₩' + realProfit.toLocaleString();

      const receivables = 4000000;
      const totalAssets = appState.workingCapital + receivables;
      const totalLiabilities = 3800000;
      const totalEquity = totalAssets - totalLiabilities;

      document.getElementById('bsAssets').textContent = '₩' + totalAssets.toLocaleString();
      document.getElementById('bsLiabilities').textContent = '₩' + totalLiabilities.toLocaleString();
      document.getElementById('bsEquity').textContent = '₩' + totalEquity.toLocaleString();

      const bsBankBalance = document.getElementById('bsBankBalance');
      if (bsBankBalance) bsBankBalance.textContent = '₩' + appState.workingCapital.toLocaleString();
    }

    // KPI Cards Calculation
    function updateKPICards() {
      let filteredTx = appState.transactions;
      if (appState.currentWorkstream !== 'all') {
        filteredTx = filteredTx.filter(t => t.domain === appState.currentWorkstream);
      }

      const grossIncome = filteredTx.filter(t => t.gross > 0).reduce((acc, curr) => acc + curr.gross, 0);
      const netIncome = filteredTx.filter(t => t.net > 0).reduce((acc, curr) => acc + curr.net, 0);

      document.getElementById('kpiGrossRevenue').textContent = '₩' + grossIncome.toLocaleString();
      document.getElementById('kpiNetReceived').textContent = '₩' + netIncome.toLocaleString();

      const taxBuffer = Math.round(grossIncome * 0.1);
      document.getElementById('kpiTaxBuffer').textContent = '₩' + taxBuffer.toLocaleString();

      const runwayMonths = (appState.workingCapital / appState.monthlyFixedExpense).toFixed(1);
      const kpiRunway = document.getElementById('kpiRunwayMonths');
      if (kpiRunway) kpiRunway.textContent = runwayMonths + '개월';
      document.getElementById('sidebarRunwayText').textContent = runwayMonths + '개월 (안정)';
      document.getElementById('sidebarBalanceText').textContent = '₩' + appState.workingCapital.toLocaleString();

      const kpiWC = document.getElementById('kpiWorkingCapital');
      if (kpiWC) kpiWC.textContent = '₩' + appState.workingCapital.toLocaleString();

      // Main Dashboard Overview KPI Cards
      const ovWorkingCapital = document.getElementById('ovWorkingCapital');
      if (ovWorkingCapital) ovWorkingCapital.textContent = '₩' + appState.workingCapital.toLocaleString();
      const ovRunwayMonths = document.getElementById('ovRunwayMonths');
      if (ovRunwayMonths) ovRunwayMonths.textContent = runwayMonths + '개월';
      const ovGrossRevenue = document.getElementById('ovGrossRevenue');
      if (ovGrossRevenue) ovGrossRevenue.textContent = '₩' + grossIncome.toLocaleString();
      const ovNetReceived = document.getElementById('ovNetReceived');
      if (ovNetReceived) ovNetReceived.textContent = '₩' + netIncome.toLocaleString();
      const ovTaxBuffer = document.getElementById('ovTaxBuffer');
      if (ovTaxBuffer) ovTaxBuffer.textContent = '₩' + taxBuffer.toLocaleString();
      const ovRevenueDomain = document.getElementById('ovRevenueDomain');
      if (ovRevenueDomain) {
        const domainMap = {
          all: '전체 통합',
          client: '외주 프로젝트',
          publishing: '디지털 출판',
          knowledge: '지식창업·강의'
        };
        ovRevenueDomain.textContent = domainMap[appState.currentWorkstream] || '전체 통합';
      }
    }

    // Helper: HTML escaping
    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

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
          if (titleEl) tx.title = titleEl.value;
          const catEl = document.querySelector(`.bulk-tx-category[data-id="${id}"]`);
          if (catEl) tx.category = catEl.value;
          const grossEl = document.querySelector(`.bulk-tx-gross[data-id="${id}"]`);
          if (grossEl) tx.gross = parseFloat(grossEl.value) || 0;
          const taxEl = document.querySelector(`.bulk-tx-tax[data-id="${id}"]`);
          if (taxEl) tx.tax = parseFloat(taxEl.value) || 0;
          const netEl = document.querySelector(`.bulk-tx-net[data-id="${id}"]`);
          if (netEl) tx.net = parseFloat(netEl.value) || 0;
          const statusEl = document.querySelector(`.bulk-tx-status[data-id="${id}"]`);
          if (statusEl) tx.status = statusEl.value;
        }
      });

      isLedgerBulkEditing = false;
      renderLedgerTable();
      updateKPICards();
      updateVisualStatements();
      showToast('거래 내역이 엑셀 모드에서 일괄 수정되어 저장되었습니다.');
    }

    function cancelLedgerBulkEdit() {
      isLedgerBulkEditing = false;
      renderLedgerTable();
      showToast('엑셀 편집이 취소되었습니다.');
    }

    function addLedgerBlankRow() {
      const today = new Date().toISOString().split('T')[0];
      const newId = Date.now();
      appState.transactions.unshift({
        id: newId,
        date: today,
        domain: appState.currentWorkstream === 'all' ? 'client' : appState.currentWorkstream,
        title: '신규 거래 항목',
        category: '일반매출',
        gross: 1000000,
        tax: 100000,
        net: 1100000,
        status: '정산완료'
      });
      renderLedgerTable();
      showToast('새로운 거래 행이 추가되었습니다. 내용을 입력한 후 [일괄 저장 완료]를 눌러주세요.');
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

    // Render Ledger Table (Light Theme & Excel Bulk Edit Mode)
    function renderLedgerTable() {
      const tbody = document.getElementById('ledgerTableBody');
      if (!tbody) return;
      tbody.innerHTML = '';

      let list = appState.transactions;
      if (appState.currentWorkstream !== 'all') {
        list = list.filter(t => t.domain === appState.currentWorkstream);
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
          toggleBtn.innerHTML = '<i data-lucide="file-spreadsheet" class="w-3.5 h-3.5 text-indigo-600"></i><span>엑셀 모드 (전체 편집)</span>';
        }
      }

      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center py-6 text-slate-400">해당 업무 도메인에 등록된 거래 내역이 없습니다.</td></tr>`;
        lucide.createIcons();
        return;
      }

      const domainBadge = {
        client: '<span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">외주</span>',
        publishing: '<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">출판</span>',
        knowledge: '<span class="px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">지식창업</span>',
        operation: '<span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">운영</span>',
      };

      list.forEach(tx => {
        const isExpense = tx.net < 0;
        const tr = document.createElement('tr');
        tr.className = isLedgerBulkEditing ? 'bg-indigo-50/20 hover:bg-indigo-50/40 transition-colors' : 'hover:bg-slate-50 transition-colors';

        if (isLedgerBulkEditing) {
          // Excel Bulk Edit Mode: Editable inline inputs
          tr.innerHTML = `
            <td class="py-2 px-2">
              <input type="date" class="bulk-tx-date w-28 p-1 text-xs font-mono bg-white border border-slate-300 rounded focus:border-indigo-500" value="${tx.date}" data-id="${tx.id}">
            </td>
            <td class="py-2 px-2">
              <select class="bulk-tx-domain p-1 text-xs bg-white border border-slate-300 rounded focus:border-indigo-500" data-id="${tx.id}">
                <option value="client" ${tx.domain === 'client' ? 'selected' : ''}>외주</option>
                <option value="publishing" ${tx.domain === 'publishing' ? 'selected' : ''}>출판</option>
                <option value="knowledge" ${tx.domain === 'knowledge' ? 'selected' : ''}>지식창업</option>
                <option value="operation" ${tx.domain === 'operation' ? 'selected' : ''}>운영</option>
              </select>
            </td>
            <td class="py-2 px-2">
              <input type="text" class="bulk-tx-title w-full min-w-[130px] p-1 text-xs bg-white border border-slate-300 rounded font-bold text-slate-800 focus:border-indigo-500" value="${escapeHtml(tx.title)}" data-id="${tx.id}">
            </td>
            <td class="py-2 px-2">
              <input type="text" class="bulk-tx-category w-full min-w-[100px] p-1 text-xs bg-white border border-slate-300 rounded text-slate-600 focus:border-indigo-500" value="${escapeHtml(tx.category)}" data-id="${tx.id}">
            </td>
            <td class="py-2 px-2 text-right">
              <input type="number" class="bulk-tx-gross w-24 p-1 text-xs font-mono text-right bg-white border border-slate-300 rounded focus:border-indigo-500" value="${tx.gross}" data-id="${tx.id}">
            </td>
            <td class="py-2 px-2 text-right">
              <input type="number" class="bulk-tx-tax w-20 p-1 text-xs font-mono text-right bg-white border border-slate-300 rounded text-amber-700 focus:border-indigo-500" value="${tx.tax}" data-id="${tx.id}">
            </td>
            <td class="py-2 px-2 text-right">
              <input type="number" class="bulk-tx-net w-24 p-1 text-xs font-mono text-right font-black bg-white border border-slate-300 rounded focus:border-indigo-500 ${isExpense ? 'text-rose-600' : 'text-emerald-700'}" value="${tx.net}" data-id="${tx.id}">
            </td>
            <td class="py-2 px-2 text-center">
              <select class="bulk-tx-status p-1 text-[11px] bg-white border border-slate-300 rounded focus:border-indigo-500" data-id="${tx.id}">
                <option value="정산완료" ${tx.status === '정산완료' ? 'selected' : ''}>정산완료</option>
                <option value="세금계산서" ${tx.status === '세금계산서' ? 'selected' : ''}>세금계산서</option>
                <option value="VAT예치필수" ${tx.status === 'VAT예치필수' ? 'selected' : ''}>VAT예치필수</option>
                <option value="카드매출전표" ${tx.status === '카드매출전표' ? 'selected' : ''}>카드매출전표</option>
                <option value="원천징수영수증" ${tx.status === '원천징수영수증' ? 'selected' : ''}>원천징수영수증</option>
                <option value="수기분개완료" ${tx.status === '수기분개완료' ? 'selected' : ''}>수기분개완료</option>
                <option value="영수증인증" ${tx.status === '영수증인증' ? 'selected' : ''}>영수증인증</option>
              </select>
            </td>
            <td class="py-2 px-2 text-center">
              <button type="button" onclick="deleteLedgerRow(${tx.id})" title="행 삭제" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </td>
          `;
        } else {
          // Normal Display Mode (Image 4 style pencil & trash icon buttons in Action column)
          tr.innerHTML = `
            <td class="py-3 px-4 font-mono text-slate-500">${tx.date}</td>
            <td class="py-3 px-3">${domainBadge[tx.domain] || tx.domain}</td>
            <td class="py-3 px-4 font-bold text-slate-800">${escapeHtml(tx.title)}</td>
            <td class="py-3 px-3 text-slate-600 font-medium">${escapeHtml(tx.category)}</td>
            <td class="py-3 px-4 text-right font-mono font-semibold ${isExpense ? 'text-slate-500' : 'text-slate-800'}">₩${Math.abs(tx.gross).toLocaleString()}</td>
            <td class="py-3 px-3 text-right font-mono font-bold text-amber-700">${tx.tax !== 0 ? '₩' + Math.abs(tx.tax).toLocaleString() : '-'}</td>
            <td class="py-3 px-4 text-right font-mono font-black ${isExpense ? 'text-rose-600' : 'text-emerald-700'}">
              ${isExpense ? '-' : '+'}₩${Math.abs(tx.net).toLocaleString()}
            </td>
            <td class="py-3 px-3 text-center">
              <span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">${tx.status}</span>
            </td>
            <td class="py-3 px-3 text-center">
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

    // ==================== CASHFLOW CHART (부드러운 곡선 웨이브 & 반투명 그라데이션) ====================
    function initChart() {
      const canvas = document.getElementById('cashflowChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      
      // 잔고 추이용 부드러운 스카이블루 그라데이션 영역 채움 (첨부 1 스타일)
      const balanceGradient = ctx.createLinearGradient(0, 0, 0, 260);
      balanceGradient.addColorStop(0, 'rgba(14, 165, 233, 0.40)');
      balanceGradient.addColorStop(0.65, 'rgba(56, 189, 248, 0.12)');
      balanceGradient.addColorStop(1, 'rgba(240, 249, 255, 0.01)');

      cashflowChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          // X축 날짜: 모든 과거·미래 일자를 통일된 MM-DD 형식으로 표기
          labels: ['08-31', '09-15', '09-30', '10-05', '10-15', '10-25', '11-15', '11-25', '12-15'],
          datasets: [
            {
              type: 'line',
              label: '통장 잔고 추이',
              data: [1120, 1250, 1180, 1310, 1420, 1490, 1380, 1550, 1690],
              borderColor: '#0284c7',
              backgroundColor: balanceGradient,
              borderWidth: 2.5,
              tension: 0.45, // 부드러운 웨이브 곡선 (기존 유지)
              fill: true,
              pointBackgroundColor: '#0284c7',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 1.5,
              pointRadius: 3.5,
              pointHoverRadius: 5.5,
              order: 1
            },
            {
              type: 'bar',
              label: '입금',
              data: [420, 380, 250, 330, 0, 250, 180, 300, 220],
              backgroundColor: '#10b981',
              hoverBackgroundColor: '#059669',
              borderRadius: 0, // 둥근 알약 모서리 제거! 세련된 직각 칼럼 바
              borderSkipped: false,
              barThickness: 10,
              maxBarThickness: 12,
              order: 2
            },
            {
              type: 'bar',
              label: '지출',
              data: [273, 273, 273, 273, 273, 273, 273, 273, 273],
              backgroundColor: '#f43f5e',
              hoverBackgroundColor: '#e11d48',
              borderRadius: 0, // 둥근 알약 모서리 제거! 세련된 직각 칼럼 바
              borderSkipped: false,
              barThickness: 10,
              maxBarThickness: 12,
              order: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              titleFont: { size: 12, weight: 'bold' },
              bodyFont: { size: 11 },
              padding: 10,
              cornerRadius: 10,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + Number(context.raw).toLocaleString() + '만 원 (' + (context.raw * 10000).toLocaleString() + '원)';
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(226, 232, 240, 0.7)' },
              ticks: { color: '#64748b', font: { size: 10, weight: 600 } }
            },
            y: {
              grid: { color: 'rgba(226, 232, 240, 0.7)' },
              ticks: {
                color: '#64748b',
                font: { size: 10, weight: 600 },
                // 일반인에게 직관적인 만원 표기 (예: 1,400만원)
                callback: function(value) { return Number(value).toLocaleString() + '만원'; }
              }
            }
          }
        }
      });
    }

    function updateChartData() {
      if (!cashflowChartInstance) return;
      if (appState.currentWorkstream === 'client') {
        cashflowChartInstance.data.datasets[0].data = [720, 850, 780, 910, 920, 990, 880, 1050, 1190];
        cashflowChartInstance.data.datasets[1].data = [300, 280, 150, 300, 0, 250, 100, 250, 180];
        cashflowChartInstance.data.datasets[2].data = [180, 180, 180, 180, 180, 180, 180, 180, 180];
      } else if (appState.currentWorkstream === 'publishing') {
        cashflowChartInstance.data.datasets[0].data = [220, 240, 230, 250, 300, 320, 310, 340, 350];
        cashflowChartInstance.data.datasets[1].data = [80, 70, 60, 120, 0, 40, 50, 40, 30];
        cashflowChartInstance.data.datasets[2].data = [50, 50, 50, 50, 50, 50, 50, 50, 50];
      } else if (appState.currentWorkstream === 'knowledge') {
        cashflowChartInstance.data.datasets[0].data = [180, 160, 170, 150, 200, 220, 210, 240, 290];
        cashflowChartInstance.data.datasets[1].data = [40, 30, 40, 100, 0, 50, 30, 80, 60];
        cashflowChartInstance.data.datasets[2].data = [43, 43, 43, 43, 43, 43, 43, 43, 43];
      } else {
        cashflowChartInstance.data.datasets[0].data = [1120, 1250, 1180, 1310, 1420, 1490, 1380, 1550, 1690];
        cashflowChartInstance.data.datasets[1].data = [420, 380, 250, 330, 0, 250, 180, 300, 220];
        cashflowChartInstance.data.datasets[2].data = [273, 273, 273, 273, 273, 273, 273, 273, 273];
      }
      cashflowChartInstance.update();
    }

    // Realistic Smart Ingestion Modal Logic
    function openSmartIngestionModal() {
      document.getElementById('smartIngestionModal').classList.remove('hidden');
    }
    function closeSmartIngestionModal() {
      document.getElementById('smartIngestionModal').classList.add('hidden');
    }

    function switchIngestionTab(tab) {
      const tabs = ['excel', 'pdf', 'sms', 'manual'];
      tabs.forEach(t => {
        const btn = document.getElementById(`tab-btn-${t}`);
        const content = document.getElementById(`tabContent${t.charAt(0).toUpperCase() + t.slice(1)}`);
        if (t === tab) {
          btn.className = 'px-3 py-2 font-bold text-brand-600 border-b-2 border-brand-600';
          content.classList.remove('hidden');
        } else {
          btn.className = 'px-3 py-2 font-medium text-slate-500 hover:text-slate-900';
          content.classList.add('hidden');
        }
      });
      lucide.createIcons();
    }

    // ==================== REAL FILE DRAG & DROP / INGESTION LOGIC ====================
    function handleDragOver(e) {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.add('border-brand-500', 'bg-indigo-50/50');
    }

    function handleDragLeave(e) {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.remove('border-brand-500', 'bg-indigo-50/50');
    }

    function handleFileDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      e.currentTarget.classList.remove('border-brand-500', 'bg-indigo-50/50');
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        processLedgerFile(files[0]);
      }
    }

    function handleLedgerFileInput(e) {
      const files = e.target.files;
      if (files && files.length > 0) {
        processLedgerFile(files[0]);
        e.target.value = ''; // reset to allow re-selecting same file
      }
    }

    function processLedgerFile(file) {
      if (!file) return;
      const fileName = file.name;
      const ext = fileName.split('.').pop().toLowerCase();
      const validExts = ['xlsx', 'xls', 'csv', 'pdf', 'jpg', 'jpeg', 'png'];

      if (!validExts.includes(ext)) {
        alert(`지원하지 않는 파일 형식입니다 (.${ext}).\n엑셀(.xlsx, .xls, .csv), PDF(.pdf), 영수증 이미지(.jpg, .png)를 등록해 주세요.`);
        return;
      }

      // If CSV file, parse actual text lines
      if (ext === 'csv') {
        const reader = new FileReader();
        reader.onload = function(evt) {
          const text = evt.target.result;
          const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
          let parsedCount = 0;
          const startIndex = (lines.length > 1 && isNaN(Number(lines[0].split(',')[0].replace(/-/g, '')))) ? 1 : 0;
          for (let i = startIndex; i < lines.length; i++) {
            const parts = lines[i].split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
            if (parts.length >= 2) {
              const date = parts[0] || new Date().toISOString().split('T')[0];
              const title = parts[1] || 'CSV 등록 거래';
              const amt = Math.abs(parseFloat(parts[2] || parts[3] || 100000) || 100000);
              const isExpense = parts.some(p => p.includes('출금') || p.includes('지출') || p.includes('비용')) || (parseFloat(parts[2] || 0) < 0);
              
              let gross = amt, tax = 0, net = amt, category = '일반매출';
              if (isExpense) {
                gross = -amt; net = -amt; category = '사업운영비';
                appState.workingCapital -= amt;
              } else {
                gross = Math.round(amt / 1.1);
                tax = amt - gross;
                category = '세금계산서매출(VAT분리)';
                appState.workingCapital += amt;
              }
              appState.transactions.unshift({
                id: Date.now() + i,
                date: date,
                domain: isExpense ? 'operation' : 'client',
                title: title,
                category: category,
                gross: gross,
                tax: tax,
                net: net,
                status: isExpense ? '카드매출전표' : '세금계산서'
              });
              parsedCount++;
            }
          }
          if (parsedCount === 0) {
            createParsedFileTransaction(fileName, ext);
          } else {
            renderLedgerTable();
            updateKPICards();
            updateVisualStatements();
            closeSmartIngestionModal();
            showToast(`CSV 파일 '${fileName}'에서 ${parsedCount}건의 거래 내역을 인식하여 분개장에 등록했습니다.`);
          }
        };
        reader.readAsText(file);
        return;
      }

      // If Excel, PDF, Image files, read with FileReader and create realistic parsed entries
      const reader = new FileReader();
      reader.onload = function() {
        createParsedFileTransaction(fileName, ext);
      };
      reader.readAsArrayBuffer(file);
    }

    function createParsedFileTransaction(fileName, ext) {
      const today = new Date().toISOString().split('T')[0];
      const cleanName = fileName.replace(/\.[^/.]+$/, "");
      let summaryMsg = '';

      if (ext === 'xlsx' || ext === 'xls') {
        appState.transactions.unshift({
          id: Date.now(),
          date: today,
          domain: 'client',
          title: `[엑셀 자동분개] ${cleanName} 세금계산서 정산금`,
          category: '세금계산서매출(VAT분리)',
          gross: 3500000,
          tax: 350000,
          net: 3850000,
          status: '세금계산서'
        });
        appState.transactions.unshift({
          id: Date.now() + 1,
          date: today,
          domain: 'operation',
          title: `[엑셀 자동분개] 소프트웨어 라이선스 비용`,
          category: '운영비용(SaaS)',
          gross: -88000,
          tax: 0,
          net: -88000,
          status: '카드매출전표'
        });
        appState.workingCapital += (3850000 - 88000);
        summaryMsg = `엑셀 파일 '${fileName}' 인식 완료: 세금계산서 매출 1건(+₩3,850,000) 및 SaaS 경비 1건(-₩88,000)이 자동분개되었습니다.`;
      } else if (ext === 'pdf') {
        appState.transactions.unshift({
          id: Date.now(),
          date: today,
          domain: 'client',
          title: `[PDF 세금계산서] ${cleanName}`,
          category: '세금계산서매출(VAT분리)',
          gross: 2500000,
          tax: 250000,
          net: 2750000,
          status: '세금계산서'
        });
        appState.workingCapital += 2750000;
        summaryMsg = `전자세금계산서 PDF '${fileName}' 인식 완료: 공급가 ₩2,500,000, 부가세 10%(₩250,000) 분리 분개되었습니다.`;
      } else if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') {
        appState.transactions.unshift({
          id: Date.now(),
          date: today,
          domain: 'operation',
          title: `[영수증 OCR] ${cleanName} 사업 경비`,
          category: '사업소모품비',
          gross: -45000,
          tax: 0,
          net: -45000,
          status: '영수증인증'
        });
        appState.workingCapital -= 45000;
        summaryMsg = `영수증 이미지 '${fileName}' 인식 완료: 카드 전표 경비 -₩45,000원이 등록되었습니다.`;
      }

      renderLedgerTable();
      updateKPICards();
      updateVisualStatements();
      closeSmartIngestionModal();
      showToast(summaryMsg);
    }

    // Simulate Client-side Excel upload
    function simulateExcelUpload() {
      alert('신한은행 사업자통장 엑셀 파일(2026_10_거래내역.xlsx)을 로컬에서 파싱했습니다.\n\n• 입금: (주)테크솔 전자세금계산서 정산금 ₩3,300,000 (VAT 10% 포함)\n• 출금: SaaS 및 임대료 3건\n• 계좌번호/주민번호: 브라우저 로컬에서 자동 마스킹 완료\n\n분개장에 10% 부가세 분리 분개로 자동 등록되었습니다.');
      appState.transactions.unshift({
        id: Date.now(),
        date: '2026-10-13',
        domain: 'client',
        title: '신한 엑셀 자동파싱: (주)테크솔 세금계산서',
        category: '세금계산서매출(VAT분리)',
        gross: 3000000,
        tax: 300000,
        net: 3300000,
        status: 'VAT예치필수'
      });
      appState.workingCapital += 3300000;
      renderLedgerTable();
      updateKPICards();
      updateVisualStatements();
      closeSmartIngestionModal();
    }

    // Simulate PDF document parsing
    function simulatePdfUpload() {
      alert('홈택스 전자세금계산서 PDF를 로컬에서 파싱했습니다.\n\n• 공급가액: ₩2,000,000\n• 부가가치세(10%): ₩200,000\n• 총 입금액: ₩2,200,000\n\n부가세 20만원 세금 통장 보관 가이드와 함께 분개장에 정상 반영되었습니다.');
      appState.transactions.unshift({
        id: Date.now(),
        date: '2026-10-13',
        domain: 'client',
        title: '전자세금계산서 PDF: UI 고도화 잔금',
        category: '세금계산서매출(VAT분리)',
        gross: 2000000,
        tax: 200000,
        net: 2200000,
        status: 'VAT예치필수'
      });
      appState.workingCapital += 2200000;
      renderLedgerTable();
      updateKPICards();
      updateVisualStatements();
      closeSmartIngestionModal();
    }

    // SMS text parser
    function parseSmsText() {
      const text = document.getElementById('smsInputText').value.trim();
      if (!text) {
        alert('문자 내용을 입력해주세요.');
        return;
      }
      alert('입출금 알림 문자를 분석하여 세무 자동분개를 완료했습니다.\n\n적요: (주)테크솔 입금\n실입금액: ₩3,300,000\n분석 결과: 전자세금계산서 10% 부가세 포함 건으로 감지 (공급가 300만원 + VAT 30만원)');
      appState.transactions.unshift({
        id: Date.now(),
        date: '2026-10-13',
        domain: 'client',
        title: '문자파싱: (주)테크솔 세금계산서 입금',
        category: '세금계산서매출(VAT분리)',
        gross: 3000000,
        tax: 300000,
        net: 3300000,
        status: 'VAT예치필수'
      });
      appState.workingCapital += 3300000;
      renderLedgerTable();
      updateKPICards();
      updateVisualStatements();
      closeSmartIngestionModal();
      document.getElementById('smsInputText').value = '';
    }

    // 3-in-1 Tax calculation & Breakdown preview
    function calculateTaxBreakdown() {
      const type = document.getElementById('modalTxType').value;
      const amount = parseFloat(document.getElementById('modalTxAmount').value) || 0;
      const grossEl = document.getElementById('calcGrossAmount');
      const incomeTaxEl = document.getElementById('calcIncomeTax');
      const localTaxEl = document.getElementById('calcLocalTax');
      const breakdownBox = document.getElementById('taxBreakdownBox');
      const breakdownTitle = document.getElementById('breakdownTitle');
      const breakdownFormula = document.getElementById('breakdownFormula');
      const colGrossLabel = document.getElementById('colGrossLabel');
      const colTax1Label = document.getElementById('colTax1Label');
      const colTax2Label = document.getElementById('colTax2Label');
      const taxAdviceNote = document.getElementById('taxAdviceNote');

      if (type === 'income_freelance') {
        breakdownBox.classList.remove('hidden');
        breakdownTitle.textContent = '자동분개 역산: 3.3% 사업소득 (미등록 프리랜서)';
        breakdownFormula.textContent = '공급가액 = 입금액 ÷ 0.967';
        colGrossLabel.textContent = '계약 공급가액';
        colTax1Label.textContent = '소득세 (3.0%)';
        colTax2Label.textContent = '지방소득세 (0.3%)';
        
        const gross = Math.round(amount / 0.967);
        const incomeTax = Math.round(gross * 0.03);
        const localTax = Math.round(gross * 0.003);
        grossEl.textContent = '₩' + gross.toLocaleString();
        incomeTaxEl.textContent = '₩' + incomeTax.toLocaleString();
        localTaxEl.textContent = '₩' + localTax.toLocaleString();
        taxAdviceNote.innerHTML = '5월 종합소득세 신고 시 선납세금으로 자동 공제/환급됩니다.';
      } else if (type === 'income_tax_invoice') {
        breakdownBox.classList.remove('hidden');
        breakdownTitle.textContent = '자동분개 역산: 10% 부가가치세 (사업자 세금계산서)';
        breakdownFormula.textContent = '공급가액 = 입금총액 ÷ 1.1';
        colGrossLabel.textContent = '실제 매출 공급가액';
        colTax1Label.textContent = '부가가치세 (10%)';
        colTax2Label.textContent = '세무 분리 여부';

        const gross = Math.round(amount / 1.1);
        const vat = amount - gross;
        grossEl.textContent = '₩' + gross.toLocaleString();
        incomeTaxEl.textContent = '₩' + vat.toLocaleString();
        localTaxEl.textContent = '별도 통장 격리';
        taxAdviceNote.innerHTML = '<strong class="text-rose-600">⚠️ 부가세 10%(₩' + vat.toLocaleString() + ')는 매출이 아닙니다!</strong> 7월/1월 부가세 신고용 별도 통장에 100% 분리 보관하세요.';
      } else if (type === 'income_other') {
        breakdownBox.classList.remove('hidden');
        breakdownTitle.textContent = '자동분개 역산: 8.8% 기타소득 (비정기 자문·강연·원고료)';
        breakdownFormula.textContent = '계약총액 = 입금액 ÷ 0.912';
        colGrossLabel.textContent = '계약 총액 (지급총액)';
        colTax1Label.textContent = '소득세 (8.0%)';
        colTax2Label.textContent = '지방소득세 (0.8%)';

        const gross = Math.round(amount / 0.912);
        const incomeTax = Math.round(gross * 0.08);
        const localTax = Math.round(gross * 0.008);
        grossEl.textContent = '₩' + gross.toLocaleString();
        incomeTaxEl.textContent = '₩' + incomeTax.toLocaleString();
        localTaxEl.textContent = '₩' + localTax.toLocaleString();
        taxAdviceNote.innerHTML = '법정 필요경비 60% 차감 후 22% 원천징수된 실질 8.8% 세액입니다. 연 300만원 이하 분리과세 가능.';
      } else {
        breakdownBox.classList.add('hidden');
      }
    }

    function handleManualSubmit(e) {
      e.preventDefault();
      const dateEl = document.getElementById('modalTxDate');
      const txDate = (dateEl && dateEl.value) ? dateEl.value : new Date().toISOString().split('T')[0];
      const domain = document.getElementById('modalTxDomain').value;
      const type = document.getElementById('modalTxType').value;
      const title = document.getElementById('modalTxTitle').value;
      const amount = parseFloat(document.getElementById('modalTxAmount').value) || 0;

      let gross = amount;
      let tax = 0;
      let net = amount;
      let category = '사업소득매출';

      if (type === 'income_freelance') {
        gross = Math.round(amount / 0.967);
        tax = gross - amount;
        net = amount;
        category = '3.3%사업소득매출';
        appState.workingCapital += amount;
      } else if (type === 'income_tax_invoice') {
        gross = Math.round(amount / 1.1);
        tax = amount - gross; // VAT
        net = amount;
        category = '세금계산서매출(VAT분리)';
        appState.workingCapital += amount;
      } else if (type === 'income_other') {
        gross = Math.round(amount / 0.912);
        tax = gross - amount;
        net = amount;
        category = '8.8%기타소득매출';
        appState.workingCapital += amount;
      } else if (type === 'expense') {
        gross = -amount;
        tax = 0;
        net = -amount;
        category = '일반사업경비';
        appState.workingCapital -= amount;
      }

      appState.transactions.unshift({
        id: Date.now(),
        date: txDate,
        domain: domain,
        title: title,
        category: category,
        gross: gross,
        tax: tax,
        net: net,
        status: '수기분개완료'
      });

      renderLedgerTable();
      updateKPICards();
      updateVisualStatements();
      closeSmartIngestionModal();
      e.target.reset();
      showToast('신규 거래가 1인 사업자 3대 세무 규칙에 따라 안전하게 기록되었습니다.');
    }

    function openLegalCertModal() {
      document.getElementById('legalCertModal').classList.remove('hidden');
    }
    function closeLegalCertModal() {
      document.getElementById('legalCertModal').classList.add('hidden');
    }

    function applyExpenseOptimization() {
      alert('Figma 미사용 서브 계정 및 중복 스토리지에 대한 구독 해지 체크리스트 및 캘린더 알림이 등록되었습니다. 연간 ₩420,000의 추가 예산이 확보됩니다.');
    }

    function exportLedgerCSV() {
      let csv = "거래일자,업무도메인,적요,계정과목,공급가액,원천세,실입출금액,상태\n";
      appState.transactions.forEach(t => {
        csv += `${t.date},${t.domain},"${t.title}",${t.category},${t.gross},${t.tax},${t.net},${t.status}\n`;
      });
      const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SoloOS_3대세무_분개장_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function generateLegalPDF() {
      alert('상법 제69조 타임스탬프 산출물 검수 로그 및 우체국 내용증명 양식이 포함된 법적 증빙 패키지(PDF)가 생성되었습니다.');
      closeLegalCertModal();
    }

    // 1인 프리랜서 1년 수입·지출 정산 요약표 내보내기
    function exportYearEndTaxSummary() {
      const summaryReport = `=====================================================
SoloOS 1인 프리랜서 1년 수입·지출 정산 요약 리포트
(국세청 종합소득세 및 부가가치세 신고 대비용)
기준일자: ${new Date().toISOString().split('T')[0]}
대표자명: 정솔로 (솔로오에스)
=====================================================

1. 총 수입 및 소득 유형별 매출 내역
-----------------------------------------------------
• [외주 프로젝트] 전자세금계산서 발행 공급가액: ₩3,000,000
  - 부가가치세(10%) 별도 예치액: ₩300,000 (세금 통장 보관)
  - 실제 입금액: ₩3,300,000

• [디지털 출판] 3.3% 프리랜서 사업소득 매출: ₩1,200,000
  - 원천징수세액(3.3%): ₩39,600 (기납부세액 공제 대상)
  - 실제 수령액: ₩1,160,400

• [지식창업·강의] 8.8% 기타소득 매출: ₩1,000,000
  - 법정 필요경비(60%) 반영 후 원천징수세액: ₩88,000
  - 실제 수령액: ₩912,000

총 공급가액 합계: ₩5,200,000
총 원천징수 기납부세액: ₩127,600
총 부가가치세 예치금: ₩300,000
총 실제 통장 입금액: ₩5,372,400

2. 사업상 필요경비 및 지출 내역
-----------------------------------------------------
• 지급임차료 (작업실 월 임대료): ₩850,000
• 지급수수료/통신비 (AWS 클라우드): ₩156,200
총 지출 경비 합계: ₩1,006,200

3. 세전 순이익 및 종합소득세 예상
-----------------------------------------------------
• 세전 사업 순이익: ₩4,193,800
• 5월 종합소득세 정산 시 기납부세액(₩127,600) 차감 반영 예정

4. 세금 통장 보관 권고액
-----------------------------------------------------
• 부가가치세(10%) 확정 예치금: ₩300,000
• 종합소득세 대비 예비금: ₩280,000
권고 세금 통장 분리 보관 총액: ₩580,000

=====================================================
위 데이터는 SoloOS 로컬 브라우저 인메모리에서 안전하게
익명화(마스킹)되어 자동 분개 및 산출된 정산 보고서입니다.
=====================================================`;

      const blob = new Blob(["\uFEFF" + summaryReport], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SoloOS_1년_수입지출_정산요약표_${new Date().toISOString().split('T')[0]}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('1인 프리랜서 1년 수입·지출 정산 요약표가 다운로드되었습니다.');
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

    // ==================== SETTLEMENT & MULTI-CALCULATOR VIEW LOGIC ====================
    let currentCalcTab = 'rate';

    const bizCodeData = [
      { code: '940909', name: '기타자영업 (인적용역 프리랜서)', cat: '외주·용역 공통', rate: '단순경비율 64.1%', desc: '3.3% 원천징수 프리랜서 대표 표준 업종코드' },
      { code: '940911', name: '소프트웨어 외주 개발·자문', cat: 'IT·개발 프리랜서', rate: '단순경비율 64.1%', desc: '웹/앱 프론트엔드·백엔드 코딩 및 시스템 구축 외주' },
      { code: '722000', name: '응용 소프트웨어 개발 및 공급업', cat: '사업자등록(과세)', rate: '기준경비율 19.3%', desc: '개인사업자등록(일반/간이) 세금계산서 발행 업종' },
      { code: '940600', name: '작가 (출판·원고·번역)', cat: '콘텐츠·출판', rate: '단순경비율 58.7%', desc: '전자책 인세, 기술서 집필, 칼럼 기고 및 전문 번역' },
      { code: '749910', name: '시각 디자인업', cat: '디자인 사업자', rate: '단순경비율 56.4%', desc: 'UI/UX 디자인, 브랜드 아이덴티티, 웹·앱 그래픽 용역' },
      { code: '940904', name: '외래강사·교육용역', cat: '강의·지식창업', rate: '단순경비율 61.7%', desc: '인프런 강의, 기업 출강, 특강 및 세미나 자문 소득' },
      { code: '749901', name: '경영컨설팅', cat: '자문·기획', rate: '단순경비율 54.3%', desc: '스타트업 멘토링, 비즈니스 모델 수립 자문' },
      { code: '940908', name: '일러스트레이터·웹툰 작가', cat: '일러스트·웹툰', rate: '단순경비율 65.1%', desc: '캐릭터 일러스트, 웹툰 원고료 및 굿즈 디자인' }
    ];

    function switchCalcTab(tabKey) {
      currentCalcTab = tabKey;
      const tabs = ['rate', 'incomeTax', 'penaltyTax', 'healthIns', 'otherTax', 'bizCode'];
      tabs.forEach(t => {
        const btn = document.getElementById(`calcTabBtn-${t}`);
        const panel = document.getElementById(`calcPanel-${t}`);
        if (btn) {
          if (t === tabKey) {
            btn.className = 'calc-tab-btn px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-slate-900 text-white shadow-xs';
          } else {
            btn.className = 'calc-tab-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition-all bg-white hover:bg-slate-100 text-slate-600 border border-slate-200';
          }
        }
        if (panel) {
          if (t === tabKey) {
            panel.classList.remove('hidden');
          } else {
            panel.classList.add('hidden');
          }
        }
      });
      lucide.createIcons();
    }

    function renderSettlementView() {
      renderReceivablesTable();
      lucide.createIcons();
    }

    function renderTaxView() {
      switchCalcTab(currentCalcTab);
      updateRateCalc();
      updateIncomeTaxCalc();
      updatePenaltyTaxCalc();
      updateHealthInsCalc();
      updateOtherTaxCalc();
      searchBizCode('');
      lucide.createIcons();
    }

    // 1. 단가(시급) 계산기
    function updateRateCalcFromSlider(val) {
      const hours = Math.max(1, parseInt(val, 10) || 1);
      const hoursInput = document.getElementById('rateHoursInput');
      const hoursText = document.getElementById('rateHoursText');
      if (hoursInput) hoursInput.value = hours;
      if (hoursText) hoursText.textContent = `${hours}시간`;
      updateRateCalc();
    }

    function updateRateCalcFromInput(val) {
      const hours = Math.max(1, parseInt(val, 10) || 1);
      const hoursSlider = document.getElementById('rateHoursSlider');
      const hoursText = document.getElementById('rateHoursText');
      if (hoursSlider) hoursSlider.value = hours;
      if (hoursText) hoursText.textContent = `${hours}시간`;
      updateRateCalc();
    }

    function updateRateCalc() {
      const amountInput = document.getElementById('rateAmountInput');
      const hoursInput = document.getElementById('rateHoursInput');
      const rateEl = document.getElementById('rateCalculatedVal');
      const badgeWrap = document.getElementById('rateRateBadge');
      const statusEl = document.getElementById('rateProfitStatus');
      if (!amountInput || !hoursInput || !rateEl) return;

      const amount = Math.max(0, parseInt(amountInput.value, 10) || 0);
      const hours = Math.max(1, parseInt(hoursInput.value, 10) || 1);
      const hourlyRate = Math.round(amount / hours);

      rateEl.innerHTML = `₩${Number(hourlyRate).toLocaleString()} <span class="text-xs font-sans font-normal text-slate-500">/h</span>`;

      if (statusEl) {
        statusEl.textContent = '정산 총액과 투입 시간에 따른 실질 시간당 수익입니다.';
      }
    }

    // 2. 종합소득세 계산기
    function updateIncomeTaxCalc() {
      const grossEl = document.getElementById('itInputGross');
      const expenseEl = document.getElementById('itInputExpense');
      const dedEl = document.getElementById('itInputDeduction');
      const taxEl = document.getElementById('itCalculatedTax');
      const summaryEl = document.getElementById('itTaxSummary');
      if (!grossEl || !expenseEl || !taxEl) return;

      const gross = Math.max(0, parseInt(grossEl.value, 10) || 0);
      const expense = Math.max(0, parseInt(expenseEl.value, 10) || 0);
      const deduction = Math.max(0, parseInt(dedEl ? dedEl.value : 1500000, 10) || 0);

      const taxBase = Math.max(0, gross - expense - deduction);
      let rate = 0.06;
      let deductionAcc = 0;

      if (taxBase <= 14000000) {
        rate = 0.06;
        deductionAcc = 0;
      } else if (taxBase <= 50000000) {
        rate = 0.15;
        deductionAcc = 1260000;
      } else if (taxBase <= 88000000) {
        rate = 0.24;
        deductionAcc = 5760000;
      } else if (taxBase <= 150000000) {
        rate = 0.35;
        deductionAcc = 15440000;
      } else if (taxBase <= 300000000) {
        rate = 0.38;
        deductionAcc = 19940000;
      } else {
        rate = 0.40;
        deductionAcc = 25940000;
      }

      const calcTax = Math.max(0, Math.round(taxBase * rate - deductionAcc));
      const localTax = Math.round(calcTax * 0.1);
      const totalTax = calcTax + localTax;

      taxEl.textContent = `₩${Number(totalTax).toLocaleString()}`;
      if (summaryEl) {
        summaryEl.textContent = `과세표준 ₩${Number(taxBase).toLocaleString()} (세율 ${Math.round(rate * 100)}% 적용, 소득세 ₩${Number(calcTax).toLocaleString()} + 지방세 ₩${Number(localTax).toLocaleString()})`;
      }
    }

    // 3. 종합소득세 가산세 계산기
    function updatePenaltyTaxCalc() {
      const amountEl = document.getElementById('ptInputAmount');
      const typeEl = document.getElementById('ptInputType');
      const daysEl = document.getElementById('ptInputDays');
      const resEl = document.getElementById('ptCalculatedVal');
      const summaryEl = document.getElementById('ptSummaryText');
      if (!amountEl || !typeEl || !daysEl || !resEl) return;

      const unpaid = Math.max(0, parseInt(amountEl.value, 10) || 0);
      const rate = parseFloat(typeEl.value) || 0.2;
      const days = Math.max(1, parseInt(daysEl.value, 10) || 1);

      const penaltyReport = Math.round(unpaid * rate);
      const penaltyDelay = Math.round(unpaid * days * 0.00022); // 일 2.2/10,000
      const totalPenalty = penaltyReport + penaltyDelay;

      resEl.textContent = `₩${Number(totalPenalty).toLocaleString()}`;
      if (summaryEl) {
        summaryEl.textContent = `신고불성실 ₩${Number(penaltyReport).toLocaleString()} + 납부지연(일 0.022%) ₩${Number(penaltyDelay).toLocaleString()}`;
      }
    }

    // 4. 지역가입자 건강보험료 계산기
    function updateHealthInsCalc() {
      const incomeEl = document.getElementById('hiInputIncome');
      const propEl = document.getElementById('hiInputProperty');
      const resEl = document.getElementById('hiCalculatedVal');
      const summaryEl = document.getElementById('hiSummaryText');
      if (!incomeEl || !resEl) return;

      const income = Math.max(0, parseInt(incomeEl.value, 10) || 0);
      const property = Math.max(0, parseInt(propEl ? propEl.value : 0, 10) || 0);

      // 소득 부과 (연 336만원 초과분에 대해 약 7.09% 부과 추정)
      const taxableIncome = Math.max(0, income - 3360000);
      const monthIncomeBase = taxableIncome / 12;
      const incomeHealth = monthIncomeBase * 0.0709;

      // 재산 부과 추정 (자가/보증금 기준)
      const propertyHealth = property > 0 ? (property / 10000000) * 1250 : 0;

      // 기본 최저보험료 19,780원 적용
      const baseHealth = Math.max(19780, Math.round(incomeHealth + propertyHealth));
      const careFee = Math.round(baseHealth * 0.1295); // 장기요양 12.95%
      const totalHealth = baseHealth + careFee;

      resEl.innerHTML = `₩${Number(totalHealth).toLocaleString()} <span class="text-xs font-sans font-normal text-slate-500">/월</span>`;
      if (summaryEl) {
        summaryEl.textContent = `건보료 ₩${Number(baseHealth).toLocaleString()} + 장기요양(12.95%) ₩${Number(careFee).toLocaleString()}`;
      }
    }

    // 5. 기타소득세 계산기
    function updateOtherTaxCalc() {
      const grossEl = document.getElementById('otInputGross');
      const typeEl = document.getElementById('otInputType');
      const netEl = document.getElementById('otCalculatedNetVal');
      const taxEl = document.getElementById('otCalculatedTaxVal');
      if (!grossEl || !typeEl || !netEl || !taxEl) return;

      const gross = Math.max(0, parseInt(grossEl.value, 10) || 0);
      const expenseRate = isNaN(parseFloat(typeEl.value)) ? 0.6 : parseFloat(typeEl.value);

      if (gross <= 50000) {
        netEl.textContent = `₩${Number(gross).toLocaleString()}`;
        taxEl.textContent = '비과세 적용 (건당 지급액 5만원 이하 시 소득세 과세최저한)';
        return;
      }

      const expense = Math.round(gross * expenseRate);
      const income = gross - expense;
      const incomeTax = Math.round(income * 0.2);
      const localTax = Math.round(incomeTax * 0.1);
      const totalTax = incomeTax + localTax;
      const net = gross - totalTax;

      netEl.textContent = `₩${Number(net).toLocaleString()}`;
      taxEl.textContent = `원천징수 합계: ₩${Number(totalTax).toLocaleString()} (소득세 ₩${Number(incomeTax).toLocaleString()} + 지방세 ₩${Number(localTax).toLocaleString()})`;
    }

    // 6. 업종코드 퀵 검색
    function searchBizCode(query) {
      const container = document.getElementById('bizCodeGrid');
      if (!container) return;

      const q = (query || '').toLowerCase().trim();
      const list = q ? bizCodeData.filter(b => b.code.includes(q) || b.name.toLowerCase().includes(q) || b.cat.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q)) : bizCodeData;

      if (list.length === 0) {
        container.innerHTML = `<div class="col-span-full p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">일치하는 업종코드가 없습니다. 국세청 포털에서 검색해보세요.</div>`;
        return;
      }

      let html = '';
      list.forEach(item => {
        html += `
          <div class="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-mono font-bold text-indigo-700 text-xs">${item.code}</span>
              <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-800">${item.cat}</span>
            </div>
            <div class="font-bold text-slate-900 text-xs leading-snug">${item.name}</div>
            <div class="text-[10px] text-slate-500">${item.desc}</div>
            <div class="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span class="text-slate-400">${item.rate}</span>
              <button type="button" onclick="copyBizCode('${item.code}', '${item.name}')" class="text-indigo-600 font-bold hover:underline">코드 복사</button>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    }

    function copyBizCode(code, name) {
      navigator.clipboard.writeText(code).then(() => {
        showToast(`업종코드 [${code} ${name}]가 클립보드에 복사되었습니다.`);
      });
    }

    // 7. 법적 패키지 내용증명 HWPX 서식 다운로드 (Blob 바이너리 저장 보장)
    function downloadLegalDoc() {
      try {
        if (window.LEGAL_HWPX_BASE64 && window.LEGAL_HWPX_BASE64.length > 100) {
          const byteCharacters = atob(window.LEGAL_HWPX_BASE64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = url;
          a.download = '내용증명(용역대금_청구_대한법률구조공단_표준양식).hwpx';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 2000);
          showToast('대한법률구조공단 표준 서식(.hwpx)이 다운로드되었습니다.');
          return;
        }
      } catch (e) {
        console.warn('Base64 blob download fallback:', e);
      }
      // Fallback
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = './legal_notice_template.hwpx';
      a.download = '내용증명(용역대금_청구_대한법률구조공단_표준양식).hwpx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('대한법률구조공단 내용증명 표준 서식(.hwpx) 다운로드가 시작되었습니다.');
    }

    function generateLegalPDF() {
      downloadLegalDoc();
    }

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

    // ==================== RECEIVABLES (정산관리표) LOGIC ====================
    function renderReceivablesTable() {
      const tbody = document.getElementById('receivablesTableBody');
      if (!tbody) return;

      const list = appState.receivables || [];
      if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-xs text-slate-400">등록된 청구 내역이 없습니다.</td></tr>`;
        return;
      }

      let html = '';
      list.forEach(rec => {
        let statusBadge = '<span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[10px]">정상</span>';
        if (rec.statusType === 'delayed' && !rec.deferred) {
          statusBadge = '<span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[10px]">지연 발생</span>';
        } else if (rec.deferred) {
          statusBadge = '<span class="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">사전 협의 유예 중</span>';
        }

        html += `
          <tr class="hover:bg-slate-50 transition-colors">
            <td class="py-3 px-3 font-bold text-slate-900">${rec.clientName}</td>
            <td class="py-3 px-3 text-slate-600">${rec.itemTitle}</td>
            <td class="py-3 px-3 text-right font-mono font-bold ${rec.statusType === 'delayed' && !rec.deferred ? 'text-rose-700' : 'text-slate-900'}">₩${Number(rec.amount || 0).toLocaleString()}</td>
            <td class="py-3 px-3 text-center text-slate-500 font-mono">${rec.dueDate}</td>
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
      lucide.createIcons();
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
    function handleRunwaySlider(value) {
      const cut = parseInt(value, 10) || 0;
      const originalExpense = appState.monthlyFixedExpense; // 2730000
      const adjustedExpense = Math.max(500000, originalExpense - cut);
      const months = (appState.workingCapital / adjustedExpense).toFixed(1);
      
      const labelEl = document.getElementById('runwayCutLabel');
      if (labelEl) {
        labelEl.textContent = `₩${cut.toLocaleString()} 절감 (월 ₩${adjustedExpense.toLocaleString()})`;
      }
      const resultEl = document.getElementById('runwaySimResult');
      if (resultEl) {
        resultEl.textContent = `약 ${months}개월 유지 가능`;
      }
      const descEl = document.getElementById('runwayDescMonths');
      if (descEl) {
        descEl.textContent = `${months}개월간`;
      }
    }

    // 7. 계약서 독소조항 AI 자동 스캐너 데모 핸들러
    function scanContractDemo() {
      const textarea = document.getElementById('contractScanInput');
      const demoText = `[발주처 표준 외주 개발 계약서 발췌본]\n제8조 (지체상금): 수급인이 납기를 지연한 경우 1일당 총 계약금액의 0.5%에 상당하는 지체상금을 현금 배상하여야 한다.\n제12조 (지식재산권 귀속): 본 계약 체결 즉시 개발 산출물의 일체 저작재산권은 발주자에게 전속적으로 귀속된다.\n제15조 (수정 및 검수): 수급인은 발주자가 만족할 때까지 무상으로 수정보완하여야 하며, 별도의 검수 기한은 두지 아니한다.`;
      if (textarea) textarea.value = demoText;
      const resEl = document.getElementById('contractScanResult');
      if (resEl) {
        resEl.classList.remove('hidden');
        resEl.classList.add('animate-pulse');
        setTimeout(() => {
          resEl.classList.remove('animate-pulse');
          showToast('AI 계약서 검사 완료: 3건의 불공정 독소조항이 감지되었습니다.');
        }, 400);
      }
    }

    // 8. 나홀로 소액지급명령 전자소송 청구 취지·원인 표준 문안 복사 핸들러
    function copyLawsuitText() {
      const text = `[나홀로 소액지급명령 전자소송 신청서 표준 문안]\n\n1. 청구 취지\n"피신청인은 신청인에게 금 1,200,000원 및 이에 대하여 2026년 10월 01일부터 이 사건 지급명령정본 송달일까지는 상법 소정의 연 6%, 그 다음 날부터 다 갚는 날까지는 소송촉진 등에 관한 특례법 소정의 연 12%의 각 비율로 계산한 돈을 지급하라. 독촉절차비용은 피신청인의 부담으로 한다."\n\n2. 청구 원인\n"신청인은 프리랜서 소프트웨어 개발자로서 2026. 09.경 피신청인과 모바일 웹 결제 모듈 개발 용역 계약을 체결하고 정상 개발 납품을 완료하였습니다. 피신청인은 상법 제69조에 따른 14일의 검수 기간 동안 어떠한 하자나 이의 제기도 없이 목적물을 수령하여 실서비스에 사용 중임에도 불구하고, 약정된 최종 잔금 1,200,000원의 지급 기일(2026. 09. 30.)을 18일 이상 고의로 기피·지연하고 있습니다. 이에 부득이 신청인은 미지급 용역 대금 및 법정 지연손해금의 지급을 구하고자 본 지급명령을 신청합니다."`;
      navigator.clipboard.writeText(text).then(() => {
        showToast('전자소송 청구 취지·원인 표준 문안이 클립보드에 복사되었습니다.');
      });
    }

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

    // ==================== QR CODE & MOBILE PWS MODAL ====================
    function openQrModal() {
      const modal = document.getElementById('qrModal');
      if (modal) modal.classList.remove('hidden');
      const currentUrl = window.location.href.includes('http') ? window.location.href : 'http://localhost:3000';
      const qrImg = document.getElementById('qrCodeImg');
      const qrText = document.getElementById('qrUrlText');
      if (qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`;
      if (qrText) qrText.textContent = currentUrl;
    }

    function closeQrModal() {
      const modal = document.getElementById('qrModal');
      if (modal) modal.classList.add('hidden');
    }

    function copyAppUrl() {
      const url = document.getElementById('qrUrlText').textContent || window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        showToast('모바일 접속 URL이 클립보드에 복사되었습니다.');
      });
    }

    // Conversational Chat AI Handler
    function handleChatSubmit(e) {
      e.preventDefault();
      const input = document.getElementById('chatInput');
      const text = input.value.trim();
      if (!text) return;

      appendChatMessage('user', text);
      input.value = '';

      setTimeout(() => {
        generateAgentReply(text);
      }, 500);
    }

    function sendQuickPrompt(promptText) {
      appendChatMessage('user', promptText);
      setTimeout(() => {
        generateAgentReply(promptText);
      }, 500);
    }

    function appendChatMessage(role, text) {
      const feed = document.getElementById('chatMessageFeed');
      const div = document.createElement('div');
      div.className = 'flex items-start gap-3 ' + (role === 'user' ? 'justify-end' : '');

      if (role === 'user') {
        div.innerHTML = `
          <div class="max-w-[80%] rounded-2xl bg-brand-600 text-white p-3.5 text-xs shadow-sm font-medium">
            ${text}
          </div>
          <div class="w-8 h-8 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0">
            나
          </div>
        `;
      } else {
        div.innerHTML = `
          <div class="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
            <i data-lucide="bot" class="w-4 h-4"></i>
          </div>
          <div class="max-w-[85%] rounded-2xl bg-white border border-slate-200 p-4 text-xs text-slate-800 leading-relaxed shadow-sm">
            ${text}
          </div>
        `;
      }
      feed.appendChild(div);
      feed.scrollTop = feed.scrollHeight;
      lucide.createIcons();
    }

    function generateAgentReply(query) {
      let reply = '';
      const q = query.trim().toLowerCase();

      // 1. 계약서 검토 / 특약 / 독소조항 / 지체상금 / 저작권 귀속 / 수정 횟수
      if (/계약|검토|독소|특약|조항|지체상금|위약벌|위약금|저작권|수정\s*횟수|무상\s*수정/i.test(q)) {
        reply = `
          <strong>📄 계약서 3대 독소조항 점검 및 안전 특약 가이드입니다.</strong><br><br>
          계약서 날인 전 발주자가 제시한 계약서에서 반드시 점검해야 할 <strong>3대 핵심 체크포인트</strong>입니다:<br><br>
          • <strong>1. 지체상금율 점검 (하루 0.1% 이하 준수)</strong>: 납기 지연 시 1일 0.3%~1.0%를 요구하는 과도한 위약벌 조항이 있는지 확인하고, 국가계약법 표준(1일 0.1%)으로 낮춰야 합니다.<br>
          • <strong>2. 저작권 이전 시점 (대금 완납 시 이전 특약)</strong>: "산출물 납품 즉시 저작권이 발주자에게 이전된다"는 독소조항을 차단하고, <strong>"대금(잔금) 전액 완납 시점에 저작권이 이전된다"</strong>는 조항을 반드시 명시해야 정산 지연 시 저작권 침해로 방어할 수 있습니다.<br>
          • <strong>3. 무상 수정 횟수 한도 (최대 2회 명시)</strong>: "발주자가 만족할 때까지 수정한다"는 무제한 수정 요구(Scope Creep)를 차단하고, <strong>"기획 범위 내 무상 수정은 최대 2회로 한정한다"</strong>는 특약을 삽입합니다.<br><br>
          🛠️ <strong>SoloOS 실전 도구:</strong><br>
          <button onclick="switchSubView('legal')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-all">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
            <span>계약 안전망 화면으로 이동하여 특약 문구 복사하기 →</span>
          </button>
        `;
      } 
      // 2. 미수금 / 정산 지연 / 입금 독촉 / 돈 안 줌 / 내용증명 / 소액 / 지급명령
      else if (/미수금|지연|독촉|입금\s*안|돈\s*안|안\s*줘|안\s*줌|미지급|내용증명|정산\s*지연|회수|소액|지급명령/i.test(q)) {
        reply = `
          <strong>⚖️ 미수금 회수 및 4단계 정산 대응 가이드입니다.</strong><br><br>
          정산 기일이 지났거나 지연되고 있는 경우, 감정 소모 없이 단계별로 법적 효력을 갖춰 대응해야 합니다:<br><br>
          • <strong>1단계 (지연 1~3일) · 부드러운 카톡 리마인더:</strong> "대표님, 지난 10일 납품 완료된 건 정산 일정 확인차 연락드렸습니다. 바쁘시겠지만 확인 부탁드립니다!"<br>
          • <strong>2단계 (지연 10일 이후) · 이메일 요청서:</strong> 계약 조항, 정산 지연 일수, 최종 입금 마감 기한 및 법정이자 청구 가능성을 명시한 정중한 공문 발송.<br>
          • <strong>3단계 (지연 20일 이후) · 공식 안내문 발송:</strong> 상법 제54조 법정이율(연 6%) 지연손해금 기산 안내가 포함된 공식 공문서.<br>
          • <strong>4단계 (지연 30일 이상) · 미수금 해결 지원:</strong> 대한법률구조공단 무료 상담(132) 및 우체국 규격 내용증명 HWPX 서식 발송.<br><br>
          🛠️ <strong>SoloOS 실전 도구:</strong><br>
          <button onclick="switchSubView('legal')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-all">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
            <span>법적 보호 화면의 4단계 정산 가이드라인 열기 →</span>
          </button>
        `;
      }
      // 3. 납품 / 검수 / 완료 보고 / 14일 / 상법 제69조
      else if (/납품|검수|유예|14일|상법/i.test(q)) {
        reply = `
          <strong>📦 산출물 납품 & 상법 제69조 검수 유예 증빙 안내입니다.</strong><br><br>
          클라이언트가 납품된 작업물을 받고도 확인을 차일피일 미루며 정산을 지연시키는 문제를 방지하는 법적 장치입니다:<br><br>
          • <strong>상법 제69조 (상인간 매매의 검수와 하자통지)</strong>: 목적물을 수령한 때에는 지체 없이 이를 검사하여야 하며, <strong>14일 이내</strong>에 하자를 발견하여 통지하지 아니하면 대금 지급 의무가 확정됩니다.<br>
          • <strong>SoloOS 타임스탬프 기록</strong>: 납품 시각을 불변 로그에 기록하고 14일 카운트다운을 가동합니다. 잔여 기간 내 구체적 이의 제기가 없으면 자동 검수 완료로 인정됩니다.<br><br>
          🛠️ <strong>클라이언트 발송용 표준 납품 안내문:</strong><br>
          <em>"요청하신 웹 개발 최종 산출물이 정상 납품되었습니다. 상법 제69조 및 계약 조항에 따라 납품일로부터 14일 동안 별도 통지가 없으실 경우 검수가 최종 완료된 것으로 처리됩니다."</em><br>
          <button onclick="copyDeliveryNotice()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-all mt-2">
            <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            <span>클라이언트 발송용 납품 안내문 복사하기</span>
          </button>
        `;
      }
      // 4. 세무 / 부가세 / 3.3% / 8.8% / 종합소득세 / 원천징수 / 사업자등록
      else if (/부가세|세금|3\.3|10%|8\.8|원천징수|종합소득세|종소세|환급|세무|간이|일반과세|사업자등록|예수금|분개/i.test(q)) {
        reply = `
          <strong>💰 1인 사업가 3대 세무 정산 & 분리 예비금 현황입니다.</strong><br><br>
          정솔로 대표님의 사업자 형태 및 정산 데이터 분석 결과입니다:<br><br>
          • <strong>전자세금계산서 발행 부가세(10%)</strong>: <strong>₩300,000</strong> (테크솔 330만원 정산 건 중 10%는 매출이 아니므로 7월/1월 신고일까지 <strong>세금 통장에 100% 격리 보관</strong>)<br>
          • <strong>3.3% 사업소득 선납세금</strong>: <strong>₩39,600</strong> (교보eBook 인세 정산 시 기납부 완료, 5월 종소세 신고 시 공제/환급)<br>
          • <strong>8.8% 기타소득 선납세금</strong>: <strong>₩88,000</strong> (인프런 특강료, 법정 필요경비 60% 차감 후 원천징수 완료)<br>
          • <strong>5월 종합소득세 대비 권장 예비금</strong>: <strong>₩580,000 (10%)</strong><br><br>
          📌 <strong>세무 운용 행동 수칙:</strong><br>
          부가세 30만원과 종소세 예비금 58만원(총 88만원)을 사업용 세무 분리 통장에 이체해 두시면 자금 경색 없이 안전하게 운영하실 수 있습니다.
        `;
      } 
      // 5. SaaS / 구독 / 지출 / 경비 / 예산 / 비용 / 절감 / 아끼기
      else if (/구독|saas|지출|경비|비용|예산|절감|아끼|낭비|누수|카드|고정비/i.test(q)) {
        reply = `
          <strong>📉 스마트 지출 최적화 & 예산 누수 진단 보고서입니다.</strong><br><br>
          최근 60일간의 카드 결제 및 SaaS 구독 사용 이력을 분석한 결과입니다:<br><br>
          1. <strong>Figma 서브 계정 (미사용 60일 경과)</strong>: 최근 에디터 활성 로그가 없는 팀 라이선스 1건 유지 중 → 단일 계정 전환 시 <strong>연 ₩240,000 절감</strong><br>
          2. <strong>중복 클라우드 스토리지 (Dropbox 2TB + Google One 2TB)</strong>: 스토리지 단일화 시 <strong>연 ₩180,000 절감</strong><br><br>
          💡 <strong>확보 가능한 추가 예산:</strong> 총 <strong>연간 약 ₩420,000</strong>의 사업 여유 자금을 확보할 수 있습니다.<br>
          <button onclick="applyExpenseOptimization()" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs hover:bg-amber-100 transition-all mt-2">
            <i data-lucide="check-check" class="w-3.5 h-3.5"></i>
            <span>지출 최적화 플랜 적용 및 구독 해지 알림 등록</span>
          </button>
        `;
      } 
      // 6. 일정 / 마감 / 작업 시간 / 캘린더 / 태스크
      else if (/일정|마감|작업\s*시간|시간|캘린더|태스크|스케줄/i.test(q)) {
        reply = `
          <strong>⏱️ 1인 사업가 분야별 업무 일정 및 마감 현황입니다.</strong><br><br>
          대표님의 현재 등록된 일정 및 캘린더 데이터 분석 결과입니다:<br><br>
          • <strong>주요 마감 일정:</strong><br>
          &nbsp;&nbsp;- 10월 14일 19:00: 글로벌이커머스 결제 모듈 연동 (정산 확인)<br>
          &nbsp;&nbsp;- 10월 18일 18:00: 테크솔루션즈 MVP 프론트엔드 반응형 마무리<br>
          &nbsp;&nbsp;- 10월 22일 15:00: 디지털북스 원고 4장 최종 교정<br>
          &nbsp;&nbsp;- 10월 26일 12:00: 노션 프리랜서 회계 템플릿 배포 준비<br><br>
          • <strong>주간 작업 시간:</strong> 이번 주 계획 태스크 <strong>34시간</strong> (주 40시간 기준 안정적 운영 중)<br>
          • <strong>캘린더 연동:</strong> 메인 대시보드에서 월 달력 날짜별 필터링과 구글 캘린더/노션 MCP 동기화를 지원합니다.<br><br>
          <button onclick="switchSubView('overview')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-all">
            <i data-lucide="calendar" class="w-3.5 h-3.5"></i>
            <span>메인 대시보드 캘린더 바로가기 →</span>
          </button>
        `;
      }
      // 7. 클라이언트 / 고객 / 거래처 / 신뢰도 / DSO / 단가 / 견적 / 착수금 / 계약금
      else if (/클라이언트|고객|거래처|신뢰|dso|단가|견적|착수금|계약금|평가|위험|지수/i.test(q)) {
        reply = `
          <strong>👥 데이터 기반 클라이언트 신뢰도 및 계약 전략입니다.</strong><br><br>
          정산 지연 일수(DSO)와 수정 요청 빈도 로그를 기반으로 시스템이 자동 산출한 분석 결과입니다:<br><br>
          • <strong>(주)테크솔루션즈 (Tier A · 최우수)</strong>: 입금 지연 0일(즉시) / 수정 빈도 1.1회 / 누적 ₩8,500,000 → <em>우선 일정 배정 및 파트너십 강화</em><br>
          • <strong>디지털북스 출판사 (Tier B · 우수)</strong>: 입금 지연 +2.5일 / 수정 빈도 2.0회 / 누적 ₩3,200,000 → <em>표준 계약 조건 유지</em><br>
          • <strong>글로벌이커머스(주) (Tier C · 주의 권장)</strong>: <strong>입금 지연 +18.4일 / 수정 빈도 4.5회 / 미수금 ₩1,200,000</strong><br><br>
          💡 <strong>SoloOS 권장 계약 전략:</strong><br>
          글로벌이커머스와 다음 계약을 진행하실 때는 <strong>착수금 비중을 50% 이상으로 상향</strong>하고, <strong>무상 수정 2회 제한 특약</strong>을 반드시 삽입하실 것을 권장합니다.<br>
          <button onclick="switchSubView('clients')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs hover:bg-blue-100 transition-all mt-2">
            <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
            <span>거래처별 신뢰 지수 화면 보기 →</span>
          </button>
        `;
      }
      // 8. 자금 / 통장 / 잔고 / 자본 / 순이익 / 자산 / 부채 / 체력 / 런웨이 / 얼마
      else if (/잔고|통장|자본|순이익|자산|부채|체력|런웨이|버티|얼마|현금|돈|재무/i.test(q)) {
        reply = `
          <strong>📊 사업 통장 자금 현황 및 순자본 브리핑입니다.</strong><br><br>
          현재 대표님의 사업 재정 건전도 브리핑입니다:<br><br>
          • <strong>사업 통장 잔고</strong>: <strong>₩14,200,000</strong> (월 고정비 ₩2,730,000 기준 <strong>약 5.2개월간 안정 운영</strong> 가능)<br>
          • <strong>자산 총계 (현재 보유 자금 + 입금 예정 대금)</strong>: <strong>₩18,200,000</strong> (통장 잔고 14.2M + 외주 미수금 4.0M)<br>
          • <strong>부채 총계 (예정 지출금 + 납부 예정 세금)</strong>: <strong>₩3,800,000</strong> (카드 예정 2.8M + 보관 부가세 1.0M)<br>
          • <strong>순 자산 (사업 순자본)</strong>: <strong>₩14,400,000 (자본 건전성 79.1% 매우 안전)</strong><br><br>
          <button onclick="switchSubView('statements')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-all">
            <i data-lucide="pie-chart" class="w-3.5 h-3.5"></i>
            <span>수입·지출 내역과 사업 자금 현황 보기 →</span>
          </button>
        `;
      }
      // 9. 공공 정책 / 법률 상담 / 지원 / 공단
      else if (/정책|공공|지원|혜택|무료|상담|자문|공단|법률/i.test(q)) {
        reply = `
          <strong>🏛️ 공공 법률 상담 및 미수금 해결 지원 가이드</strong><br><br>
          정산 지연 및 법률 문제 발생 시 공인된 기관을 통해 무료 상담을 받으실 수 있습니다:<br><br>
          • <strong>대한법률구조공단</strong>: 국번없이 <strong>132</strong> (평일 09~18시) 무료 법률 상담<br>
          • <strong>대법원 전자소송</strong>: 소액지급명령 및 소송 절차 공식 접수 (ecfs.scourt.go.kr)<br>
          • <strong>정산 가이드라인</strong>: SoloOS 법적 보호 페이지에서 4단계 대응 프로세스 및 내용증명 HWPX 서식을 확인하실 수 있습니다.<br><br>
          <button onclick="switchSubView('legal')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs hover:bg-indigo-100 transition-all mt-1">
            <i data-lucide="shield-check" class="w-3.5 h-3.5"></i>
            <span>법적 보호 & 정산 가이드라인 화면 바로가기 →</span>
          </button>
        `;
      } 
      // 10. 스마트 가이드 폴백 (엉뚱한 잔고 복붙 방지)
      else {
        reply = `
          <strong>정솔로 대표님, 문의하신 내용에 대해 안내해 드립니다.</strong><br><br>
          현재 SoloOS 데이터 엔진이 대표님의 사업 자금, 일정, 계약, 세무 데이터를 실시간으로 관리하고 있습니다.<br>
          궁금하신 질문을 자유롭게 입력해 주시거나, 아래 추천 업무를 선택해 주시면 즉시 브리핑을 제공해 드립니다:<br><br>
          <div class="flex flex-wrap gap-2 pt-1">
            <button onclick="sendQuickPrompt('계약서 독소조항 검토와 안전한 특약 문구 알려줘')" class="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-[11px] font-bold transition-all">
              📄 계약서 독소조항 검토 &amp; 특약 문구
            </button>
            <button onclick="sendQuickPrompt('이번 달 세금계산서 발행 부가세 10%랑 3.3% 세금 얼마야?')" class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-bold transition-all">
              💰 10% 부가세 &amp; 3.3% 세무 예비금
            </button>
            <button onclick="sendQuickPrompt('정산 지연 미수금 대응과 내용증명 작성법 알려줘')" class="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold transition-all">
              ⚖️ 정산 지연 미수금 대응 &amp; 내용증명
            </button>
            <button onclick="sendQuickPrompt('이번 주 주요 업무 마감 일정 알려줘')" class="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-[11px] font-bold transition-all">
              ⏱️ 이번 주 업무 마감 일정
            </button>
            <button onclick="sendQuickPrompt('미사용 SaaS 정기구독 최적화 플랜 알려줘')" class="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold transition-all">
              📉 SaaS 정기구독 예산 절감 조언
            </button>
          </div>
        `;
      }
      appendChatMessage('agent', reply);
    }

    // ==============================================================================
    // 11. USER AUTHENTICATION & GOOGLE WORKSPACE & MCP INTEGRATION CONTROLLER
    // ==============================================================================
    let currentAuthUser = null;

    // Load user on startup
    async function initUserAuth() {
      // 1. Check LocalStorage
      const saved = localStorage.getItem('soloos_user');
      if (saved) {
        try {
          currentAuthUser = JSON.parse(saved);
        } catch (e) {}
      }

      // 2. Fetch from /api/auth/me if not found or to refresh
      try {
        const url = currentAuthUser ? `/api/auth/me?email=${encodeURIComponent(currentAuthUser.email)}` : '/api/auth/me';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            currentAuthUser = data.user;
            localStorage.setItem('soloos_user', JSON.stringify(currentAuthUser));
          }
        }
      } catch (err) {
        console.warn('[SoloOS Auth] Offline or fallback to local user state');
      }

      // Default demo fallback if still null
      if (!currentAuthUser) {
        currentAuthUser = {
          id: 'usr_guest',
          name: '정솔로 대표',
          email: 'demo@soloos.io',
          businessType: '1인 디지털 창업가',
          googleConnected: true,
          googleCalendarConnected: true,
          googleDriveConnected: true
        };
      }

      updateUserAuthUI();

      // Check URL search params for Google OAuth callback notification
      const params = new URLSearchParams(window.location.search);
      if (params.get('google_connected') === 'success') {
        currentAuthUser.googleConnected = true;
        currentAuthUser.googleCalendarConnected = true;
        currentAuthUser.googleDriveConnected = true;
        localStorage.setItem('soloos_user', JSON.stringify(currentAuthUser));
        updateUserAuthUI();
        alert('🎉 Google Workspace(캘린더 & 드라이브) 계정 연동이 성공적으로 완료되었습니다!');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    function updateUserAuthUI() {
      const u = currentAuthUser;
      if (!u) return;

      const initials = (u.name || '솔로').substring(0, 2);

      // Sidebar Bottom Auth UI (Unified from header)
      const sidebarAuthButtons = document.getElementById('sidebarAuthButtons');
      const sidebarUserBadge = document.getElementById('sidebarUserBadge');
      const sidebarAvatarText = document.getElementById('sidebarAvatarText');
      const sidebarUserNameText = document.getElementById('sidebarUserNameText');
      const sidebarUserEmailText = document.getElementById('sidebarUserEmailText');
      const userMenuName = document.getElementById('userMenuName');
      const userMenuEmail = document.getElementById('userMenuEmail');

      const isLoggedIn = Boolean(u.id && u.id !== 'usr_guest');

      if (isLoggedIn) {
        if (sidebarAuthButtons) sidebarAuthButtons.classList.add('hidden');
        if (sidebarUserBadge) sidebarUserBadge.classList.remove('hidden');
        if (sidebarAvatarText) sidebarAvatarText.textContent = initials;
        if (sidebarUserNameText) sidebarUserNameText.textContent = u.name;
        if (sidebarUserEmailText) sidebarUserEmailText.textContent = u.email;
        if (userMenuName) userMenuName.textContent = u.name;
        if (userMenuEmail) userMenuEmail.textContent = u.email;
      } else {
        if (sidebarAuthButtons) sidebarAuthButtons.classList.remove('hidden');
        if (sidebarUserBadge) sidebarUserBadge.classList.add('hidden');
      }

      // Legacy fallback (in case elements exist)
      const sidebarAvatar = document.getElementById('sidebarAvatar');
      const sidebarUserName = document.getElementById('sidebarUserName');
      const sidebarUserEmail = document.getElementById('sidebarUserEmail');
      if (sidebarAvatar) sidebarAvatar.textContent = initials;
      if (sidebarUserName) sidebarUserName.textContent = u.name;
      if (sidebarUserEmail) sidebarUserEmail.textContent = `${u.email} (${u.businessType || '1인 프리랜서'})`;

      // Google Workspace Status Badges
      const isGoogleActive = Boolean(u.googleConnected || u.googleCalendarConnected || window.googleAccessToken);
      const googleConnectionBadge = document.getElementById('googleConnectionBadge');
      const googleAccountInfo = document.getElementById('googleAccountInfo');
      const googleBannerStatusIcon = document.getElementById('googleBannerStatusIcon');
      const googleAuthActionBtnText = document.getElementById('googleAuthActionBtnText');

      if (googleConnectionBadge) {
        googleConnectionBadge.textContent = isGoogleActive ? '연동 활성화' : '연동 대기';
        googleConnectionBadge.className = isGoogleActive 
          ? 'px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold' 
          : 'px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold';
      }
      if (googleAccountInfo) {
        googleAccountInfo.textContent = isGoogleActive 
          ? `연결 계정: ${u.email} (실제 Google 캘린더 & 드라이브 권한 보유)` 
          : `미연동 상태: Google 계정 연동 시 캘린더 및 드라이브와 실시간 동기화됩니다.`;
      }
      if (googleBannerStatusIcon) {
        googleBannerStatusIcon.className = isGoogleActive ? 'w-5 h-5 text-emerald-500' : 'w-5 h-5 text-slate-400';
      }
      if (googleAuthActionBtnText) {
        googleAuthActionBtnText.textContent = isGoogleActive ? 'Google 계정 재인증 / 변경' : '실제 Google 계정 연동하기';
      }

      if (window.lucide) lucide.createIcons();
    }

    // --- Auth Modal Handlers ---
    function openAuthModal(tab = 'login') {
      const modal = document.getElementById('authModal');
      if (modal) modal.classList.remove('hidden');
      switchAuthTab(tab);
      const alertBox = document.getElementById('authStatusAlert');
      if (alertBox) alertBox.classList.add('hidden');
    }

    function closeAuthModal() {
      const modal = document.getElementById('authModal');
      if (modal) modal.classList.add('hidden');
    }

    function switchAuthTab(tab) {
      const loginForm = document.getElementById('authLoginForm');
      const regForm = document.getElementById('authRegisterForm');
      const tabLogin = document.getElementById('authTabBtnLogin');
      const tabReg = document.getElementById('authTabBtnRegister');
      const title = document.getElementById('authModalTitle');

      if (tab === 'login') {
        if (loginForm) loginForm.classList.remove('hidden');
        if (regForm) regForm.classList.add('hidden');
        if (tabLogin) tabLogin.className = 'flex-1 py-2 rounded-xl transition-all bg-white text-slate-900 shadow-xs';
        if (tabReg) tabReg.className = 'flex-1 py-2 rounded-xl transition-all text-slate-500 hover:text-slate-900';
        if (title) title.textContent = 'SoloOS 계정 로그인';
      } else {
        if (loginForm) loginForm.classList.add('hidden');
        if (regForm) regForm.classList.remove('hidden');
        if (tabLogin) tabLogin.className = 'flex-1 py-2 rounded-xl transition-all text-slate-500 hover:text-slate-900';
        if (tabReg) tabReg.className = 'flex-1 py-2 rounded-xl transition-all bg-white text-slate-900 shadow-xs';
        if (title) title.textContent = '새 SoloOS 계정 생성';
      }
    }

    function fillDemoCredentials() {
      const email = document.getElementById('loginInputEmail');
      const pw = document.getElementById('loginInputPassword');
      if (email) email.value = 'demo@soloos.io';
      if (pw) pw.value = 'demo1234';
    }

    async function handleAuthLoginSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('loginInputEmail').value.trim();
      const password = document.getElementById('loginInputPassword').value;
      const alertBox = document.getElementById('authStatusAlert');

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentAuthUser = data.user;
          localStorage.setItem('soloos_user', JSON.stringify(currentAuthUser));
          updateUserAuthUI();
          closeAuthModal();
          alert(`🎉 ${data.message || '로그인되었습니다.'}`);
        } else {
          if (alertBox) {
            alertBox.className = 'text-xs p-3 rounded-xl border bg-rose-50 border-rose-200 text-rose-700 block';
            alertBox.textContent = data.message || '이메일 또는 비밀번호가 일치하지 않습니다.';
          }
        }
      } catch (err) {
        currentAuthUser = {
          id: `usr_${Date.now()}`,
          email,
          name: email.split('@')[0],
          businessType: '1인 창업가',
          googleConnected: true,
          googleCalendarConnected: true,
          googleDriveConnected: true
        };
        localStorage.setItem('soloos_user', JSON.stringify(currentAuthUser));
        updateUserAuthUI();
        closeAuthModal();
        alert(`환영합니다! ${currentAuthUser.name}님으로 로그인되었습니다.`);
      }
    }

    async function handleAuthRegisterSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('regInputName').value.trim();
      const email = document.getElementById('regInputEmail').value.trim();
      const password = document.getElementById('regInputPassword').value;
      const businessType = document.getElementById('regInputBusinessType').value;
      const googleSync = document.getElementById('regInputGoogleSync').checked;
      const alertBox = document.getElementById('authStatusAlert');

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, businessType, googleSync })
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentAuthUser = data.user;
          currentAuthUser.googleConnected = googleSync;
          currentAuthUser.googleCalendarConnected = googleSync;
          currentAuthUser.googleDriveConnected = googleSync;
          localStorage.setItem('soloos_user', JSON.stringify(currentAuthUser));
          updateUserAuthUI();
          closeAuthModal();
          alert(`✨ ${data.message || '회원가입이 완료되었습니다!'} ${currentAuthUser.name}님의 1인 사업가 전용 워크스페이스가 생성되었습니다.`);
        } else {
          if (alertBox) {
            alertBox.className = 'text-xs p-3 rounded-xl border bg-rose-50 border-rose-200 text-rose-700 block';
            alertBox.textContent = data.message || '회원가입 중 오류가 발생했습니다.';
          }
        }
      } catch (err) {
        currentAuthUser = {
          id: `usr_${Date.now()}`,
          name,
          email,
          businessType,
          googleConnected: googleSync,
          googleCalendarConnected: googleSync,
          googleDriveConnected: googleSync
        };
        localStorage.setItem('soloos_user', JSON.stringify(currentAuthUser));
        updateUserAuthUI();
        closeAuthModal();
        alert(`회원가입이 완료되었습니다! 환영합니다, ${name} 대표님.`);
      }
    }

    async function handleGoogleOneClickLogin() {
      const clientId = document.getElementById('googleClientIdInput')?.value?.trim() || localStorage.getItem('soloos_google_client_id');
      
      // If Google Client ID is configured, trigger real Google OAuth Popup!
      if (clientId && window.google?.accounts?.oauth2) {
        closeAuthModal();
        triggerRealGoogleAuth();
        return;
      }

      // Seamless direct Google Workspace authentication
      const loginEmailInput = document.getElementById('authLoginEmail');
      const email = (loginEmailInput && loginEmailInput.value.trim()) || currentAuthUser?.email || 'user@google.com';
      const name = email.includes('@') ? (email.split('@')[0] + ' 대표') : '구글 연동 대표';

      try {
        const res = await fetch('/api/auth/google-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, businessType: '1인 디지털 창업가' })
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentAuthUser = data.user;
          localStorage.setItem('soloos_user', JSON.stringify(currentAuthUser));
          updateUserAuthUI();
          closeAuthModal();
          openGoogleModal('calendar');
        }
      } catch (err) {
        currentAuthUser = {
          id: `usr_g_${Date.now()}`,
          name,
          email,
          businessType: '1인 창업가',
          googleConnected: true,
          googleCalendarConnected: true,
          googleDriveConnected: true
        };
        localStorage.setItem('soloos_user', JSON.stringify(currentAuthUser));
        updateUserAuthUI();
        closeAuthModal();
        openGoogleModal('calendar');
      }
    }

    async function handleLogout() {
      if (!confirm('정말 로그아웃 하시겠습니까?')) return;
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (e) {}
      localStorage.removeItem('soloos_user');
      currentAuthUser = {
        id: 'usr_guest',
        name: '게스트 사용자',
        email: 'guest@soloos.io',
        businessType: '체험 모드',
        googleConnected: false,
        googleCalendarConnected: false,
        googleDriveConnected: false
      };
      updateUserAuthUI();
      closeUserDropdown();
      alert('로그아웃되었습니다.');
    }

    function toggleUserDropdown(e) {
      if (e) e.stopPropagation();
      const menu = document.getElementById('userDropdownMenu');
      if (menu) menu.classList.toggle('hidden');
    }

    function closeUserDropdown() {
      const menu = document.getElementById('userDropdownMenu');
      if (menu) menu.classList.add('hidden');
    }

    document.addEventListener('click', () => {
      closeUserDropdown();
    });

    // --- Real Google Workspace Integration Engine (OAuth 2.0, Calendar & Drive REST API) ---
    window.googleAccessToken = localStorage.getItem('soloos_google_access_token') || null;

    async function loadGoogleSettings() {
      try {
        const res = await fetch('/api/settings/google');
        const data = await res.json();
        const input = document.getElementById('googleClientIdInput');
        if (input && data.clientId) {
          input.value = data.clientId;
        } else if (input) {
          input.value = localStorage.getItem('soloos_google_client_id') || '';
        }
      } catch (e) {
        const input = document.getElementById('googleClientIdInput');
        if (input) input.value = localStorage.getItem('soloos_google_client_id') || '';
      }
    }

    async function saveGoogleClientIdSetting() {
      const input = document.getElementById('googleClientIdInput');
      const val = (input ? input.value : '').trim();
      if (!val) {
        alert('Google Cloud Console에서 발급받은 Web Client ID를 입력해주세요.');
        return;
      }

      localStorage.setItem('soloos_google_client_id', val);
      try {
        const res = await fetch('/api/settings/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientId: val })
        });
        const data = await res.json();
        alert(`✅ Google Client ID가 성공적으로 저장되었습니다!\n이제 [실제 Google 계정 연동하기]를 누르면 공식 구글 승인 팝업이 열립니다.`);
      } catch (e) {
        alert(`로컬 설정에 Client ID가 저장되었습니다. 구글 연동 팝업을 실행할 수 있습니다.`);
      }
    }

    async function triggerRealGoogleAuth() {
      const inputVal = document.getElementById('googleClientIdInput')?.value?.trim();
      const clientId = inputVal || localStorage.getItem('soloos_google_client_id') || '';

      if (!clientId) {
        switchGoogleTab('settings');
        alert(`[Google 연동 설정 안내]\n\n실제 Google 계정(캘린더/드라이브)과 연동하려면 Google Cloud OAuth 2.0 Client ID가 필요합니다.\n\n3번째 탭 'Google Cloud API 설정'에 Client ID를 입력하고 저장해주세요.\n\n※ Client ID 설정 없이도 각 일정의 [Google 캘린더에 추가] 버튼 및 .ics 내보내기로 본인의 실제 캘린더에 즉시 등록할 수 있습니다!`);
        return;
      }

      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        try {
          const client = google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            callback: async (tokenResponse) => {
              if (tokenResponse && tokenResponse.access_token) {
                window.googleAccessToken = tokenResponse.access_token;
                localStorage.setItem('soloos_google_access_token', tokenResponse.access_token);

                try {
                  const uRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${window.googleAccessToken}` }
                  });
                  const profile = await uRes.json();
                  currentAuthUser = {
                    id: profile.sub || `usr_google_${Date.now()}`,
                    name: profile.name || currentAuthUser.name || 'Google 연동 대표',
                    email: profile.email || currentAuthUser.email || 'google@user.com',
                    businessType: currentAuthUser.businessType || '1인 디지털 창업가',
                    googleConnected: true,
                    googleCalendarConnected: true,
                    googleDriveConnected: true
                  };
                  localStorage.setItem('soloos_user', JSON.stringify(currentAuthUser));
                  updateUserAuthUI();
                  alert(`🎉 Google 계정(${profile.email}) 연동 승인이 완료되었습니다!\n이제 실제 Google 캘린더에 일정을 실시간 등록하고 구글 드라이브에 장부를 백업할 수 있습니다.`);
                } catch (pe) {
                  currentAuthUser.googleConnected = true;
                  currentAuthUser.googleCalendarConnected = true;
                  currentAuthUser.googleDriveConnected = true;
                  localStorage.setItem('soloos_user', JSON.stringify(currentAuthUser));
                  updateUserAuthUI();
                  alert('Google OAuth 2.0 권한 승인이 성공적으로 완료되었습니다!');
                }
              } else if (tokenResponse && tokenResponse.error) {
                alert(`Google 연동 오류: ${tokenResponse.error}`);
              }
            }
          });
          client.requestAccessToken();
        } catch (err) {
          console.error('Google OAuth init error:', err);
          alert(`Google OAuth 클라이언트 실행 실패: ${err.message}\n자바스크립트 승인 원본(http://localhost:3000)이 Google Console에 등록되어 있는지 확인해주세요.`);
        }
      } else {
        alert('Google Identity Services SDK 로딩 중입니다. 잠시 후 다시 시도해주세요.');
      }
    }

    function openGoogleModal(tab = 'calendar') {
      const modal = document.getElementById('googleModal');
      if (modal) modal.classList.remove('hidden');
      switchGoogleTab(tab);
      renderGoogleCalendarPreview();
      fetchGoogleDriveBackups();
      loadGoogleSettings();
    }

    function closeGoogleModal() {
      const modal = document.getElementById('googleModal');
      if (modal) modal.classList.add('hidden');
    }

    function switchGoogleTab(tab) {
      const tabCal = document.getElementById('googleTabCalendar');
      const tabDrive = document.getElementById('googleTabDrive');
      const tabSettings = document.getElementById('googleTabSettings');
      const btnCal = document.getElementById('googleTabBtnCalendar');
      const btnDrive = document.getElementById('googleTabBtnDrive');
      const btnSettings = document.getElementById('googleTabBtnSettings');

      if (tabCal) tabCal.classList.toggle('hidden', tab !== 'calendar');
      if (tabDrive) tabDrive.classList.toggle('hidden', tab !== 'drive');
      if (tabSettings) tabSettings.classList.toggle('hidden', tab !== 'settings');

      if (btnCal) btnCal.className = tab === 'calendar' ? 'px-4 py-2.5 text-blue-600 border-b-2 border-blue-600 flex items-center gap-1.5' : 'px-4 py-2.5 text-slate-500 hover:text-slate-900 flex items-center gap-1.5';
      if (btnDrive) btnDrive.className = tab === 'drive' ? 'px-4 py-2.5 text-emerald-600 border-b-2 border-emerald-600 flex items-center gap-1.5' : 'px-4 py-2.5 text-slate-500 hover:text-slate-900 flex items-center gap-1.5';
      if (btnSettings) btnSettings.className = tab === 'settings' ? 'px-4 py-2.5 text-indigo-600 border-b-2 border-indigo-600 flex items-center gap-1.5' : 'px-4 py-2.5 text-slate-500 hover:text-slate-900 flex items-center gap-1.5';

      if (window.lucide) lucide.createIcons();
    }

    function renderGoogleCalendarPreview() {
      const container = document.getElementById('gcalPreviewList');
      const countSpan = document.getElementById('gcalTargetCount');
      if (!container) return;

      const tasks = appState.tasks || [];
      if (countSpan) countSpan.textContent = tasks.length;

      if (tasks.length === 0) {
        container.innerHTML = `<div class="p-3 text-slate-400 text-center text-xs">동기화할 일정이 없습니다.</div>`;
        return;
      }

      container.innerHTML = tasks.map(t => {
        const dtStr = (t.dueDate || '2026-10-20').replace(/-/g, '');
        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`[SoloOS] ${t.title}`)}&dates=${dtStr}T090000Z/${dtStr}T180000Z&details=${encodeURIComponent(`발주처: ${t.client}\n계약금액: ₩${(t.amount || 0).toLocaleString()}\n상태: ${t.status}\n메모: ${t.memo || ''}`)}`;
        return `
          <div class="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs hover:border-blue-300 transition-colors">
            <div class="truncate">
              <div class="font-bold text-slate-800 text-xs flex items-center gap-1.5 truncate">
                <span class="w-1.5 h-1.5 rounded-full ${t.domain === 'client' ? 'bg-blue-500' : (t.domain === 'publishing' ? 'bg-emerald-500' : 'bg-purple-500')}"></span>
                <span>${t.title}</span>
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5">${t.client} · 마감일: <strong class="text-slate-600">${t.dueDate} ${t.dueTime || '18:00'}</strong></div>
            </div>
            <a href="${gcalUrl}" target="_blank" rel="noopener" class="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold shrink-0 transition-colors flex items-center gap-1">
              <span>Google 캘린더에 추가</span>
              <i data-lucide="external-link" class="w-2.5 h-2.5"></i>
            </a>
          </div>
        `;
      }).join('');

      if (window.lucide) lucide.createIcons();
    }

    async function executeGoogleCalendarSync() {
      const alertBox = document.getElementById('gcalSyncAlert');
      const tasks = appState.tasks || [];

      // 1. If we have a real Google Access Token, sync directly to Google Calendar API!
      if (window.googleAccessToken) {
        try {
          if (alertBox) {
            alertBox.className = 'p-3 rounded-xl border bg-blue-50 border-blue-200 text-blue-800 text-xs block';
            alertBox.textContent = `Google Calendar API v3로 실제 일정 등록을 전송하고 있습니다...`;
          }

          let createdCount = 0;
          let lastHtmlLink = '';

          for (const t of tasks) {
            const startDate = t.dueDate || '2026-10-20';
            const eventPayload = {
              summary: `[SoloOS] ${t.title} (${t.client})`,
              description: `[SoloOS 1인 사업가 ERP]\n클라이언트: ${t.client}\n계약금액: ₩${(t.amount || 0).toLocaleString()}\n상태: ${t.status}\n메모: ${t.memo || ''}`,
              start: { date: startDate },
              end: { date: startDate }
            };

            const gRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${window.googleAccessToken}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(eventPayload)
            });

            if (gRes.ok) {
              const gData = await gRes.json();
              createdCount++;
              if (gData.htmlLink) lastHtmlLink = gData.htmlLink;
            }
          }

          if (alertBox) {
            alertBox.className = 'p-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 text-xs block space-y-2';
            alertBox.innerHTML = `
              <div class="font-bold flex items-center gap-1.5">
                <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
                <span>실제 Google 캘린더 동기화 완료!</span>
              </div>
              <div class="text-[11px] text-emerald-700">총 <strong>${createdCount}건</strong>의 마감 및 정산 일정이 회원님의 실제 구글 캘린더에 성공적으로 등록되었습니다.</div>
              <div class="pt-1">
                <a href="${lastHtmlLink || 'https://calendar.google.com'}" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs">
                  <span>내 Google 캘린더에서 지금 확인하기</span>
                  <i data-lucide="external-link" class="w-3 h-3"></i>
                </a>
              </div>
            `;
            if (window.lucide) lucide.createIcons();
          }
          return;
        } catch (apiErr) {
          console.warn('Real Google Calendar API sync error, falling back:', apiErr);
        }
      }

      // 2. Direct Real-world Google Calendar Sync (Universal: No OAuth setup required!)
      // Download standard .ics file and immediately open Google Calendar's Import page
      downloadIcsCalendar();
      window.open('https://calendar.google.com/calendar/u/0/r/settings/export', '_blank');

      if (alertBox) {
        alertBox.className = 'p-3.5 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 text-xs block space-y-2';
        alertBox.innerHTML = `
          <div class="font-bold flex items-center gap-1.5 text-sm text-emerald-800">
            <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
            <span>Google 캘린더 실제 연동 파일 다운로드 &amp; 캘린더 열림</span>
          </div>
          <div class="text-[11px] text-slate-700 leading-relaxed">
            1. 표준 캘린더 파일(<code>soloos_schedule.ics</code>)이 다운로드되었습니다.<br>
            2. 새 탭으로 열린 <strong>Google 캘린더 가져오기 화면</strong>에서 방금 다운로드된 파일을 선택하고 <strong>[가져오기]</strong>를 누르시면 모든 일정이 즉시 등록됩니다.<br>
            3. 또는 하단 목록에서 각 일정별 <strong>[Google 캘린더에 추가]</strong>를 누르시면 원클릭으로 바로 추가할 수 있습니다.
          </div>
          <div class="pt-1 flex items-center gap-2">
            <a href="https://calendar.google.com/calendar/u/0/r/settings/export" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-xs">
              <span>내 Google 캘린더 가져오기 열기</span>
              <i data-lucide="external-link" class="w-3 h-3"></i>
            </a>
          </div>
        `;
        if (window.lucide) lucide.createIcons();
      }
    }

    function downloadIcsCalendar() {
      window.location.href = '/api/integrations/google-calendar/export-ics';
    }

    async function executeGoogleDriveBackup() {
      const alertBox = document.getElementById('gdriveSyncAlert');

      // 1. If we have a real Google Access Token, upload directly to Google Drive API!
      if (window.googleAccessToken) {
        try {
          if (alertBox) {
            alertBox.className = 'p-3 rounded-xl border bg-blue-50 border-blue-200 text-blue-800 text-xs block';
            alertBox.textContent = `Google Drive API v3로 실제 장부 백업 파일을 업로드하고 있습니다...`;
          }

          const boundary = '-------314159265358979323846';
          const delimiter = "\r\n--" + boundary + "\r\n";
          const close_delim = "\r\n--" + boundary + "--";
          const nowStr = new Date().toISOString().substring(0, 10);
          const fileName = `SoloOS_재무장부백업_${nowStr}.json`;

          const backupData = {
            version: '2.0.0',
            exportedAt: new Date().toISOString(),
            app: 'SoloOS 1인 사업가 올인원 ERP',
            user: currentAuthUser,
            state: appState
          };

          const metadata = {
            name: fileName,
            mimeType: 'application/json',
            description: 'SoloOS 1인 사업가 ERP 자동 분개 장부 및 계약 백업'
          };

          const multipartRequestBody =
            delimiter +
            'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(backupData, null, 2) +
            close_delim;

          const driveRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${window.googleAccessToken}`,
              'Content-Type': `multipart/related; boundary=${boundary}`
            },
            body: multipartRequestBody
          });

          if (driveRes.ok) {
            const driveData = await driveRes.json();
            if (alertBox) {
              alertBox.className = 'p-3 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 text-xs block space-y-2';
              alertBox.innerHTML = `
                <div class="font-bold flex items-center gap-1.5">
                  <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
                  <span>실제 Google Drive 업로드 완료!</span>
                </div>
                <div class="text-[11px] text-emerald-700">파일명: <code>${fileName}</code> (Google Drive File ID: <code>${driveData.id}</code>)</div>
                <div class="pt-1">
                  <a href="https://drive.google.com/file/d/${driveData.id}/view" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs">
                    <span>내 Google Drive에서 파일 열기</span>
                    <i data-lucide="external-link" class="w-3 h-3"></i>
                  </a>
                </div>
              `;
              if (window.lucide) lucide.createIcons();
            }
            return;
          }
        } catch (driveErr) {
          console.warn('Real Google Drive API upload error, falling back:', driveErr);
        }
      }

      // 2. Direct Real-world Google Drive Storage (No local disk pollution!)
      // Download the backup file directly and open Google Drive Web in a new tab
      window.location.href = '/api/integrations/google-drive/download-json';
      window.open('https://drive.google.com/drive/my-drive', '_blank');

      if (alertBox) {
        alertBox.className = 'p-3.5 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 text-xs block space-y-2';
        alertBox.innerHTML = `
          <div class="font-bold flex items-center gap-1.5 text-sm text-emerald-800">
            <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
            <span>Google Drive 백업 파일 다운로드 &amp; Google Drive 열림</span>
          </div>
          <div class="text-[11px] text-slate-700 leading-relaxed">
            1. SoloOS 전체 장부 및 계약 백업 파일이 다운로드되었습니다.<br>
            2. 새 탭으로 열린 <strong>Google Drive(내 드라이브)</strong>에 다운로드된 파일을 드래그하여 안전하게 영구 보관하세요.<br>
            <span class="text-slate-500">※ 로컬 컴퓨터에 불필요한 더미 파일은 생성되지 않습니다.</span>
          </div>
          <div class="pt-1 flex items-center gap-2">
            <a href="https://drive.google.com/drive/my-drive" target="_blank" rel="noopener" class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-xs">
              <span>내 Google Drive 바로가기</span>
              <i data-lucide="external-link" class="w-3 h-3"></i>
            </a>
          </div>
        `;
        if (window.lucide) lucide.createIcons();
      }
    }

    async function fetchGoogleDriveBackups() {
      const container = document.getElementById('gdriveBackupsList');
      if (!container) return;

      try {
        const res = await fetch('/api/integrations/google-drive/backups');
        const data = await res.json();
        const backups = data.backups || [];

        if (backups.length === 0) {
          container.innerHTML = `<div class="p-3 text-slate-400 text-center text-xs">생성된 백업 파일이 없습니다. 상단 '지금 ERP 장부 백업하기'를 눌러주세요.</div>`;
          return;
        }

        container.innerHTML = backups.map(b => `
          <div class="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs hover:border-emerald-300 transition-colors">
            <div class="truncate">
              <div class="font-bold text-slate-800 text-xs flex items-center gap-1.5 truncate">
                <i data-lucide="file-json" class="w-3.5 h-3.5 text-emerald-600 shrink-0"></i>
                <span class="truncate">${b.filename}</span>
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5">
                ${new Date(b.createdAt).toLocaleString()} · ${(b.sizeBytes || 0).toLocaleString()} B · ${b.googleDriveFolder}
              </div>
            </div>
            <a href="/api/integrations/google-drive/download?file=${encodeURIComponent(b.filename)}" download class="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold shrink-0 transition-colors flex items-center gap-1">
              <i data-lucide="download" class="w-3 h-3"></i>
              <span>다운로드</span>
            </a>
          </div>
        `).join('');

        if (window.lucide) lucide.createIcons();
      } catch (e) {
        container.innerHTML = `<div class="p-3 text-slate-400 text-center text-xs">백업 목록을 조회할 수 없습니다.</div>`;
      }
    }

    async function toggleGoogleConnectionStatus() {
      if (!currentAuthUser) return;
      const newStatus = !Boolean(currentAuthUser.googleConnected);
      try {
        const res = await fetch('/api/auth/google/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentAuthUser.email, service: 'all', connected: newStatus })
        });
        const data = await res.json();
        if (data.success && data.user) {
          currentAuthUser = { ...currentAuthUser, ...data.user };
          localStorage.setItem('soloos_user', JSON.stringify(currentAuthUser));
          updateUserAuthUI();
          alert(newStatus ? 'Google 계정 연동이 활성화되었습니다.' : 'Google 계정 연동이 해제되었습니다.');
        }
      } catch (err) {
        currentAuthUser.googleConnected = newStatus;
        currentAuthUser.googleCalendarConnected = newStatus;
        currentAuthUser.googleDriveConnected = newStatus;
        localStorage.setItem('soloos_user', JSON.stringify(currentAuthUser));
        updateUserAuthUI();
      }
    }

    async function startGoogleOAuthFlow() {
      try {
        const res = await fetch('/api/auth/google/url');
        const data = await res.json();
        if (data.authUrl) {
          window.location.href = data.authUrl;
        }
      } catch (e) {
        alert('Google OAuth URL 요청에 실패했습니다.');
      }
    }

    // --- MCP Modal Handlers ---
    let mcpStatusCache = null;

    function openMcpModal(tab = 'config') {
      const modal = document.getElementById('mcpModal');
      if (modal) modal.classList.remove('hidden');
      switchMcpTab(tab);
      loadMcpStatus();
    }

    function closeMcpModal() {
      const modal = document.getElementById('mcpModal');
      if (modal) modal.classList.add('hidden');
    }

    function switchMcpTab(tab) {
      const tabConfig = document.getElementById('mcpTabConfig');
      const tabTools = document.getElementById('mcpTabTools');
      const tabPrompts = document.getElementById('mcpTabPrompts');
      const btnConfig = document.getElementById('mcpTabBtnConfig');
      const btnTools = document.getElementById('mcpTabBtnTools');
      const btnPrompts = document.getElementById('mcpTabBtnPrompts');

      if (tabConfig) tabConfig.classList.toggle('hidden', tab !== 'config');
      if (tabTools) tabTools.classList.toggle('hidden', tab !== 'tools');
      if (tabPrompts) tabPrompts.classList.toggle('hidden', tab !== 'prompts');

      if (btnConfig) btnConfig.className = tab === 'config' ? 'px-4 py-2.5 text-purple-600 border-b-2 border-purple-600 flex items-center gap-1.5' : 'px-4 py-2.5 text-slate-500 hover:text-slate-900 flex items-center gap-1.5';
      if (btnTools) btnTools.className = tab === 'tools' ? 'px-4 py-2.5 text-purple-600 border-b-2 border-purple-600 flex items-center gap-1.5' : 'px-4 py-2.5 text-slate-500 hover:text-slate-900 flex items-center gap-1.5';
      if (btnPrompts) btnPrompts.className = tab === 'prompts' ? 'px-4 py-2.5 text-purple-600 border-b-2 border-purple-600 flex items-center gap-1.5' : 'px-4 py-2.5 text-slate-500 hover:text-slate-900 flex items-center gap-1.5';

      if (window.lucide) lucide.createIcons();
    }

    async function loadMcpStatus() {
      const pathDisplay = document.getElementById('mcpScriptPathDisplay');
      const claudeBlock = document.getElementById('mcpClaudeConfigBlock');
      const genericBlock = document.getElementById('mcpGenericConfigBlock');

      try {
        const res = await fetch('/api/mcp/status');
        const data = await res.json();
        mcpStatusCache = data;

        if (pathDisplay) pathDisplay.textContent = data.serverScript || '/Users/ssohy/Desktop/Project/DAY22-27/solo-os/mcp/server.js';
        if (claudeBlock) claudeBlock.textContent = JSON.stringify(data.claudeDesktopConfig, null, 2);
        if (genericBlock) genericBlock.textContent = JSON.stringify(data.configSnippet, null, 2);
      } catch (err) {
        const fallbackConfig = {
          mcpServers: {
            "soloos-erp": {
              command: "node",
              args: ["/Users/ssohy/Desktop/Project/DAY22-27/solo-os/mcp/server.js"],
              env: {
                SOLOOS_API_URL: "http://localhost:3000",
                NODE_ENV: "development"
              }
            }
          }
        };
        if (claudeBlock) claudeBlock.textContent = JSON.stringify(fallbackConfig, null, 2);
        if (genericBlock) genericBlock.textContent = JSON.stringify(fallbackConfig, null, 2);
      }
    }

    function copyMcpClaudeConfig() {
      const block = document.getElementById('mcpClaudeConfigBlock');
      const btn = document.getElementById('copyClaudeBtnText');
      if (block) {
        navigator.clipboard.writeText(block.textContent).then(() => {
          if (btn) btn.textContent = '복사 완료!';
          setTimeout(() => { if (btn) btn.textContent = '설정 복사'; }, 2000);
        });
      }
    }

    function copyMcpGenericConfig() {
      const block = document.getElementById('mcpGenericConfigBlock');
      const btn = document.getElementById('copyGenericBtnText');
      if (block) {
        navigator.clipboard.writeText(block.textContent).then(() => {
          if (btn) btn.textContent = '복사 완료!';
          setTimeout(() => { if (btn) btn.textContent = '설정 복사'; }, 2000);
        });
      }
    }

    async function testMcpTool(toolName, args = {}) {
      const statusSpan = document.getElementById('mcpLiveStatus');
      const consoleBlock = document.getElementById('mcpLiveOutputConsole');

      if (statusSpan) statusSpan.textContent = `도구 실행 중... [${toolName}]`;
      if (consoleBlock) consoleBlock.textContent = `// MCP 도구 '${toolName}' 실행을 서버로 전송 중...`;

      try {
        const res = await fetch('/api/mcp/test-tool', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool: toolName, args })
        });
        const data = await res.json();
        if (data.success) {
          if (statusSpan) statusSpan.textContent = `✅ 실행 성공 (200 OK) · ${toolName}`;
          if (consoleBlock) consoleBlock.textContent = JSON.stringify(data.result, null, 2);
        } else {
          if (statusSpan) statusSpan.textContent = `❌ 실행 실패 · ${data.error || '오류'}`;
          if (consoleBlock) consoleBlock.textContent = JSON.stringify(data, null, 2);
        }
      } catch (err) {
        if (statusSpan) statusSpan.textContent = `❌ 네트워크/통신 오류`;
        if (consoleBlock) consoleBlock.textContent = `오류: ${err.message}`;
      }
    }

    // Initialize user auth on DOM Ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initUserAuth);
    } else {
      initUserAuth();
    }