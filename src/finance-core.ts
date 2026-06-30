import { round } from 'lodash';

export interface CashFlow {
  amount: number;
  period: number; // 0 = now, 1 = end of period 1, etc.
}

export class FinanceCore {
  // Net Present Value
  public calculateNPV(rate: number, cashFlows: CashFlow[]): number {
    let npv = 0;
    for (const cf of cashFlows) {
      npv += cf.amount / Math.pow(1 + rate, cf.period);
    }
    return round(npv, 2);
  }

  // Internal Rate of Return (simple approximation)
  public calculateIRR(cashFlows: number[]): number {
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
  // Future Value, Payback, etc. can be added here

}

export default new FinanceCore();