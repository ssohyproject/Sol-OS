/**
 * SolOS Page: Legal Protection (법적 보호)
 * Commercial Act Article 69 inspection deemed completed, official notice HWPX generator, lawsuit claim copy, dispute timeline
 */

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


    function openLegalCertModal() {
      document.getElementById('legalCertModal').classList.remove('hidden');
    }
    function closeLegalCertModal() {
      document.getElementById('legalCertModal').classList.add('hidden');
    }


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


    // 8. 나홀로 소액지급명령 전자소송 청구 취지·원인 표준 문안 복사 핸들러
    function copyLawsuitText() {
      const text = `[나홀로 소액지급명령 전자소송 신청서 표준 문안]\n\n1. 청구 취지\n"피신청인은 신청인에게 금 1,200,000원 및 이에 대하여 2026년 10월 01일부터 이 사건 지급명령정본 송달일까지는 상법 소정의 연 6%, 그 다음 날부터 다 갚는 날까지는 소송촉진 등에 관한 특례법 소정의 연 12%의 각 비율로 계산한 돈을 지급하라. 독촉절차비용은 피신청인의 부담으로 한다."\n\n2. 청구 원인\n"신청인은 프리랜서 소프트웨어 개발자로서 2026. 09.경 피신청인과 모바일 웹 결제 모듈 개발 용역 계약을 체결하고 정상 개발 납품을 완료하였습니다. 피신청인은 상법 제69조에 따른 14일의 검수 기간 동안 어떠한 하자나 이의 제기도 없이 목적물을 수령하여 실서비스에 사용 중임에도 불구하고, 약정된 최종 잔금 1,200,000원의 지급 기일(2026. 09. 30.)을 18일 이상 고의로 기피·지연하고 있습니다. 이에 부득이 신청인은 미지급 용역 대금 및 법정 지연손해금의 지급을 구하고자 본 지급명령을 신청합니다."`;
      navigator.clipboard.writeText(text).then(() => {
        showToast('전자소송 청구 취지·원인 표준 문안이 클립보드에 복사되었습니다.');
      });
    }


    // 5. 법적 보호: 미수금 관리 대시보드 동적 렌더러 (실사용자 데이터 vs 가상체험 모드 엄격 분리)

    // 5. 법적 보호: 미수금 관리 대시보드 동적 렌더러 (실사용자 데이터 vs 가상체험 모드 엄격 분리)
    function renderLegalProtectionDashboard() {
      const isDemo = Boolean(appState && appState.isDemoMode);
      
      const totalUnpaidEl = document.getElementById('legalTotalUnpaid');
      const overdueCountEl = document.getElementById('legalOverdueCount');
      const avgOverdueDaysEl = document.getElementById('legalAvgOverdueDays');
      const overdueContainer = document.getElementById('legalOverdueCardsContainer');
      const deliverableContainer = document.getElementById('legalDeliverableContainer');
      const timelineContainer = document.getElementById('legalAuditTimelineContainer');
      const projSelect = document.getElementById('legalMessageProjectSelect');

      // 1. Overdue Projects & Metrics
      let overdueList = [];
      if (isDemo) {
        overdueList = [
          {
            id: 'demo_1',
            projName: '브랜드 홈페이지 제작',
            clientName: '글로벌이커머스(주)',
            amount: 1500000,
            dueDate: '2026.10.15',
            delayedDays: 4,
            stageText: '1단계 (카톡 확인 요청 발송 완료)',
            stageClass: 'text-indigo-700'
          },
          {
            id: 'demo_2',
            projName: '소셜 마케팅 배너 디자인',
            clientName: '스타트업알파',
            amount: 1700000,
            dueDate: '2026.10.07',
            delayedDays: 12,
            stageText: '2단계 (메일 리마인드 발송 완료) ➔ 3단계 공식 공문 권장',
            stageClass: 'text-amber-700'
          }
        ];
      } else {
        const rawDelayed = (appState.receivables || []).filter(r => r.statusType === 'delayed' && r.amount > 0);
        overdueList = rawDelayed.map((r, idx) => {
          let days = 7;
          if (r.dueDate) {
            const due = new Date(r.dueDate);
            const now = new Date();
            const diffTime = now - due;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            days = Math.max(1, diffDays > 0 ? diffDays : 1);
          }
          return {
            id: r.id || `rec_${idx}`,
            projName: r.itemTitle || '프로젝트',
            clientName: r.clientName || '클라이언트',
            amount: r.amount || 0,
            dueDate: r.dueDate || '2026.10.19',
            delayedDays: days,
            stageText: days > 14 ? '3단계 (공식 최고서/내용증명 권장)' : days > 7 ? '2단계 (메일 리마인드 발송 권장)' : '1단계 (정중한 확인 요청)',
            stageClass: days > 14 ? 'text-rose-700' : days > 7 ? 'text-amber-700' : 'text-indigo-700'
          };
        });
      }

      // Update KPI metrics
      if (overdueList.length === 0) {
        if (totalUnpaidEl) totalUnpaidEl.textContent = '₩0';
        if (overdueCountEl) overdueCountEl.textContent = '0건';
        if (avgOverdueDaysEl) avgOverdueDaysEl.textContent = '0일';
      } else {
        const totalAmount = overdueList.reduce((acc, cur) => acc + cur.amount, 0);
        const avgDays = (overdueList.reduce((acc, cur) => acc + cur.delayedDays, 0) / overdueList.length).toFixed(1);
        if (totalUnpaidEl) totalUnpaidEl.textContent = '₩' + totalAmount.toLocaleString();
        if (overdueCountEl) overdueCountEl.textContent = `${overdueList.length}건`;
        if (avgOverdueDaysEl) avgOverdueDaysEl.textContent = `${avgDays}일`;
      }

      // Render Overdue Cards
      if (overdueContainer) {
        if (overdueList.length === 0) {
          overdueContainer.innerHTML = `
            <div class="p-8 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <i data-lucide="shield-check" class="w-5 h-5"></i>
              </div>
              <p class="text-xs font-bold text-slate-800">현재 약정 지급일이 경과한 정산 지연 프로젝트가 없습니다.</p>
              <p class="text-[11px] text-slate-500 max-w-md mx-auto">모든 프로젝트의 납품 및 대금 정산이 약정대로 원활히 관리되고 있습니다. 정산 지연이 발생할 경우 즉시 감지되어 단계별 맞춤 대응이 활성화됩니다.</p>
            </div>
          `;
        } else {
          overdueContainer.innerHTML = overdueList.map(item => `
            <div class="p-4 rounded-xl bg-white border border-rose-200 hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900 text-sm">${escapeHtml(item.projName)}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">지연 ${item.delayedDays}일</span>
                  <span class="text-[11px] text-slate-500">${escapeHtml(item.clientName)}</span>
                </div>
                <div class="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                  <span>미수 잔금: <strong class="font-mono text-rose-600 font-bold">₩${item.amount.toLocaleString()}</strong></span>
                  <span>계약상 지급일: <strong>${item.dueDate}</strong></span>
                  <span>현재 대응: <span class="${item.stageClass} font-bold">${item.stageText}</span></span>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button type="button" onclick="selectOverdueProjectForMessage('${escapeHtml(item.projName)}', '${escapeHtml(item.clientName)}', ${item.amount}, ${item.delayedDays}, '${item.dueDate}')" class="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-colors">
                  맞춤 정산 요청문 작성
                </button>
                <button type="button" onclick="markOverdueAsPaid('${escapeHtml(item.projName)}', ${item.amount})" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs">
                  입금 완료 처리
                </button>
              </div>
            </div>
          `).join('');
        }
      }

      // 2. Deliverable Management Card
      if (deliverableContainer) {
        if (isDemo) {
          deliverableContainer.innerHTML = `
            <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-slate-900 text-sm">프로젝트: 브랜드 홈페이지 제작</span>
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      검수 대기 중 (1차 수정본 검토)
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-500 mt-0.5">산출물: 반응형 웹 퍼블리싱 소스코드 및 그래픽 에셋 (v1.1)</p>
                </div>
                <div class="flex items-center gap-3 text-xs font-mono">
                  <span>납품일: <strong>2026.10.15</strong></span>
                  <span class="text-indigo-700 font-bold">약정 검수 기한: 2026.10.25 (D-6)</span>
                </div>
              </div>

              <!-- 4-Step Visual Progress Bar -->
              <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <div class="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span class="flex items-center gap-1.5 text-emerald-600">
                    <i data-lucide="check" class="w-4 h-4"></i>
                    <span>1. 산출물 전달 완료 (10.15)</span>
                  </span>
                  <span class="flex items-center gap-1.5 text-amber-600">
                    <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>2. 클라이언트 검수 진행 (D-6)</span>
                  </span>
                  <span class="flex items-center gap-1.5 text-slate-400">
                    <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                    <span>3. 최종 승인 확인</span>
                  </span>
                  <span class="flex items-center gap-1.5 text-slate-400">
                    <span class="w-2 h-2 rounded-full bg-slate-300"></span>
                    <span>4. 잔금 지급 (₩1,500,000)</span>
                  </span>
                </div>
                <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                  <div class="bg-emerald-500 h-full w-1/4"></div>
                  <div class="bg-amber-500 h-full w-1/4"></div>
                  <div class="bg-slate-200 h-full w-1/2"></div>
                </div>
              </div>

              <!-- Actions for Deliverable -->
              <div class="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div class="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <i data-lucide="info" class="w-3.5 h-3.5 text-indigo-500"></i>
                  <span>검수 기한이 6일 남았습니다. 필요 시 일정을 리마인드하거나 검수 결과를 기록하세요.</span>
                </div>
                <div class="flex items-center gap-2">
                  <button type="button" onclick="copyInspectionReminder()" class="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs">
                    <i data-lucide="message-square" class="w-3.5 h-3.5 text-amber-600"></i>
                    <span>검수 일정 리마인드 작성</span>
                  </button>
                  <button type="button" onclick="openRecordInspectionResultModal()" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs">
                    <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i>
                    <span>검수 결과 및 승인 기록</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        } else {
          const userInspectionTask = (appState.tasks || []).find(t => t.status === '지연검수' || (t.memo && t.memo.includes('검수')));
          if (userInspectionTask) {
            deliverableContainer.innerHTML = `
              <div class="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-slate-900 text-sm">프로젝트: ${escapeHtml(userInspectionTask.title)}</span>
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        검수 대기 중
                      </span>
                    </div>
                    <p class="text-[11px] text-slate-500 mt-0.5">발주처: ${escapeHtml(userInspectionTask.client || '발주처')} / 잔금: ₩${(userInspectionTask.amount || 0).toLocaleString()}</p>
                  </div>
                  <div class="flex items-center gap-3 text-xs font-mono">
                    <span class="text-indigo-700 font-bold">약정 완료일: ${userInspectionTask.dueDate || '미정'}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 pt-1">
                  <button type="button" onclick="openRecordInspectionResultModal()" class="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs">
                    <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i>
                    <span>검수 결과 및 승인 기록</span>
                  </button>
                </div>
              </div>
            `;
          } else {
            deliverableContainer.innerHTML = `
              <div class="p-8 text-center bg-slate-50/80 rounded-2xl border border-dashed border-slate-200 space-y-2">
                <div class="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                  <i data-lucide="check-circle" class="w-5 h-5"></i>
                </div>
                <p class="text-xs font-bold text-slate-800">현재 검수 대기 또는 진행 중인 산출물 납품 건이 없습니다.</p>
                <p class="text-[11px] text-slate-500 max-w-md mx-auto">프로젝트 산출물을 발주처에 전달한 후 '검수 확인 문서 생성' 또는 계약 등록을 통해 체계적인 납품 검수 수명주기를 관리해 보세요.</p>
              </div>
            `;
          }
        }
      }

      // 3. Project Audit Timeline
      if (timelineContainer) {
        const customLogs = appState.auditTimeline || [];
        if (customLogs.length > 0) {
          timelineContainer.innerHTML = customLogs.map(item => {
            const isSystem = item.type === 'system';
            return `
              <div class="relative">
                <div class="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full ${isSystem ? 'bg-blue-500' : 'bg-emerald-500'} border-2 border-white shadow-xs"></div>
                <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-slate-900">${escapeHtml(item.title)}</span>
                    <span class="text-[10px] ${isSystem ? 'text-blue-700 bg-blue-50 border-blue-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'} font-bold px-2 py-0.5 rounded border">
                      ${isSystem ? '시스템 인증' : '사용자 등록'}
                    </span>
                  </div>
                  <p class="text-[11px] text-slate-600">${escapeHtml(item.desc)}</p>
                  <span class="text-[10px] text-slate-400 font-mono">${escapeHtml(item.dateStr)}</span>
                </div>
              </div>
            `;
          }).join('');
        } else if (isDemo) {
          timelineContainer.innerHTML = `
            <div class="relative">
              <div class="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-xs"></div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-900">계약서 체결본 등록 및 보관</span>
                  <span class="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">시스템 인증</span>
                </div>
                <p class="text-[11px] text-slate-600">전자계약 체결본 PDF 저장 완료 (총 계약금액 ₩3,500,000 / 잔금 ₩1,500,000 규정)</p>
                <span class="text-[10px] text-slate-400 font-mono">2026.10.05 14:30:12</span>
              </div>
            </div>
            <div class="relative">
              <div class="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs"></div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-900">최종 산출물 1차 납품본 전달</span>
                  <span class="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">사용자 등록</span>
                </div>
                <p class="text-[11px] text-slate-600">구글 드라이브 링크 및 소스코드 zip 파일 이메일 전송 (수신자: project@global-ec.com)</p>
                <span class="text-[10px] text-slate-400 font-mono">2026.10.15 17:15:00</span>
              </div>
            </div>
            <div class="relative">
              <div class="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-xs"></div>
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-slate-900">납품 안내 및 검수 요청 공식 발송</span>
                  <span class="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">시스템 인증</span>
                </div>
                <p class="text-[11px] text-slate-600">검수 요청 문서 첨부 및 약정 검수 기한(2026.10.25) 기재 안내문 발송</p>
                <span class="text-[10px] text-slate-400 font-mono">2026.10.16 10:00:24</span>
              </div>
            </div>
          `;
        } else {
          timelineContainer.innerHTML = `
            <div class="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p class="text-xs text-slate-500 font-medium">등록된 사실관계 증빙 기록이 없습니다. 상단의 [새 증빙 기록 추가]를 눌러 산출물 전달 이메일이나 계약 문서를 등록해 보세요.</p>
            </div>
          `;
        }
      }

      // 4. Update Project Select Options for Message Generator
      if (projSelect) {
        projSelect.innerHTML = '';
        if (overdueList.length > 0) {
          overdueList.forEach((item, idx) => {
            const opt = document.createElement('option');
            opt.value = item.id;
            opt.text = `${item.projName} - ${item.clientName} (미수금 ₩${item.amount.toLocaleString()}, 지연 ${item.delayedDays}일)`;
            opt.dataset.projName = item.projName;
            opt.dataset.clientName = item.clientName;
            opt.dataset.amount = item.amount;
            opt.dataset.delayedDays = item.delayedDays;
            opt.dataset.dueDate = item.dueDate;
            if (idx === 0) opt.selected = true;
            projSelect.appendChild(opt);
          });
        } else {
          const opt = document.createElement('option');
          opt.value = 'default_custom';
          opt.text = '직접 입력 / 예시 프로젝트 - (주)클라이언트 (미수금 ₩1,500,000, 지연 5일)';
          opt.dataset.projName = '외주 개발 및 디자인 프로젝트';
          opt.dataset.clientName = '(주)클라이언트';
          opt.dataset.amount = 1500000;
          opt.dataset.delayedDays = 5;
          opt.dataset.dueDate = '2026.10.14';
          opt.selected = true;
          projSelect.appendChild(opt);
        }
      }

      updateGeneratedLegalMessage();
      if (window.lucide) lucide.createIcons();
    }

    function selectOverdueProjectForMessage(projName, clientName, amount, delayedDays, dueDate) {
      const select = document.getElementById('legalMessageProjectSelect');
      if (select) {
        let matched = false;
        for (let i = 0; i < select.options.length; i++) {
          if (select.options[i].text.includes(projName)) {
            select.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) {
          const opt = document.createElement('option');
          opt.value = 'custom_' + Date.now();
          opt.text = `${projName} - ${clientName} (미수금 ₩${amount.toLocaleString()}, 지연 ${delayedDays}일)`;
          opt.dataset.projName = projName;
          opt.dataset.clientName = clientName;
          opt.dataset.amount = amount;
          opt.dataset.delayedDays = delayedDays;
          opt.dataset.dueDate = dueDate || '2026.10.15';
          select.appendChild(opt);
          select.selectedIndex = select.options.length - 1;
        }
      }
      updateGeneratedLegalMessage();
      const msgArea = document.getElementById('legalGeneratedMessage');
      if (msgArea) {
        msgArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
        msgArea.focus();
      }
      showToast(`'${projName}' 미수금 정보가 맞춤 요청서에 자동 반영되었습니다.`);
    }

    function markOverdueAsPaid(projName, amount) {
      if (!confirm(`'${projName}' 미수 잔금 ₩${amount.toLocaleString()} 입금을 완료 처리하시겠습니까?\n사업 통장 잔고에 가산되며 차트와 자금 현황이 즉시 업데이트됩니다.`)) {
        return;
      }

      appState.workingCapital = (appState.workingCapital || 0) + amount;

      // Update matching receivable in appState
      if (appState.receivables) {
        const found = appState.receivables.find(r => (r.itemTitle || '').includes(projName) || (projName || '').includes(r.itemTitle || ''));
        if (found) {
          found.statusType = 'collected';
          found.amount = 0;
        }
      }

      // Add to audit timeline
      addAuditTimelineEntry({
        dateStr: new Date().toISOString().replace('T', ' ').substring(0, 19),
        title: `[입금 완료 확인] ${projName} 잔금 ₩${amount.toLocaleString()} 수금`,
        desc: `발주처로부터 미수 잔금 ₩${amount.toLocaleString()} 전액 정상 입금 확인되어 자금 통장 잔고로 통합 처리되었습니다.`,
        type: 'system'
      });

      saveCurrentWorkspaceData();
      updateKPICards();
      updateVisualStatements();
      renderReceivablesTable();
      renderLedgerTable();
      renderLegalProtectionDashboard();
      if (typeof updateChartData === 'function') updateChartData();
      if (typeof renderCashflowForecastChart === 'function') renderCashflowForecastChart();
      showToast(`'${projName}' 입금 완료 처리 완료! 사업 통장 잔고에 반영되었습니다.`);
    }

    function updateGeneratedLegalMessage() {
      const select = document.getElementById('legalMessageProjectSelect');
      const val = select ? select.value : 'p1';
      let projName = '브랜드 홈페이지 제작';
      let clientName = '글로벌이커머스(주)';
      let amount = 1500000;
      let delayedDays = 4;
      let dueDate = '2026.10.15';

      if (val === 'p2') {
        projName = '소셜 마케팅 배너 디자인';
        clientName = '스타트업알파';
        amount = 1700000;
        delayedDays = 12;
        dueDate = '2026.10.07';
      } else if (select && select.selectedOptions && select.selectedOptions[0]) {
        const opt = select.selectedOptions[0];
        if (opt.dataset && opt.dataset.projName) {
          projName = opt.dataset.projName;
          clientName = opt.dataset.clientName || '클라이언트';
          amount = parseInt(opt.dataset.amount, 10) || 0;
          delayedDays = parseInt(opt.dataset.delayedDays, 10) || 0;
          dueDate = opt.dataset.dueDate || '2026.10.15';
        } else {
          const txt = opt.text;
          const match = txt.match(/^(.*?)\s*-\s*(.*?)\s*\(/);
          if (match) {
            projName = match[1].trim();
            clientName = match[2].trim();
          }
        }
      }

      const tone = currentLegalMessageTone;
      const prob = currentLegalProblemId;
      const textarea = document.getElementById('legalGeneratedMessage');
      if (!textarea) return;

      const formattedAmount = amount.toLocaleString();
      let msg = '';

      if (tone === 'kakao') {
        if (prob === 1) {
          // 1. 입금 예정일 경과 (지연 1~7일) - 정중한 리마인드
          msg = `담당자님, 안녕하세요! 솔로오에스 정솔로입니다.\n\n바쁘신 업무 중에 메시지 드려 죄송합니다. 다름이 아니라 지난 ${dueDate} 약정 지급 예정이었던 [${projName}]의 잔금(₩${formattedAmount}) 입금 일정을 확인하고자 연락드렸습니다.\n\n혹시 사내 세무 결재 일정 등으로 지연되시는 것인지 편하실 때 일정 회신 주시면 감사하겠습니다.\n\n■ 입금 계좌: 카카오뱅크 3333-01-2345678 (예금주: 정솔로)\n환절기 건강 유의하세요! 감사합니다.`;
        } else if (prob === 2) {
          // 2. 클라이언트 연락 두절 (지연 14일 이상) - 긴급 연락 요청 및 법적 절차 전 최종 고지
          msg = `담당자님, 안녕하세요. [${projName}] 프로젝트 담당자 정솔로입니다.\n\n약정 대금(₩${formattedAmount}) 지급일(${dueDate})로부터 벌써 ${delayedDays}일이 경과하였으나, 수차례 남겨드린 메시지와 유선 연락에 회신이 없어 부득이하게 긴급 메시지를 남깁니다.\n\n이번 주까지 최소한의 입금 일정이나 소명 연락이 없을 경우, 당사에서도 부득이하게 공식 내용증명 발송 및 대법원 전자소송(지급명령) 등 법적 절차를 검토할 수밖에 없는 점 양해 부탁드립니다.\n\n확인하시는 대로 연락 부탁드립니다. 감사합니다.`;
        } else if (prob === 3) {
          // 3. 검수가 계속 지연·회피됨 - 검수 기한 경과 및 자동 합격 간주 안내
          msg = `담당자님, 안녕하세요! [${projName}] 프로젝트 관련하여 연락드립니다.\n\n최종 산출물 납품 후 계약서상 약정된 검수 기한이 경과하였으나 별도의 수정이나 하자 보완 요청이 접수되지 않았습니다.\n\n표준계약서 제6조(검수 및 인수)에 의거하여 본 과업은 정상 검수 완료(합격)된 것으로 간주 처리되며, 이에 따라 최종 잔금 ₩${formattedAmount}에 대한 세금계산서 발행 및 정산 절차를 진행하고자 합니다.\n\n최종 정산 일정 확인 부탁드립니다!\n■ 입금 계좌: 카카오뱅크 3333-01-2345678 (정솔로)`;
        } else if (prob === 4) {
          // 4. 계약에 없던 추가 작업 요구 - 과업 범위(SOW) 분리 및 별도 견적 제안
          msg = `담당자님, 요청해주신 추가 작업 사항 잘 확인하였습니다.\n\n다만 검토 결과, 해당 내용은 당초 체결된 [${projName}]의 과업 범위(Scope of Work)를 벗어난 신규 기능/작업에 해당합니다.\n\n당초 계약된 산출물은 완벽히 납품 완료되었으므로 기존 잔금(₩${formattedAmount}) 정산을 우선 마무리 부탁드리며, 추가 요청 건은 별도 변경 계약 및 합리적인 추가 견적으로 즉시 지원해 드리겠습니다!\n\n추가 작업 견적서 필요 시 바로 송부드리겠습니다. 감사합니다.`;
        } else {
          // 5. 대금 지급 거부 및 분쟁 - 지급 이행 강력 촉구 및 분쟁 조정 경고
          msg = `담당자님, [${projName}] 미수 잔금 ₩${formattedAmount} 지급 거부 의사에 깊은 유감을 표합니다.\n\n당사는 계약서상 명시된 모든 산출물을 정상 납품하여 계약상 의무를 충실히 이행 완료하였습니다. 정당한 법적 사유 없는 일방적 대금 미지급은 명백한 계약 위반입니다.\n\n본 건이 한국공정거래조정원 분쟁 조정이나 법원 지급명령 등 법적 분쟁으로 확대되지 않도록, 이번 주 금요일까지 최종 입금 또는 원만한 해결을 위한 공식 답변을 요청드립니다.`;
        }
      } else if (tone === 'email') {
        if (prob === 1) {
          // 1. 입금 예정일 경과 - 이메일 정산 요청서
          msg = `[정산 안내] '${projName}' 용역 잔금 입금 일정 및 세무 결재 확인 요청의 건\n\n수신: ${clientName} 회계/프로젝트 담당자님 귀하\n발신: 솔로오에스 정솔로 대표 (010-1234-5678)\n\n안녕하십니까, 귀사의 무궁한 발전을 기원합니다.\n\n본 메일은 양사가 체결한 '${projName}' 용역 계약의 잔금 지급 일정과 관련하여 확인 요청드리고자 발송되었습니다.\n\n1. 프로젝트명: ${projName}\n2. 약정 지급 기일: ${dueDate} (현재 ${delayedDays}일 경과)\n3. 미지급 잔금: 금 ${formattedAmount}원 (VAT 포함/별도 계약 기준)\n4. 입금 지정 계좌: 카카오뱅크 3333-01-2345678 (예금주: 정솔로)\n\n사내 결재 주기나 회계 정산 일정상 지연되시는 경우, 예상 이체 일자를 회신 메일로 알려주시면 감사하겠습니다.\n원활한 업무 마무리를 위해 담당자님의 확인 부탁드립니다.\n\n감사합니다.\n솔로오에스 정솔로 배상`;
        } else if (prob === 2) {
          // 2. 클라이언트 연락 두절 - 이메일 긴급 회신 최고
          msg = `[긴급 회신 요청] '${projName}' 대금 장기 연체 및 연락 두절에 따른 최종 확인 요청의 건\n\n수신: ${clientName} 대표이사 및 프로젝트 담당자님 귀하\n발신: 솔로오에스 정솔로 대표 (010-1234-5678)\n\n안녕하십니까, 솔로오에스 정솔로입니다.\n\n귀사와 체결한 '${projName}' 용역 계약과 관련하여, 약정 지급 기일(${dueDate})로부터 현재 ${delayedDays}일이 경과하였으나 담당 부서와의 유선 연락 및 메신저 회신이 전면 두절된 상태입니다.\n\n1. 과업명: ${projName}\n2. 연체 금액: 금 ${formattedAmount}원 (연체일수: ${delayedDays}일)\n3. 회신 기한: 본 메일 발송일로부터 3영업일 이내\n\n본 메일을 확인하시는 즉시 미지급 사유 및 구체적인 대금 입금 일정을 서면 회신하여 주시기 바랍니다. 만약 기한 내에도 아무런 회신이 없을 경우, 당사는 본 건을 고의적 대금 미지급으로 간주하고 내용증명 우편 발송 및 대법원 전자소송 지급명령 신청 절차에 착수할 수밖에 없음을 통지합니다.\n\n귀사의 신속하고 책임 있는 회신을 요청합니다.\n\n솔로오에스 정솔로 배상`;
        } else if (prob === 3) {
          // 3. 검수 지연/회피 - 이메일 검수 완료 간주 및 정산 요청
          msg = `[검수 완료 안내] '${projName}' 약정 검수 기한 도과에 따른 최종 인수 및 정산의 건\n\n수신: ${clientName} 프로젝트 검수 담당자님 귀하\n발신: 솔로오에스 정솔로 대표 (010-1234-5678)\n\n안녕하십니까, 솔로오에스 정솔로입니다.\n\n귀사와 진행 중인 '${projName}' 프로젝트의 최종 산출물을 제출한 이후, 계약서상 명시된 약정 검수 기한(납품일로부터 14일)이 도과하였습니다.\n\n1. 과업명: ${projName}\n2. 산출물 납품일: ${dueDate}\n3. 관련 조항: 표준용역계약서 제6조(검수 및 인수) 및 상법 제69조(매수인의 목적물의 검사와 하자통지의무)\n4. 최종 정산 대금: 금 ${formattedAmount}원\n\n약정 검수 기한 내에 귀사로부터 구체적인 하자 보완 요구나 정당한 수정 요청이 서면 접수되지 아니하였으므로, 계약 조항에 의거하여 본 과업의 목적물은 귀사에 의해 정상 검수 및 인수 완료된 것으로 확정 처리되었습니다.\n\n이에 따라 최종 잔금 ₩${formattedAmount}에 대한 정산 및 입금을 요청드리오니, 이번 주 내로 지정 계좌(카카오뱅크 3333-01-2345678 정솔로)로 입금하여 주시기 바랍니다.\n\n감사합니다.\n솔로오에스 정솔로 배상`;
        } else if (prob === 4) {
          // 4. 추가 작업 요구 - 이메일 과업 범위(SOW) 분리 및 변경 계약 제안서
          msg = `[과업 범위 안내] '${projName}' 추가 요청 사항에 대한 범위 검토 및 변경계약 제안의 건\n\n수신: ${clientName} 프로젝트 총괄 담당자님 귀하\n발신: 솔로오에스 정솔로 대표 (010-1234-5678)\n\n안녕하십니까, 솔로오에스 정솔로입니다.\n\n귀사에서 최근 전달해 주신 추가 수정 및 기능 구현 요청 사항을 면밀히 검토하였습니다. 이에 대해 용역 계약 기준 안내 및 상호 윈-윈을 위한 진행 방안을 제안해 드립니다.\n\n1. 기본 계약 과업 현황: '${projName}' 당초 계약서 및 과업지시서(SOW)에 명시된 모든 산출물은 기한 내 100% 정상 납품 완료되었습니다.\n2. 추가 요청 사항 검토: 요청하신 세부 항목은 당초 계약 범위를 현저히 초과하는 신규 과업(Scope Creep)으로 분류됩니다.\n3. 권장 진행 절차:\n  가) 기존 완료 과업에 대한 검수 합격 승인 및 약정 잔금(₩${formattedAmount})의 우선 정산\n  나) 신규 추가 과업에 대한 별도 작업 견적서(일정 및 공수) 검토 후 공식 계약 변경 합의서 작성\n\n기존 과업의 잔금 정산이 확정되는 대로, 추가 요청 사항에 대한 최적의 작업 견적을 신속히 송부해 드리겠습니다.\n\n감사합니다.\n솔로오에스 정솔로 배상`;
        } else {
          // 5. 대금 지급 거부 및 분쟁 - 이메일 최종 법적 조치 최고
          msg = `[최종 최고] '${projName}' 부당한 대금 지급 거부에 따른 법적 조치 착수 통지의 건\n\n수신: ${clientName} 대표이사 및 재무 총괄 귀하\n발신: 솔로오에스 정솔로 대표 (010-1234-5678)\n\n귀사의 무궁한 발전을 기원합니다.\n\n본 통지는 귀사가 정당한 사유 없이 '${projName}' 용역 잔금 ₩${formattedAmount}원의 지급을 일방적으로 거부하고 있는 사안에 대하여, 최종 법적 권리 구제 절차 착수를 고지하고자 발송되었습니다.\n\n1. 계약 사실 및 이행: 본인은 계약에 명시된 규격과 일정에 맞춰 모든 산출물을 납품하였으며, 계약상 의무를 완벽히 이행하였습니다.\n2. 채무 불이행: 귀사는 대금 지급 기일(${dueDate})이 ${delayedDays}일 경과하였음에도 계약서에 위배되는 일방적 사유로 잔금 지급을 이행하지 않고 있습니다.\n3. 예정된 법적 구제 절차:\n  - 한국공정거래조정원 약관 및 용역하도급 분쟁조정 신청\n  - 관할 법원 지급명령 신청(소송촉진특례법상 연 12% 지연이자 청구)\n  - 채권 보전을 위한 가압류 및 거래처 채권 추심 절차\n\n귀사와의 원만한 상거래 신뢰를 유지하고자 본 메일 수신일로부터 5영업일(2026년 10월 26일까지)의 최종 유예 기간을 부여하오니, 기한 내 완제하여 주시기 바랍니다.\n\n솔로오에스 정솔로 배상`;
        }
      } else {
        // formal: 내용증명 / 법적 공문
        if (prob === 1) {
          // 1. 입금 예정일 경과 - 공식 지급 안내 공문
          msg = `[공식 공문] '${projName}' 용역 대금 지급 일정 확인 및 이행 요청서\n\n문서번호: SOLOOS-REMIND-20261019\n수 신: ${clientName} 대표이사 귀하\n발 신: 솔로오에스 대표 정솔로\n제 목: '${projName}' 계약 잔금(₩${formattedAmount}) 지급 일정 확인의 건\n\n1. 귀사의 일익 번창하심을 기원합니다.\n2. 본인은 귀사와 체결한 '${projName}' 용역 계약에 의거하여 계약상의 목적물 납품 및 최종 인도를 정상 완료하였습니다.\n3. 본 계약에 따른 잔금 ₩${formattedAmount}원의 약정 지급 기일은 ${dueDate}이었으나, 현재 약정일로부터 ${delayedDays}일이 경과한 상태입니다.\n4. 회계 마감 및 세무 결재 일정 등으로 인하여 집행이 지연되고 있는 것으로 사료되오나, 양사 간의 원활한 계약 종결을 위해 본 공문 수신 후 3영업일 이내에 최종 입금 예정 일정을 서면 또는 유선으로 회신하여 주실 것을 정중히 요청합니다.\n5. 입금 지정 계좌: 카카오뱅크 3333-01-2345678 (예금주: 정솔로)\n\n2026년 10월 19일\n솔로오에스 대표 정 솔 로 (직인생략)`;
        } else if (prob === 2) {
          // 2. 클라이언트 연락 두절 - 연락 두절에 따른 최고서
          msg = `[공식 최고서] '${projName}' 채무 불이행 및 연락 두절에 따른 대금 지급 최고서\n\n문서번호: SOLOOS-LEGAL-20261019-02\n수 신: ${clientName} 대표이사 귀하\n발 신: 솔로오에스 대표 정솔로\n제 목: 용역 대금(₩${formattedAmount}) 지급 최고 및 법적 절차 착수 예고\n\n1. 귀사의 번영을 기원합니다.\n2. 본인은 귀사와 체결한 '${projName}' 용역 계약상의 모든 의무를 성실히 이행 완료하였으나, 귀사는 약정 지급 기일(${dueDate})로부터 ${delayedDays}일이 경과하도록 대금을 지급하지 않고 있습니다.\n3. 특히 본인의 수차례에 걸친 정당한 독촉 및 연락 시도에도 불구하고 귀사는 일체의 회신 없이 무단으로 연락을 회피하고 있는바, 이는 명백한 상거래 신의성실의 원칙 위반이자 고의적 채무 불이행에 해당합니다.\n4. 이에 본 공문으로 최종 최고하오니, 본 통지를 송달받은 날로부터 7일 이내에 미지급 대금 ₩${formattedAmount}원 전액을 지정 계좌(카카오뱅크 3333-01-2345678 정솔로)로 즉시 지급하여 주시기 바랍니다.\n5. 만일 상기 기한 내에 대금 완제 또는 합당한 소명이 없을 경우, 본인은 별도의 추가 통지 없이 관할 법원에 지급명령 신청, 금융계좌 가압류 신청 및 형사고소(사기죄)를 포함한 일체의 법적 구제 절차에 즉각 착수할 것임을 엄중히 고지합니다.\n\n2026년 10월 19일\n솔로오에스 대표 정 솔 로 (직인생략)`;
        } else if (prob === 3) {
          // 3. 검수 지연/회피 - 검수 합격 간주 통지서
          msg = `[공식 통지서] '${projName}' 목적물 검수 완료 간주 및 대금 청구서\n\n문서번호: SOLOOS-INSPECT-20261019\n수 신: ${clientName} 대표이사 귀하\n발 신: 솔로오에스 대표 정솔로\n제 목: 용역 목적물 검수 완료 간주 통지 및 잔금(₩${formattedAmount}) 지급 청구\n\n1. 귀사의 무궁한 발전을 기원합니다.\n2. 본인은 '${projName}' 용역 계약에 따라 목적물을 기한 내 성실히 납품하였으며, 상법 제69조 및 양사 계약서 제6조(검수 및 인수)에 의거하여 귀사에 검수를 요청한 바 있습니다.\n3. 귀사는 약정 검수 기한이 경과하였음에도 불구하고 객관적인 하자 사실의 구체적 적시나 서면 시정 요구 없이 정당한 사유 없이 검수를 부당하게 지연·회피하였습니다.\n4. 따라서 계약 조항 및 상법 규정에 따라 본 용역 목적물은 하자가 없는 상태로 귀사에 의해 최종 검수 합격 및 인수된 것으로 법적 간주 처리되었음을 본 문서를 통해 공식 통지합니다.\n5. 이에 귀사는 목적물 인수에 따른 대가 지급 의무가 확정되었으므로, 본 통지를 송달받은 날로부터 7일 이내에 미지급 잔금 ₩${formattedAmount}원을 지정 계좌(카카오뱅크 3333-01-2345678 정솔로)로 입금하여 주시기 바랍니다.\n\n2026년 10월 19일\n솔로오에스 대표 정 솔 로 (직인생략)`;
        } else if (prob === 4) {
          // 4. 추가 작업 요구 - 과업 범위 준수 및 추가 용역 계약 변경 요청 공문
          msg = `[공식 공문] '${projName}' 당초 계약 과업 완료 통지 및 추가 작업에 관한 계약 변경 요청서\n\n문서번호: SOLOOS-SCOPE-20261019\n수 신: ${clientName} 대표이사 귀하\n발 신: 솔로오에스 대표 정솔로\n제 목: 계약 과업 범위(SOW) 준수 및 신규 추가 용역 변경계약 체결 요청\n\n1. 귀사의 일익 번창을 기원합니다.\n2. 본인은 귀사와 체결한 '${projName}' 용역 계약의 과업내용서에 명시된 모든 개발 및 디자인 산출물의 납품을 성실히 완료하였습니다.\n3. 귀사가 최근 요구하신 작업 내역은 당초 계약서 및 과업 범위(Scope of Work)에 포함되지 아니한 신규 추가 개발 건에 해당합니다.\n4. 소프트웨어 진흥법 및 하도급거래 공정화에 관한 법률 등 관련 법령에 의거하여, 계약 외 추가 과업에 대한 무상 용역 요구나 이를 빌미로 한 기존 대금의 지급 유보는 부당한 경영 간섭 및 불공정 거래 행위에 해당합니다.\n5. 이에 당초 계약 완료에 따른 잔금 ₩${formattedAmount}원의 우선 지급을 청구하오며, 추가 요청 과업에 대해서는 공정한 추가 공수 산정을 바탕으로 변경계약을 체결한 후 성실히 수행할 것을 제안합니다.\n\n2026년 10월 19일\n솔로오에스 대표 정 솔 로 (직인생략)`;
        } else {
          // 5. 대금 지급 거부 및 분쟁 - 내용증명 대금 지급 이행 최고서
          msg = `[내용증명] '${projName}' 용역 대금 청구 및 법적 조치 착수에 관한 최고서\n\n문서번호: SOLOOS-LEGAL-20261019-CERT\n발 신 인: 솔로오에스 대표 정솔로 (서울시 강남구 테헤란로 123, 연락처: 010-1234-5678)\n수 신 인: ${clientName} 대표이사 귀하\n제    목: 용역 대금(₩${formattedAmount}) 지급 이행 최고 및 분쟁 조정·소송 제기 예고\n\n1. 귀사의 무궁한 발전을 기원합니다.\n2. 발신인은 수신인과 2026년 체결한 '${projName}' 용역 계약에 의거하여 계약상의 모든 산출물을 신의성실 원칙에 따라 납품 완료하였습니다.\n3. 그러나 수신인은 약정된 대금 지급 기일(${dueDate})이 ${delayedDays}일 경과하였음에도 불구하고, 계약서 및 법적 근거가 없는 부당한 사유를 들어 잔금 ₩${formattedAmount}원의 지급을 일방적으로 거부하고 있습니다.\n4. 이는 명백한 계약 불이행이자 민법 제390조(채무불이행) 및 상법상의 대금 지급 의무 위반에 해당합니다.\n5. 이에 발신인은 본 최고서를 통하여 엄중히 통고하오니, 본 최고서 도달일로부터 7일 이내에 미지급 잔금 ₩${formattedAmount}원 전액을 아래 계좌로 송금하여 주시기 바랍니다.\n   ■ 입금 계좌: 카카오뱅크 3333-01-2345678 (예금주: 정솔로)\n6. 만일 위 기한 내에 변제가 이루어지지 않을 경우, 발신인은 한국공정거래조정원 분쟁 조정 신청, 관할 법원에 대한 지급명령 신청 및 강제집행 절차를 즉시 개시할 것이며, 이로 인해 발생하는 상사 법정이율(연 6%) 및 소송촉진특례법상 지연손해금(연 12%), 변호사 보수를 포함한 일체의 소송비용을 귀사에 전액 청구할 것임을 통지합니다.\n\n2026년 10월 19일\n발신인 솔로오에스 대표 정 솔 로 (인)`;
        }
      }

      textarea.value = msg;
    }



// Expose legal functions to global window
window.setLegalStep = setLegalStep;
window.copyDeliveryNotice = copyDeliveryNotice;
window.copyKakaoReminder = copyKakaoReminder;
window.copyEmailReminder = copyEmailReminder;
window.copyFormalNotice = copyFormalNotice;
window.switchLegalPageTab = switchLegalPageTab;
window.openLegalCertModal = openLegalCertModal;
window.closeLegalCertModal = closeLegalCertModal;
window.downloadLegalDoc = downloadLegalDoc;
window.generateLegalPDF = generateLegalPDF;
window.copyLawsuitText = copyLawsuitText;
window.renderLegalProtectionDashboard = renderLegalProtectionDashboard;
window.selectOverdueProjectForMessage = selectOverdueProjectForMessage;
window.markOverdueAsPaid = markOverdueAsPaid;
window.updateGeneratedLegalMessage = updateGeneratedLegalMessage;
