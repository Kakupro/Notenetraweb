import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { getDatabase, ref, onValue, query, orderByChild } from 'firebase/database';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Wallet, ArrowUpCircle, ArrowDownCircle, Info } from 'lucide-react';

const CashFlowView = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [totalCredit, setTotalCredit] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const db = getDatabase();
    // Path matches the ESP code: transactions/esp/{userId}
    const transactionsRef = ref(db, `transactions/esp/${user.uid}`);
    
    // Sort by timestamp if possible, or just fetch all
    const q = query(transactionsRef);

    const unsubscribe = onValue(q, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array
        const transactionList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));

        // Sort by time (assuming time string "DD-MM-YYYY HH:MM:SS" which is not ideal for sorting string-wise
        // but let's try to parse or just display them)
        // Ideally ESP should send a timestamp (epoch), but it sends a formatted string.
        // We will just reverse the list to show newest first (assuming pushed in order)
        transactionList.reverse();

        setTransactions(transactionList);

        // Calculate Totals
        let credit = 0;
        let debit = 0;
        transactionList.forEach(tx => {
            const amount = parseFloat(tx.amount) || 0;
            if (tx.type === 'credit') credit += amount;
            if (tx.type === 'debit') debit += amount;
        });
        setTotalCredit(credit);
        setTotalDebit(debit);
      } else {
        setTransactions([]);
        setTotalCredit(0);
        setTotalDebit(0);
      }
      setLoading(false);
    }, (error) => {
        console.error("Error fetching transactions:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return <div className="p-8 text-center text-white">Loading Cash Flow Data...</div>;
  }

  return (
    <div className="p-6 space-y-6 bg-dark-bg-primary min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">Smart Cash Counter</h1>
        <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded border border-gray-700">
            <p className="flex items-center gap-1"><Info size={12}/> Connection ID (UserID)</p>
            <code className="text-cyan-400">{user?.uid}</code>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-blue-900 to-blue-950 border-blue-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Net Balance</CardTitle>
            <Wallet className="h-4 w-4 text-blue-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{(totalCredit - totalDebit).toFixed(2)}</div>
            <p className="text-xs text-blue-200 mt-1">Current Cash in Hand</p>
          </CardContent>
        </Card>

        {/* Credit Card */}
        <Card className="bg-gradient-to-br from-emerald-900 to-emerald-950 border-emerald-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Total Credit (In)</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-emerald-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{totalCredit.toFixed(2)}</div>
            <p className="text-xs text-emerald-200 mt-1">Total Received</p>
          </CardContent>
        </Card>

        {/* Debit Card */}
        <Card className="bg-gradient-to-br from-rose-900 to-rose-950 border-rose-800">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-rose-100">Total Debit (Out)</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-rose-200" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₹{totalDebit.toFixed(2)}</div>
            <p className="text-xs text-rose-200 mt-1">Total Paid</p>
          </CardContent>
        </Card>
      </div>

      {/* Warning / Instruction if no data */}
      {transactions.length === 0 && (
          <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg text-yellow-200 text-sm">
            <p className="font-bold flex items-center gap-2"><Info size={16}/> No Data Received Yet</p>
            <p className="mt-1">Make sure your ESP device is turned on, connected to WiFi, and the User ID in the code matches: <span className="font-mono bg-black/30 px-1 rounded text-white">{user?.uid}</span></p>
          </div>
      )}

      {/* Transactions List */}
      <Card className="bg-dark-bg-card border-dark-border-primary">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
             <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-400 uppercase bg-dark-bg-tertiary">
                    <tr>
                        <th className="px-4 py-3">Time</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3">Mode</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-dark-border-primary hover:bg-dark-bg-tertiary/50 transition-colors">
                            <td className="px-4 py-3 text-gray-300">{tx.time}</td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    tx.type === 'credit' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                    {tx.type.toUpperCase()}
                                </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-white">
                                <span className={tx.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'}>
                                    {tx.type === 'credit' ? '+' : '-'} ₹{parseFloat(tx.amount).toFixed(2)}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-400">{tx.mode || 'Cash'}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CashFlowView;
