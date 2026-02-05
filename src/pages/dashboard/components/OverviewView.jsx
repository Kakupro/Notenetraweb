import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../context/AuthContext';
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
  const { user } = useAuth();
  useEffect(() => {
    if (user) {
      // Logic to load data locally or just use demo data
      // For now, we just rely on the initial state set from demoData
      // If we wanted to simulate 'loading' we could do it here
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
            {recentTransactions.map((tx, index) => {
              let displayDate = 'Invalid Date';
              try {
                // Ensure date is valid for display
                const date = new Date(tx.time); // tx.time was preserved as original in map
                // But we need to handle the specific format if it's that string
                if (typeof tx.time === 'string' && tx.time.match(/^\d{2}-\d{2}-\d{4}/)) {
                  displayDate = new Date(tx.time.replace(/(\d{2})-(\d{2})-(\d{4})/, '$3-$2-$1')).toLocaleDateString();
                } else if (!isNaN(date.getTime())) {
                  displayDate = date.toLocaleDateString();
                }
              } catch (e) { console.error('Date error', e) }

              return (
                <React.Fragment key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${tx.type === 'credit' ? 'green' : 'red'}-500/10`}>
                        <Icon name={tx.type === 'credit' ? 'TrendingUp' : 'TrendingDown'} size={20} className={tx.type === 'credit' ? 'text-green-500' : 'text-red-500'} />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{tx.mode || 'Cash'}</p>
                        <p className="text-sm text-muted-foreground">{displayDate}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>₹{(tx.amount || 0).toLocaleString('en-IN')}</p>
                  </div>
                </React.Fragment>
              )
            })}
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