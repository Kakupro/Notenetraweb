import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import { getAuth } from 'firebase/auth';
import { database } from '../../../firebase';
import { ref, onValue } from 'firebase/database';
import Button from '../../../components/ui/Button';
import { demoData, formatCurrency, formatDate } from '../../../utils/demoData';
import { computeCreditScoreFromTransactions } from '../../../utils/msmeScore';

const OverviewView = ({ children }) => {
  const [kpiData, setKpiData] = useState(demoData.kpiData);
  const [revenueData, setRevenueData] = useState(demoData.revenueData);
  const [paymentMethodData, setPaymentMethodData] = useState(demoData.paymentMethodData);
  const [creditScoreHistory, setCreditScoreHistory] = useState(demoData.creditScoreHistory);
  const [recentTransactions, setRecentTransactions] = useState(demoData.recentTransactions);
  const [scoreResult, setScoreResult] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Fetch from ESP32 path: transactions/esp
      const transactionsRef = ref(database, `transactions/esp`);
      const creditHistoryRef = ref(database, `creditHistory/${user.uid}`);

      onValue(transactionsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const transactions = Object.values(data).filter(t => t && t.time);
          
          // Calculate KPIs from ESP32 data
          const totalRevenue = transactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + (t.amount || 0), 0);
          const totalDebits = transactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + (t.amount || 0), 0);
          const totalTransactions = transactions.length;
          const currentBalance = totalRevenue - totalDebits;
          
          // Compute real-time credit score from cash transactions
          const computed = computeCreditScoreFromTransactions(
            transactions.map(t => ({
              time: t.time,
              amount: t.amount || 0,
              type: t.type, // 'credit' or 'debit'
            }))
          );
          setScoreResult(computed);

          setKpiData([
            { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: "TrendingUp", color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/20", change: "" },
            { title: "Total Transactions", value: totalTransactions, icon: "Receipt", color: "text-cyan-400", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/20", change: "" },
            { title: "Credit Score", value: computed?.score300to900 ?? '—', icon: "Award", color: "text-cyan-400", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/20", change: "" },
            { title: "Current Balance", value: `₹${currentBalance.toLocaleString('en-IN')}`, icon: "Wallet", color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/20", change: "" },
          ]);

          // Process revenue data for chart
          const monthlyRevenue = transactions.reduce((acc, t) => {
            if (t.time) {
              const date = new Date(t.time.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1'));
              const month = date.toLocaleString('default', { month: 'short' });
              if (t.type === 'credit') {
                acc[month] = (acc[month] || 0) + (t.amount || 0);
              }
            }
            return acc;
          }, {});
          setRevenueData(Object.keys(monthlyRevenue).map(month => ({ month, revenue: monthlyRevenue[month] })));

          // Process payment method data (ESP32 only sends cash transactions)
          setPaymentMethodData([
            { name: 'Cash', value: 100, color: '#10B981' }
          ]);

          // Set recent transactions (last 5)
          const recent = transactions
            .sort((a, b) => {
              const dateA = new Date(a.time.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1'));
              const dateB = new Date(b.time.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1'));
              return dateB - dateA;
            })
            .slice(0, 5)
            .map(t => ({
              ...t,
              mode: 'cash',
              time: t.time
            }));
          setRecentTransactions(recent);
        }
      });

      onValue(creditHistoryRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const history = Object.values(data).sort((a, b) => new Date(a.date) - new Date(b.date));
          setCreditScoreHistory(history);
        }
      });
    }
  }, [user]);

  return (
    <div className="p-6 space-y-6">
      {children} 
      <div className="mb-6">
        <Button
          onClick={() => window.open('https://razorpay.me/@notenetra', '_blank')}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Accept Online Payments (via Razorpay)
        </Button>
      </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData?.map((kpi, index) => (
          <div
            key={index}
            className={`${kpi?.bgColor} ${kpi?.borderColor} border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${kpi?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={kpi?.icon} size={24} className={kpi?.color} />
              </div>
              <div className={`flex items-center space-x-1 ${kpi?.color} text-sm font-medium`}>
                <Icon name="TrendingUp" size={16} />
                <span>{kpi?.change}</span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-1">{kpi?.value}</h3>
              <p className="text-sm text-muted-foreground">{kpi?.title}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip 
                  formatter={(value) => [`₹${value?.toLocaleString('en-IN')}`, 'Revenue']}
                  labelStyle={{ color: 'var(--foreground)' }}
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                />
                <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Recent Transactions</h3>
          <div className="space-y-4">
            {recentTransactions.map((tx, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${tx.type === 'credit' ? 'green' : 'red'}-500`}>
                      <Icon name={tx.type === 'credit' ? 'TrendingUp' : 'TrendingDown'} size={20} className={`text-${tx.type === 'credit' ? 'green' : 'red'}-400`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{tx.mode}</p>
                      <p className="text-sm text-muted-foreground">{new Date(tx.time).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>₹{tx.amount.toLocaleString('en-IN')}</p>
                </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Credit Score Progress</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={creditScoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis domain={['dataMin - 50', 'dataMax + 50']} stroke="var(--muted-foreground)" />
                <Tooltip 
                  formatter={(value) => [value, 'Credit Score']}
                  labelStyle={{ color: 'var(--foreground)' }}
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="var(--primary)" 
                  strokeWidth={3}
                  dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: 'var(--primary)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6">Payment Methods</h3>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  paddingAngle={5}
                >
                  {paymentMethodData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value.toFixed(2)}%`, 'Share']}
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;