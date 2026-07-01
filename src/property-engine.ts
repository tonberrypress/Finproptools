import { validateInput } from './validator';
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
    validateInput({ noi, capRate }, {
      noi: { required: true, positive: true },
      capRate: { required: true, positive: true }
    });
    return round(noi / capRate, 2);
  }

  public dcfValuation(input: PropertyInput): any {
    validateInput(input, {
      noi: { required: true, positive: true },
      holdingPeriod: { required: true, positive: true }
    });
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
    validateInput(input, {
      purchasePrice: { required: true, positive: true },
      holdingPeriod: { required: true, positive: true },
      annualNOI: { required: true, positive: true }
    });
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

  public developmentFeasibility(input: any) {
    validateInput(input, {
      landCost: { required: true, positive: true },
      constructionCost: { required: true, positive: true },
      totalUnits: { required: true, positive: true },
      pricePerUnit: { required: true, positive: true }
    });
    const { landCost, constructionCost, totalUnits, pricePerUnit, holdingPeriod = 2, softCostsPercent = 0.15 } = input;

    const totalHardCost = constructionCost;
    const softCosts = totalHardCost * softCostsPercent;
    const totalCost = landCost + totalHardCost + softCosts;

    const totalRevenue = totalUnits * pricePerUnit;
    const profit = totalRevenue - totalCost;
    const margin = totalRevenue > 0 ? round(profit / totalRevenue * 100, 2) : 0;
    const yieldOnCost = totalCost > 0 ? round(totalRevenue / totalCost, 2) : 0;

    return {
      totalDevelopmentCost: round(totalCost, 2),
      totalProjectedRevenue: round(totalRevenue, 2),
      grossProfit: round(profit, 2),
      profitMarginPercent: margin,
      yieldOnCost,
      recommendation: margin > 20 ? "Feasible - Strong" : margin > 10 ? "Feasible" : "High Risk"
    };
  }

  public leaseEconomics(input: any) {
    validateInput(input, {
      monthlyRent: { required: true, positive: true },
      termMonths: { required: true, positive: true }
    });
    const { monthlyRent, termMonths, escalationRate = 0.03, tenantImprovements = 0, commissions = 0 } = input;

    let totalRent = 0;
    let currentRent = monthlyRent;

    for (let month = 1; month <= termMonths; month++) {
      totalRent += currentRent;
      if (month % 12 === 0) {
        currentRent *= (1 + escalationRate);
      }
    }

    const totalCosts = tenantImprovements + commissions;
    const effectiveRent = totalRent - totalCosts;

    return {
      totalContractRent: round(totalRent, 2),
      totalCosts: round(totalCosts, 2),
      effectiveRentOverTerm: round(effectiveRent, 2),
      averageMonthlyEffectiveRent: round(effectiveRent / termMonths, 2),
      npv: round(effectiveRent * 0.9, 2) // Simplified NPV
    };
  }

  public portfolioMetrics(properties: any[]) {
    validateInput({ properties }, {
      properties: { required: true }
    });
    if (!properties || properties.length === 0) {
      return { error: "No properties provided" };
    }

    const totalNOI = properties.reduce((sum, p) => sum + (p.noi || 0), 0);
    const totalValue = properties.reduce((sum, p) => sum + (p.value || 0), 0);
    const averageOccupancy = properties.reduce((sum, p) => sum + (p.occupancy || 0), 0) / properties.length;

    const totalExpenseRatio = properties.reduce((sum, p) => {
      return sum + (p.expenses ? p.expenses / (p.noi + p.expenses) : 0);
    }, 0) / properties.length;

    return {
      totalNOI: round(totalNOI, 2),
      totalPortfolioValue: round(totalValue, 2),
      averageOccupancy: round(averageOccupancy * 100, 2),
      averageExpenseRatio: round(totalExpenseRatio * 100, 2),
      portfolioCapRate: totalValue > 0 ? round(totalNOI / totalValue, 4) : 0,
      numberOfProperties: properties.length
    };
  }

}

export default new PropertyEngine();