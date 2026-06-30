import { round } from 'lodash';

export interface PropertyInput {
  noi: number;                    // Net Operating Income
  capRate: number;
  purchasePrice?: number;
  holdingPeriod: number;
  growthRate?: number;
  exitCapRate?: number;
}

export class PropertyEngine {
  public incomeApproachValuation(noi: number, capRate: number): number {
    return round(noi / capRate, 2);
  }

  public dcfValuation(input: PropertyInput): any {
    const { noi, growthRate = 0.03, holdingPeriod, exitCapRate = 0.07 } = input;
    let currentNOI = noi;
    let totalCF = 0;

    for (let year = 1; year <= holdingPeriod; year++) {
      currentNOI = currentNOI * (1 + growthRate);
      totalCF += currentNOI;
    }

    const exitValue = currentNOI / exitCapRate;
    const totalValue = totalCF + exitValue;

    return {
      noiValuation: this.incomeApproachValuation(noi, input.capRate || 0.08),
      dcfValue: round(totalValue, 2),
      exitValue: round(exitValue, 2)
    };
  }

public calculateRealEstateReturn(input: any) {
  const { purchasePrice, holdingPeriod, annualNOI, growthRate = 0.03, exitCapRate = 0.07, loanAmount = 0 } = input;

  let equity = purchasePrice - loanAmount;
  let totalCashFlow = 0;
  let currentNOI = annualNOI;

  for (let year = 1; year <= holdingPeriod; year++) {
    currentNOI *= (1 + growthRate);
    totalCashFlow += currentNOI;
  }

  const exitValue = currentNOI / exitCapRate;
  const equityAtExit = exitValue - loanAmount; // Simplified
  const totalReturn = totalCashFlow + equityAtExit;
  const irr = (totalReturn / equity) ** (1 / holdingPeriod) - 1; // Approximate

  return {
    cashOnCashReturn: round((annualNOI / equity) * 100, 2),
    totalCashFlow: round(totalCashFlow, 2),
    exitValue: round(exitValue, 2),
    approximateIRR: round(irr * 100, 2)
  };
}


}

export default new PropertyEngine();