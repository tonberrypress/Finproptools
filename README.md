# FinProp Tools

A TypeScript-based API for financial and real estate calculations. Deploy on Netlify Functions.

## Description

Pure logic financial and real estate calculation APIs for loan amortization, property valuation, tax calculations, and financial analysis.

## Features

- **Loan Calculations**: Amortization schedules, payment calculations
- **Financial Analysis**: NPV, IRR, Black-Scholes option pricing, tax brackets
- **Property Valuation**: Income approach, DCF valuation, real estate returns
- **Development Analysis**: Feasibility studies, lease economics, portfolio metrics

## API Endpoints

### Loan Calculations
- **POST** `/api/calculate-loan` - Calculate loan amortization schedule
  ```json
  {
    "principal": 300000,
    "annualInterestRate": 0.06,
    "termMonths": 360,
    "extraPayment": 0,
    "paymentFrequency": "monthly"
  }
