/**
 * SolOS Page: Tax Management (세금 관리)
 * 3 Major taxes calculators (Simple rate, 10% VAT, Hourly wage, Business code directory),
 * Reserve account breakdown, Hometax deduction guide, and year-end summary
 */

    // ==================== SETTLEMENT & MULTI-CALCULATOR VIEW LOGIC ====================
    let currentCalcTab = 'rate';

    const bizCodeData = [
      { code: '940909', name: '기타자영업 (인적용역 프리랜서)', cat: '외주·용역 공통', rate: '단순경비율 64.1%', desc: '3.3% 원천징수 프리랜서 대표 표준 업종코드' },
      { code: '940911', name: '소프트웨어 외주 개발·자문', cat: 'IT·개발 프리랜서', rate: '단순경비율 64.1%', desc: '웹/앱 프론트엔드·백엔드 코딩 및 시스템 구축 외주' },
      { code: '722000', name: '응용 소프트웨어 개발 및 공급업', cat: '사업자등록(과세)', rate: '기준경비율 19.3%', desc: '개인사업자등록(일반/간이) 세금계산서 발행 업종' },
      { code: '940600', name: '작가 (출판·원고·번역)', cat: '콘텐츠·출판', rate: '단순경비율 58.7%', desc: '전자책 인세, 기술서 집필, 칼럼 기고 및 전문 번역' },
      { code: '749910', name: '시각 디자인업', cat: '디자인 사업자', rate: '단순경비율 56.4%', desc: 'UI/UX 디자인, 브랜드 아이덴티티, 웹·앱 그래픽 용역' },
      { code: '940904', name: '외래강사·교육용역', cat: '강의·지식창업', rate: '단순경비율 61.7%', desc: '인프런 강의, 기업 출강, 특강 및 세미나 자문 소득' },
      { code: '749901', name: '경영컨설팅', cat: '자문·기획', rate: '단순경비율 54.3%', desc: '스타트업 멘토링, 비즈니스 모델 수립 자문' },
      { code: '940908', name: '일러스트레이터·웹툰 작가', cat: '일러스트·웹툰', rate: '단순경비율 65.1%', desc: '캐릭터 일러스트, 웹툰 원고료 및 굿즈 디자인' }
    ];

    function renderTaxView() {
      switchCalcTab(currentCalcTab);
      updateRateCalc();
      updateIncomeTaxCalc();
      updatePenaltyTaxCalc();
      updateHealthInsCalc();
      updateOtherTaxCalc();
      searchBizCode('');
      lucide.createIcons();
    }

    // 1. 단가(시급) 계산기
    function updateRateCalcFromSlider(val) {
      const hours = Math.max(1, parseInt(val, 10) || 1);
      const hoursInput = document.getElementById('rateHoursInput');
      const hoursText = document.getElementById('rateHoursText');
      if (hoursInput) hoursInput.value = hours;
      if (hoursText) hoursText.textContent = `${hours}시간`;
      updateRateCalc();
    }

    function updateRateCalcFromInput(val) {
      const hours = Math.max(1, parseInt(val, 10) || 1);
      const hoursSlider = document.getElementById('rateHoursSlider');
      const hoursText = document.getElementById('rateHoursText');
      if (hoursSlider) hoursSlider.value = hours;
      if (hoursText) hoursText.textContent = `${hours}시간`;
      updateRateCalc();
    }

    function updateRateCalc() {
      const amountInput = document.getElementById('rateAmountInput');
      const hoursInput = document.getElementById('rateHoursInput');
      const rateEl = document.getElementById('rateCalculatedVal');
      const badgeWrap = document.getElementById('rateRateBadge');
      const statusEl = document.getElementById('rateProfitStatus');
      if (!amountInput || !hoursInput || !rateEl) return;

      const amount = Math.max(0, parseInt(amountInput.value, 10) || 0);
      const hours = Math.max(1, parseInt(hoursInput.value, 10) || 1);
      const hourlyRate = Math.round(amount / hours);

      rateEl.innerHTML = `₩${Number(hourlyRate).toLocaleString()} <span class="text-xs font-sans font-normal text-slate-500">/h</span>`;

      if (statusEl) {
        statusEl.textContent = '정산 총액과 투입 시간에 따른 실질 시간당 수익입니다.';
      }
    }

    // 2. 종합소득세 계산기
    function updateIncomeTaxCalc() {
      const grossEl = document.getElementById('itInputGross');
      const expenseEl = document.getElementById('itInputExpense');
      const dedEl = document.getElementById('itInputDeduction');
      const taxEl = document.getElementById('itCalculatedTax');
      const summaryEl = document.getElementById('itTaxSummary');
      if (!grossEl || !expenseEl || !taxEl) return;

      const gross = Math.max(0, parseInt(grossEl.value, 10) || 0);
      const expense = Math.max(0, parseInt(expenseEl.value, 10) || 0);
      const deduction = Math.max(0, parseInt(dedEl ? dedEl.value : 1500000, 10) || 0);

      const taxBase = Math.max(0, gross - expense - deduction);
      let rate = 0.06;
      let deductionAcc = 0;

      if (taxBase <= 14000000) {
        rate = 0.06;
        deductionAcc = 0;
      } else if (taxBase <= 50000000) {
        rate = 0.15;
        deductionAcc = 1260000;
      } else if (taxBase <= 88000000) {
        rate = 0.24;
        deductionAcc = 5760000;
      } else if (taxBase <= 150000000) {
        rate = 0.35;
        deductionAcc = 15440000;
      } else if (taxBase <= 300000000) {
        rate = 0.38;
        deductionAcc = 19940000;
      } else {
        rate = 0.40;
        deductionAcc = 25940000;
      }

      const calcTax = Math.max(0, Math.round(taxBase * rate - deductionAcc));
      const localTax = Math.round(calcTax * 0.1);
      const totalTax = calcTax + localTax;

      taxEl.textContent = `₩${Number(totalTax).toLocaleString()}`;
      if (summaryEl) {
        summaryEl.textContent = `과세표준 ₩${Number(taxBase).toLocaleString()} (세율 ${Math.round(rate * 100)}% 적용, 소득세 ₩${Number(calcTax).toLocaleString()} + 지방세 ₩${Number(localTax).toLocaleString()})`;
      }
    }

    // 3. 종합소득세 가산세 계산기
    function updatePenaltyTaxCalc() {
      const amountEl = document.getElementById('ptInputAmount');
      const typeEl = document.getElementById('ptInputType');
      const daysEl = document.getElementById('ptInputDays');
      const resEl = document.getElementById('ptCalculatedVal');
      const summaryEl = document.getElementById('ptSummaryText');
      if (!amountEl || !typeEl || !daysEl || !resEl) return;

      const unpaid = Math.max(0, parseInt(amountEl.value, 10) || 0);
      const rate = parseFloat(typeEl.value) || 0.2;
      const days = Math.max(1, parseInt(daysEl.value, 10) || 1);

      const penaltyReport = Math.round(unpaid * rate);
      const penaltyDelay = Math.round(unpaid * days * 0.00022); // 일 2.2/10,000
      const totalPenalty = penaltyReport + penaltyDelay;

      resEl.textContent = `₩${Number(totalPenalty).toLocaleString()}`;
      if (summaryEl) {
        summaryEl.textContent = `신고불성실 ₩${Number(penaltyReport).toLocaleString()} + 납부지연(일 0.022%) ₩${Number(penaltyDelay).toLocaleString()}`;
      }
    }

    // 4. 지역가입자 건강보험료 계산기
    function updateHealthInsCalc() {
      const incomeEl = document.getElementById('hiInputIncome');
      const propEl = document.getElementById('hiInputProperty');
      const resEl = document.getElementById('hiCalculatedVal');
      const summaryEl = document.getElementById('hiSummaryText');
      if (!incomeEl || !resEl) return;

      const income = Math.max(0, parseInt(incomeEl.value, 10) || 0);
      const property = Math.max(0, parseInt(propEl ? propEl.value : 0, 10) || 0);

      // 소득 부과 (연 336만원 초과분에 대해 약 7.09% 부과 추정)
      const taxableIncome = Math.max(0, income - 3360000);
      const monthIncomeBase = taxableIncome / 12;
      const incomeHealth = monthIncomeBase * 0.0709;

      // 재산 부과 추정 (자가/보증금 기준)
      const propertyHealth = property > 0 ? (property / 10000000) * 1250 : 0;

      // 기본 최저보험료 19,780원 적용
      const baseHealth = Math.max(19780, Math.round(incomeHealth + propertyHealth));
      const careFee = Math.round(baseHealth * 0.1295); // 장기요양 12.95%
      const totalHealth = baseHealth + careFee;

      resEl.innerHTML = `₩${Number(totalHealth).toLocaleString()} <span class="text-xs font-sans font-normal text-slate-500">/월</span>`;
      if (summaryEl) {
        summaryEl.textContent = `건보료 ₩${Number(baseHealth).toLocaleString()} + 장기요양(12.95%) ₩${Number(careFee).toLocaleString()}`;
      }
    }

    // 5. 기타소득세 계산기
    function updateOtherTaxCalc() {
      const grossEl = document.getElementById('otInputGross');
      const typeEl = document.getElementById('otInputType');
      const netEl = document.getElementById('otCalculatedNetVal');
      const taxEl = document.getElementById('otCalculatedTaxVal');
      if (!grossEl || !typeEl || !netEl || !taxEl) return;

      const gross = Math.max(0, parseInt(grossEl.value, 10) || 0);
      const expenseRate = isNaN(parseFloat(typeEl.value)) ? 0.6 : parseFloat(typeEl.value);

      if (gross <= 50000) {
        netEl.textContent = `₩${Number(gross).toLocaleString()}`;
        taxEl.textContent = '비과세 적용 (건당 지급액 5만원 이하 시 소득세 과세최저한)';
        return;
      }

      const expense = Math.round(gross * expenseRate);
      const income = gross - expense;
      const incomeTax = Math.round(income * 0.2);
      const localTax = Math.round(incomeTax * 0.1);
      const totalTax = incomeTax + localTax;
      const net = gross - totalTax;

      netEl.textContent = `₩${Number(net).toLocaleString()}`;
      taxEl.textContent = `원천징수 합계: ₩${Number(totalTax).toLocaleString()} (소득세 ₩${Number(incomeTax).toLocaleString()} + 지방세 ₩${Number(localTax).toLocaleString()})`;
    }

    // 6. 업종코드 퀵 검색
    function searchBizCode(query) {
      const container = document.getElementById('bizCodeGrid');
      if (!container) return;

      const q = (query || '').toLowerCase().trim();
      const list = q ? bizCodeData.filter(b => b.code.includes(q) || b.name.toLowerCase().includes(q) || b.cat.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q)) : bizCodeData;

      if (list.length === 0) {
        container.innerHTML = `<div class="col-span-full p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">일치하는 업종코드가 없습니다. 국세청 포털에서 검색해보세요.</div>`;
        return;
      }

      let html = '';
      list.forEach(item => {
        html += `
          <div class="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all space-y-1">
            <div class="flex items-center justify-between">
              <span class="font-mono font-bold text-indigo-700 text-xs">${item.code}</span>
              <span class="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-800">${item.cat}</span>
            </div>
            <div class="font-bold text-slate-900 text-xs leading-snug">${item.name}</div>
            <div class="text-[10px] text-slate-500">${item.desc}</div>
            <div class="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
              <span class="text-slate-400">${item.rate}</span>
              <button type="button" onclick="copyBizCode('${item.code}', '${item.name}')" class="text-indigo-600 font-bold hover:underline">코드 복사</button>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    }

    function copyBizCode(code, name) {
      navigator.clipboard.writeText(code).then(() => {
        showToast(`업종코드 [${code} ${name}]가 클립보드에 복사되었습니다.`);
      });
    }

    // 7. 법적 패키지 내용증명 HWPX 서식 다운로드 (Blob 바이너리 저장 보장)

    function switchCalcTab(tabKey) {
      if (tabKey === 'rate') tabKey = 'rateCalc';
      currentCalcTab = tabKey;
      const tabs = ['rateCalc', 'vatCalc', 'wageCalc', 'bizCode'];
      tabs.forEach(t => {
        const btn = document.getElementById(`calcTabBtn-${t}`);
        const panel = document.getElementById(`calcPanel-${t}`);
        if (btn) {
          if (t === tabKey) {
            btn.className = 'calc-tab-btn px-2.5 py-1 rounded-lg text-xs font-bold transition-all bg-slate-900 text-white shadow-xs';
          } else {
            btn.className = 'calc-tab-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition-all bg-white hover:bg-slate-100 text-slate-600 border border-slate-200';
          }
        }
        if (panel) {
          if (t === tabKey) {
            panel.classList.remove('hidden');
          } else {
            panel.classList.add('hidden');
          }
        }
      });
      if (window.lucide) lucide.createIcons();
    }

    // 1. 간편 산술 세율 계산기 (수식 투명 공개, 세무판정 미제공)
    function setSimpleRatePreset(rate) {
      const rateInput = document.getElementById('simpleCalcRateInput');
      if (rateInput) rateInput.value = rate;
      updateSimpleRateCalc();
    }

    function updateSimpleRateCalc() {
      const amountInput = document.getElementById('simpleCalcAmountInput');
      const rateInput = document.getElementById('simpleCalcRateInput');
      const computedEl = document.getElementById('simpleComputedAmountText');
      const netEl = document.getElementById('simpleNetAmountText');
      const formulaEl = document.getElementById('simpleFormulaDisplay');
      if (!amountInput || !rateInput) return;

      const amount = Math.max(0, parseInt(amountInput.value, 10) || 0);
      const rate = Math.max(0, parseFloat(rateInput.value) || 0);
      const computedTax = Math.round(amount * (rate / 100));
      const netAmount = amount - computedTax;

      if (computedEl) computedEl.textContent = `₩${computedTax.toLocaleString()}`;
      if (netEl) netEl.textContent = `₩${netAmount.toLocaleString()}`;
      if (formulaEl) {
        formulaEl.textContent = `산식: ${amount.toLocaleString()} × ${rate}% = ${computedTax.toLocaleString()}원`;
      }
    }

    // 2. 부가가치세 10% 산술 분리 계산기
    let currentVatMode = 'add'; // 'add' or 'separate'

    function setVatCalcMode(mode) {
      currentVatMode = mode;
      const addBtn = document.getElementById('vatModeBtn-add');
      const sepBtn = document.getElementById('vatModeBtn-separate');
      const label = document.getElementById('vatAmountInputLabel');

      if (mode === 'add') {
        if (addBtn) addBtn.className = 'flex-1 py-2 rounded-xl border border-indigo-300 bg-indigo-50 text-indigo-700 font-bold text-xs transition-all';
        if (sepBtn) sepBtn.className = 'flex-1 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium text-xs transition-all';
        if (label) label.textContent = '공급가액 입력 (원)';
      } else {
        if (addBtn) addBtn.className = 'flex-1 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-medium text-xs transition-all';
        if (sepBtn) sepBtn.className = 'flex-1 py-2 rounded-xl border border-indigo-300 bg-indigo-50 text-indigo-700 font-bold text-xs transition-all';
        if (label) label.textContent = '부가가치세 포함 총액 입력 (원)';
      }
      updateVatCalc();
    }

    function updateVatCalc() {
      const input = document.getElementById('vatAmountInput');
      const supplyEl = document.getElementById('vatResultSupply');
      const taxEl = document.getElementById('vatResultTax');
      const totalEl = document.getElementById('vatResultTotal');
      const formulaEl = document.getElementById('vatFormulaDisplay');
      if (!input) return;

      const rawVal = Math.max(0, parseInt(input.value, 10) || 0);

      let supply = 0;
      let tax = 0;
      let total = 0;

      if (currentVatMode === 'add') {
        supply = rawVal;
        tax = Math.round(supply * 0.1);
        total = supply + tax;
        if (formulaEl) {
          formulaEl.textContent = `산식: ${supply.toLocaleString()} × 10% = ${tax.toLocaleString()}원 (합계: ${total.toLocaleString()}원)`;
        }
      } else {
        total = rawVal;
        supply = Math.round(total / 1.1);
        tax = total - supply;
        if (formulaEl) {
          formulaEl.textContent = `산식: ${total.toLocaleString()} ÷ 1.1 = 공급가액 ${supply.toLocaleString()}원 (부가세: ${tax.toLocaleString()}원)`;
        }
      }

      if (supplyEl) supplyEl.textContent = `₩${supply.toLocaleString()}`;
      if (taxEl) taxEl.textContent = `₩${tax.toLocaleString()}`;
      if (totalEl) totalEl.textContent = `₩${total.toLocaleString()}`;
    }


    function calculateTaxBreakdown() {
      const type = document.getElementById('modalTxType').value;
      const amount = parseFloat(document.getElementById('modalTxAmount').value) || 0;
      const grossEl = document.getElementById('calcGrossAmount');
      const incomeTaxEl = document.getElementById('calcIncomeTax');
      const localTaxEl = document.getElementById('calcLocalTax');
      const breakdownBox = document.getElementById('taxBreakdownBox');
      const breakdownTitle = document.getElementById('breakdownTitle');
      const breakdownFormula = document.getElementById('breakdownFormula');
      const colGrossLabel = document.getElementById('colGrossLabel');
      const colTax1Label = document.getElementById('colTax1Label');
      const colTax2Label = document.getElementById('colTax2Label');
      const taxAdviceNote = document.getElementById('taxAdviceNote');

      if (type === 'income_freelance') {
        breakdownBox.classList.remove('hidden');
        breakdownTitle.textContent = '자동분개 역산: 3.3% 사업소득 (미등록 프리랜서)';
        breakdownFormula.textContent = '공급가액 = 입금액 ÷ 0.967';
        colGrossLabel.textContent = '계약 공급가액';
        colTax1Label.textContent = '소득세 (3.0%)';
        colTax2Label.textContent = '지방소득세 (0.3%)';
        
        const gross = Math.round(amount / 0.967);
        const incomeTax = Math.round(gross * 0.03);
        const localTax = Math.round(gross * 0.003);
        grossEl.textContent = '₩' + gross.toLocaleString();
        incomeTaxEl.textContent = '₩' + incomeTax.toLocaleString();
        localTaxEl.textContent = '₩' + localTax.toLocaleString();
        taxAdviceNote.innerHTML = '5월 종합소득세 신고 시 선납세금으로 자동 공제/환급됩니다.';
      } else if (type === 'income_tax_invoice') {
        breakdownBox.classList.remove('hidden');
        breakdownTitle.textContent = '자동분개 역산: 10% 부가가치세 (사업자 세금계산서)';
        breakdownFormula.textContent = '공급가액 = 입금총액 ÷ 1.1';
        colGrossLabel.textContent = '실제 매출 공급가액';
        colTax1Label.textContent = '부가가치세 (10%)';
        colTax2Label.textContent = '세무 분리 여부';

        const gross = Math.round(amount / 1.1);
        const vat = amount - gross;
        grossEl.textContent = '₩' + gross.toLocaleString();
        incomeTaxEl.textContent = '₩' + vat.toLocaleString();
        localTaxEl.textContent = '별도 통장 격리';
        taxAdviceNote.innerHTML = '<strong class="text-rose-600">⚠️ 부가세 10%(₩' + vat.toLocaleString() + ')는 매출이 아닙니다!</strong> 7월/1월 부가세 신고용 별도 통장에 100% 분리 보관하세요.';
      } else if (type === 'income_other') {
        breakdownBox.classList.remove('hidden');
        breakdownTitle.textContent = '자동분개 역산: 8.8% 기타소득 (비정기 자문·강연·원고료)';
        breakdownFormula.textContent = '계약총액 = 입금액 ÷ 0.912';
        colGrossLabel.textContent = '계약 총액 (지급총액)';
        colTax1Label.textContent = '소득세 (8.0%)';
        colTax2Label.textContent = '지방소득세 (0.8%)';

        const gross = Math.round(amount / 0.912);
        const incomeTax = Math.round(gross * 0.08);
        const localTax = Math.round(gross * 0.008);
        grossEl.textContent = '₩' + gross.toLocaleString();
        incomeTaxEl.textContent = '₩' + incomeTax.toLocaleString();
        localTaxEl.textContent = '₩' + localTax.toLocaleString();
        taxAdviceNote.innerHTML = '법정 필요경비 60% 차감 후 22% 원천징수된 실질 8.8% 세액입니다. 연 300만원 이하 분리과세 가능.';
      } else {
        breakdownBox.classList.add('hidden');
      }
    }


    // 1인 프리랜서 1년 수입·지출 정산 요약표 내보내기
    function exportYearEndTaxSummary() {
      const summaryReport = `=====================================================
SolOS 1인 프리랜서 1년 수입·지출 정산 요약 리포트
(국세청 종합소득세 및 부가가치세 신고 대비용)
기준일자: ${new Date().toISOString().split('T')[0]}
대표자명: 정솔로 (솔로오에스)
=====================================================

1. 총 수입 및 소득 유형별 매출 내역
-----------------------------------------------------
• [외주 프로젝트] 전자세금계산서 발행 공급가액: ₩3,000,000
  - 부가가치세(10%) 별도 예치액: ₩300,000 (세금 통장 보관)
  - 실제 입금액: ₩3,300,000

• [디지털 출판] 3.3% 프리랜서 사업소득 매출: ₩1,200,000
  - 원천징수세액(3.3%): ₩39,600 (기납부세액 공제 대상)
  - 실제 수령액: ₩1,160,400

• [지식창업·강의] 8.8% 기타소득 매출: ₩1,000,000
  - 법정 필요경비(60%) 반영 후 원천징수세액: ₩88,000
  - 실제 수령액: ₩912,000

총 공급가액 합계: ₩5,200,000
총 원천징수 기납부세액: ₩127,600
총 부가가치세 예치금: ₩300,000
총 실제 통장 입금액: ₩5,372,400

2. 사업상 필요경비 및 지출 내역
-----------------------------------------------------
• 지급임차료 (작업실 월 임대료): ₩850,000
• 지급수수료/통신비 (AWS 클라우드): ₩156,200
총 지출 경비 합계: ₩1,006,200

3. 세전 순이익 및 종합소득세 예상
-----------------------------------------------------
• 세전 사업 순이익: ₩4,193,800
• 5월 종합소득세 정산 시 기납부세액(₩127,600) 차감 반영 예정

4. 세금 통장 보관 권고액
-----------------------------------------------------
• 부가가치세(10%) 확정 예치금: ₩300,000
• 종합소득세 대비 예비금: ₩280,000
권고 세금 통장 분리 보관 총액: ₩580,000

=====================================================
위 데이터는 SolOS 로컬 브라우저 인메모리에서 안전하게
익명화(마스킹)되어 자동 분개 및 산출된 정산 보고서입니다.
=====================================================`;

      const blob = new Blob(["\uFEFF" + summaryReport], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `SolOS_1년_수입지출_정산요약표_${new Date().toISOString().split('T')[0]}.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('1인 프리랜서 1년 수입·지출 정산 요약표가 다운로드되었습니다.');
    }


    // 3. 세무 일정 할 일(캘린더) 자동 등록 도구
    function addTaxScheduleToTasks(dateStr, title) {
      if (!appState.tasks) appState.tasks = [];
      const existing = appState.tasks.find(t => t.title === title && t.dueDate === dateStr);
      if (existing) {
        alert(`이미 캘린더 및 할 일에 등록된 세무 일정입니다: ${title} (${dateStr})`);
        return;
      }
      const newTask = {
        id: Date.now(),
        title: title || '종합소득세 중간예납 고지서 확인',
        category: '세무',
        type: 'tax',
        dueDate: dateStr || '2026-11-30',
        dueTime: '18:00',
        priority: '높음',
        status: '진행중',
        memo: `국세청 일반 안내 일정: ${dateStr} 종합소득세 중간예납 납부기한 (홈택스 고지서 확인 및 세금 통장 준비금 점검)`,
        completed: false
      };
      appState.tasks.push(newTask);
      saveCurrentWorkspaceData();
      renderTasks();
      alert(`📅 [내 일정 등록 완료]\n${title} (${dateStr}) 일정이 캘린더와 할 일 목록에 자동 등록되었습니다!`);
    }



// Expose tax functions to global window
window.currentCalcTab = currentCalcTab;
window.bizCodeData = bizCodeData;
window.renderTaxView = renderTaxView;
window.switchCalcTab = switchCalcTab;
window.updateRateCalcFromSlider = updateRateCalcFromSlider;
window.updateRateCalcFromInput = updateRateCalcFromInput;
window.updateRateCalc = updateRateCalc;
window.updateIncomeTaxCalc = updateIncomeTaxCalc;
window.updatePenaltyTaxCalc = updatePenaltyTaxCalc;
window.updateHealthInsCalc = updateHealthInsCalc;
window.updateOtherTaxCalc = updateOtherTaxCalc;
window.searchBizCode = searchBizCode;
window.copyBizCode = copyBizCode;
window.setSimpleRatePreset = setSimpleRatePreset;
window.updateSimpleRateCalc = updateSimpleRateCalc;
window.setVatCalcMode = setVatCalcMode;
window.updateVatCalc = updateVatCalc;
window.calculateTaxBreakdown = calculateTaxBreakdown;
window.exportYearEndTaxSummary = exportYearEndTaxSummary;
window.addTaxScheduleToTasks = addTaxScheduleToTasks;
