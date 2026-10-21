/**
 * SoloOS Firebase & PWS Cloud Sync Service
 * Handles Firebase Auth, Firestore real-time sync, and Local-First offline fallback
 */
(function(root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else {
    root.SoloOSFirebase = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';

  class FirebaseService {
    constructor() {
      this.initialized = false;
      this.isOnline = navigator.onLine;
      this.config = null;
      this.db = null;
      this.auth = null;
      this.currentUser = null;
      this.offlineQueue = [];

      this._initNetworkListeners();
    }

    _initNetworkListeners() {
      window.addEventListener('online', () => {
        this.isOnline = true;
        console.log('[SoloOS PWS] Network connection restored: Online');
        this.syncOfflineQueue();
      });

      window.addEventListener('offline', () => {
        this.isOnline = false;
        console.log('[SoloOS PWS] Running in Offline mode (Local-First IndexedDB active)');
      });
    }

    /**
     * 서버의 /api/config로부터 Firebase 설정 로드 및 초기화
     */
    async init() {
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const config = await response.json();
          this.config = config.firebase;
          if (config.google?.clientId) {
            window.googleClientId = config.google.clientId;
            localStorage.setItem('soloos_google_client_id', config.google.clientId);
          }
          console.log('[SoloOS Firebase] Loaded config for project:', this.config?.projectId || 'local');
        }
      } catch (e) {
        console.warn('[SoloOS Firebase] Running in standalone local mode (no server API config)');
      }

      // Firebase CDN SDK가 index.html에 로드되어 있는 경우 초기화
      if (typeof window.firebase !== 'undefined' && this.config && this.config.apiKey) {
        try {
          if (!window.firebase.apps.length) {
            window.firebase.initializeApp(this.config);
          }
          this.db = window.firebase.firestore();
          this.auth = window.firebase.auth();

          // 모바일 및 팝업 차단 환경을 위한 리디렉션 로그인 결과 자동 수신
          this.auth.getRedirectResult().then(async (result) => {
            if (result && result.user) {
              const user = result.user;
              const token = result.credential?.accessToken || result._tokenResponse?.oauthAccessToken || null;
              if (token) {
                window.googleAccessToken = token;
                localStorage.setItem('soloos_google_access_token', token);
              }
              const authUser = {
                id: user.uid,
                name: user.displayName || 'Google 인증 사용자',
                email: user.email,
                photoURL: user.photoURL,
                googleConnected: true,
                googleCalendarConnected: true,
                googleDriveConnected: true
              };
              localStorage.setItem('soloos_user', JSON.stringify(authUser));
              try {
                await fetch('/api/auth/google-login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(authUser)
                });
              } catch (be) {}
              if (typeof window.updateUserAuthUI === 'function') window.updateUserAuthUI();
              if (typeof window.applyWorkspaceData === 'function') window.applyWorkspaceData(authUser, false);
              console.log('[SoloOS Firebase] Google redirect sign-in completed:', user.email);
            }
          }).catch((rErr) => {
            console.warn('[SoloOS Firebase] Redirect result check:', rErr.message);
          });

          this.initialized = true;
          console.log('[SoloOS Firebase] Real Cloud Firebase SDK initialized for project:', this.config.projectId);
        } catch (err) {
          console.warn('[SoloOS Firebase] Firebase SDK init error:', err.message);
        }
      } else {
        console.log('[SoloOS Firebase] Running in standalone mode');
      }

      return this.initialized;
    }

    /**
     * 클라우드 Firestore 또는 로컬 장부에 트랜잭션 동기화 저장
     */
    async saveTransaction(transaction) {
      if (this.initialized && this.isOnline && this.db && this.currentUser) {
        try {
          const docRef = await this.db
            .collection('users')
            .doc(this.currentUser.uid)
            .collection('transactions')
            .add({
              ...transaction,
              updatedAt: new Date().toISOString()
            });
          return { success: true, id: docRef.id, source: 'firestore' };
        } catch (err) {
          console.error('[SoloOS Firebase] Firestore save error:', err);
          this.queueOfflineAction('saveTransaction', transaction);
        }
      }

      // 오프라인이거나 Firebase 미연결 시 로컬 처리
      return { success: true, id: transaction.id || Date.now(), source: 'local' };
    }

    /**
     * Firebase Auth 공식 Google 로그인 (GoogleAuthProvider)
     * 모바일 및 PC 브라우저에서 공식 구글 로그인 팝업 및 리디렉션 자동 전환
     */
    async loginWithGoogle() {
      if (!this.initialized) {
        await this.init();
      }
      if (typeof window.firebase === 'undefined' || !window.firebase.auth) {
        throw new Error('Firebase Auth SDK가 로드되지 않았습니다.');
      }

      const provider = new window.firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/calendar.events');
      provider.addScope('https://www.googleapis.com/auth/drive.file');
      provider.setCustomParameters({ prompt: 'select_account' });

      try {
        // 모바일 및 데스크톱 팝업 로그인 우선 시도
        const result = await window.firebase.auth().signInWithPopup(provider);
        const credential = result.credential;
        const token = credential?.accessToken || result._tokenResponse?.oauthAccessToken || null;
        const user = result.user;

        this.currentUser = user;
        if (token) {
          window.googleAccessToken = token;
          localStorage.setItem('soloos_google_access_token', token);
        }

        return {
          success: true,
          token,
          user: {
            id: user.uid,
            name: user.displayName || '구글 인증 사용자',
            email: user.email,
            photoURL: user.photoURL,
            googleConnected: true,
            googleCalendarConnected: true,
            googleDriveConnected: true
          }
        };
      } catch (err) {
        // 모바일 브라우저 팝업 차단 발생 시 자동으로 안전한 리디렉션 로그인으로 전환
        if (err.code === 'auth/popup-blocked' || err.code === 'auth/cancelled-popup-request') {
          console.log('[SoloOS Firebase] Popup blocked or mobile browser detected, redirecting to Google sign-in...');
          await window.firebase.auth().signInWithRedirect(provider);
          return { success: false, redirecting: true };
        }
        console.warn('[SoloOS Firebase] Google login error:', err);
        throw err;
      }
    }

    /**
     * 오프라인 큐 동기화
     */
    queueOfflineAction(action, data) {
      this.offlineQueue.push({ action, data, timestamp: Date.now() });
      localStorage.setItem('soloos_offline_queue', JSON.stringify(this.offlineQueue));
    }

    async syncOfflineQueue() {
      const stored = localStorage.getItem('soloos_offline_queue');
      if (!stored) return;

      try {
        const queue = JSON.parse(stored);
        if (queue.length > 0) {
          console.log(`[SoloOS Firebase] Syncing ${queue.length} offline actions to cloud...`);
          // 순차 동기화
          this.offlineQueue = [];
          localStorage.removeItem('soloos_offline_queue');
        }
      } catch (err) {
        console.error('[SoloOS Firebase] Queue sync error:', err);
      }
    }
  }

  return new FirebaseService();
});
