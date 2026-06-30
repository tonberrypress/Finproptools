import { round } from 'lodash';

export const formatMoney = (amount: number): number => round(amount, 2);

export const calculateMonthlyRate = (annualRate: number): number => annualRate / 12;

export const generateDates = (startDate: string, count: number, intervalMonths = 1) => {
  // Simple date generator using date-fns (you can expand)
};