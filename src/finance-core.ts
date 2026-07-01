import { validateInput } from './validator';
import { round } from 'lodash';

export interface CashFlow {
  amount: number;
  period: number; // 0 = now, 1 = end of period 1, etc.
}

export class FinanceCore {
  // Net Present Value
  public calculateNPV(rate: number, cashFlows: CashFlow[]): number {
    validateInput({ rate, cashFlows }, {
  rate: { required: true },
  cashFlows: { required: true }
});
    let npv = 0;
    for (const cf of cashFlows) {
      npv += cf.amount / Math.pow(1 + rate, cf.period);
    }
    return round(npv, 2);
  }

  // Internal Rate of Return (simple approximation)
  public calculateIRR(cashFlows: number[]): number {
 validateInput({ cashFlows }, {
  cashFlows: { required: true }
});
    // Basic implementation - can be improved with better solver
    let rate = 0.1;
    for (let i = 0; i < 50; i++) {
      let npv = cashFlows[0];
      for (let t = 1; t < cashFlows.length; t++) {
        npv += cashFlows[t] / Math.pow(1 + rate, t);
      }
      if (Math.abs(npv) < 0.01) break;
      rate += npv > 0 ? 0.001 : -0.001;
    }
    return round(rate * 100, 2);
  }

// Add this to the existing FinanceCore class

  public blackScholes(callPut: 'call' | 'put', S: number, K: number, T: number, r: number, sigma: number): number {
    validateInput({ S, K, T, r, sigma }, {
  S: { required: true, positive: true },
  K: { required: true, positive: true },
  T: { required: true, positive: true },
  r: { required: true },
  sigma: { required: true, positive: true }
});
  const d1 = (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
  const d2 = d1 - sigma * Math.sqrt(T);

  const normCDF = (x: number) => {
    // Simple approximation
    return 0.5 * (1 + Math.tanh(0.8 * x));
  };

  if (callPut === 'call') {
    return round(S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2), 2);
  } else {
    return round(K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1), 2);
  }
}

public analyzeFinancials(income: any, balance: any) {
validateInput({ income, balance }, {
  income: { required: true },
  balance: { required: true }
});
  const revenue = income.revenue || 0;
  const netIncome = income.netIncome || 0;
  const assets = balance.assets || 0;
  const equity = balance.equity || 0;
  const liabilities = balance.liabilities || 0;

  return {
    grossMargin: revenue > 0 ? round((revenue - (income.cogs || 0)) / revenue * 100, 2) : 0,
    netProfitMargin: revenue > 0 ? round(netIncome / revenue * 100, 2) : 0,
    roe: equity > 0 ? round(netIncome / equity * 100, 2) : 0, // Return on Equity
    currentRatio: balance.currentAssets && balance.currentLiabilities ? 
      round(balance.currentAssets / balance.currentLiabilities, 2) : null,
    debtToEquity: equity > 0 ? round(liabilities / equity, 2) : null
  };
}

public straightLineDepreciation(cost: number, salvage: number, usefulLife: number, year: number): number {
  const annualDep = (cost - salvage) / usefulLife;
  return round(annualDep, 2);
}

public calculateTax( taxableIncome: number, brackets: Array<{min: number, rate: number}> = [] ): number {
 validateInput({ taxableIncome }, {
  taxableIncome: { required: true }
});
  // Default progressive brackets (US-style example - customizable)
  const defaultBrackets = [
    { min: 0, rate: 0.10 },
    { min: 11000, rate: 0.12 },
    { min: 44725, rate: 0.22 },
    { min: 95375, rate: 0.24 }
  ];

  const usedBrackets = brackets.length ? brackets : defaultBrackets;
  let tax = 0;
  let prev = 0;

  for (const bracket of usedBrackets) {
    if (taxableIncome > bracket.min) {
      const taxableInBracket = Math.min(taxableIncome, bracket.min + 1000000) - prev; // simplified
      tax += taxableInBracket * bracket.rate;
      prev = bracket.min;
    }
  }
  return round(tax, 2);
}

public rollingForecast(currentValue: number, growthRate: number, periods: number, scenario: 'base' | 'best' | 'worst' = 'base') {
 validateInput({ currentValue, growthRate, periods }, {
  currentValue: { required: true },
  growthRate: { required: true },
  periods: { required: true, positive: true }
});
  const adjustedRate = scenario === 'best' ? growthRate * 1.2 : 
                       scenario === 'worst' ? growthRate * 0.8 : growthRate;

  const forecast = [];
  let value = currentValue;

  for (let i = 1; i <= periods; i++) {
    value = value * (1 + adjustedRate);
    forecast.push({
      period: i,
      projectedValue: round(value, 2),
      growthApplied: round(adjustedRate * 100, 2)
    });
  }

  return forecast;
}


  // Future Value, Payback, etc. can be added here

}

export default new FinanceCore();