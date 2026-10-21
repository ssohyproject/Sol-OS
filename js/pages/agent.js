/**
 * SoloOS Page: Intelligent Conversational AI Agent
 * Natural language CFO advisory for 3-in-1 taxes, contracts, runway, and delivery deadlines
 */

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



// Expose agent functions to global window
window.handleChatSubmit = handleChatSubmit;
window.sendQuickPrompt = sendQuickPrompt;
window.appendChatMessage = appendChatMessage;
window.generateAgentReply = generateAgentReply;
