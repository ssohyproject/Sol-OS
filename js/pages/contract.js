/**
 * SolOS Page: Contract Management (계약 관리)
 * Standard contract template library, 2D cross recommendation, toxic clause scanner demo, real-time contract table
 */

    // ==================== CONTRACT & LEGAL REVOLUTION UX HANDLERS ====================
    let currentContractDomain = 'all';
    let currentContractType = 'all';
    let currentLegalProblemId = 1;
    let currentLegalMessageTone = 'kakao';
    let currentContractLibDomain = 'all';
    let currentContractLibSearch = '';
    let selectedContractLibId = 'msit_sw';
    let isContractLibCollapsed = false;

    // 0. 정부·공공기관 공식 용역 표준계약서 자료실 데이터베이스 (6종 공인 서식)
    const CONTRACT_LIB_DATA = [
      {
        id: 'msit_sw',
        domain: 'it',
        title: 'SW 용역 표준계약서',
        issuer: '과학기술정보통신부 고시 제2023-14호',
        ministryBadge: '과기정통부 공식',
        badgeColor: 'blue',
        summary: '소프트웨어 개발·구축 및 데이터 용역에 적용되는 공식 서식으로, 과업 변경 시 대금 증액과 산출물 지식재산권 완납 시 이전을 규정합니다.',
        targets: ['데이터제공형', '데이터창출형', '가공서비스형', 'SW신규개발', '유지보수'],
        clauses: [
          { title: '제4조 (과업 변경 및 대금 조정)', desc: '발주자의 요구로 과업 내용이나 사양이 변경될 경우, 수급인은 추가 일정 및 견적 증액을 서면 요청할 수 있으며 상호 합의 하에 계약을 변경한다.' },
          { title: '제7조 (산출물 검수 및 기한 준수)', desc: '목적물 인도 후 계약서상 검수 기한(통상 10~14일) 내에 서면 이의가 없으면 검수가 합격된 것으로 간주한다.' },
          { title: '제11조 (지식재산권 귀속 시점)', desc: '용역 결과물의 저작재산권은 발주자가 수급인에게 용역 대금 전액을 완납한 시점에 발주자에게 이전된다.' },
          { title: '제14조 (지체상금 요율 한도)', desc: '지체상금 요율은 1일 0.1% 이하로 제한하며, 발주자의 검수 지연 기간은 지체 일수에서 전액 제외한다.' }
        ],
        caution: '개발 도중 요구사항 변경이 빈번한 프로젝트에서는 본 서식의 제4조 과업변경 서면 합의 절차를 반드시 계약 특약에 유지해야 합니다.',
        downloadUrl: 'https://www.msit.go.kr/bbs/view.do?sCode=user&mId=245&mPid=243&bbsSeqNo=67&nttSeqNo=3139474',
        previewId: 'it'
      },
      {
        id: 'kidp_design',
        domain: 'design',
        title: '디자인 용역 표준계약서',
        issuer: '산업통상자원부·한국디자인진흥원(KIDP)',
        ministryBadge: 'KIDP 공식 고시',
        badgeColor: 'indigo',
        summary: '시각, 제품, 멀티미디어, 서비스디자인 등 4대 디자인 분야 특화 서식으로 시안 수정 횟수와 미채택 시안 권리 유보를 명시합니다.',
        targets: ['시각디자인', '제품디자인', '멀티미디어', '서비스·UI/UX', '브랜드디자인'],
        clauses: [
          { title: '제5조 (시안 제출 및 수정 횟수 제한)', desc: '기본 시안은 2종으로 하며, 발주자의 수정 요구는 계약 범위 내 2회로 한정한다. 초과 시 별도 추가 비용을 산정한다.' },
          { title: '제8조 (산출물 검수 절차)', desc: '발주자는 산출물 수령일로부터 10일 이내에 서면으로 결과를 통지해야 하며 미통지 시 승인 간주한다.' },
          { title: '제12조 (미채택 시안 권리 유보)', desc: '최종 채택되지 않은 시안에 대한 모든 저작권은 디자이너에게 유보되며, 발주자는 무단 도용하거나 제3자에게 제공할 수 없다.' },
          { title: '제15조 (포트폴리오 사용권)', desc: '디자이너는 본 프로젝트 결과물을 자신의 포트폴리오 및 프로모션 목적으로 자유롭게 게시·활용할 수 있다.' }
        ],
        caution: '시안 수정 횟수(기본 2회)와 추가 수정 비용 단가를 본문에 명시하여 무제한 수정 요구를 사전 차단하세요.',
        downloadUrl: 'https://kidp.or.kr/?menuno=935&bbsno=15523&siteno=16&act=view&ztag=rO0ABXQAMzxjYWxsIHR5cGU9ImJvYXJkIiBubz0iNjIyIiBza2luPSJraWRwX2JicyI%2BPC9jYWxsPg%3D%3D',
        previewId: 'design'
      },
      {
        id: 'mcst_publishing',
        domain: 'publishing',
        title: '디지털 출판·전자책 배급 표준계약서',
        issuer: '문화체육관광부 고시 제2021-12호',
        ministryBadge: '문체부 표준 서식',
        badgeColor: 'emerald',
        summary: '종이책, 전자책(eBook), 오디오북 출판권 및 배타적발행권 설정 서식으로 2차적 저작물 작성권을 작가에게 유보합니다.',
        targets: ['출판권 설정', '전자출판 배급', '배타적발행권', '오디오북', '정기 간행물'],
        clauses: [
          { title: '제4조 (2차적 저작물 작성권 유보)', desc: '원작을 바탕으로 한 영상화, 번역, 웹툰화, 굿즈 등 2차적 저작물 작성·이용 권리는 저작자에게 온전히 유보된다.' },
          { title: '제9조 (투명한 순인세 정산 주기)', desc: '플랫폼 정산 수수료 공제 내역과 실제 다운로드 부수를 분기별로 투명하게 통지하고 익월 말일까지 정산한다.' },
          { title: '제14조 (계약 기간 및 자동 연장 제한)', desc: '계약 유효기간은 3년으로 하며, 만료 3개월 전 서면 갱신 합의가 없을 경우 자동 해지된다.' },
          { title: '제18조 (품절 및 절판 시 계약 해지)', desc: '출판사가 3개월 이상 무단 발행 중단 시 저작자는 최고 후 즉시 계약을 해지할 수 있다.' }
        ],
        caution: '2차적 저작물 작성권이 출판사에 포괄 양도되지 않도록 제4조 유보 조항을 반드시 원문대로 유지하세요.',
        downloadUrl: 'https://www.mcst.go.kr/site/s_data/generalData/dataView.jsp?pSeq=32&pMenuCD=0405050000&pCurrentPage=1&pType=04&pSearchType=01&pSearchWord=%EC%B6%9C%ED%8C%90+%EB%B6%84%EC%95%BC+%ED%91%9C%EC%A4%80%EA%B3%84%EC%95%BD%EC%84%9C',
        previewId: 'publishing'
      },
      {
        id: 'kocca_content',
        domain: 'content',
        title: '방송·영상·콘텐츠 외주제작 표준계약서',
        issuer: '문화체육관광부·방송통신위원회 고시',
        ministryBadge: 'KOCCA 공식',
        badgeColor: 'rose',
        summary: '유튜브 영상 편집, 광고 콘텐츠, 모션그래픽 제작에 최적화되어 최종 렌더링 파일과 원본 프로젝트 파일 납품 범위를 분리합니다.',
        targets: ['유튜브 영상', '모션그래픽', '광고 영상', '쇼츠/릴스 제작', '온라인 강의 촬영'],
        clauses: [
          { title: '제6조 (산출물 납품 및 원본 파일 범위)', desc: '납품 대상은 사전 합의된 최종 렌더링 영상 파일에 한하며, aep/prproj 등 프로젝트 원본 소스 파일 제공은 별도 협의·정산한다.' },
          { title: '제8조 (음원·폰트 유료 라이선스 책임)', desc: '발주자의 요구로 사용된 유료 폰트 및 BGM 라이선스 비용과 법적 책임은 발주자가 부담한다.' },
          { title: '제11조 (가편 및 종합 편집 피드백)', desc: '가편집 1회, 종합 편집 1회에 걸쳐 피드백 일정을 사전 확정하고 발주자의 피드백 지연 시 납기를 순연한다.' },
          { title: '제16조 (크레딧 표기 및 포트폴리오)', desc: '제작자의 성명 또는 상호를 영상 엔드 크레딧에 표기할 권리를 가지며 포트폴리오 사용을 보장한다.' }
        ],
        caution: '프로젝트 원본 소스 파일(Pr/Ae)의 양도 여부를 반드시 사전 특약으로 명시하여 분쟁을 예방하세요.',
        downloadUrl: 'https://www.kocca.kr',
        previewId: 'content'
      },
      {
        id: 'ftc_freelance',
        domain: 'general',
        title: '프리랜서 지식용역 표준계약서',
        issuer: '공정거래위원회 용역위탁 표준 서식',
        ministryBadge: '공정위 공식',
        badgeColor: 'slate',
        summary: '컨설팅, 번역, 카피라이팅 등 다양한 1인 지식용역에 범용 적용되며, 부당 대금 감액 금지 및 계약 해지 예고 기간을 체계화합니다.',
        targets: ['경영 컨설팅', '전문 번역·통역', '카피라이팅/글쓰기', '마케팅 기획', '리서치 분석'],
        clauses: [
          { title: '제5조 (부당한 대금 감액 및 지급 보류 금지)', desc: '발주자는 정당한 사유 없이 당초 계약된 용역 대금을 일방적으로 감액하거나 지급을 미룰 수 없다.' },
          { title: '제9조 (목적물 검수 기한 10일 준수)', desc: '인도 후 10일 이내에 검수 결과를 서면 통보하여야 하며 기한 내 이의가 없으면 검수가 종료된 것으로 본다.' },
          { title: '제13조 (계약 해지 30일 전 서면 예고)', desc: '부득이한 사유로 계약을 중도 해지할 경우 30일 전 서면 통보하여야 하며 기수행 공수에 대한 대금을 정산한다.' },
          { title: '제17조 (분쟁 시 관할 법원 합의)', desc: '분쟁 발생 시 대한상사중재원 또는 수급인(프리랜서) 주소지 관할 법원을 우선 합의 관할로 지정할 수 있다.' }
        ],
        caution: '중도 타절 시에도 기수행 공수에 대해 대금을 보장받는 제13조 중도 정산 조항을 꼭 확인하세요.',
        downloadUrl: 'https://www.ftc.go.kr',
        previewId: 'general'
      },
      {
        id: 'copyright_transfer',
        domain: 'general',
        title: '저작재산권 양도 및 이용허락 표준계약서',
        issuer: '문화체육관광부·한국저작권위원회 고시',
        ministryBadge: '저작권위원회 공식',
        badgeColor: 'violet',
        summary: '창작물의 저작재산권 전부/일부 양도 또는 비독점 이용허락 시 권리 이전 시점과 2차적 저작물 작성권 범위를 정밀 규정합니다.',
        targets: ['일러스트/삽화', '음악/효과음', '소프트웨어 라이선스', '사진/영상 소스', '캐릭터 IP'],
        clauses: [
          { title: '제3조 (권리 이전의 조건부 효력)', desc: '본 계약에 따른 저작재산권의 양도 또는 이용 권리는 발주자가 양도 대금을 전액 완납한 때에 비로소 효력이 발생한다.' },
          { title: '제7조 (저작인격권 존중 및 성명표시)', desc: '저작재산권이 양도되더라도 저작자의 성명표시권 및 동일성유지권 등 저작인격권은 창작자에게 전속된다.' },
          { title: '제10조 (이용 매체 및 지역적 범위 제한)', desc: '이용허락의 경우 허락된 플랫폼(국내 온라인 등) 및 계약 기간을 명시하며 이를 초과하는 사용은 별도 허락을 요한다.' },
          { title: '제14조 (미채택 후보작의 권리 유보)', desc: '납품 과정에서 제안되었으나 최종 선정되지 않은 기획안·후보작의 권리는 창작자에게 귀속된다.' }
        ],
        caution: '대금 전액 완납 전 클라이언트가 무단 사용하는 것을 방지하는 제3조 대금완납 정지조건을 꼭 확인하세요.',
        downloadUrl: 'https://www.copyright.or.kr',
        previewId: 'transfer'
      }
    ];

    function toggleContractLibrary(forceOpen) {
      const wrapper = document.getElementById('contractLibContentWrapper');
      const chevron = document.getElementById('contractLibChevronIcon');
      const chevronHeader = document.getElementById('contractLibChevronHeaderIcon');
      if (!wrapper) return;

      if (forceOpen === true) {
        isContractLibCollapsed = false;
      } else {
        isContractLibCollapsed = !isContractLibCollapsed;
      }

      if (isContractLibCollapsed) {
        wrapper.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
        if (chevronHeader) chevronHeader.style.transform = 'rotate(180deg)';
      } else {
        wrapper.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
        if (chevronHeader) chevronHeader.style.transform = 'rotate(0deg)';
        renderContractLibList();
        renderContractLibDetail(selectedContractLibId);
      }
    }

    function filterContractLibList(val) {
      currentContractLibSearch = (val || '').toLowerCase().trim();
      renderContractLibList();
    }

    function filterContractLibByDomain(domain) {
      currentContractLibDomain = domain || 'all';
      document.querySelectorAll('.contract-lib-filter-btn').forEach(btn => {
        if (btn.dataset.domain === domain) {
          btn.className = 'contract-lib-filter-btn px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-slate-900 text-white';
        } else {
          btn.className = 'contract-lib-filter-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition-all bg-white hover:bg-slate-100 text-slate-700 border border-slate-200';
        }
      });
      renderContractLibList();
    }

    function selectContractLib(id) {
      selectedContractLibId = id;
      renderContractLibList();
      renderContractLibDetail(id);
    }

    function renderContractLibList() {
      const listBox = document.getElementById('contractLibListBox');
      if (!listBox) return;

      let filtered = CONTRACT_LIB_DATA.filter(item => {
        const matchesDomain = (currentContractLibDomain === 'all' || item.domain === currentContractLibDomain);
        const q = currentContractLibSearch;
        const matchesSearch = !q ||
          item.title.toLowerCase().includes(q) ||
          item.issuer.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.targets.some(t => t.toLowerCase().includes(q));
        return matchesDomain && matchesSearch;
      });

      if (filtered.length === 0) {
        listBox.innerHTML = `
          <div class="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p class="text-xs text-slate-500 font-medium">검색 조건에 일치하는 표준계약서가 없습니다.</p>
          </div>
        `;
        return;
      }

      if (!filtered.some(f => f.id === selectedContractLibId)) {
        selectedContractLibId = filtered[0].id;
        renderContractLibDetail(selectedContractLibId);
      }

      listBox.innerHTML = filtered.map(item => {
        const isSelected = item.id === selectedContractLibId;
        const borderClass = isSelected ? 'border-indigo-600 bg-indigo-50/60 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80';
        return `
          <button type="button" onclick="selectContractLib('${item.id}')" class="w-full text-left p-3.5 rounded-xl border ${borderClass} transition-all space-y-2 group block">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-white/90 text-slate-700 border border-slate-200">${item.ministryBadge}</span>
              <span class="text-[10px] text-slate-500 font-mono">${item.issuer.split(' ')[0]}</span>
            </div>
            <div>
              <div class="font-bold text-slate-900 text-xs flex items-center justify-between">
                <span>${item.title}</span>
                <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all"></i>
              </div>
              <p class="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">${item.summary}</p>
            </div>
            <div class="flex flex-wrap gap-1 pt-1">
              ${item.targets.slice(0, 3).map(t => `<span class="text-[9.5px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">${t}</span>`).join('')}
              ${item.targets.length > 3 ? `<span class="text-[9.5px] text-slate-400 font-medium">+${item.targets.length - 3}</span>` : ''}
            </div>
          </button>
        `;
      }).join('');

      if (window.lucide) lucide.createIcons();
    }

    function renderContractLibDetail(id) {
      const detailBox = document.getElementById('contractLibDetailBox');
      if (!detailBox) return;

      const item = CONTRACT_LIB_DATA.find(c => c.id === id) || CONTRACT_LIB_DATA[0];
      if (!item) return;

      detailBox.innerHTML = `
        <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-2xs">
          <!-- Top info -->
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">${item.ministryBadge}</span>
                <span class="text-xs text-slate-500">${item.issuer}</span>
              </div>
              <h4 class="text-base font-bold text-slate-900">${item.title}</h4>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">${item.summary}</p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <button type="button" onclick="openContractPreviewModal('${item.previewId}')" class="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
                <span>서식 미리보기</span>
              </button>
              <a href="${item.downloadUrl}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs">
                <i data-lucide="download" class="w-3.5 h-3.5"></i>
                <span>공식 원문 받기</span>
              </a>
            </div>
          </div>

          <!-- Target fields -->
          <div class="space-y-1.5">
            <span class="text-[11px] font-bold text-slate-700 block">적용 추천 대상 및 세부 분야:</span>
            <div class="flex flex-wrap gap-1.5">
              ${item.targets.map(t => `<span class="px-2 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-medium">✓ ${t}</span>`).join('')}
            </div>
          </div>

          <!-- 4 Core Clauses -->
          <div class="space-y-2 pt-1">
            <span class="text-[11px] font-bold text-indigo-950 flex items-center gap-1">
              <i data-lucide="shield-check" class="w-3.5 h-3.5 text-emerald-600"></i>
              <span>본 서식의 핵심 법적 보호 조항 (4대 조항)</span>
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              ${item.clauses.map(c => `
                <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span class="font-bold text-slate-900 text-[11.5px] block">${c.title}</span>
                  <p class="text-[11px] text-slate-600 leading-relaxed">${c.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Caution Box -->
          <div class="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs flex items-start gap-2">
            <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
            <div class="text-[11px] text-amber-900 leading-relaxed">
              <strong>실무 협상 가이드:</strong> ${item.caution}
            </div>
          </div>
        </div>
      `;

      if (window.lucide) lucide.createIcons();
    }

    // 1. 업무 분야별 표준계약서 추천 엔진 (분야 + 계약유형 2차원 교차 추천)
    function openContractPreviewModal(templateId) {
      const modal = document.getElementById('contractPreviewModal');
      if (!modal) return;

      const titleEl = document.getElementById('cpmTitle');
      const subEl = document.getElementById('cpmSubtitle');
      const descEl = document.getElementById('cpmOverviewDesc');
      const clauseList = document.getElementById('cpmClauseList');
      const linkEl = document.getElementById('cpmDownloadLink');

      if (templateId === 'design' || templateId === 'kidp_design') {
        if (titleEl) titleEl.textContent = '디자인 용역 표준계약서 미리보기';
        if (subEl) subEl.textContent = '산업통상자원부 및 한국디자인진흥원(KIDP) 공식 고시 표준 서식';
        if (descEl) descEl.textContent = '본 서식은 디자인 용역의 특성을 반영하여 시안 수정 횟수를 명문화하고, 미채택된 시안에 대한 권리를 디자이너에게 보존하며 납품 검수 기한을 투명하게 규정합니다.';
        if (clauseList) {
          clauseList.innerHTML = `
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제5조 (시안 제출 및 수정 횟수 제한)</span>
              <p class="text-[11px] text-slate-600">수급인이 제출하는 기본 시안은 2종으로 하며, 발주자의 수정 요구는 2회에 한하여 무상으로 진행한다. 이를 초과하는 수정 및 컨셉의 근본적 변경은 별도의 추가 비용을 산정한다.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제8조 (산출물 검수 및 승인 절차)</span>
              <p class="text-[11px] text-slate-600">발주자는 최종 산출물 수령일로부터 10일 이내에 서면으로 검수 결과를 통지해야 하며, 정당한 사유 없이 통지하지 않을 경우 검수에 합격한 것으로 간주한다.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제12조 (미채택 시안 및 저작권의 귀속)</span>
              <p class="text-[11px] text-slate-600">최종 채택되지 않은 시안에 대한 모든 저작권은 수급인에게 유보되며, 발주자는 채택되지 않은 시안을 무단으로 모방하거나 제3자에게 제공할 수 없다. 최종 산출물의 저작재산권은 용역비 완납 즉시 이전된다.</p>
            </div>
          `;
        }
        if (linkEl) linkEl.href = 'https://kidp.or.kr/?menuno=935&bbsno=15523&siteno=16&act=view&ztag=rO0ABXQAMzxjYWxsIHR5cGU9ImJvYXJkIiBubz0iNjIyIiBza2luPSJraWRwX2JicyI%2BPC9jYWxsPg%3D%3D';
      } else if (templateId === 'publishing' || templateId === 'mcst_publishing') {
        if (titleEl) titleEl.textContent = '디지털 출판·전자책 배급 표준계약서 미리보기';
        if (subEl) subEl.textContent = '문화체육관광부 고시 표준 출판권 및 배타적발행권 설정 서식';
        if (descEl) descEl.textContent = '본 서식은 저작자의 2차적 저작물 작성권을 안전하게 보존하고, 전자출판 및 오디오북 정산 시 플랫폼 수수료 공제 내역을 투명하게 공개하도록 돕습니다.';
        if (clauseList) {
          clauseList.innerHTML = `
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제4조 (2차적 저작물 작성권 등의 유보)</span>
              <p class="text-[11px] text-slate-600">저작물을 원작으로 하여 영상, 연극, 번역, 굿즈 등 2차적 저작물을 작성·이용할 수 있는 권리는 저작자에게 유보되며, 출판사가 이를 대행하고자 할 때는 별도의 서면 계약을 체결한다.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제9조 (인세 및 대금 정산 주기)</span>
              <p class="text-[11px] text-slate-600">출판사는 분기별 또는 반기별로 판매 부수 및 다운로드 현황, 정산 산출 근거를 서면 또는 전자문서로 저작자에게 통지하고 익월 말일까지 인세를 지급한다.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제14조 (계약 기간 및 해지)</span>
              <p class="text-[11px] text-slate-600">본 계약의 유효기간은 3년으로 하며, 기간 만료 3개월 전까지 쌍방의 서면 갱신 의사 표시가 없을 경우 자동 해지된다.</p>
            </div>
          `;
        }
        if (linkEl) linkEl.href = 'https://www.mcst.go.kr/site/s_data/generalData/dataView.jsp?pSeq=32&pMenuCD=0405050000&pCurrentPage=1&pType=04&pSearchType=01&pSearchWord=%EC%B6%9C%ED%8C%90+%EB%B6%84%EC%95%BC+%ED%91%9C%EC%A4%80%EA%B3%84%EC%95%BD%EC%84%9C';
      } else if (templateId === 'content' || templateId === 'kocca_content') {
        if (titleEl) titleEl.textContent = '방송·영상·콘텐츠 외주제작 표준계약서 미리보기';
        if (subEl) subEl.textContent = '문화체육관광부 및 방송통신위원회 공식 고시 표준 서식';
        if (descEl) descEl.textContent = '영상 및 멀티미디어 외주 제작 환경에서 유료 음원/폰트 책임 소재를 명문화하고 최종 렌더링 파일과 원본 프로젝트 소스(aep/prproj)의 제공 범위를 명확히 분리합니다.';
        if (clauseList) {
          clauseList.innerHTML = `
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제6조 (산출물 납품 및 원본 프로젝트 파일 범위)</span>
              <p class="text-[11px] text-slate-600">제작자가 납품하는 산출물은 최종 인코딩된 마스터 영상 파일(MP4/MOV)에 한한다. 프로젝트 원본 파일(Ae/Pr 등)의 인도는 별도의 서면 합의와 추가 대금 지급을 전제로 한다.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제8조 (유료 라이선스 책임)</span>
              <p class="text-[11px] text-slate-600">발주자의 특정 요청으로 사용된 상업용 음원, 서체, 스톡 영상 라이선스 구매 비용 및 라이선스 기간 경과 후 발생하는 법적 책임은 발주자가 전적으로 부담한다.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제16조 (크레딧 표기 및 포트폴리오 활용)</span>
              <p class="text-[11px] text-slate-600">제작자는 영상물 크레딧에 자신의 성명 또는 상호를 표기할 권리를 가지며, 제작 완료된 결과물을 자신의 제작 실적 포트폴리오로 공개 게시할 수 있다.</p>
            </div>
          `;
        }
        if (linkEl) linkEl.href = 'https://www.kocca.kr';
      } else if (templateId === 'transfer' || templateId === 'copyright_transfer') {
        if (titleEl) titleEl.textContent = '저작재산권 양도 및 이용허락 표준계약서 미리보기';
        if (subEl) subEl.textContent = '문화체육관광부 및 한국저작권위원회 공식 고시 표준 서식';
        if (descEl) descEl.textContent = '저작물의 권리 이전 또는 이용허락 시 대금 완납을 정지조건으로 명시하고 창작자의 저작인격권(성명표시권)을 안전하게 보호합니다.';
        if (clauseList) {
          clauseList.innerHTML = `
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제3조 (권리 이전의 조건부 효력 발생)</span>
              <p class="text-[11px] text-slate-600">본 계약에 따른 저작재산권의 이전 또는 독점적 이용 권리는 발주자가 수급인에게 약정된 대금 전액을 완납한 시점에 비로소 법적 효력이 발생한다.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제7조 (저작인격권의 전속)</span>
              <p class="text-[11px] text-slate-600">저작재산권이 양도되더라도 성명표시권 및 동일성유지권 등 창작자의 고유한 저작인격권은 침해될 수 없으며 발주자는 원작자의 성명을 성실히 표시하여야 한다.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제14조 (미채택 시안 및 기획안 유보)</span>
              <p class="text-[11px] text-slate-600">용역 과정에서 제안되었으나 최종 선택되지 않은 후보 시안이나 기획안에 대한 모든 권리는 창작자에게 유보되며 무단 전용할 수 없다.</p>
            </div>
          `;
        }
        if (linkEl) linkEl.href = 'https://www.copyright.or.kr';
      } else if (templateId === 'general' || templateId === 'ftc_freelance') {
        if (titleEl) titleEl.textContent = '프리랜서 지식용역 표준계약서 미리보기';
        if (subEl) subEl.textContent = '공정거래위원회 고시 용역위탁 표준 서식';
        if (descEl) descEl.textContent = '컨설팅, 번역, 카피라이팅, 기획 등 지식 서비스 프리랜서를 위해 부당 대금 감액 금지와 중도 해지 시 기수행 공수 정산 원칙을 체계화했습니다.';
        if (clauseList) {
          clauseList.innerHTML = `
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제5조 (부당한 대금 감액 및 지급 보류 금지)</span>
              <p class="text-[11px] text-slate-600">발주자는 납품 목적물의 하자가 객관적으로 입증되지 않는 한 당초 약정된 대금을 감액하거나 지급을 부당하게 미룰 수 없다.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제9조 (검수 기한 10일 준수)</span>
              <p class="text-[11px] text-slate-600">목적물을 수령한 날로부터 10일 이내에 서면으로 검수 결과를 통지하여야 하며 기한 내 이의가 없으면 검수가 종료된 것으로 본다.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제13조 (중도 해지 시 기수행 공수 정산)</span>
              <p class="text-[11px] text-slate-600">발주자의 귀책으로 계약이 중도 해지되는 경우, 발주자는 해지 시점까지 수급인이 수행한 공수에 비례하는 용역 대금을 즉시 정산 지급하여야 한다.</p>
            </div>
          `;
        }
        if (linkEl) linkEl.href = 'https://www.ftc.go.kr';
      } else {
        if (titleEl) titleEl.textContent = 'SW 용역 표준계약서 미리보기';
        if (subEl) subEl.textContent = '과학기술정보통신부 공식 고시 표준 서식';
        if (descEl) descEl.textContent = '본 서식은 개발자의 지식재산권을 보호하고, 발주자의 일방적인 과업 변경 및 지체상금 남용을 방지하기 위한 표준 조항들로 구성되어 있습니다.';
        if (clauseList) {
          clauseList.innerHTML = `
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제4조 (과업의 변경 및 계약금액 조정)</span>
              <p class="text-[11px] text-slate-600">발주자의 요구로 과업 내용이나 사양이 변경될 경우, 수급인은 추가 일정 및 견적 증액을 서면으로 요청할 수 있으며 상호 합의 하에 계약을 변경한다.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제7조 (산출물 검수 및 잔금 지급)</span>
              <p class="text-[11px] text-slate-600">수급인이 최종 산출물을 전달한 날로부터 계약서에 정한 검수 기한(통상 10~14일) 내에 서면으로 검수 결과를 통보해야 하며, 기한 경과 시 검수가 합격된 것으로 간주한다.</p>
            </div>
            <div class="p-3 rounded-xl bg-white border border-slate-200 space-y-1">
              <span class="font-bold text-slate-900">제11조 (지식재산권 귀속 및 권리 이전 시점)</span>
              <p class="text-[11px] text-slate-600">본 용역으로 창작된 최종 산출물의 저작재산권은 발주자가 수급인에게 계약상 용역 대금 전액을 완납한 시점에 발주자에게 이전된다.</p>
            </div>
          `;
        }
        if (linkEl) linkEl.href = 'https://www.msit.go.kr/bbs/view.do?sCode=user&mId=245&mPid=243&bbsSeqNo=67&nttSeqNo=3139474';
      }

      modal.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }

    function closeContractPreviewModal() {
      const modal = document.getElementById('contractPreviewModal');
      if (modal) modal.classList.add('hidden');
    }

// 1. 업무 분야별 표준계약서 추천 엔진 (분야별 맞춤 계약유형 2차원 교차 추천)
const DOMAIN_CONTRACT_TYPES = {
  all: [
    { id: 'all', label: '전체 유형' },
    { id: 'new', label: '신규 프로젝트 제작' },
    { id: 'maintenance', label: '유지보수 및 운영 (IT/기술)' },
    { id: 'license', label: '저작권 이용허락 (라이선스)' },
    { id: 'transfer', label: '저작재산권 양도' }
  ],
  design: [
    { id: 'all', label: '전체 디자인 서식' },
    { id: 'visual', label: '🎨 시각디자인 (BI·CI·패키지)' },
    { id: 'digital', label: '📱 디지털·UI/UX 디자인 (웹·앱)' },
    { id: 'product', label: '⚙️ 제품·산업 디자인 (기구·외관)' },
    { id: 'license', label: '📜 디자인 저작권 이용허락 (라이선스)' },
    { id: 'transfer', label: '⚖️ 디자인 저작재산권 양도' }
  ],
  it: [
    { id: 'all', label: '전체 SW 서식' },
    { id: 'new', label: '💻 SW 신규 개발·구축 용역' },
    { id: 'maintenance', label: '🛠️ 시스템 유지보수 및 운영 위탁' },
    { id: 'transfer', label: '⚖️ SW 저작재산권 양도 및 이용허락' }
  ],
  content: [
    { id: 'all', label: '전체 콘텐츠 서식' },
    { id: 'new', label: '🎬 영상 신규 외주제작 (촬영·편집)' },
    { id: 'license', label: '📺 영상 방영권·전송권 이용허락' },
    { id: 'transfer', label: '📁 프로젝트 원본 소스 및 저작권 양도' }
  ],
  publishing: [
    { id: 'all', label: '전체 출판 서식' },
    { id: 'publishing_right', label: '📖 출판권 및 배타적발행권 설정 (종이책·eBook)' },
    { id: 'manuscript', label: '✍️ 원고 집필 및 디지털 콘텐츠 이용허락' },
    { id: 'transfer', label: '⚖️ 출판 저작재산권 양도' }
  ],
  general: [
    { id: 'all', label: '전체 서식' },
    { id: 'new', label: '📝 프리랜서 지식용역 위탁' },
    { id: 'maintenance', label: '🛠️ 시스템 유지보수 및 운영 위탁' },
    { id: 'license', label: '📜 저작재산권 이용허락 (라이선스)' },
    { id: 'transfer', label: '⚖️ 저작재산권 양도' }
  ]
};

function renderContractTypeChips(domain) {
  const container = document.getElementById('contractTypeFilterChips');
  if (!container) return;
  const types = DOMAIN_CONTRACT_TYPES[domain] || DOMAIN_CONTRACT_TYPES.all;
  
  if (!types.some(t => t.id === currentContractType)) {
    currentContractType = 'all';
  }

  container.innerHTML = types.map(t => {
    const isSelected = t.id === currentContractType;
    const btnClass = isSelected
      ? 'px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold transition-all shadow-xs'
      : 'px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all';
    return `<button type="button" onclick="setContractTypeFilter('${t.id}')" id="ctChip-${t.id}" class="${btnClass}">${t.label}</button>`;
  }).join('');
}

function setContractDomainFilter(domain) {
  currentContractDomain = domain;
  const chips = ['all', 'design', 'it', 'content', 'publishing', 'general'];
  chips.forEach(c => {
    const btn = document.getElementById(`cdChip-${c}`);
    if (btn) {
      if (c === domain) {
        btn.className = 'px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold transition-all shadow-xs';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all';
      }
    }
  });
  renderContractTypeChips(domain);
  updateContractRecommendation();
}

function setContractTypeFilter(type) {
  currentContractType = type;
  const domain = currentContractDomain || 'all';
  const types = DOMAIN_CONTRACT_TYPES[domain] || DOMAIN_CONTRACT_TYPES.all;
  types.forEach(t => {
    const btn = document.getElementById(`ctChip-${t.id}`);
    if (btn) {
      if (t.id === type) {
        btn.className = 'px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold transition-all shadow-xs';
      } else {
        btn.className = 'px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all';
      }
    }
  });
  updateContractRecommendation();
}

function updateContractRecommendation() {
  const nameEl = document.getElementById('recContractName');
  const sourceEl = document.getElementById('recContractSource');
  const reasonEl = document.getElementById('recContractReason');
  const keyClauseEl = document.getElementById('recKeyClause');
  const inspEl = document.getElementById('recInspectionClause');
  const trustEl = document.getElementById('recTrustInfo');
  const linkEl = document.getElementById('recDownloadLink');

  const domain = currentContractDomain || 'all';
  const type = currentContractType || 'all';

  let rec = {
    name: 'SW 용역 표준계약서 (과학기술정보통신부 공식 고시)',
    source: '과기정통부 고시 제2023-14호',
    reason: '개발·IT 프로젝트에 가장 적합한 공식 서식으로, 과업 범위 변경 시 대금 조정 절차와 소프트웨어 산출물의 지식재산권 귀속 기준 및 계약서상 검수 기한이 명확히 규정되어 있습니다.',
    keyClause: '업무 범위 변경 대금 증액, 저작권 완납 시 이전',
    insp: '검수 기한 명시(10~14일), 지연 시 자동 합격 간주',
    trust: '과기정통부 공식 포털 서식 자료실',
    link: 'https://www.msit.go.kr/bbs/view.do?sCode=user&mId=245&mPid=243&bbsSeqNo=67&nttSeqNo=3139474',
    preview: 'it'
  };

  if (domain === 'design') {
    if (type === 'visual') {
      rec = {
        name: '시각디자인 용역 표준계약서 (한국디자인진흥원 KIDP 공식)',
        source: '산업통상자원부·KIDP 고시 표준 서식',
        reason: 'BI·CI 브랜드 로고, 그래픽, 패키지 디자인에 특화된 공식 서식입니다. 기본 시안 2종 제출 및 무상 수정 2회 제한 규정이 명시되어 있으며, 최종 채택되지 않은 시안의 모든 지식재산권은 디자이너에게 유보됩니다.',
        keyClause: '시안 수정 2회 한정, 미채택 시안 지재권 원작자 귀속, 포트폴리오 사용권',
        insp: '산출물 납품 후 10일 이내 서면 검수 완료 및 잔금 정산',
        trust: '한국디자인진흥원(KIDP) 공식 서식 자료실',
        link: 'https://kidp.or.kr/?menuno=935&bbsno=15523&siteno=16&act=view&ztag=rO0ABXQAMzxjYWxsIHR5cGU9ImJvYXJkIiBubz0iNjIyIiBza2luPSJraWRwX2JicyI%2BPC9jYWxsPg%3D%3D',
        preview: 'design'
      };
    } else if (type === 'digital') {
      rec = {
        name: '디지털디자인(UI/UX·웹) 용역 표준계약서 (KIDP 고시)',
        source: '한국디자인진흥원 공인 디지털디자인 서식',
        reason: '웹사이트, 모바일 앱 화면설계, 디자인 시스템(피그마) 및 프로토타입 제작에 최적화된 서식입니다. 화면설계서 승인 후 추가 페이지 발생 시 견적 조정 절차와 해상도별 반응형 작업 범위가 명시됩니다.',
        keyClause: '기획서 외 추가 페이지 별도 정산, 피그마 컴포넌트 에셋 인도 범위 분리',
        insp: '단계별 프로토타입 서면 승인 후 14일 이내 최종 검수 완료',
        trust: '한국디자인진흥원(KIDP) 디지털디자인 표준',
        link: 'https://kidp.or.kr',
        preview: 'design'
      };
    } else if (type === 'product') {
      rec = {
        name: '제품·산업디자인 용역 표준계약서 (산업통상자원부·KIDP)',
        source: '산업통상자원부 고시 제2019-140호',
        reason: '하드웨어 외관, 기구설계, 3D 모델링 및 렌더링 프로젝트에 최적화된 서식입니다. 목업(Mock-up) 제작 비용 및 금형 수정 시 설계 변경 합의 절차가 규정되어 있습니다.',
        keyClause: '3D CAD 데이터 납품 기준, 목업 제작비 별도 정산, 양산 설계 변경 협의',
        insp: '3D 모델링 검증 후 14일 이내 검수 통지 및 단계별 잔금 지급',
        trust: '산업통상자원부·한국디자인진흥원',
        link: 'https://kidp.or.kr',
        preview: 'design'
      };
    } else if (type === 'license') {
      rec = {
        name: '디자인 저작재산권 이용허락(라이선스) 표준계약서',
        source: '문화체육관광부·한국저작권위원회 공인 표준 서식',
        reason: '캐릭터, 일러스트, 그래픽 에셋의 원본 소유권을 넘기지 않고, 발주자에게 정해진 매체(온라인/인쇄 등), 사용 기간, 사용 지역에 한하여 이용 권한만을 허여하는 안전한 라이선스 서식입니다.',
        keyClause: '저작권 창작자 원시 귀속, 허용 매체 외 무단 사용 시 저작권 침해 간주',
        insp: '라이선스 개시일 확인 및 라이선스 사용료 선지급 원칙',
        trust: '한국저작권위원회 공식 라이선스 자료실',
        link: 'https://www.copyright.or.kr',
        preview: 'transfer'
      };
    } else if (type === 'transfer') {
      rec = {
        name: '디자인 저작재산권 양도 표준계약서 (KIDP·공정위)',
        source: '산업통상자원부·공정거래위원회 공인 표준 서식',
        reason: '발주자의 요구로 산출물의 지식재산권을 이전할 때 사용하는 서식입니다. 반드시 "용역 대금 전액 완납"을 정지조건으로 권리가 이전되며, 채택되지 않은 시안은 디자이너에게 영구 유보됩니다.',
        keyClause: '용역 잔금 전액 완납 시 권리 이전(정지조건), 미채택 시안 디자이너 유보',
        insp: '최종 잔금 입금 확인증 발행과 동시에 권리 이전 효력 발생',
        trust: '공정거래위원회 및 한국디자인진흥원 공시',
        link: 'https://www.ftc.go.kr',
        preview: 'transfer'
      };
    } else {
      rec = {
        name: '디자인 용역 표준계약서 (한국디자인진흥원 KIDP 공식 고시)',
        source: '산업통상자원부·KIDP 고시 표준 서식',
        reason: '시각, 제품, 디지털(UI/UX), 서비스디자인 등 디자인 전 분야에 걸쳐 시안 수정 횟수 제한(2회), 미채택 시안 권리 유보, 검수 기한(10일)이 정밀 규정된 공식 표준 서식입니다.',
        keyClause: '시안 수정 2회 한정, 미채택 시안 지재권 원작자 귀속, 포트폴리오 사용권',
        insp: '약정 검수 기한(10일) 내 서면 피드백 및 기한 경과 시 승인 간주',
        trust: '한국디자인진흥원 공식 포털 자료실',
        link: 'https://kidp.or.kr/?menuno=935&bbsno=15523&siteno=16&act=view&ztag=rO0ABXQAMzxjYWxsIHR5cGU9ImJvYXJkIiBubz0iNjIyIiBza2luPSJraWRwX2JicyI%2BPC9jYWxsPg%3D%3D',
        preview: 'design'
      };
    }
  } else if (domain === 'it') {
    if (type === 'maintenance') {
      rec = {
        name: 'SW 및 시스템 유지보수·운영 위탁 표준계약서 (과기정통부 표준)',
        source: '과학기술정보통신부 표준 서식',
        reason: '구축 완료된 시스템, 앱, 웹사이트의 지속적인 유지관리 및 서버 운영에 최적화된 서식입니다. 월간 고정 유지보수비 정산, 정기점검 SLA(장애 복구 시간 보장), 자동 갱신 제한 및 해지 예고 기간이 포함됩니다.',
        keyClause: '월간 SLA(서비스수준합의) 기준 명시, 장애 등급별 대응 시간, 계약 30일 전 해지 예고',
        insp: '매월 말일 유지보수 월간 보고서 제출 후 익월 10일 이내 정산',
        trust: '과기정통부 공인 소프트웨어 유지관리 기준',
        link: 'https://www.msit.go.kr',
        preview: 'it'
      };
    } else if (type === 'transfer') {
      rec = {
        name: 'SW 저작재산권 양도 및 이용허락 표준계약서 (과기정통부)',
        source: '과학기술정보통신부·공정위 고시 서식',
        reason: '소프트웨어 소스코드 및 산출물의 저작권을 발주처에 양도하거나 전용 실시권을 부여할 때 사용합니다. 용역 잔금 완납 시 권리가 이전되며 오픈소스 라이선스 고지 의무가 명시됩니다.',
        keyClause: '용역 대금 전액 완납 시 권리 이전, 오픈소스 라이선스 고지 준수',
        insp: '소스코드 레포지토리 이전 및 최종 잔금 정산 시 효력 발생',
        trust: '과기정통부 SW진흥포털',
        link: 'https://www.msit.go.kr',
        preview: 'it'
      };
    } else {
      rec = {
        name: 'SW 신규 구축·개발 표준계약서 (과기정통부 공식 고시)',
        source: '과기정통부 고시 제2023-14호',
        reason: '신규 소프트웨어 개발 및 웹/앱 시스템 구축에 가장 최적화된 서식입니다. 과업내용서(SOW) 변경 시 추가 견적 청구 권리와 마일스톤 단계별 검수 승인 기준이 체계화되어 있습니다.',
        keyClause: '과업 변경 시 대금 및 일정 의무 조정, 지체상금 1일 0.1% 상한',
        insp: '산출물 납품 후 14일 이내 서면 검수 완료, 기한 경과 시 승인 간주',
        trust: '과학기술정보통신부 소프트웨어산업진흥 포털',
        link: 'https://www.msit.go.kr/bbs/view.do?sCode=user&mId=245&mPid=243&bbsSeqNo=67&nttSeqNo=3139474',
        preview: 'it'
      };
    }
  } else if (domain === 'content') {
    if (type === 'license') {
      rec = {
        name: '방송·영상 저작물 이용허락(방영권·전송권) 표준계약서',
        source: '문화체육관광부·한국콘텐츠진흥원 표준 서식',
        reason: '제작된 영상의 저작권을 이전하지 않고 특정 플랫폼(유튜브, 웹사이트, 방송 등) 및 방영 기간을 한정하여 전송 권한만을 부여합니다.',
        keyClause: '허용 플랫폼 한정, 2차 가공 시 제작자 사전 동의, 크레딧 표기 의무',
        insp: '송출 개시일 확인 및 라이선스료 전액 선지급',
        trust: '한국콘텐츠진흥원(KOCCA) 공식',
        link: 'https://www.kocca.kr',
        preview: 'content'
      };
    } else if (type === 'transfer') {
      rec = {
        name: '영상 저작재산권 및 원본 소스 양도 표준계약서',
        source: '문화체육관광부 고시 표준 서식',
        reason: '영상 마스터 파일과 프로젝트 원본 소스(Pr/Ae) 및 모든 저작재산권을 일괄 양도하는 서식으로, 용역 대금 완납을 정지조건으로 합니다.',
        keyClause: '대금 완납 시 권리 이전(정지조건), 음원·폰트 유료 라이선스 책임 발주처 부담',
        insp: '최종 잔금 완납 확인과 동시에 원본 소스 인수인계',
        trust: '문화체육관광부·KOCCA',
        link: 'https://www.kocca.kr',
        preview: 'transfer'
      };
    } else {
      rec = {
        name: '방송·영상·콘텐츠 신규 외주제작 표준계약서 (문체부·방통위)',
        source: '문화체육관광부·방통위 고시 표준 서식',
        reason: '유튜브 영상 편집, 광고 콘텐츠, 모션그래픽 외주 제작에 특화되어 스토리보드 확정, 가편집/종합편집 피드백 일정, 최종 렌더링 파일 납품 의무와 원본 프로젝트 파일(aep, prproj) 별도 정산 원칙을 규정합니다.',
        keyClause: '가편/종편 단계별 검수, 렌더링 파일 납품, 원본 소스 별도 계약',
        insp: '종합 편집본 전달 후 7일 이내 피드백 완료 간주 규정',
        trust: '한국콘텐츠진흥원(KOCCA) 공식 자료실',
        link: 'https://www.kocca.kr',
        preview: 'content'
      };
    }
  } else if (domain === 'publishing') {
    if (type === 'manuscript') {
      rec = {
        name: '디지털 콘텐츠 원고 집필 및 이용허락 표준계약서',
        source: '문화체육관광부 출판·콘텐츠 표준 서식',
        reason: '사보, 매거진, 웹 칼럼, 전자책용 원고 집필 위탁에 특화되어 글자수/분량 기준, 탈고 기한, 원고료 정산 및 수정 횟수 제한을 명확히 합니다.',
        keyClause: '원고 탈고 기준 명시, 수정 1회 한정, 출판 여부 무관 원고료 전액 지급',
        insp: '원고 전달 후 7일 이내 서면 검수 통지',
        trust: '문화체육관광부 포털',
        link: 'https://www.mcst.go.kr',
        preview: 'publishing'
      };
    } else if (type === 'transfer') {
      rec = {
        name: '출판 저작재산권 양도 표준계약서 (문체부 고시)',
        source: '문화체육관광부 고시 표준 서식',
        reason: '원고의 저작권을 양도할 때 사용하는 서식으로, 저작권료 전액 완납 시점에 권리가 이전되며 2차적 저작물 작성권은 원작자에게 안전하게 유보됩니다.',
        keyClause: '용역 대금 전액 완납 시 권리 이전, 2차 저작물 작성권 작가 유보',
        insp: '최종 인세 및 원고료 완납 확인 시 효력 발생',
        trust: '문화체육관광부 공식 정보공개',
        link: 'https://www.mcst.go.kr',
        preview: 'transfer'
      };
    } else {
      rec = {
        name: '출판권 및 배타적발행권 설정 표준계약서 (문체부 고시)',
        source: '문화체육관광부 고시 제2021-12호',
        reason: '도서·전자책(eBook) 배타적 발행 권리를 설정하는 표준 서식으로, 2차적 저작물(영상화, 번역, 웹툰화) 작성권을 작가에게 온전히 보장하며 분기별 투명한 순인세 정산을 의무화합니다.',
        keyClause: '원고 탈고 기준 명시, 2차적 저작물 작성권 작가 유보, 선인세 지급',
        insp: '원고 인도 후 30일 이내 교정·인쇄 승인 절차 규정',
        trust: '문화체육관광부 공식 정보공개 포털',
        link: 'https://www.mcst.go.kr/site/s_data/generalData/dataView.jsp?pSeq=32&pMenuCD=0405050000&pCurrentPage=1&pType=04&pSearchType=01&pSearchWord=%EC%B6%9C%ED%8C%90+%EB%B6%84%EC%95%BC+%ED%91%9C%EC%A4%80%EA%B3%84%EC%95%BD%EC%84%9C',
        preview: 'publishing'
      };
    }
  } else {
    // domain === 'general' or 'all'
    if (type === 'maintenance') {
      rec = {
        name: 'SW 및 시스템 유지보수·운영 위탁 표준계약서 (과기정통부 표준)',
        source: '과학기술정보통신부 표준 서식',
        reason: '구축 완료된 시스템, 앱, 웹사이트의 지속적인 유지관리 및 서버 운영에 최적화된 서식입니다. 월간 고정 유지보수비 정산, 정기점검 SLA(장애 복구 시간 보장), 자동 갱신 제한 및 해지 예고 기간이 포함됩니다.',
        keyClause: '월간 SLA(서비스수준합의) 기준 명시, 장애 등급별 대응 시간, 계약 30일 전 해지 예고',
        insp: '매월 말일 유지보수 월간 보고서 제출 후 익월 10일 이내 정산',
        trust: '과기정통부 공인 소프트웨어 유지관리 기준',
        link: 'https://www.msit.go.kr',
        preview: 'it'
      };
    } else if (type === 'license') {
      rec = {
        name: '저작재산권 이용허락(라이선스) 표준계약서 (문체부·저작권위원회)',
        source: '문화체육관광부·한국저작권위원회 공인 표준 서식',
        reason: '저작재산권 자체를 넘기지 않고, 발주자에게 정해진 매체(온라인, 인쇄 등), 사용 기간(예: 1년), 사용 지역에 한하여 비독점적(또는 독점적) 이용 권한만을 허여하는 가장 안전한 라이선스 서식입니다.',
        keyClause: '저작권 창작자 원시 귀속, 허용된 매체·기간 외 사용 시 저작권 침해 간주',
        insp: '라이선스 개시일 확인 및 라이선스 사용료 선지급 원칙',
        trust: '한국저작권위원회 공식 라이선스 자료실',
        link: 'https://www.copyright.or.kr',
        preview: 'transfer'
      };
    } else if (type === 'transfer') {
      rec = {
        name: '저작재산권 양도 표준계약서 (문화체육관광부·공정거래위원회)',
        source: '문체부·공정위 고시 공인 표준 서식',
        reason: '발주자의 요구로 산출물의 지식재산권을 이전할 때 사용하는 서식입니다. 반드시 "용역 대금 전액 완납"을 정지조건으로 권리가 이전되며, 저작인격권(성명표시권) 존중 및 채택되지 않은 시안은 창작자에게 유보됩니다.',
        keyClause: '용역 잔금 전액 완납 시 권리 이전(정지조건), 미채택 시안 권리 유보, 성명표시권 보장',
        insp: '최종 잔금 입금 확인증 발행과 동시에 권리 이전 효력 발생',
        trust: '공정거래위원회 및 문화체육관광부 공시 서식',
        link: 'https://www.ftc.go.kr',
        preview: 'transfer'
      };
    } else {
      rec = {
        name: '프리랜서 용역 표준계약서 (공정위·고용노동부 권장 서식)',
        source: '공정거래위원회 용역위탁 표준 서식',
        reason: '컨설팅, 번역, 카피라이팅 등 다양한 1인 지식용역에 범용 적용되며, 부당한 대금 감액 금지 및 계약 해지 예고 기간이 체계화되어 있습니다.',
        keyClause: '부당 대금 감액 금지, 계약 해지 30일 전 서면 예고',
        insp: '목적물 인도 후 10일 이내 검수 완료 규정',
        trust: '공정거래위원회 표준계약서 공시',
        link: 'https://www.ftc.go.kr',
        preview: 'general'
      };
    }
  }

  if (nameEl) nameEl.textContent = rec.name;
  if (sourceEl) sourceEl.textContent = rec.source;
  if (reasonEl) reasonEl.textContent = rec.reason;
  if (keyClauseEl) keyClauseEl.textContent = rec.keyClause;
  if (inspEl) inspEl.textContent = rec.insp;
  if (trustEl) trustEl.textContent = rec.trust;
  if (linkEl) linkEl.href = rec.link;

  const previewBtn = document.querySelector("#contractRecommendationBox button[onclick*=\"openContractPreviewModal\"]");
  if (previewBtn) {
    previewBtn.setAttribute("onclick", `openContractPreviewModal("${rec.preview}")`);
  }

  if (window.lucide) lucide.createIcons();
}


function copyContractClause() {
      const clause = `[공인 표준계약서 기준 3대 안전 특약 문구]\n1. (지체상금 요율 완화) "지체상금 요율은 1일 0.1%로 하되, 발주자의 검수 지연이나 추가 수정 요구로 발생한 기간은 지체 일수에서 전액 제외한다."\n2. (저작재산권 이전 시점) "본 용역 결과물의 일체 저작재산권은 발주자가 수급인에게 용역 대금 전액을 완납한 시점에 발주자에게 이전된다."\n3. (검수 기한 및 수정 횟수) "최종 산출물 전달 후 10일 이내에 서면 이의가 없는 경우 검수가 완료된 것으로 보며, 무상 수정은 계약 범위 내 2회로 한정한다."`;
      navigator.clipboard.writeText(clause).then(() => {
        showToast('3대 표준 특약 문구가 클립보드에 안전하게 복사되었습니다.');
      });
    }

    // 4-B. 계약 프로젝트 & 일정 관리 실시간 연동 테이블
    let currentContractProjectsFilter = 'all';

    function filterContractProjects(filter) {
      currentContractProjectsFilter = filter;
      ['all', 'signed', 'negotiating', 'inspecting'].forEach(f => {
        const btn = document.getElementById(`cpfBtn-${f}`);
        if (btn) {
          if (f === filter) {
            btn.className = 'px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold transition-all shadow-2xs';
          } else {
            btn.className = 'px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-medium border border-slate-200 transition-all';
          }
        }
      });
      renderContractProjectsTable(filter);
    }

    function jumpToScheduleFromContract(dateStr) {
      switchSubView('schedule');
      if (dateStr && typeof filterTaskByDate === 'function') {
        filterTaskByDate(dateStr);
      }
      showToast(`[일정 관리] ${dateStr || '마감'} 일정이 선택된 캘린더 화면으로 이동했습니다.`);
    }

    function renderContractProjectsTable(filter = currentContractProjectsFilter) {
      const tbody = document.getElementById('contractProjectsTableBody');
      if (!tbody) return;

      const isDemo = Boolean(appState && appState.isDemoMode);
      let contracts = [];

      if (appState.contracts && appState.contracts.length > 0) {
        contracts = appState.contracts.map(c => ({
          ...c,
          statusText: c.status === 'signed' ? '체결 완료' : (c.status === 'negotiating' ? '수정 협의 중' : '검토 중'),
          stageText: c.unpaidAmount > 0 ? (c.status === 'signed' ? '납품 완료 (검수 진행 중)' : '과업 진행 중') : '과업 완료 (정산 완결)',
          stageType: c.unpaidAmount > 0 ? 'inspecting' : 'completed',
          templateName: '표준 용역계약서'
        }));
      } else if (isDemo) {
        contracts = [
          {
            id: 'c_demo_1',
            projectName: '브랜드 홈페이지 제작',
            clientName: '글로벌이커머스(주)',
            totalAmount: 3500000,
            unpaidAmount: 1500000,
            deliveryDate: '2026-10-18',
            inspectionDate: '2026-10-25',
            status: 'signed',
            statusText: '체결 완료',
            stageText: '납품 완료 (검수 진행 중)',
            stageType: 'inspecting',
            templateName: '과기정통부 SW표준서식'
          },
          {
            id: 'c_demo_2',
            projectName: '소셜 마케팅 배너 디자인',
            clientName: '스타트업알파',
            totalAmount: 1700000,
            unpaidAmount: 1700000,
            deliveryDate: '2026-10-07',
            inspectionDate: '2026-10-15',
            status: 'signed',
            statusText: '체결 완료',
            stageText: '정산 지연 대응 중',
            stageType: 'delayed',
            templateName: 'KIDP 디자인 표준서식'
          },
          {
            id: 'c_demo_3',
            projectName: '사내 기술 블로그 기고',
            clientName: '테크랩스',
            totalAmount: 1200000,
            unpaidAmount: 0,
            deliveryDate: '2026-10-22',
            inspectionDate: '2026-10-29',
            status: 'negotiating',
            statusText: '수정 협의 중',
            stageText: '지체상금 요율 조율 중',
            stageType: 'negotiating',
            templateName: '문체부 저작물 표준서식'
          }
        ];
      } else if (appState.tasks && appState.tasks.length > 0) {
        const clientTasks = appState.tasks.filter(t => t.domain === 'client');
        if (clientTasks.length > 0) {
          contracts = clientTasks.map(t => ({
            id: 'task_c_' + t.id,
            projectName: t.title,
            clientName: t.client || '클라이언트',
            totalAmount: t.amount || 0,
            unpaidAmount: t.amount || 0,
            deliveryDate: t.dueDate || '2026-10-31',
            inspectionDate: '',
            status: 'signed',
            statusText: '체결 완료',
            stageText: t.completed ? '완료' : '과업 진행 중 (납품 대기)',
            stageType: t.completed ? 'completed' : 'inprogress',
            templateName: '표준 용역계약서'
          }));
        }
      }

      // Summary Metrics calculation
      const activeCountEl = document.getElementById('contractMetricActiveCount');
      const urgentDeadlineEl = document.getElementById('contractMetricUrgentDeadline');
      const totalRevenueEl = document.getElementById('contractMetricTotalRevenue');
      const unpaidBalanceEl = document.getElementById('contractMetricUnpaidBalance');

      const totalRev = contracts.reduce((acc, c) => acc + (c.totalAmount || 0), 0);
      const totalUnpaid = contracts.reduce((acc, c) => acc + (c.unpaidAmount || 0), 0);
      const now = new Date('2026-10-19');

      let urgentCount = 0;
      contracts.forEach(c => {
        if (c.deliveryDate) {
          const diffDays = Math.ceil((new Date(c.deliveryDate) - now) / (1000 * 60 * 60 * 24));
          if (diffDays >= -14 && diffDays <= 7) urgentCount++;
        }
      });

      if (activeCountEl) activeCountEl.textContent = `${contracts.length}건`;
      if (urgentDeadlineEl) urgentDeadlineEl.textContent = `${urgentCount}건`;
      if (totalRevenueEl) totalRevenueEl.textContent = `₩${totalRev.toLocaleString()}`;
      if (unpaidBalanceEl) unpaidBalanceEl.textContent = `₩${totalUnpaid.toLocaleString()}`;

      // Filter
      let displayList = contracts;
      if (filter === 'signed') {
        displayList = contracts.filter(c => c.status === 'signed');
      } else if (filter === 'negotiating') {
        displayList = contracts.filter(c => c.status === 'negotiating');
      } else if (filter === 'inspecting') {
        displayList = contracts.filter(c => c.stageType === 'inspecting' || c.stageType === 'delayed' || c.unpaidAmount > 0);
      }

      if (displayList.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" class="p-8 text-center text-slate-400">
              <i data-lucide="layers" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
              <p class="font-bold text-slate-700 text-xs">등록된 계약 프로젝트가 없습니다.</p>
              <p class="text-[11px] text-slate-400 mt-1">[+ 새 계약 등록 및 일정 연동] 버튼을 눌러 계약을 등록하시면 납품 마감일이 일정 관리(캘린더)와 실시간으로 동기화됩니다.</p>
            </td>
          </tr>
        `;
        if (window.lucide) lucide.createIcons();
        return;
      }

      tbody.innerHTML = displayList.map(item => {
        let ddayBadge = '';
        if (item.deliveryDate) {
          const targetDate = new Date(item.deliveryDate);
          const diff = Math.ceil((targetDate - now) / (1000 * 60 * 60 * 24));
          if (diff < 0) {
            ddayBadge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">지연 ${Math.abs(diff)}일</span>`;
          } else if (diff === 0) {
            ddayBadge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">오늘 마감 (D-Day)</span>`;
          } else if (diff <= 3) {
            ddayBadge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">D-${diff} 마감 임박</span>`;
          } else {
            ddayBadge = `<span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">D-${diff}</span>`;
          }
        }

        const statusBadge = item.status === 'signed'
          ? `<span class="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">체결 완료</span>`
          : `<span class="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-50 text-amber-700 border border-amber-200">${item.statusText || '수정 협의 중'}</span>`;

        const stageDot = item.stageType === 'delayed'
          ? 'bg-rose-500'
          : (item.stageType === 'inspecting' ? 'bg-amber-500' : 'bg-emerald-500');

        return `
          <tr class="hover:bg-slate-50/70 transition-colors">
            <td class="p-3">
              <div class="font-bold text-slate-900">${escapeHtml(item.projectName)}</div>
              <div class="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                <span>${escapeHtml(item.clientName)}</span>
                ${item.templateName ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">${escapeHtml(item.templateName)}</span>` : ''}
              </div>
            </td>
            <td class="p-3">
              <div class="flex items-center gap-1.5">
                <span class="font-mono text-slate-800 font-bold">${item.deliveryDate || '미정'}</span>
                ${ddayBadge}
              </div>
              ${item.inspectionDate ? `<div class="text-[10.5px] text-indigo-700 mt-0.5 font-mono">약정 검수: ${item.inspectionDate}</div>` : ''}
              <button type="button" onclick="jumpToScheduleFromContract('${item.deliveryDate}')" class="text-[10.5px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 mt-1 transition-colors">
                <i data-lucide="calendar" class="w-3 h-3"></i>
                <span>캘린더에서 일정 보기</span>
              </button>
            </td>
            <td class="p-3">
              <div class="font-mono font-bold text-slate-900">₩${(item.totalAmount || 0).toLocaleString()}</div>
              ${item.unpaidAmount > 0 
                ? `<div class="text-[10.5px] text-rose-600 font-mono font-bold">미수 잔금: ₩${item.unpaidAmount.toLocaleString()}</div>`
                : `<div class="text-[10px] text-slate-400">완납 완료</div>`}
            </td>
            <td class="p-3">${statusBadge}</td>
            <td class="p-3">
              <span class="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full ${stageDot}"></span>
                <span>${escapeHtml(item.stageText || '과업 진행 중')}</span>
              </span>
            </td>
            <td class="p-3 text-right">
              <div class="flex items-center justify-end gap-1.5">
                <button type="button" onclick="jumpToScheduleFromContract('${item.deliveryDate}')" class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] border border-indigo-200 transition-colors flex items-center gap-1" title="일정 관리 캘린더로 이동">
                  <i data-lucide="calendar" class="w-3 h-3"></i>
                  <span>일정 이동</span>
                </button>
                <button type="button" onclick="switchSubView('legal')" class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] border border-slate-200 transition-colors flex items-center gap-1" title="법적 보호 검수 및 정산 이동">
                  <i data-lucide="shield-check" class="w-3 h-3 text-emerald-600"></i>
                  <span>검수·정산</span>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      if (window.lucide) lucide.createIcons();
    }


