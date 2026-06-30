export const validateInput = (input: any, rules: any) => {
  for (const [field, rule] of Object.entries(rules)) {
    if (rule.required && (input[field] === undefined || input[field] === null)) {
      throw new Error(`${field} is required`);
    }
    if (rule.positive && (typeof input[field] === 'number' && input[field] <= 0)) {
      throw new Error(`${field} must be positive`);
    }
  }
};