import React, { useState } from 'react';
import { calculateCreditScore } from './creditScoreCalculator.js';

export function CreditScoreExample() {
  const [transactions, setTransactions] = useState(120);
  const [income, setIncome] = useState(100000);
  const [age, setAge] = useState(10);
  const [score, setScore] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    try {
      setError('');
      const result = calculateCreditScore(transactions, income, age);
      setScore(result);
    } catch (err) {
      setError(err.message);
      setScore(null);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Credit Score Calculator</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Monthly Transactions
          </label>
          <input
            type="number"
            value={transactions}
            onChange={(e) => setTransactions(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Monthly Income (INR)
          </label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Age (Years)
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleCalculate}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Calculate Credit Score
        </button>

        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {score !== null && (
          <div className="mt-4 p-4 bg-green-50 rounded-md">
            <h3 className="text-lg font-semibold text-green-800">Credit Score</h3>
            <p className="text-3xl font-bold text-green-600">{score}</p>
            <p className="text-sm text-green-700 mt-1">
              Range: 300-900
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Example usage in your component:
// import { CreditScoreExample } from './utils/creditScoreExample';
// 
// function App() {
//   return (
//     <div>
//       <CreditScoreExample />
//     </div>
//   );
// }
