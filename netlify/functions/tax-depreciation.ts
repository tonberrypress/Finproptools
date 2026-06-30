import type { Handler } from '@netlify/functions';
import FinanceCore from '../../src/finance-core';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const input = JSON.parse(event.body || '{}');
    const core = new FinanceCore();

    const result = {
      depreciation: core.straightLineDepreciation(
        input.assetCost, 
        input.salvageValue || 0, 
        input.usefulLife, 
        input.year || 1
      ),
      taxLiability: input.taxableIncome ? core.calculateTax(input.taxableIncome) : null
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