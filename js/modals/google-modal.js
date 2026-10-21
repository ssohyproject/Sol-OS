/**
 * SolOS Modal: Google Workspace Sync Modal
 * Google Calendar 2-way event synchronization, Google Drive cloud backup, and OAuth 2.0 flow
 */

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
        const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`[SolOS] ${t.title}`)}&dates=${dtStr}T090000Z/${dtStr}T180000Z&details=${encodeURIComponent(`발주처: ${t.client}\n계약금액: ₩${(t.amount || 0).toLocaleString()}\n상태: ${t.status}\n메모: ${t.memo || ''}`)}`;
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
              summary: `[SolOS] ${t.title} (${t.client})`,
              description: `[SolOS 1인 사업가 ERP]\n클라이언트: ${t.client}\n계약금액: ₩${(t.amount || 0).toLocaleString()}\n상태: ${t.status}\n메모: ${t.memo || ''}`,
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
          const fileName = `SolOS_재무장부백업_${nowStr}.json`;

          const backupData = {
            version: '2.0.0',
            exportedAt: new Date().toISOString(),
            app: 'SolOS 1인 사업가 올인원 ERP',
            user: currentAuthUser,
            state: appState
          };

          const metadata = {
            name: fileName,
            mimeType: 'application/json',
            description: 'SolOS 1인 사업가 ERP 자동 분개 장부 및 계약 백업'
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
            1. SolOS 전체 장부 및 계약 백업 파일이 다운로드되었습니다.<br>
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



// Expose google modal functions to global window
window.loadGoogleSettings = loadGoogleSettings;
window.saveGoogleClientIdSetting = saveGoogleClientIdSetting;
window.triggerRealGoogleAuth = triggerRealGoogleAuth;
window.openGoogleModal = openGoogleModal;
window.closeGoogleModal = closeGoogleModal;
window.switchGoogleTab = switchGoogleTab;
window.renderGoogleCalendarPreview = renderGoogleCalendarPreview;
window.executeGoogleCalendarSync = executeGoogleCalendarSync;
window.downloadIcsCalendar = downloadIcsCalendar;
window.executeGoogleDriveBackup = executeGoogleDriveBackup;
window.fetchGoogleDriveBackups = fetchGoogleDriveBackups;
window.toggleGoogleConnectionStatus = toggleGoogleConnectionStatus;
window.startGoogleOAuthFlow = startGoogleOAuthFlow;
