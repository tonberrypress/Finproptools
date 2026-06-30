import type { Handler } from '@netlify/functions';
import FinanceCore from '../../src/finance-core';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const input = JSON.parse(event.body || '{}');
    const core = new FinanceCore();

    const forecast = core.rollingForecast(
      input.currentValue,
      input.growthRate,
      input.periods || 12,
      input.scenario || 'base'
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        forecast,
        summary: {
          finalValue: forecast[forecast.length - 1].projectedValue,
          totalGrowth: round((forecast[forecast.length - 1].projectedValue - input.currentValue) / input.currentValue * 100, 2)
        }
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};