/**
 * SoloOS Tax & Financial Engineering Module
 * Works in both Browser (window.SoloOSTaxEngine) and Node.js (CommonJS / ES Module)
 * Supports 3대 세무 매트릭스, 4대 기타소득 역산, 워터폴 손익, 런웨이 지표
 */
(function(root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.SoloOSTaxEngine = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';

  const TaxEngine = {
    version: '2.0.0',

    /**
     * 1. 10% 일반과세 세금계산서 계산
     * @param {number} gross 공급가액
     */
    calcVAT: function(gross) {
      const g = Math.round(Number(gross) || 0);
      const vat = Math.round(g * 0.1);
      return {
        gross: g,
        tax: vat,
        net: g + vat,
        rate: 0.10,
        type: 'VAT'
      };
    },

    /**
     * 10% 일반과세 세금계산서 합계금액에서 공급가액 및 VAT 역산
     * @param {number} total 합계금액(공급가+부가세)
     */
    reverseVAT: function(total) {
      const t = Math.round(Number(total) || 0);
      const gross = Math.round(t / 1.1);
      const tax = t - gross;
      return {
        gross: gross,
        tax: tax,
        net: t,
        rate: 0.10,
        type: 'VAT'
      };
    },

    /**
     * 2. 3.3% 프리랜서 사업소득세 계산 (공급가 기준)
     * @param {number} gross 계약/공급금액
     */
    calcWithholding33: function(gross) {
      const g = Math.round(Number(gross) || 0);
      const incomeTax = Math.floor(g * 0.03); // 국세 3%
      const localTax = Math.floor(incomeTax * 0.1); // 지방소득세 0.3% (소득세의 10%)
      const totalTax = incomeTax + localTax;
      const net = g - totalTax; // 실수령액
      return {
        gross: g,
        incomeTax: incomeTax,
        localTax: localTax,
        tax: totalTax,
        net: net,
        effectiveRate: 0.033,
        type: '3.3%'
      };
    },

    /**
     * 3.3% 프리랜서 사업소득세 정밀 역산 (통장 입금된 실수령액 -> 공급가, 소득세, 지방세)
     * 공식: 공급가 = 실수령액 / (1 - 0.033) = 실수령액 / 0.967
     * @param {number} netAmount 통장 입금 실수령액
     */
    reverseWithholding33: function(netAmount) {
      const net = Math.round(Number(netAmount) || 0);
      if (net <= 0) return { gross: 0, incomeTax: 0, localTax: 0, tax: 0, net: 0 };
      
      const gross = Math.round(net / 0.967);
      const incomeTax = Math.floor(gross * 0.03);
      const localTax = Math.floor(incomeTax * 0.1);
      const totalTax = incomeTax + localTax;
      return {
        gross: gross,
        incomeTax: incomeTax,
        localTax: localTax,
        tax: totalTax,
        net: gross - totalTax,
        effectiveRate: 0.033,
        type: '3.3%'
      };
    },

    /**
     * 3. 국세청 4대 기타소득 계산 (8.8%, 4.4%, 22%)
     * @param {number} gross 총 지급액
     * @param {number} expenseRatio 필요경비율 (0.6, 0.8, 0.0)
     */
    calcOtherIncome: function(gross, expenseRatio = 0.60) {
      const g = Math.round(Number(gross) || 0);
      const recognizedExpense = Math.floor(g * expenseRatio);
      const taxableIncome = g - recognizedExpense; // 소득금액
      const incomeTax = Math.floor(taxableIncome * 0.20); // 국세 20%
      const localTax = Math.floor(incomeTax * 0.10); // 지방세 2%
      const totalTax = incomeTax + localTax;
      const net = g - totalTax;
      const effectiveRate = Number(((totalTax / g) * 100).toFixed(2)) || 0;

      return {
        gross: g,
        recognizedExpense: recognizedExpense,
        taxableIncome: taxableIncome,
        incomeTax: incomeTax,
        localTax: localTax,
        tax: totalTax,
        net: net,
        expenseRatio: expenseRatio,
        effectiveRate: effectiveRate
      };
    },

    /**
     * 기타소득 실수령액에서 총액 역산
     * @param {number} net 실수령액
     * @param {number} expenseRatio 필요경비율 (0.6 -> 실효 8.8%, 0.8 -> 실효 4.4%)
     */
    reverseOtherIncome: function(net, expenseRatio = 0.60) {
      const n = Math.round(Number(net) || 0);
      const effectiveRate = (1 - expenseRatio) * 0.22;
      const gross = Math.round(n / (1 - effectiveRate));
      return this.calcOtherIncome(gross, expenseRatio);
    },

    /**
     * 4. 런웨이(Runway) 생존 개월 수 계산
     * @param {number} workingCapital 사업 통장 보유 가용 잔고
     * @param {number} monthlyFixedExpense 월 고정 지출액
     */
    calcRunway: function(workingCapital, monthlyFixedExpense) {
      const wc = Number(workingCapital) || 0;
      const me = Number(monthlyFixedExpense) || 1;
      const months = (wc / me).toFixed(1);
      return {
        workingCapital: wc,
        monthlyFixedExpense: me,
        runwayMonths: parseFloat(months),
        isSafe: parseFloat(months) >= 6.0,
        isWarning: parseFloat(months) < 3.0
      };
    },

    /**
     * 5. 워터폴 손익 계산기
     * 총매출 -> 직접경비 -> 당기순이익 -> 세무분리예치금 -> 최종 잉여금
     */
    calcWaterfall: function(transactions = []) {
      let grossRevenue = 0;
      let totalExpense = 0;
      let taxReserve = 0;

      transactions.forEach(t => {
        const net = Number(t.net) || 0;
        const tax = Math.abs(Number(t.tax) || 0);
        if (net > 0) {
          grossRevenue += (t.gross ? Math.abs(Number(t.gross)) : net);
          taxReserve += tax;
        } else {
          totalExpense += Math.abs(net);
        }
      });

      const netProfit = grossRevenue - totalExpense;
      const pureRunwaySurplus = netProfit - taxReserve;
      const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0.0';

      return {
        grossRevenue: grossRevenue,
        totalExpense: totalExpense,
        netProfit: netProfit,
        profitMargin: parseFloat(profitMargin),
        taxReserve: taxReserve,
        pureRunwaySurplus: pureRunwaySurplus
      };
    },

    /**
     * 6. 사업 체력표 (자산, 부채, 자본건전도)
     */
    calcFinancialStamina: function(workingCapital, receivables = [], deferredPayables = 0) {
      const totalReceivables = receivables.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
      const totalAssets = Number(workingCapital) + totalReceivables;
      const totalLiabilities = Number(deferredPayables) || 0;
      const netWorth = totalAssets - totalLiabilities;
      const healthRatio = totalAssets > 0 ? ((netWorth / totalAssets) * 100).toFixed(1) : '100.0';

      return {
        workingCapital: Number(workingCapital),
        receivables: totalReceivables,
        totalAssets: totalAssets,
        totalLiabilities: totalLiabilities,
        netWorth: netWorth,
        healthRatio: parseFloat(healthRatio)
      };
    }
  };

  return TaxEngine;
});
