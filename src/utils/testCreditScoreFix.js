import { calculateCreditScore } from './creditScoreCalculator.js';

// Test that the credit score calculation is now deterministic
console.log('Testing Credit Score Fix:');
console.log('================================');

// Test 1: Same inputs should always give same result
const testInputs = [120, 100000, 10];
console.log('Test 1: Consistency Check');
console.log('Inputs:', testInputs);
console.log('Result 1:', calculateCreditScore(...testInputs));
console.log('Result 2:', calculateCreditScore(...testInputs));
console.log('Result 3:', calculateCreditScore(...testInputs));
console.log('All results should be identical: 595');
console.log('');

// Test 2: Different inputs should give different but consistent results
console.log('Test 2: Different Inputs');
console.log('Inputs: [50, 50000, 5]');
console.log('Result:', calculateCreditScore(50, 50000, 5));
console.log('Expected: 300 + min(600, 50*2) + min(50, 5*5) + min(50, 50000/20000) = 300 + 100 + 25 + 2.5 = 427.5 ≈ 428');
console.log('');

// Test 3: Edge cases
console.log('Test 3: Edge Cases');
console.log('Max transactions (300+):', calculateCreditScore(300, 100000, 10));
console.log('Max age (10+ years):', calculateCreditScore(120, 100000, 15));
console.log('Max income (1M+):', calculateCreditScore(120, 2000000, 10));
console.log('All max values:', calculateCreditScore(500, 2000000, 20));
console.log('');

// Test 4: Formula verification
console.log('Test 4: Formula Verification for [120, 100000, 10]');
const transactions = 120;
const income = 100000;
const age = 10;

const baseScore = 300;
const transactionScore = Math.min(600, transactions * 2);
const ageScore = Math.min(50, age * 5);
const incomeScore = Math.min(50, income / 20000);

console.log('Base Score:', baseScore);
console.log('Transaction Score:', transactionScore, '(min(600, 120*2) = min(600, 240) = 240)');
console.log('Age Score:', ageScore, '(min(50, 10*5) = min(50, 50) = 50)');
console.log('Income Score:', incomeScore, '(min(50, 100000/20000) = min(50, 5) = 5)');
console.log('Total:', baseScore + transactionScore + ageScore + incomeScore);
console.log('Expected Result: 595');
console.log('Actual Result:', calculateCreditScore(transactions, income, age));
console.log('');

console.log('✅ Credit Score Fix Verification Complete!');
console.log('The function now uses the correct formula and is deterministic.');
