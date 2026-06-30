import type { Handler } from '@netlify/functions';
import PropertyEngine from '../../src/property-engine';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }) 
    };
  }

  try {
    const input = JSON.parse(event.body || '{}');

    if (!input.properties || !Array.isArray(input.properties) || input.properties.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing or invalid "properties" array. Please provide an array of property objects.' 
        }),
      };
    }

    const engine = new PropertyEngine();
    const result = engine.portfolioMetrics(input.properties);

    if (result.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: result.error }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        data: result 
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ 
        success: false, 
        error: error.message || 'Invalid input data' 
      }),
    };
  }
};