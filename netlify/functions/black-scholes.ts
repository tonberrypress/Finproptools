import type { Handler } from '@netlify/functions';
import FinanceCore from '../../src/finance-core';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const input = JSON.parse(event.body || '{}');
    const core = new FinanceCore();

    const price = core.blackScholes(
      input.type || 'call',
      input.spotPrice,
      input.strike,
      input.timeToExpiration,
      input.riskFreeRate,
      input.volatility
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        optionPrice: price,
        inputs: input 
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};