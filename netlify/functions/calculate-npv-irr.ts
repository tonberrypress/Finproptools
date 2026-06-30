
import type { Handler } from '@netlify/functions';
import FinanceCore from '../../src/finance-core';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }) };
  }

  try {
    const input = JSON.parse(event.body || '{}');

    if (!input.cashFlows || !Array.isArray(input.cashFlows) || input.cashFlows.length < 2) {
      return { statusCode: 400, body: JSON.stringify({ success: false, error: 'cashFlows array with at least 2 entries is required' }) };
    }

    const core = new FinanceCore();
    const result = {
      npv: input.rate !== undefined ? core.calculateNPV(input.rate, input.cashFlows) : null,
      irr: core.calculateIRR(input.cashFlows.map((cf: any) => cf.amount || cf))
    };

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: result }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: error.message || 'Invalid input' }),
    };
  }
};