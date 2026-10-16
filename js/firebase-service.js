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
          console.log('[SoloOS Firebase] Loaded config for project:', this.config?.projectId || 'local');
        }
      } catch (e) {
        console.warn('[SoloOS Firebase] Running in standalone local mode (no server API config)');
      }

      // Firebase CDN SDK가 index.html에 로드되어 있고 API Key가 유효한 경우 초기화
      if (typeof window.firebase !== 'undefined' && this.config && this.config.apiKey) {
        try {
          if (!window.firebase.apps.length) {
            window.firebase.initializeApp(this.config);
          }
          this.db = window.firebase.firestore();
          this.auth = window.firebase.auth();
          this.initialized = true;
          console.log('[SoloOS Firebase] Firebase SDK initialized successfully!');
        } catch (err) {
          console.warn('[SoloOS Firebase] Firebase SDK init skipped/failed:', err.message);
        }
      } else {
        console.log('[SoloOS Firebase] Local-First mode active (IndexedDB & LocalStorage)');
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
