/**
 * SolOS Page: Financial Statements (자금 현황)
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





    // ==================== CASHFLOW FORECAST & FINANCIAL STATEMENTS CONTROLLER ====================
    let cashflowForecastChartInstance = null;
    let forecastPeriod = 30;
    let isForecastConservative = false;
    let isForecastZoom = true;

    function renderCashflowForecastChart() {
      const canvas = document.getElementById('cashflowForecastCanvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const workingCapital = Number(appState.workingCapital || 0);
      const monthlyFixedExpense = Number(appState.monthlyFixedExpense || 0);
      const taxSaved = Number(appState.taxSaved || 0);
      const availableCash = Math.max(0, workingCapital - taxSaved);
      const receivables = appState.receivables || [];

      // 기준일: 2026-10-19 (현재 워크스페이스 기준)
      const baseYear = 2026;
      const baseMonth = 9; // 10월 (0-indexed)
      const baseDay = 19;
      const totalDays = forecastPeriod || 30;

      const labels = [];
      const balanceData = [];
      const safeLineData = [];
      const incomeData = [];
      const expenseData = [];

      let currentBal = workingCapital;
      const safeThreshold = Math.max(2000000, monthlyFixedExpense * 2);

      let minBalance = workingCapital;
      let minBalanceDateStr = '';

      for (let i = 0; i < totalDays; i++) {
        const d = new Date(baseYear, baseMonth, baseDay + i);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const dateKey = `${yyyy}-${mm}-${dd}`;
        const labelKey = `${mm}.${dd}`;
        labels.push(labelKey);

        // 1. 입금 집계
        let dayIncome = 0;
        receivables.forEach(r => {
          if (r.dueDate === dateKey) {
            if (isForecastConservative && (r.statusType === 'delayed' || r.status === '지연')) {
              return;
            }
            dayIncome += Number(r.amount || 0);
          }
        });

        // 2. 지출 집계 (고정비 결제일: 매월 25일)
        let dayExpense = 0;
        if (d.getDate() === 25 && monthlyFixedExpense > 0) {
          dayExpense += monthlyFixedExpense;
        }

        currentBal = currentBal + dayIncome - dayExpense;
        balanceData.push(currentBal);
        safeLineData.push(safeThreshold);
        incomeData.push(dayIncome > 0 ? dayIncome : null);
        expenseData.push(dayExpense > 0 ? dayExpense : null);

        if (currentBal < minBalance) {
          minBalance = currentBal;
          minBalanceDateStr = `${mm}월 ${dd}일`;
        }
      }

      // 차트 생성/갱신
      if (cashflowForecastChartInstance) {
        try {
          cashflowForecastChartInstance.destroy();
        } catch (e) {
          console.warn("[CashflowForecast] Chart destroy error:", e);
        }
        cashflowForecastChartInstance = null;
      }

      const gradient = ctx.createLinearGradient(0, 0, 0, 190);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.32)');
      gradient.addColorStop(0.6, 'rgba(99, 102, 241, 0.10)');
      gradient.addColorStop(1, 'rgba(238, 242, 255, 0.01)');

      const minValInData = Math.min(...balanceData);
      const yAxisMin = isForecastZoom 
        ? Math.max(0, Math.floor(minValInData * 0.85)) 
        : 0;

      cashflowForecastChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              type: 'line',
              label: '예상 현금 잔액',
              data: balanceData,
              borderColor: '#3b82f6',
              backgroundColor: gradient,
              borderWidth: 2.5,
              tension: 0.35,
              fill: true,
              pointBackgroundColor: '#2563eb',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 1.5,
              pointRadius: totalDays <= 30 ? 3 : 2,
              pointHoverRadius: 5.5,
              order: 2
            },
            {
              type: 'line',
              label: '최소 안전선 (고정비 2개월)',
              data: safeLineData,
              borderColor: '#f43f5e',
              borderWidth: 1.5,
              borderDash: [5, 4],
              pointRadius: 0,
              fill: false,
              order: 1
            },
            {
              type: 'bar',
              label: '입금 예정',
              data: incomeData,
              backgroundColor: '#10b981',
              borderRadius: 4,
              barThickness: totalDays <= 30 ? 8 : 5,
              order: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                boxWidth: 10,
                boxHeight: 10,
                usePointStyle: true,
                pointStyle: 'circle',
                font: {
                  size: 10,
                  family: 'Pretendard, system-ui, sans-serif',
                  weight: '600'
                },
                color: '#475569'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              titleFont: { size: 11, weight: '700' },
              bodyFont: { size: 11 },
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: function(context) {
                  const val = context.parsed.y;
                  if (val === null || val === undefined) return '';
                  return `${context.dataset.label}: ₩${val.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: {
                font: { size: 10, family: 'monospace' },
                color: '#64748b',
                maxRotation: 0,
                autoSkip: true,
                maxTicksLimit: totalDays <= 30 ? 10 : 12
              }
            },
            y: {
              min: yAxisMin,
              grid: {
                color: 'rgba(226, 232, 240, 0.6)',
                borderDash: [3, 3]
              },
              ticks: {
                font: { size: 10, family: 'monospace' },
                color: '#64748b',
                callback: function(value) {
                  if (value >= 10000000) {
                    return (value / 10000000).toFixed(1) + '천만';
                  } else if (value >= 10000) {
                    return (value / 10000).toLocaleString() + '만';
                  }
                  return '₩' + value.toLocaleString();
                }
              }
            }
          }
        }
      });

      // 배너 갱신
      const rangeBadge = document.getElementById('forecastRangeBadge');
      if (rangeBadge && labels.length > 0) {
        rangeBadge.textContent = `2026.${labels[0]} ~ ${labels[labels.length - 1]}`;
      }
      const minBalEl = document.getElementById('forecastMinBalance');
      if (minBalEl) minBalEl.textContent = '₩' + minBalance.toLocaleString();
      const minDateEl = document.getElementById('forecastMinDate');
      if (minDateEl) {
        minDateEl.textContent = minBalanceDateStr ? `${minBalanceDateStr} 결제 후 최저` : '특이 지출 없음';
      }
      const alertBanner = document.getElementById('forecastAlertBanner');
      if (alertBanner) {
        const isSafe = minBalance >= safeThreshold;
        alertBanner.className = isSafe
          ? 'p-3 rounded-lg bg-white border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2'
          : 'p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2';
        const innerContent = alertBanner.querySelector('.text-slate-700') || alertBanner;
        if (innerContent) {
          innerContent.innerHTML = isSafe
            ? `<div class="flex items-center gap-2 text-slate-700">
                 <i data-lucide="check-circle-2" class="w-4 h-4 text-emerald-600 shrink-0"></i>
                 <span>예상 최저 잔액: <strong class="text-slate-900 font-mono">₩${minBalance.toLocaleString()}</strong> (${minBalanceDateStr || '안정'}) | 최소 안전선(₩${safeThreshold.toLocaleString()}) 대비 안정적입니다.</span>
               </div>
               <span class="text-[11px] text-slate-400 self-start sm:self-auto">* 고정비 2개월치(안전보유선) 기준</span>`
            : `<div class="flex items-center gap-2 text-rose-800">
                 <i data-lucide="alert-triangle" class="w-4 h-4 text-rose-600 shrink-0"></i>
                 <span>⚠️ 예상 최저 잔액: <strong class="text-rose-700 font-mono">₩${minBalance.toLocaleString()}</strong> (${minBalanceDateStr || '주의'}) | 최소 안전선(₩${safeThreshold.toLocaleString()}) 이하로 일시 하락할 수 있어 사전 정산 확인이 권장됩니다.</span>
               </div>
               <span class="text-[11px] text-rose-500 self-start sm:self-auto">* 고정비 2개월치(안전보유선) 기준</span>`;
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
      }
    }

    function setForecastPeriod(period) {
      forecastPeriod = period;
      const btn30 = document.getElementById('forecastBtn30');
      const btn60 = document.getElementById('forecastBtn60');
      if (btn30 && btn60) {
        if (period === 30) {
          btn30.className = 'px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900 text-white shadow-xs';
          btn60.className = 'px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-100';
        } else {
          btn60.className = 'px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-900 text-white shadow-xs';
          btn30.className = 'px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-100';
        }
      }
      renderCashflowForecastChart();
    }

    function toggleForecastConservative() {
      isForecastConservative = !isForecastConservative;
      const btn = document.getElementById('forecastBtnConservative');
      if (btn) {
        if (isForecastConservative) {
          btn.className = 'px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs';
        } else {
          btn.className = 'px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 flex items-center gap-1';
        }
      }
      renderCashflowForecastChart();
      if (typeof showToast === 'function') {
        showToast(isForecastConservative 
          ? "보수적 시나리오 활성화: 지연 상태인 미수금을 제외하고 예측합니다." 
          : "기본 시나리오: 모든 예정 입금 건을 포함하여 예측합니다.");
      }
    }

    function toggleForecastZoom() {
      isForecastZoom = !isForecastZoom;
      const btn = document.getElementById('forecastBtnZoom');
      const label = document.getElementById('forecastZoomLabel');
      if (label) {
        label.textContent = `변동폭 확대 (${isForecastZoom ? 'ON' : 'OFF'})`;
      }
      if (btn) {
        if (isForecastZoom) {
          btn.className = 'px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1';
        } else {
          btn.className = 'px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 flex items-center gap-1';
        }
      }
      renderCashflowForecastChart();
    }

    function switchWaterfallMode(mode) {
      const accContainer = document.getElementById('waterfallAccountingContainer');
      const cfContainer = document.getElementById('waterfallCashflowContainer');
      const tabAcc = document.getElementById('wfTabAccounting');
      const tabCf = document.getElementById('wfTabCashflow');

      if (mode === 'accounting') {
        if (accContainer) accContainer.classList.remove('hidden');
        if (cfContainer) cfContainer.classList.add('hidden');
        if (tabAcc) tabAcc.className = 'px-3 py-1 rounded-lg font-bold bg-white text-slate-900 shadow-xs transition-all';
        if (tabCf) tabCf.className = 'px-3 py-1 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition-all';
      } else {
        if (cfContainer) cfContainer.classList.remove('hidden');
        if (accContainer) accContainer.classList.add('hidden');
        if (tabCf) tabCf.className = 'px-3 py-1 rounded-lg font-bold bg-white text-slate-900 shadow-xs transition-all';
        if (tabAcc) tabAcc.className = 'px-3 py-1 rounded-lg font-medium text-slate-600 hover:text-slate-900 transition-all';
      }
    }


// Expose statements functions to global window
window.updateVisualStatements = updateVisualStatements;
window.applyExpenseOptimization = applyExpenseOptimization;
window.handleRunwaySlider = handleRunwaySlider;
window.renderCashflowForecastChart = renderCashflowForecastChart;
window.setForecastPeriod = setForecastPeriod;
window.toggleForecastConservative = toggleForecastConservative;
window.toggleForecastZoom = toggleForecastZoom;
window.switchWaterfallMode = switchWaterfallMode;