// ==================== CONTRACT ANALYSIS & DEMO (Item 2) ====================
function scanContractDemo() {
  const textarea = document.getElementById("contractScanInput");
  if (textarea) {
    textarea.value = `[용역계약서 샘플]
제1조 (목적) 본 계약은 발주처(갑)와 용역수행자(을) 간의 웹사이트 개발 용역에 관한 제반 사항을 규정함을 목적으로 한다.
제3조 (작업 일정 및 마일스톤) 을은 계약 체결일로부터 30일 이내에 최종 산출물을 제출하여야 한다.
제4조 (대금 지급 조건) 총 용역비는 3,500,000원으로 하며, 계약금 50%, 잔금 50%를 지급한다.
제5조 (검수 및 수정) 을은 갑이 만족하여 승인할 때까지 무상으로 수정을 반복하여 완료하여야 한다.
제8조 (손해배상 및 지체상금) 을이 납기를 지연할 경우 지체 1일당 총 계약금액의 0.5%를 지체상금으로 공제한다.
제12조 (저작권) 본 용역의 결과물에 대한 모든 지식재산권은 계약 체결과 동시에 갑에게 영구 귀속된다.
제15조 (계약 해지) 일방의 중대한 귀책사유가 있을 시 서면 통보 후 해지할 수 있다.`;
    showToast("표준 분석용 샘플 계약서 전문이 입력창에 자동 기입되었습니다. [계약서 내용 검수하기] 버튼을 눌러보세요.");
  }
}

