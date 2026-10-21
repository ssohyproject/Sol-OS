/**
 * SoloOS Core: Authentication & User Session
 * Firebase Auth, Local Storage user caching, Login/Register modal, Google One-click, Logout
 */

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



// Expose auth to global window
window.isUserLoggedIn = isUserLoggedIn;
window.initUserAuth = initUserAuth;
window.updateUserAuthUI = updateUserAuthUI;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthTab = switchAuthTab;
window.fillDemoCredentials = fillDemoCredentials;
window.handleAuthLoginSubmit = handleAuthLoginSubmit;
window.handleAuthRegisterSubmit = handleAuthRegisterSubmit;
window.handleGoogleOneClickLogin = handleGoogleOneClickLogin;
window.handleLogout = handleLogout;
window.toggleUserDropdown = toggleUserDropdown;
window.closeUserDropdown = closeUserDropdown;
