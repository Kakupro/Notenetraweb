import React, { useState, useEffect } from 'react';
import { database } from '../../../firebase';
import { ref, onValue } from 'firebase/database';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { getAuth } from 'firebase/auth';
import { demoData, getTransactionStats } from '../../../utils/demoData';

const TransactionsView = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [dateRange, setDateRange] = useState('7days');
  const [transactions, setTransactions] = useState(demoData.transactions);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      // Fetch from ESP32 path: transactions/esp
      const transactionsRef = ref(database, `transactions/esp`);
      const unsubscribe = onValue(transactionsRef, (snapshot) => {
        const data = snapshot.val();
        const loadedTransactions = [];
        if (data) {
          Object.keys(data).forEach((key) => {
            const transaction = data[key];
            
            // Handle the ESP32 data structure
            if (transaction && transaction.time) {
              // Parse the timestamp from ESP32 format
              const timestamp = transaction.time;
              const datePart = timestamp.split(' ')[0]; // Get date part
              const timePart = timestamp.split(' ')[1]; // Get time part
              
              loadedTransactions.push({
                id: key, 
                date: datePart,
                time: timePart,
                customer: `ESP32 Device`, 
                amount: transaction.amount || 0,
                type: transaction.mode || 'cash', 
                transactionType: transaction.type || 'unknown', 
                status: 'completed', 
                items: `${transaction.amount} Rs ${transaction.type === 'credit' ? 'Added' : 'Removed'}`,
                userID: transaction.userID || 'ESP32'
              });
            }
          });
          
          // Sort by timestamp (newest first)
          loadedTransactions.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateB - dateA;
          });
        }
        setTransactions(loadedTransactions);
      }, (error) => {
        console.error("Error fetching transactions:", error);
        // Fallback to demo data if ESP32 data is not available
        setTransactions(demoData.transactions);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  const typeOptions = [
    { value: 'all', label: 'All Modes' },
    { value: 'cash', label: 'Cash' },
    { value: 'UPI', label: 'UPI' },
    { value: 'Card', label: 'Card' },
    { value: 'credit', label: 'Credit (Type)' },
    { value: 'debit', label: 'Debit (Type)' }
  ];

  const dateOptions = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'UPI': return 'Smartphone';
      case 'cash': return 'Banknote';
      case 'Cash': return 'Banknote';
      case 'Card': return 'CreditCard';
      case 'credit': return 'TrendingUp';
      case 'debit': return 'TrendingDown';
      default: return 'Receipt';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'UPI': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'cash': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Cash': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'Card': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'credit': return 'text-teal-400 bg-teal-500/10 border-teal-500/20';
      case 'debit': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesSearch = transaction?.customer?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         transaction?.items?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         transaction?.id?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    const matchesType = filterType === 'all' || transaction?.type === filterType || transaction?.transactionType === filterType;
    return matchesSearch && matchesType;
  });

  const stats = getTransactionStats(filteredTransactions);
  const { totalCredit, totalDebit, totalTransactions, balance } = stats;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">ESP32 Transaction History</h2>
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            onClick={() => alert('Export functionality would be implemented here')}
          >
            Export
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Receipt" size={24} color="var(--primary)" />
              <div>
                <p className="text-sm text-cyan-400">Total Transactions</p>
                <p className="text-2xl font-bold text-cyan-300">{totalTransactions}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="TrendingUp" size={24} color="var(--success)" />
              <div>
                <p className="text-sm text-green-400">Total Credit</p>
                <p className="text-2xl font-bold text-green-300">₹{totalCredit?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="TrendingDown" size={24} color="var(--destructive)" />
              <div>
                <p className="text-sm text-red-400">Total Debit</p>
                <p className="text-2xl font-bold text-red-300">₹{totalDebit?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Wallet" size={24} color="var(--warning)" />
              <div>
                <p className="text-sm text-amber-400">Current Balance</p>
                <p className="text-2xl font-bold text-amber-300">₹{balance?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            value={filterType}
            onValueChange={setFilterType}
            options={typeOptions}
            className="w-full sm:w-48"
          />
          <Select
            value={dateRange}
            onValueChange={setDateRange}
            options={dateOptions}
            className="w-full sm:w-48"
          />
        </div>
        
        <div className="mt-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">ID</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Date & Time</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Device</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Description</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Payment Mode</th>
                <th className="text-left py-3 px-6 font-medium text-muted-foreground">Type</th>
                <th className="text-right py-3 px-6 font-medium text-muted-foreground">Amount</th>
                <th className="text-center py-3 px-6 font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions?.map((transaction, index) => (
                <tr 
                  key={transaction?.id} 
                  className={`border-b border-border hover:bg-muted-foreground/10 transition-colors ${
                    index % 2 === 0 ? 'bg-card' : 'bg-background'
                  }`}
                >
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm text-primary">{transaction?.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">{transaction?.date}</div>
                      <div className="text-muted-foreground">{transaction?.time}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-foreground">{transaction?.customer}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-muted-foreground max-w-xs truncate" title={transaction?.items}>
                      {transaction?.items}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(transaction?.type)}`}>
                      <Icon name={getTypeIcon(transaction?.type)} size={14} />
                      <span>{transaction?.type}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getTypeColor(transaction?.transactionType)}`}>
                      <Icon name={getTypeIcon(transaction?.transactionType)} size={14} />
                      <span>{transaction?.transactionType?.charAt(0).toUpperCase() + transaction?.transactionType?.slice(1)}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-bold text-foreground">₹{transaction?.amount?.toLocaleString('en-IN')}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                      <Icon name="CheckCircle" size={14} />
                      <span>Completed</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Search" size={48} color="var(--muted-foreground)" className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsView;
