import type { Handler } from '@netlify/functions';
import LoanEngine from '../../src/loan-engine';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const input = JSON.parse(event.body || '{}');
    const loan = new LoanEngine();

    const result = loan.calculateLoan({
      principal: input.loanAmount,
      annualInterestRate: input.interestRate,
      termMonths: input.termMonths,
      extraPayment: input.extraPayment || 0
    });

    // Add commercial metrics
    const noi = input.noi || 0;
    const dscr = noi > 0 ? round(noi / result.monthlyPayment / 12, 2) : null; // Annualized
    const ltv = input.propertyValue ? round(input.loanAmount / input.propertyValue, 2) : null;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        loan: result,
        commercialMetrics: {
          dscr,
          ltv,
          debtYield: noi > 0 ? round(noi / input.loanAmount * 100, 2) : null
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