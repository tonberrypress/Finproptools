import { round } from 'lodash';

export interface PortfolioInput {
  returns: number[];           // Array of asset returns
  weights: number[];           // Portfolio weights (must sum to 1)
  riskFreeRate?: number;
  benchmarkReturns?: number[];
}

export class PortfolioEngine {
  public calculateSharpeRatio(returns: number[], riskFreeRate = 0.02): number {
    const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);
    return round((meanReturn - riskFreeRate) / stdDev, 4);
  }

  public calculatePortfolioReturn(weights: number[], assetReturns: number[]): number {
    let total = 0;
    for (let i = 0; i < weights.length; i++) {
      total += weights[i] * assetReturns[i];
    }
    return round(total, 4);
  }
}

export default new PortfolioEngine();