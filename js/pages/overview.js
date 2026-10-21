/**
 * SolOS Page: Main Dashboard (Overview)
 * Top KPI indicators, visual runway indicators, and interactive Cashflow Wave Chart
 */

    function updateKPICards() {
      if (!isLedgerBulkEditing) {
        saveCurrentWorkspaceData();
      }
      let filteredTx = appState.transactions || [];
      if (appState.currentWorkstream !== 'all') {
        filteredTx = filteredTx.filter(t => t.domain === appState.currentWorkstream);
      }

      const grossIncome = filteredTx.filter(t => t.gross > 0).reduce((acc, curr) => acc + curr.gross, 0);
      const netIncome = filteredTx.filter(t => t.net > 0).reduce((acc, curr) => acc + curr.net, 0);
      const taxBuffer = Math.round(grossIncome * 0.1);
      const workingCapital = Number(appState.workingCapital || 0);
      const monthlyFixedExpense = Number(appState.monthlyFixedExpense || 0);
      const availableCash = Math.max(0, workingCapital - taxBuffer);

      let runwayMonths = '0.0';
      if (workingCapital > 0 && monthlyFixedExpense > 0) {
        runwayMonths = (workingCapital / monthlyFixedExpense).toFixed(1);
      }
      const isHealthy = parseFloat(runwayMonths) >= 3.0;
      const runwayStatus = (workingCapital > 0 && monthlyFixedExpense > 0) 
        ? (isHealthy ? '(안정)' : '(주의)') 
        : '(비움)';

      // 1. Sidebar indicators
      const sbBalance = document.getElementById('sidebarBalanceText');
      if (sbBalance) sbBalance.textContent = '₩' + workingCapital.toLocaleString();
      const sbRunway = document.getElementById('sidebarRunwayText');
      if (sbRunway) sbRunway.textContent = runwayMonths + '개월 ' + runwayStatus;

      // 2. Main Dashboard (subview-overview) Top Indicators
      const ovWorkingCapital = document.getElementById('ovWorkingCapital');
      if (ovWorkingCapital) ovWorkingCapital.textContent = '₩' + workingCapital.toLocaleString();
      const ovRunwayMonths = document.getElementById('ovRunwayMonths');
      if (ovRunwayMonths) ovRunwayMonths.textContent = runwayMonths + '개월';
      const ovFixedGuide = document.getElementById('ovFixedExpenseGuide');
      if (ovFixedGuide) {
        ovFixedGuide.textContent = monthlyFixedExpense > 0 
          ? `(월 고정비 ₩${monthlyFixedExpense.toLocaleString()} 기준)` 
          : '[월 고정비 미등록]';
      }
      const ovGrossRevenue = document.getElementById('ovGrossRevenue');
      if (ovGrossRevenue) ovGrossRevenue.textContent = '₩' + grossIncome.toLocaleString();
      const ovNetReceived = document.getElementById('ovNetReceived');
      if (ovNetReceived) ovNetReceived.textContent = '₩' + netIncome.toLocaleString();
      const ovTaxBuffer = document.getElementById('ovTaxBuffer');
      if (ovTaxBuffer) ovTaxBuffer.textContent = '₩' + taxBuffer.toLocaleString();
      const ovRevenueDomain = document.getElementById('ovRevenueDomain');
      if (ovRevenueDomain) {
        const domainMap = {
          all: '전체 통합',
          client: '외주 프로젝트',
          publishing: '디지털 출판',
          knowledge: '지식창업·강의'
        };
        ovRevenueDomain.textContent = domainMap[appState.currentWorkstream] || '전체 통합';
      }

      // 3. 자금 현황 (subview-statements) Section 1: 4대 핵심 지표 카드
      const kpiWC = document.getElementById('kpiWorkingCapital');
      if (kpiWC) kpiWC.textContent = '₩' + workingCapital.toLocaleString();

      const kpiAvail = document.getElementById('kpiAvailableCash');
      if (kpiAvail) kpiAvail.textContent = '₩' + availableCash.toLocaleString();

      const kpiAvailDesc = document.getElementById('kpiAvailableCashDesc');
      if (kpiAvailDesc) {
        kpiAvailDesc.textContent = `세금 적립금(₩${taxBuffer.toLocaleString()}) 제외 순수 가용 자금`;
      }

      const kpiRunway = document.getElementById('kpiRunwayMonths');
      if (kpiRunway) kpiRunway.textContent = runwayMonths + '개월';

      const kpiFixed = document.getElementById('kpiMonthlyFixedExpense');
      if (kpiFixed) kpiFixed.textContent = '₩' + monthlyFixedExpense.toLocaleString() + ' / 월';

      const kpiBadge = document.getElementById('kpiWorkingCapitalBadge');
      const kpiDot = document.getElementById('kpiWorkingCapitalDot');
      if (kpiBadge && kpiDot) {
        if (workingCapital === 0) {
          kpiBadge.textContent = '자금 등록 필요';
          kpiBadge.className = 'px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-600 border border-slate-200';
          kpiDot.className = 'w-2.5 h-2.5 rounded-full bg-slate-400';
        } else if (isHealthy) {
          kpiBadge.textContent = '안정적 운용';
          kpiBadge.className = 'px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 border border-emerald-200';
          kpiDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500';
        } else {
          kpiBadge.textContent = '주의 권고';
          kpiBadge.className = 'px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200';
          kpiDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-500';
        }
      }

      const kpiHealth = document.getElementById('kpiCapitalHealth');
      if (kpiHealth) {
        const healthPercent = monthlyFixedExpense > 0 
          ? Math.min(100, Math.round((workingCapital / (monthlyFixedExpense * 3)) * 100)) 
          : 0;
        kpiHealth.textContent = `건전성: ${healthPercent}%`;
      }

      const kpiNotice = document.getElementById('kpiRunwayNotice');
      if (kpiNotice) {
        kpiNotice.textContent = monthlyFixedExpense > 0 
          ? `월 고정비 ₩${monthlyFixedExpense.toLocaleString()} 기준` 
          : '신규 매출 0원 가정 시';
      }

      const kpiRunwayDesc = document.getElementById('kpiRunwayDesc');
      if (kpiRunwayDesc) {
        if (workingCapital > 0 && monthlyFixedExpense > 0) {
          kpiRunwayDesc.innerHTML = `현재 등록된 사업 통장 보유 잔고 <strong>₩${workingCapital.toLocaleString()}</strong>를 기준으로, 추가 매출이 발생하지 않아도 <strong>약 ${runwayMonths}개월간 안정적으로 사업을 유지</strong>할 수 있습니다.`;
        } else {
          kpiRunwayDesc.innerHTML = `현재 등록된 사업 통장 보유 잔고가 <strong>₩0</strong>입니다. [자금 정리]에서 매출·입금 내역을 등록하거나 사업 통장 초기 잔고를 설정해 주세요.`;
        }
      }

      // 4. Compatibility IDs
      const elGross = document.getElementById('kpiGrossRevenue');
      if (elGross) elGross.textContent = '₩' + grossIncome.toLocaleString();
      const elNet = document.getElementById('kpiNetReceived');
      if (elNet) elNet.textContent = '₩' + netIncome.toLocaleString();
      const elTaxBuf = document.getElementById('kpiTaxBuffer');
      if (elTaxBuf) elTaxBuf.textContent = '₩' + taxBuffer.toLocaleString();
    }

    // Helper: HTML escaping

    // ==================== CASHFLOW CHART (부드러운 곡선 웨이브 & 반투명 그라데이션) ====================
    function initChart() {
      const canvas = document.getElementById('cashflowChart');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      
      // 잔고 추이용 부드러운 스카이블루 그라데이션 영역 채움 (첨부 1 스타일)
      const balanceGradient = ctx.createLinearGradient(0, 0, 0, 260);
      balanceGradient.addColorStop(0, 'rgba(14, 165, 233, 0.40)');
      balanceGradient.addColorStop(0.65, 'rgba(56, 189, 248, 0.12)');
      balanceGradient.addColorStop(1, 'rgba(240, 249, 255, 0.01)');

      cashflowChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          // X축 날짜: 모든 과거·미래 일자를 통일된 MM-DD 형식으로 표기
          labels: ['08-31', '09-15', '09-30', '10-05', '10-15', '10-25', '11-15', '11-25', '12-15'],
          datasets: [
            {
              type: 'line',
              label: '통장 잔고 추이',
              data: [1120, 1250, 1180, 1310, 1420, 1490, 1380, 1550, 1690],
              borderColor: '#0284c7',
              backgroundColor: balanceGradient,
              borderWidth: 2.5,
              tension: 0.45, // 부드러운 웨이브 곡선 (기존 유지)
              fill: true,
              pointBackgroundColor: '#0284c7',
              pointBorderColor: '#ffffff',
              pointBorderWidth: 1.5,
              pointRadius: 3.5,
              pointHoverRadius: 5.5,
              order: 1
            },
            {
              type: 'bar',
              label: '입금',
              data: [420, 380, 250, 330, 0, 250, 180, 300, 220],
              backgroundColor: '#10b981',
              hoverBackgroundColor: '#059669',
              borderRadius: 0, // 둥근 알약 모서리 제거! 세련된 직각 칼럼 바
              borderSkipped: false,
              barThickness: 10,
              maxBarThickness: 12,
              order: 2
            },
            {
              type: 'bar',
              label: '지출',
              data: [273, 273, 273, 273, 273, 273, 273, 273, 273],
              backgroundColor: '#f43f5e',
              hoverBackgroundColor: '#e11d48',
              borderRadius: 0, // 둥근 알약 모서리 제거! 세련된 직각 칼럼 바
              borderSkipped: false,
              barThickness: 10,
              maxBarThickness: 12,
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
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              titleFont: { size: 12, weight: 'bold' },
              bodyFont: { size: 11 },
              padding: 10,
              cornerRadius: 10,
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + Number(context.raw).toLocaleString() + '만 원 (' + (context.raw * 10000).toLocaleString() + '원)';
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(226, 232, 240, 0.7)' },
              ticks: { color: '#64748b', font: { size: 10, weight: 600 } }
            },
            y: {
              grid: { color: 'rgba(226, 232, 240, 0.7)' },
              ticks: {
                color: '#64748b',
                font: { size: 10, weight: 600 },
                // 일반인에게 직관적인 만원 표기 (예: 1,400만원)
                callback: function(value) { return Number(value).toLocaleString() + '만원'; }
              }
            }
          }
        }
      });
    }

    function updateChartData() {
      if (!cashflowChartInstance) return;
      if (appState.currentWorkstream === 'client') {
        cashflowChartInstance.data.datasets[0].data = [720, 850, 780, 910, 920, 990, 880, 1050, 1190];
        cashflowChartInstance.data.datasets[1].data = [300, 280, 150, 300, 0, 250, 100, 250, 180];
        cashflowChartInstance.data.datasets[2].data = [180, 180, 180, 180, 180, 180, 180, 180, 180];
      } else if (appState.currentWorkstream === 'publishing') {
        cashflowChartInstance.data.datasets[0].data = [220, 240, 230, 250, 300, 320, 310, 340, 350];
        cashflowChartInstance.data.datasets[1].data = [80, 70, 60, 120, 0, 40, 50, 40, 30];
        cashflowChartInstance.data.datasets[2].data = [50, 50, 50, 50, 50, 50, 50, 50, 50];
      } else if (appState.currentWorkstream === 'knowledge') {
        cashflowChartInstance.data.datasets[0].data = [180, 160, 170, 150, 200, 220, 210, 240, 290];
        cashflowChartInstance.data.datasets[1].data = [40, 30, 40, 100, 0, 50, 30, 80, 60];
        cashflowChartInstance.data.datasets[2].data = [43, 43, 43, 43, 43, 43, 43, 43, 43];
      } else {
        cashflowChartInstance.data.datasets[0].data = [1120, 1250, 1180, 1310, 1420, 1490, 1380, 1550, 1690];
        cashflowChartInstance.data.datasets[1].data = [420, 380, 250, 330, 0, 250, 180, 300, 220];
        cashflowChartInstance.data.datasets[2].data = [273, 273, 273, 273, 273, 273, 273, 273, 273];
      }
      cashflowChartInstance.update();
    }



// Expose overview functions to global window
window.updateKPICards = updateKPICards;
window.initChart = initChart;
window.updateChartData = updateChartData;
