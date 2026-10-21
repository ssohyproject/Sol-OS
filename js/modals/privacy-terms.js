/**
 * SolOS Modal: Terms of Service & Privacy Policy Modal
 * Mandatory/optional checkboxes agreement, tab switching, statutory disclosures
 */

    // 5. 회원가입 개인정보 및 이용약관 동의 컨트롤러
    function toggleAllAgreements(masterEl) {
      const isChecked = masterEl.checked;
      const termsEl = document.getElementById('regAgreeTerms');
      const privacyEl = document.getElementById('regAgreePrivacy');
      const mktEl = document.getElementById('regAgreeMarketing');
      if (termsEl) termsEl.checked = isChecked;
      if (privacyEl) privacyEl.checked = isChecked;
      if (mktEl) mktEl.checked = isChecked;
    }

    function checkIndividualAgreements() {
      const masterEl = document.getElementById('regAgreeAll');
      const termsEl = document.getElementById('regAgreeTerms');
      const privacyEl = document.getElementById('regAgreePrivacy');
      const mktEl = document.getElementById('regAgreeMarketing');
      if (masterEl && termsEl && privacyEl && mktEl) {
        masterEl.checked = (termsEl.checked && privacyEl.checked && mktEl.checked);
      }
    }

    function openPrivacyTermsModal(tab) {
      const modal = document.getElementById('privacyTermsModal');
      if (!modal) return;
      modal.classList.remove('hidden');
      switchPrivacyTermsTab(tab || 'terms');
      if (window.lucide) lucide.createIcons();
    }

    function closePrivacyTermsModal() {
      const modal = document.getElementById('privacyTermsModal');
      if (modal) modal.classList.add('hidden');
    }

    function switchPrivacyTermsTab(tab) {
      const tabs = ['terms', 'privacy', 'marketing'];
      tabs.forEach(t => {
        const btn = document.getElementById(`ptmTabBtn-${t}`);
        const content = document.getElementById(`ptmTabContent-${t}`);
        if (btn) {
          if (t === tab) {
            btn.className = 'flex-1 py-1.5 rounded-lg bg-white text-slate-900 shadow-xs transition-all font-bold';
          } else {
            btn.className = 'flex-1 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all font-medium';
          }
        }
        if (content) {
          if (t === tab) {
            content.classList.remove('hidden');
          } else {
            content.classList.add('hidden');
          }
        }
      });
      if (window.lucide) lucide.createIcons();
    }

    




// Expose privacy terms functions to global window
window.toggleAllAgreements = toggleAllAgreements;
window.checkIndividualAgreements = checkIndividualAgreements;
window.openPrivacyTermsModal = openPrivacyTermsModal;
window.closePrivacyTermsModal = closePrivacyTermsModal;
window.switchPrivacyTermsTab = switchPrivacyTermsTab;
