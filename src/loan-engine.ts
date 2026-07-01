import { validateInput } from './validator';
import { addMonths, format } from 'date-fns';
import { round } from 'lodash';

export interface LoanInput {
  principal: number;
  annualInterestRate: number;
  termMonths: number;
  startDate?: string;
  extraPayment?: number;
  paymentFrequency?: 'monthly' | 'biweekly';
  interestOnlyPeriods?: number; // For complex loans
}

export interface AmortizationRow {
  period: number;
  paymentDate: string;
  beginningBalance: number;
  scheduledPayment: number;
  extraPayment: number;
  totalPayment: number;
  interest: number;
  principal: number;
  endingBalance: number;
  cumulativeInterest: number;
}

export interface LoanSummary {
  monthlyPayment: number;
  totalPayments: number;
  totalInterest: number;
  payoffDate: string;
  totalExtraPaid: number;
  amortizationSchedule: AmortizationRow[];
}
  
export class LoanEngine {
  private calculateMonthlyRate(annualRate: number): number {
    return annualRate / 12;
  }

  private calculateMonthlyPayment(principal: number, monthlyRate: number, termMonths: number): number {
    if (monthlyRate === 0) return principal / termMonths;
    const x = Math.pow(1 + monthlyRate, termMonths);
    return principal * (monthlyRate * x) / (x - 1);
  }

  public calculateLoan(input: LoanInput): LoanSummary {
    validateInput(input, {
      principal: { required: true, positive: true },
      termMonths: { required: true, positive: true },
      annualInterestRate: { required: true }
  });
    const {
      principal,
      annualInterestRate,
      termMonths,
      startDate = new Date().toISOString(),
      extraPayment = 0,
      paymentFrequency = 'monthly'
    } = input;


    const monthlyRate = this.calculateMonthlyRate(annualInterestRate);
    let scheduledPayment = this.calculateMonthlyPayment(principal, monthlyRate, termMonths);
    scheduledPayment = round(scheduledPayment, 2);

    let balance = principal;
    let cumulativeInterest = 0;
    const schedule: AmortizationRow[] = [];
    let currentDate = new Date(startDate);
    let totalExtra = 0;
    let period = 0;

    const monthsToAdd = paymentFrequency === 'biweekly' ? 0.5 : 1;

    while (balance > 0.01 && period < termMonths + 120) {
      period++;
      const interest = round(balance * monthlyRate, 2);
      let principalPayment = scheduledPayment - interest;

      if (extraPayment > 0) {
        principalPayment += extraPayment;
        totalExtra += extraPayment;
      }

      if (principalPayment > balance) {
        principalPayment = balance;
      }

      balance = round(Math.max(0, balance - principalPayment), 2);
      cumulativeInterest = round(cumulativeInterest + interest, 2);

      const paymentDate = format(currentDate, 'yyyy-MM-dd');

      schedule.push({
        period,
        paymentDate,
        beginningBalance: round(balance + principalPayment, 2),
        scheduledPayment,
        extraPayment: extraPayment > 0 ? extraPayment : 0,
        totalPayment: round(interest + principalPayment, 2),
        interest,
        principal: principalPayment,
        endingBalance: balance,
        cumulativeInterest,
      });

      currentDate = addMonths(currentDate, monthsToAdd);
      if (balance <= 0) break;
    }

    const totalPayments = schedule.reduce((sum, row) => sum + row.totalPayment, 0);

    return {
      monthlyPayment: scheduledPayment,
      totalPayments: round(totalPayments, 2),
      totalInterest: cumulativeInterest,
      payoffDate: schedule[schedule.length - 1]?.paymentDate || '',
      totalExtraPaid: round(totalExtra, 2),
      amortizationSchedule: schedule,
    };
  }
}

export default new LoanEngine();
