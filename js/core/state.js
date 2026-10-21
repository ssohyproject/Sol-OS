/**
 * SoloOS Core: State Management & Workspace Sync
 * Central reactive state (appState), demo vs guest storage, persistence, and refresh triggers
 */

    // ==================== WORKSPACE DEFINITIONS (샘플 vs 비로그인 초기 상태) ====================
    const SAMPLE_WORKSPACE = {
      workingCapital: 14200000,
      monthlyFixedExpense: 2730000,
      taxSaved: 580000,
      transactions: [
        { id: 1, date: "2026-10-12", domain: "client", title: "(주)테크솔루션즈 전자세금계산서 발행", category: "세금계산서매출(VAT분리)", gross: 3000000, tax: 300000, net: 3300000, status: "세금계산서" },
        { id: 2, date: "2026-10-10", domain: "publishing", title: "교보eBook 9월 정산 인세 (3.3%)", category: "3.3%사업소득매출", gross: 1200000, tax: 39600, net: 1160400, status: "원천징수영수증" },
        { id: 3, date: "2026-10-08", domain: "knowledge", title: "인프런 스타트업 기술특강료 (8.8%)", category: "8.8%기타소득매출", gross: 1000000, tax: 88000, net: 912000, status: "원천징수영수증" },
        { id: 4, date: "2026-10-05", domain: "client", title: "AWS 클라우드 서버 이용료", category: "지급수수료/통신", gross: -142000, tax: -14200, net: -156200, status: "신용카드전표" },
        { id: 5, date: "2026-10-01", domain: "operation", title: "작업실 월 임대료 및 관리비", category: "지급임차료", gross: -850000, tax: 0, net: -850000, status: "계산서(면세)" },
        { id: 6, date: "2026-09-25", domain: "operation", title: "패스트파이브 공유오피스 월 임차료 (고정비)", category: "지급임차료(매입공제)", gross: -1000000, tax: -100000, net: -1100000, status: "세금계산서", isFixedExpense: true, paymentDay: 25 },
        { id: 7, date: "2026-09-25", domain: "operation", title: "Adobe/Figma/GitHub/Notion 등 업무 SW 구독료 (고정비)", category: "지급수수료/SaaS", gross: -480000, tax: 0, net: -480000, status: "신용카드전표", isFixedExpense: true, paymentDay: 25 },
        { id: 8, date: "2026-09-25", domain: "operation", title: "KT 기업인터넷 & 업무용 모바일 회선 (고정비)", category: "통신비(매입공제)", gross: -136364, tax: -13636, net: -150000, status: "세금계산서", isFixedExpense: true, paymentDay: 25 },
        { id: 9, date: "2026-10-10", domain: "operation", title: "국민연금 & 건강보험 1인사업자 납부 (고정비)", category: "제세공과금/4대보험", gross: -400000, tax: 0, net: -400000, status: "신용카드전표", isFixedExpense: true, paymentDay: 10 },
        { id: 10, date: "2026-09-25", domain: "operation", title: "사업장 기본 운영비 및 세무 기장료 (고정비)", category: "사업소모품비/수수료", gross: -545455, tax: -54545, net: -600000, status: "세금계산서", isFixedExpense: true, paymentDay: 25 }
      ],
      tasks: [
        { id: 1, domain: "client", client: "테크솔루션즈", title: "MVP 프론트엔드 반응형 마무리", dueDate: "2026-10-18", dueTime: "18:00", priority: "높음", status: "진행중", amount: 2500000, memo: "결제 모듈 최종 API 테스트 및 반응형 모바일 검수 완료 후 납품", completed: false },
        { id: 2, domain: "publishing", client: "디지털북스", title: "타입스크립트 완벽 가이드 원고 4장 교정", dueDate: "2026-10-22", dueTime: "15:00", priority: "보통", status: "대기", amount: 1200000, memo: "코드 블록 문법 검증 및 예제 실행 테스트", completed: false },
        { id: 3, domain: "knowledge", client: "자체 런칭", title: "노션 프리랜서 회계 템플릿 배포 준비", dueDate: "2026-10-26", dueTime: "12:00", priority: "보통", status: "진행중", amount: 800000, memo: "템플릿 상세 페이지 가이드 작성", completed: false },
        { id: 4, domain: "client", client: "글로벌이커머스", title: "프로모션 결제 모듈 연동 (정산 확인 건)", dueDate: "2026-10-14", dueTime: "19:00", priority: "높음", status: "지연검수", amount: 1200000, memo: "상법 제69조 14일 검수 도래 건 잔금 확인", completed: false }
      ],
      clients: [
        {
          id: 1,
          name: "(주)테크솔루션즈",
          shortName: "테크솔루션즈",
          tier: "우수",
          bizNum: "120-88-12345",
          settlementCycle: "매월 말일 마감 익월 15일",
          manager: "김영민 이사 (010-9123-4567)",
          totalRevenue: 8500000,
          completedCount: 3,
          avgDelay: "0일 (즉시 결제)",
          avgRevision: 1.1,
          spentHours: 60,
          hourlyRate: 75000,
          specialClause: "",
          checklist: [
            { id: "c1", label: "사업자등록증", checked: true },
            { id: "c2", label: "통장 사본", checked: true },
            { id: "c3", label: "견적서 원본", checked: true },
            { id: "c4", label: "용역 계약서", checked: true },
            { id: "c5", label: "비밀유지계약(NDA)", checked: true }
          ]
        },
        {
          id: 2,
          name: "디지털북스 출판사",
          shortName: "디지털북스",
          tier: "양호",
          bizNum: "214-85-67890",
          settlementCycle: "발행 후 익익월 10일",
          manager: "박서연 편집장 (010-3456-7890)",
          totalRevenue: 3400000,
          completedCount: 2,
          avgDelay: "2일",
          avgRevision: 2.0,
          spentHours: 40,
          hourlyRate: 60000,
          specialClause: "2쇄 인세율 10% 증액 특약",
          checklist: [
            { id: "c1", label: "사업자등록증", checked: true },
            { id: "c2", label: "통장 사본", checked: true },
            { id: "c3", label: "출판 계약서", checked: true },
            { id: "c4", label: "배타적발행권 설정 계약서", checked: true }
          ]
        },
        {
          id: 3,
          name: "글로벌이커머스(주)",
          shortName: "글로벌이커머스",
          tier: "주의",
          bizNum: "105-87-34567",
          settlementCycle: "검수 완료 후 익월 말일",
          manager: "최재호 팀장 (010-5678-1234)",
          totalRevenue: 5200000,
          completedCount: 1,
          avgDelay: "5일 (검수 지연 빈번)",
          avgRevision: 3.5,
          spentHours: 85,
          hourlyRate: 50000,
          specialClause: "지체상금 1일 0.1% 상한 (표준특약 반영 권장)",
          checklist: [
            { id: "c1", label: "사업자등록증", checked: true },
            { id: "c2", label: "통장 사본", checked: true },
            { id: "c3", label: "표준 용역계약서", checked: true }
          ]
        }
      ],
      receivables: [
        { id: 1, client: "글로벌이커머스(주)", clientName: "글로벌이커머스(주)", project: "프로모션 결제 모듈 연동 (잔금)", itemTitle: "프로모션 결제 모듈 연동 (잔금)", amount: 1200000, dueDate: "2026-10-14", delayDays: 5, status: "지연", statusType: "delayed", type: "잔금", contact: "최재호 팀장 (010-5678-1234)", deferred: false },
        { id: 2, client: "(주)테크솔루션즈", clientName: "(주)테크솔루션즈", project: "외주 개발 1차 잔금 입금 확인", itemTitle: "외주 개발 1차 잔금 입금 확인", amount: 2500000, dueDate: "2026-10-25", delayDays: -6, status: "예정", statusType: "normal", type: "잔금", contact: "김영민 이사 (010-9123-4567)", deferred: false },
        { id: 3, client: "디지털북스 출판사", clientName: "디지털북스 출판사", project: "기술서적 4장 감수료 정산", itemTitle: "기술서적 4장 감수료 정산", amount: 700000, dueDate: "2026-10-28", delayDays: -9, status: "예정", statusType: "normal", type: "원고료", contact: "박서연 편집장 (010-3456-7890)", deferred: false }
      ],
      contracts: [
        {
          id: "c_demo_1",
          projectName: "프로모션 결제 모듈 연동 (정산 확인 건)",
          clientName: "글로벌이커머스",
          totalAmount: 1200000,
          unpaidAmount: 1200000,
          deliveryDate: "2026-10-14",
          inspectionDate: "2026-10-14",
          status: "signed",
          statusText: "체결 완료",
          stageText: "과업 진행 중 (납품 대기)",
          stageType: "inspecting",
          templateName: "표준 용역계약서"
        },
        {
          id: "c_demo_2",
          projectName: "MVP 프론트엔드 반응형 마무리",
          clientName: "테크솔루션즈",
          totalAmount: 2500000,
          unpaidAmount: 2500000,
          deliveryDate: "2026-10-18",
          inspectionDate: "2026-10-25",
          status: "signed",
          statusText: "체결 완료",
          stageText: "과업 진행 중 (납품 대기)",
          stageType: "inspecting",
          templateName: "표준 용역계약서"
        },
        {
          id: "c_demo_3",
          projectName: "외주 개발 1차 잔금 입금 확인 (+₩2.5M)",
          clientName: "(주)테크솔루션즈",
          totalAmount: 2500000,
          unpaidAmount: 2500000,
          deliveryDate: "2026-10-25",
          inspectionDate: "2026-10-25",
          status: "signed",
          statusText: "체결 완료",
          stageText: "과업 진행 중 (납품 대기)",
          stageType: "inspecting",
          templateName: "표준 용역계약서"
        }
      ]
    };

    const EMPTY_WORKSPACE = {
      workingCapital: 0,
      monthlyFixedExpense: 0,
      taxSaved: 0,
      transactions: [],
      tasks: [],
      clients: [],
      receivables: [],
      contracts: []
    };

    // Initial State: 첫 접속 시 비로그인 보호 모드(샘플 데이터 적용 전)로 안전하게 초기화
    const appState = {
      viewMode: "dashboard",
      plainLanguage: true,
      currentWorkstream: "all",
      workingCapital: 0,
      monthlyFixedExpense: 0,
      taxSaved: 0,
      scheduleBufferEnabled: false,
      scheduleViewMode: "calendar",
      clientDeferred: false,
      isDemoMode: false,
      transactions: [],
      tasks: [],
      clients: [],
      receivables: [],
      contracts: []
    };

