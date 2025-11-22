import { calculateCreditScore } from './creditScoreCalculator.js';

// Test the function with the example provided
console.log('Testing calculateCreditScore(120, 100000, 10):');
console.log('Expected calculation:');
console.log('Base: 300');
console.log('Transactions: min(600, 120 * 2) = min(600, 240) = 240');
console.log('Age: min(50, 10 * 5) = min(50, 50) = 50');
console.log('Income: min(50, 100000 / 20000) = min(50, 5) = 5');
console.log('Total: 300 + 240 + 50 + 5 = 595');

const result = calculateCreditScore(120, 100000, 10);
console.log('Actual result:', result);

// Test multiple calls to ensure consistency
console.log('\nTesting consistency (should be the same):');
console.log('Call 1:', calculateCreditScore(120, 100000, 10));
console.log('Call 2:', calculateCreditScore(120, 100000, 10));
console.log('Call 3:', calculateCreditScore(120, 100000, 10));

// Test edge cases
console.log('\nTesting edge cases:');
console.log('Max transactions (300+):', calculateCreditScore(300, 100000, 10));
console.log('Max age (10+ years):', calculateCreditScore(120, 100000, 15));
console.log('Max income (1M+):', calculateCreditScore(120, 2000000, 10));
console.log('All max values:', calculateCreditScore(500, 2000000, 20));

// Test error cases
console.log('\nTesting error cases:');
try {
  calculateCreditScore(undefined, 100000, 10);
} catch (error) {
  console.log('Missing transactionsCount:', error.message);
}

try {
  calculateCreditScore(120, null, 10);
} catch (error) {
  console.log('Missing monthlyIncome:', error.message);
}

try {
  calculateCreditScore(120, 100000, 'invalid');
} catch (error) {
  console.log('Invalid businessAgeYears:', error.message);
}
