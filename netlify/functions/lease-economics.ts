import type { Handler } from '@netlify/functions';
import PropertyEngine from '../../src/property-engine';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const input = JSON.parse(event.body || '{}');
    const engine = new PropertyEngine();

    const result = engine.leaseEconomics(input);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, leaseAnalysis: result }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};