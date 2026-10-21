/**
 * SoloOS Page: Financial Statements (자금 현황)
 * Accounting Waterfall (손익 폭포수), Liquidity forecast, Runway diagnosis slider, Expense optimization
 */

    function updateVisualStatements() {
      let filteredTx = appState.transactions || [];
      if (appState.currentWorkstream !== 'all') {
        filteredTx = filteredTx.filter(t => t.domain === appState.currentWorkstream);
      }

      const grossIncome = filteredTx.filter(t => t.gross > 0).reduce((acc, curr) => acc + curr.gross, 0);
      const taxAmount = filteredTx.filter(t => t.tax > 0).reduce((acc, curr) => acc + curr.tax, 0);
      const netIncome = filteredTx.filter(t => t.net > 0).reduce((acc, curr) => acc + curr.net, 0);
      const expenses = Math.abs(filteredTx.filter(t => t.net < 0).reduce((acc, curr) => acc + curr.net, 0));
      const realProfit = netIncome - expenses;
      const margin = grossIncome > 0 ? ((realProfit / grossIncome) * 100).toFixed(1) : '0.0';

      const setElText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };

      // View A: 회계 손익 폭포수 (Waterfall)
      setElText('wfGross', '₩' + grossIncome.toLocaleString());
      setElText('wfTax', (taxAmount > 0 ? '-₩' : '₩') + taxAmount.toLocaleString());
      setElText('wfNet', '₩' + netIncome.toLocaleString());
      setElText('wfExpense', (expenses > 0 ? '-₩' : '₩') + expenses.toLocaleString());
      setElText('wfProfit', (realProfit < 0 ? '-₩' : '₩') + Math.abs(realProfit).toLocaleString());
      setElText('wfProfitMarginText', `순마진: ${margin}%`);

      const baseVal = Math.max(grossIncome, 1);
      const setBarWidth = (id, val) => {
        const bar = document.getElementById(id);
        if (bar) bar.style.width = Math.min(100, Math.max(0, Math.round((Math.abs(val) / baseVal) * 100))) + '%';
      };
      setBarWidth('wfGrossBar', grossIncome);
      setBarWidth('wfTaxBar', taxAmount);
      setBarWidth('wfNetBar', netIncome);
      setBarWidth('wfExpenseBar', expenses);
      setBarWidth('wfProfitBar', Math.max(0, realProfit));

      // Section 2: 예정 입출금 및 단기 유동성 예측
      const recList = appState.receivables || [];
      const pendingReceivables = recList.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
      const delayedCount = recList.filter(r => (r.statusType === 'delayed' || r.status === '지연') && !r.deferred).length;
      const normalCount = recList.length - delayedCount;

      setElText('bsReceivablesAmount', (pendingReceivables > 0 ? '+₩' : '₩') + pendingReceivables.toLocaleString());
      if (document.getElementById('bsReceivablesCount')) {
        document.getElementById('bsReceivablesCount').textContent = recList.length > 0
          ? `총 ${recList.length}건 (확정 ${normalCount}건, 지연 ${delayedCount}건)`
          : '예정 대금 0건';
      }

      const fixedExp = Number(appState.monthlyFixedExpense || 0);
      const taxLiability = Math.round(grossIncome * 0.1);
      const scheduledOut = fixedExp + taxLiability;
      setElText('bsLiabilities', (scheduledOut > 0 ? '-₩' : '₩') + scheduledOut.toLocaleString());
      const bsLiabilitiesDesc = document.getElementById('bsLiabilitiesDesc');
      if (bsLiabilitiesDesc) {
        bsLiabilitiesDesc.textContent = `월 필수 고정비(₩${fixedExp.toLocaleString()}) + 세무 부채(₩${taxLiability.toLocaleString()}) 합산입니다.`;
      }

      const workingCapital = Number(appState.workingCapital || 0);
      const projectedEndingBalance = workingCapital + pendingReceivables - scheduledOut;
      setElText('bsEquity', '₩' + projectedEndingBalance.toLocaleString());
      const bsEquityDesc = document.getElementById('bsEquityDesc');
      if (bsEquityDesc) {
        bsEquityDesc.textContent = projectedEndingBalance > 0
          ? '예정 입출금을 모두 집행하고도 온전히 내 손에 남는 안전 여유 자금입니다.'
          : '예정 지출 대비 현금이 부족할 수 있으니 사전 자금 확보가 권장됩니다.';
      }

      // View B: 실제 통장 현금 흐름
      const totalCashIn = netIncome + pendingReceivables;
      const totalCashOut = expenses + scheduledOut;
      const netCashFlow = totalCashIn - totalCashOut;
      setElText('cfTotalIn', '₩' + totalCashIn.toLocaleString());
      setElText('cfTotalInDesc', `실수령액 ₩${netIncome.toLocaleString()} + 미수금 ₩${pendingReceivables.toLocaleString()}`);
      setElText('cfTotalOut', (totalCashOut > 0 ? '-₩' : '₩') + totalCashOut.toLocaleString());
      setElText('cfTotalOutDesc', `경비 ₩${expenses.toLocaleString()} + 예정고정비 ₩${scheduledOut.toLocaleString()}`);
      setElText('cfNetFlow', (netCashFlow >= 0 ? '+₩' : '-₩') + Math.abs(netCashFlow).toLocaleString());
      setElText('cfNetFlowDesc', netCashFlow >= 0 ? '당월 현금 증가 예상' : '당월 현금 감소 예상');
      setElText('cfEndingBalance', '₩' + projectedEndingBalance.toLocaleString());
      setElText('cfEndingBalanceDesc', `현재 잔고(₩${workingCapital.toLocaleString()}) 기준`);

      // 30일 예측 최저 잔액 배너
      const minProjected = Math.max(0, workingCapital - scheduledOut);
      setElText('forecastMinBalance', '₩' + minProjected.toLocaleString());
      setElText('forecastMinDate', workingCapital > 0 ? '고정비 결제일(25일) 기준' : '자금 미등록');

      // Legacy compatibility tags
      setElText('bsBankBalance', '₩' + workingCapital.toLocaleString());
      setElText('bsAssets', '₩' + (workingCapital + pendingReceivables).toLocaleString());
    }

    // KPI Cards Calculation

    function applyExpenseOptimization() {
      alert('Figma 미사용 서브 계정 및 중복 스토리지에 대한 구독 해지 체크리스트 및 캘린더 알림이 등록되었습니다. 연간 ₩420,000의 추가 예산이 확보됩니다.');
    }


    function handleRunwaySlider(value) {
      const cut = parseInt(value, 10) || 0;
      const originalExpense = appState.monthlyFixedExpense; // 2730000
      const adjustedExpense = Math.max(500000, originalExpense - cut);
      const months = (appState.workingCapital / adjustedExpense).toFixed(1);
      
      const labelEl = document.getElementById('runwayCutLabel');
      if (labelEl) {
        labelEl.textContent = `₩${cut.toLocaleString()} 절감 (월 ₩${adjustedExpense.toLocaleString()})`;
      }
      const resultEl = document.getElementById('runwaySimResult');
      if (resultEl) {
        resultEl.textContent = `약 ${months}개월 유지 가능`;
      }
      const descEl = document.getElementById('runwayDescMonths');
      if (descEl) {
        descEl.textContent = `${months}개월간`;
      }
    }



// Expose statements functions to global window
window.updateVisualStatements = updateVisualStatements;
window.applyExpenseOptimization = applyExpenseOptimization;
window.handleRunwaySlider = handleRunwaySlider;
