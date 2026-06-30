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
}

export default new PropertyEngine();