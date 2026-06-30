import type { Handler } from '@netlify/functions';
import PortfolioEngine from '../../src/portfolio-engine';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const input = JSON.parse(event.body || '{}');
    const engine = new PortfolioEngine();

    const result = {
      portfolioReturn: engine.calculatePortfolioReturn(input.weights || [], input.assetReturns || []),
      sharpeRatio: input.returns ? engine.calculateSharpeRatio(input.returns, input.riskFreeRate) : null
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};