import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DashboardPreview = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const dashboardCards = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: '₹2,45,680',
      change: '+12.5%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'primary'
    },
    {
      id: 'transactions',
      title: 'Transactions',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: 'Activity',
      color: 'accent'
    },
    {
      id: 'credit',
      title: 'Credit Score',
      value: '785',
      change: '+15 pts',
      trend: 'up',
      icon: 'Award',
      color: 'success'
    },
    {
      id: 'customers',
      title: 'Retention',
      value: '94%',
      change: '+2.4%',
      trend: 'up',
      icon: 'Users',
      color: 'warning'
    }
  ];

  const recentTransactions = [
    { id: 1, type: 'UPI', customer: 'Rajesh Kumar', amount: '₹1,250', time: '2 mins ago', status: 'completed' },
    { id: 2, type: 'Cash', customer: 'Priya Sharma', amount: '₹850', time: '5 mins ago', status: 'completed' },
    { id: 3, type: 'UPI', customer: 'Amit Patel', amount: '₹2,100', time: '8 mins ago', status: 'completed' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto content-spacing relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              <Icon name="Monitor" size={14} className="mr-2" />
              Live Dashboard Preview
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Real-Time Business
              <span className="block italic text-primary">Intelligence</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Experience the power of data. Our dashboard converts raw transaction data into actionable insights, helping you make informed decisions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex space-x-2 bg-muted/30 p-1.5 rounded-2xl backdrop-blur-sm border border-border/50"
          >
            {['overview', 'analytics', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 capitalize ${activeTab === tab
                  ? 'bg-background text-primary shadow-lg border border-border/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group lg:p-1"
        >
          {/* Dashboard Frame */}
          <div className="relative bg-background border border-border rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 group-hover:border-primary/20">
            {/* Toolbar */}
            <div className="h-14 bg-muted/20 border-b border-border flex items-center justify-between px-8">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-destructive/30" />
                <div className="w-3 h-3 rounded-full bg-warning/30" />
                <div className="w-3 h-3 rounded-full bg-success/30" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live Sync Active</span>
              </div>
            </div>

            <div className="p-8 lg:p-12">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {dashboardCards.map((card, i) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.4 + (i * 0.1) }}
                    className="p-6 bg-muted/10 rounded-3xl border border-border/50 hover:bg-muted/20 transition-all duration-300"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-${card.color}/10 flex items-center justify-center`}>
                        <Icon name={card.icon} size={20} className={`text-${card.color}`} />
                      </div>
                      <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-lg">
                        {card.change}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-foreground">{card.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Transactions Area */}
              <div className="bg-muted/5 rounded-3xl border border-border/50 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-lg font-bold">Recent Transactions</h4>
                  <button className="text-sm font-bold text-primary hover:underline">View All History</button>
                </div>

                <div className="space-y-4">
                  {recentTransactions.map((tx, i) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isVisible ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.8 + (i * 0.1) }}
                      className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-2xl hover:shadow-md transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-xl bg-${tx.type === 'UPI' ? 'primary' : 'success'}/10 flex items-center justify-center`}>
                          <Icon name={tx.type === 'UPI' ? 'Smartphone' : 'Banknote'} size={18} className={`text-${tx.type === 'UPI' ? 'primary' : 'success'}`} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{tx.customer}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{tx.type} • {tx.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{tx.amount}</p>
                        <p className="text-[10px] text-success font-bold uppercase tracking-widest">Completed</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Overlay */}
            <div className="absolute inset-x-0 bottom-0 py-12 px-8 bg-gradient-to-t from-background via-background/95 to-transparent flex justify-center items-end">
              <Button
                variant="default"
                size="xl"
                iconName="Monitor"
                iconPosition="left"
                className="bg-foreground text-background font-bold h-16 px-10 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center"
                onClick={() => navigate('/dashboard-demo')}
              >
                Launch Fully Interactive Demo
              </Button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-accent/20 rounded-full blur-[80px]" />
          <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;