function runContractAnalysis() {
  const textarea = document.getElementById("contractScanInput");
  const content = textarea ? textarea.value.trim() : "";
  if (!content) {
    alert("계약서 내용을 붙여넣거나 파일을 먼저 업로드해 주세요.");
    const resEl = document.getElementById("contractScanResult");
    if (resEl) resEl.classList.add("hidden");
    return;
  }

  const resEl = document.getElementById("contractScanResult");
  if (resEl) {
    resEl.classList.remove("hidden");
    resEl.classList.add("animate-pulse");
    setTimeout(() => {
      resEl.classList.remove("animate-pulse");
      resEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      showToast("계약서 내용 검수 완료: 주요 기재 표현 3건 발견 및 직접 확인 권장 항목이 정리되었습니다.");
    }, 250);
  }
}

function copyClauseText(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.innerText || el.textContent || "";
  navigator.clipboard.writeText(text).then(() => {
    showToast("참고 예시 문구가 클립보드에 복사되었습니다.");
  });
}





// Expose contract functions to global window
window.toggleContractLibrary = toggleContractLibrary;
window.filterContractLibList = filterContractLibList;
window.filterContractLibByDomain = filterContractLibByDomain;
window.selectContractLib = selectContractLib;
window.renderContractLibList = renderContractLibList;
window.renderContractLibDetail = renderContractLibDetail;
window.openContractPreviewModal = openContractPreviewModal;
window.closeContractPreviewModal = closeContractPreviewModal;
window.renderContractTypeChips = renderContractTypeChips;
window.setContractDomainFilter = setContractDomainFilter;
window.setContractTypeFilter = setContractTypeFilter;
window.updateContractRecommendation = updateContractRecommendation;
window.copyContractClause = copyContractClause;
window.filterContractProjects = filterContractProjects;
window.jumpToScheduleFromContract = jumpToScheduleFromContract;
window.renderContractProjectsTable = renderContractProjectsTable;
window.scanContractDemo = scanContractDemo;
window.runContractAnalysis = runContractAnalysis;
window.copyClauseText = copyClauseText;
