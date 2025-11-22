/**
 * Calculates a credit score based on business metrics
 * @param {number} transactionsCount - Number of cash transactions in a month
 * @param {number} monthlyIncome - Shopkeeper's monthly income in INR
 * @param {number} businessAgeYears - How many years the shop has been running
 * @returns {number} Credit score between 300 and 900
 * @throws {Error} If any input is missing or invalid
 */
export function calculateCreditScore(transactionsCount, monthlyIncome, businessAgeYears) {
  // Validate inputs
  if (transactionsCount === undefined || transactionsCount === null) {
    throw new Error('transactionsCount is required');
  }
  if (monthlyIncome === undefined || monthlyIncome === null) {
    throw new Error('monthlyIncome is required');
  }
  if (businessAgeYears === undefined || businessAgeYears === null) {
    throw new Error('businessAgeYears is required');
  }

  // Ensure inputs are numbers
  const transactions = Number(transactionsCount);
  const income = Number(monthlyIncome);
  const age = Number(businessAgeYears);

  // Validate number conversion
  if (isNaN(transactions) || isNaN(income) || isNaN(age)) {
    throw new Error('All inputs must be valid numbers');
  }

  // Validate non-negative values
  if (transactions < 0 || income < 0 || age < 0) {
    throw new Error('All inputs must be non-negative');
  }

  // Calculate credit score using the fixed formula
  const baseScore = 300;
  const transactionScore = Math.min(600, transactions * 2);
  const ageScore = Math.min(50, age * 5);
  const incomeScore = Math.min(50, income / 20000);

  const creditScore = baseScore + transactionScore + ageScore + incomeScore;

  // Ensure score doesn't exceed 900
  return Math.min(900, Math.round(creditScore));
}

// Example usage:
// calculateCreditScore(120, 100000, 10) should return a fixed score
// Base: 300
// Transactions: min(600, 120 * 2) = min(600, 240) = 240
// Age: min(50, 10 * 5) = min(50, 50) = 50
// Income: min(50, 100000 / 20000) = min(50, 5) = 5
// Total: 300 + 240 + 50 + 5 = 595
