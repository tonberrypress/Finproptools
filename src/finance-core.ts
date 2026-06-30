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

  // Future Value, Payback, etc. can be added here
}

export default new FinanceCore();