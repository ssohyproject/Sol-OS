/**
 * SoloOS Main Application Controller (Bootstrap Entry Point)
 * Coordinates modular core, pages, modals, and initiates the application lifecycle
 */

// Initialize user auth and UI on DOM Ready
// Initialize user auth on DOM Ready
    function initSoloOSApp() {
      // 1. Initial State Check (localStorage 저장 데이터 우선 복원 -> 없으면 세션 데모 또는 초기 상태)
      const savedWorkspace = loadSavedWorkspaceFromLocal();
      const isDemoActive = sessionStorage.getItem('soloos_demo_active') === 'true';

      if (savedWorkspace) {
        appState.isDemoMode = Boolean(savedWorkspace.isDemoMode);
        if (appState.isDemoMode) {
          sessionStorage.setItem('soloos_demo_active', 'true');
        }
        loadWorkspaceFromData(savedWorkspace);
        if (Array.isArray(savedWorkspace.auditTimeline)) {
          appState.auditTimeline = savedWorkspace.auditTimeline;
        }
      } else if (isDemoActive) {
        appState.isDemoMode = true;
        loadWorkspaceFromData(SAMPLE_WORKSPACE);
      } else {
        appState.isDemoMode = false;
        loadWorkspaceFromData(EMPTY_WORKSPACE);
      }

      isAppBootstrapping = false;
      saveCurrentWorkspaceData();

      // 2. Render all UI components
      refreshAllUI();
      applyPlainLanguageTerms();
      switchSubView('overview');

      // 3. Update overlay and guest banner
      syncGuestOverlayVisibility();
      updateGuestBannerUI(appState.isDemoMode);

      // 4. 처음 접속 시 대시보드형 vs 대화형 모드 선택 팝업 표시
      if (!sessionStorage.getItem('soloos_mode_selected') && !localStorage.getItem('soloos_mode_selected')) {
        setTimeout(openOnboardingModal, 150);
      }

      // 5. Auth initialization
      initUserAuth();
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSoloOSApp);
    } else {
      initSoloOSApp();
    }
