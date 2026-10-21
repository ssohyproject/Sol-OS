/**
 * SoloOS Core: UI Utilities & Helpers
 * Toast alerts, HTML sanitization, accounting plain language terms, PWS install, QR modal, Onboarding
 */

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


    function escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }


    function openOnboardingModal() {
      const modal = document.getElementById("onboardingModal");
      if (modal) {
        modal.classList.remove("hidden");
        if (window.lucide && typeof lucide.createIcons === "function") {
          lucide.createIcons();
        }
      }
    }
    function closeOnboardingModal() {
      const modal = document.getElementById("onboardingModal");
      if (modal) modal.classList.add("hidden");
      sessionStorage.setItem("soloos_mode_selected", "true");
      localStorage.setItem("soloos_mode_selected", "true");
    }
    function selectOnboardingMode(mode) {
      switchViewMode(mode);
      closeOnboardingModal();
      sessionStorage.setItem("soloos_mode_selected", "true");
      localStorage.setItem("soloos_mode_selected", "true");
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



// Expose utilities to global window
window.showToast = showToast;
window.escapeHtml = escapeHtml;
window.togglePlainLanguageMode = togglePlainLanguageMode;
window.applyPlainLanguageTerms = applyPlainLanguageTerms;
window.installPWS = installPWS;
window.openOnboardingModal = openOnboardingModal;
window.closeOnboardingModal = closeOnboardingModal;
window.selectOnboardingMode = selectOnboardingMode;
window.openQrModal = openQrModal;
window.closeQrModal = closeQrModal;
window.copyAppUrl = copyAppUrl;