let cashflowChartInstance = null;
let calYear = 2026;
let calMonth = 9; // 0-indexed: 9 = 10월
let selectedCalDate = null; // null: 전체 일정 표시, 'YYYY-MM-DD': 해당 날짜 필터
let isLedgerBulkEditing = false;

const WORKSPACE_STORAGE_KEY = "soloos_workspace_state_v1";
let isAppBootstrapping = true;
    function hasActiveWorkspaceData() {
      return Boolean(
        appState.isDemoMode ||
        Number(appState.workingCapital || 0) > 0 ||
        (appState.transactions && appState.transactions.length > 0) ||
        (appState.tasks && appState.tasks.length > 0) ||
        (appState.clients && appState.clients.length > 0) ||
        (appState.receivables && appState.receivables.length > 0) ||
        (appState.contracts && appState.contracts.length > 0)
      );
    }

    function syncGuestOverlayVisibility() {
      const overlay = document.getElementById("cashflowGuestOverlay");
      if (!overlay) return;
      if (appState.isDemoMode || isUserLoggedIn() || hasActiveWorkspaceData()) {
        overlay.classList.add("hidden");
      } else {
        overlay.classList.remove("hidden");
      }
    }

    function saveCurrentWorkspaceData() {
      if (isAppBootstrapping) return;
      try {
        const payload = {
          isDemoMode: Boolean(appState.isDemoMode),
          workingCapital: Number(appState.workingCapital || 0),
          monthlyFixedExpense: Number(appState.monthlyFixedExpense || 0),
          taxSaved: Number(appState.taxSaved || 0),
          transactions: appState.transactions || [],
          tasks: appState.tasks || [],
          clients: appState.clients || [],
          receivables: appState.receivables || [],
          contracts: appState.contracts || [],
          auditTimeline: appState.auditTimeline || [],
          savedAt: new Date().toISOString()
        };
        localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(payload));
        syncGuestOverlayVisibility();
      } catch (e) {
        console.warn("[SoloOS] Failed to save workspace to localStorage:", e);
      }
    }

    function loadSavedWorkspaceFromLocal() {
      try {
        const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      } catch (e) {
        console.warn("[SoloOS] Failed to load workspace from localStorage:", e);
      }
      return null;
    }

    function renderTasks() {
      if (typeof renderScheduleTasks === "function") renderScheduleTasks();
      if (typeof renderMonthlyCalendar === "function") renderMonthlyCalendar();
      if (typeof renderFullScheduleTasks === "function") renderFullScheduleTasks();
      if (typeof renderFullMonthlyCalendar === "function") renderFullMonthlyCalendar();
    }

    function applyWorkspaceData(authUser, forceSample = false) {
      if (forceSample) {
        loadSampleDemoWorkspace();
      } else {
        syncGuestOverlayVisibility();
        updateGuestBannerUI(appState.isDemoMode);
        refreshAllUI();
      }
    }

    function isUserLoggedIn() {
      return Boolean(currentAuthUser && currentAuthUser.id && currentAuthUser.id !== "usr_guest" && currentAuthUser.email);
    }

    function normalizeReceiptStatus(status) {
      if (!status) return "";
      const s = String(status).trim();
      if (s === "세금계산서" || s === "전자세금계산서" || s === "세금통장분리보관" || s === "고정비/공제" || s === "VAT예치필수") return "세금계산서";
      if (s === "계산서(면세)" || s === "계산서" || s === "계산서확인") return "계산서(면세)";
      if (s === "신용카드전표" || s === "카드매출전표" || s === "공제영수증" || s === "적격증빙" || s === "고정비/경비" || s === "고정비/소득공제" || s.includes("카드")) return "신용카드전표";
      if (s === "현금영수증") return "현금영수증";
      if (s === "원천징수영수증" || s === "원천징수완료" || s.includes("원천") || s.includes("필요경비")) return "원천징수영수증";
      if (s === "간이영수증") return "간이영수증";
      if (s === "정산완료" || s === "수기분개완료" || s === "영수증인증") return "";
      return s;
    }

    function loadWorkspaceFromData(src) {
      if (!src) return;
      appState.workingCapital = Number(src.workingCapital || 0);
      appState.monthlyFixedExpense = Number(src.monthlyFixedExpense || 0);
      appState.taxSaved = Number(src.taxSaved || 0);
      const rawTx = JSON.parse(JSON.stringify(src.transactions || []));
      appState.transactions = rawTx.map(t => ({
        ...t,
        status: normalizeReceiptStatus(t.status)
      }));
      appState.tasks = JSON.parse(JSON.stringify(src.tasks || []));
      appState.clients = JSON.parse(JSON.stringify(src.clients || []));
      const rawRec = JSON.parse(JSON.stringify(src.receivables || []));
      appState.receivables = rawRec.map(r => ({
        ...r,
        clientName: r.clientName || r.client || '',
        client: r.client || r.clientName || '',
        itemTitle: r.itemTitle || r.project || '',
        project: r.project || r.itemTitle || '',
        statusType: r.statusType || (r.status === '지연' || (r.delayDays && r.delayDays > 0) ? 'delayed' : 'normal'),
        status: r.status || (r.statusType === 'delayed' ? '지연' : '예정'),
        amount: Number(r.amount || 0),
        deferred: Boolean(r.deferred)
      }));
      appState.contracts = JSON.parse(JSON.stringify(src.contracts || []));
    }

    // Comprehensive UI Refresh function (모든 서브뷰 및 위젯 상태 동기화)
    function refreshAllUI() {
      try {
        if (typeof updateKPICards === "function") updateKPICards();
      } catch (e) {
        console.warn("[refreshAllUI] updateKPICards error:", e);
      }
      try {
        if (typeof updateVisualStatements === "function") updateVisualStatements();
      } catch (e) {
        console.warn("[refreshAllUI] updateVisualStatements error:", e);
      }
      try {
        if (typeof renderMonthlyCalendar === "function") renderMonthlyCalendar();
      } catch (e) {
        console.warn("[refreshAllUI] renderMonthlyCalendar error:", e);
      }
      try {
        if (typeof renderScheduleTasks === "function") renderScheduleTasks();
      } catch (e) {
        console.warn("[refreshAllUI] renderScheduleTasks error:", e);
      }
      try {
        if (typeof renderFullMonthlyCalendar === "function") renderFullMonthlyCalendar();
      } catch (e) {
        console.warn("[refreshAllUI] renderFullMonthlyCalendar error:", e);
      }
      try {
        if (typeof renderFullScheduleTasks === "function") renderFullScheduleTasks();
      } catch (e) {
        console.warn("[refreshAllUI] renderFullScheduleTasks error:", e);
      }
      try {
        if (typeof renderLedgerTable === "function") renderLedgerTable();
      } catch (e) {
        console.warn("[refreshAllUI] renderLedgerTable error:", e);
      }
      try {
        if (typeof renderClientList === "function") renderClientList();
        if (typeof renderClientDetail === "function") {
          const cid = typeof selectedClientId !== "undefined" && selectedClientId ? selectedClientId : (appState.clients && appState.clients[0] ? appState.clients[0].id : null);
          if (cid) {
            selectedClientId = cid;
            renderClientDetail(cid);
          }
        }
      } catch (e) {
        console.warn("[refreshAllUI] client views error:", e);
      }
      try {
        if (typeof renderReceivablesTable === "function") renderReceivablesTable();
      } catch (e) {
        console.warn("[refreshAllUI] renderReceivablesTable error:", e);
      }
      try {
        if (typeof renderContractProjectsTable === "function") renderContractProjectsTable();
      } catch (e) {
        console.warn("[refreshAllUI] renderContractProjectsTable error:", e);
      }
      try {
        if (typeof renderLegalProtectionDashboard === "function") renderLegalProtectionDashboard();
      } catch (e) {
        console.warn("[refreshAllUI] renderLegalProtectionDashboard error:", e);
      }
      try {
        if (typeof renderKanbanBoard === "function") renderKanbanBoard();
      } catch (e) {
        console.warn("[refreshAllUI] renderKanbanBoard error:", e);
      }
      try {
        if (typeof renderGanttTimeline === "function") renderGanttTimeline();
      } catch (e) {
        console.warn("[refreshAllUI] renderGanttTimeline error:", e);
      }
      try {
        if (typeof renderFixedExpenseScheduleRows === "function") renderFixedExpenseScheduleRows();
      } catch (e) {
        console.warn("[refreshAllUI] renderFixedExpenseScheduleRows error:", e);
      }
      try {
        if (typeof renderSettlementView === "function") renderSettlementView();
      } catch (e) {
        console.warn("[refreshAllUI] renderSettlementView error:", e);
      }
      try {
        if (typeof renderTaxView === "function") renderTaxView();
      } catch (e) {
        console.warn("[refreshAllUI] renderTaxView error:", e);
      }
      try {
        if (typeof initChart === "function") initChart();
        if (typeof updateChartData === "function") updateChartData();
      } catch (e) {
        console.warn("[refreshAllUI] chart error:", e);
      }
      try {
        if (typeof applyPlainLanguageTerms === "function") applyPlainLanguageTerms();
      } catch (e) {
        console.warn("[refreshAllUI] applyPlainLanguageTerms error:", e);
      }
      if (!isLedgerBulkEditing) {
        saveCurrentWorkspaceData();
      }
      syncGuestOverlayVisibility();
      if (window.lucide && typeof lucide.createIcons === "function") {
        lucide.createIcons();
      }
    }

    function loadSampleDemoWorkspace() {
      appState.isDemoMode = true;
      sessionStorage.setItem("soloos_demo_active", "true");
      loadWorkspaceFromData(SAMPLE_WORKSPACE);

      const overlay = document.getElementById("cashflowGuestOverlay");
      if (overlay) overlay.classList.add("hidden");

      updateGuestBannerUI(true);
      refreshAllUI();
      saveCurrentWorkspaceData();
      showToast("가상 샘플 데이터(₩14,200,000 및 4대 과업·고정비)가 완벽히 적용되었습니다.");
    }

    function clearToGuestProtectedState() {
      appState.isDemoMode = false;
      sessionStorage.removeItem("soloos_demo_active");
      loadWorkspaceFromData(EMPTY_WORKSPACE);

      const overlay = document.getElementById("cashflowGuestOverlay");
      if (overlay) overlay.classList.remove("hidden");

      updateGuestBannerUI(false);
      refreshAllUI();
      saveCurrentWorkspaceData();
      showToast("샘플 데이터를 비우고 초기 화면으로 전환했습니다.");
    }

    function startWithSampleDemo() {
      loadSampleDemoWorkspace();
      closeOnboardingModal();
    }

    function updateGuestBannerUI(isDemo) {
      const banner = document.getElementById("guestProtectionBanner");
      if (!banner) return;
      const isLoggedIn = isUserLoggedIn();
      if (isLoggedIn) {
        banner.classList.add("hidden");
        return;
      }
      banner.classList.remove("hidden");
      if (isDemo) {
        banner.innerHTML = `
          <div class="flex items-center justify-between text-[11px]">
            <span class="text-indigo-600 font-bold flex items-center gap-1">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              체험 둘러보기 중
            </span>
            <span class="text-[9px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">샘플</span>
          </div>
          <p class="text-[10.5px] text-slate-500 leading-tight">가상 샘플 데이터가 표시 중입니다.</p>
          <button type="button" onclick="clearToGuestProtectedState()" class="w-full py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-[11px] font-bold border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 transition-all">
            <i data-lucide="rotate-ccw" class="w-3 h-3 text-slate-400"></i>
            <span>데이터 비우기</span>
          </button>
        `;
      } else {
        banner.innerHTML = `
          <p class="text-[11px] text-slate-500 leading-relaxed break-keep font-medium">
            로그인하여 나만의 워크스페이스를 시작하세요.
          </p>
          <button type="button" onclick="loadSampleDemoWorkspace()" class="w-full py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-brand-600 text-[11px] font-bold border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 transition-all">
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-amber-500"></i>
            <span>샘플 데이터 복구</span>
          </button>
        `;
      }
      if (window.lucide && typeof lucide.createIcons === "function") {
        lucide.createIcons();
      }
    }


window.addEventListener('beforeunload', () => {
  if (!isLedgerBulkEditing) {
    saveCurrentWorkspaceData();
  }
});

// Expose state and state helpers to global window
window.SAMPLE_WORKSPACE = SAMPLE_WORKSPACE;
window.EMPTY_WORKSPACE = EMPTY_WORKSPACE;
window.appState = appState;
window.WORKSPACE_STORAGE_KEY = WORKSPACE_STORAGE_KEY;
window.hasActiveWorkspaceData = hasActiveWorkspaceData;
window.syncGuestOverlayVisibility = syncGuestOverlayVisibility;
window.saveCurrentWorkspaceData = saveCurrentWorkspaceData;
window.loadSavedWorkspaceFromLocal = loadSavedWorkspaceFromLocal;
window.applyWorkspaceData = applyWorkspaceData;
window.renderTasks = renderTasks;
window.loadSampleDemoWorkspace = loadSampleDemoWorkspace;
window.clearToGuestProtectedState = clearToGuestProtectedState;
window.startWithSampleDemo = startWithSampleDemo;
window.refreshAllUI = refreshAllUI;
