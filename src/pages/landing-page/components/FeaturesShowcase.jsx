import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../../firebase';
import Button from '../../../components/ui/Button';

const FeaturesShowcase = () => {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [monthlyTransactions, setMonthlyTransactions] = useState('');
  const [businessAge, setBusinessAge] = useState('');
  const [creditScore, setCreditScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const functions = getFunctions(app);
  const calculateScore = httpsCallable(functions, 'calculateCreditScore');

  const handleCalculateCreditScore = async () => {
    if (!monthlyRevenue || !monthlyTransactions || !businessAge) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError(null);
    setCreditScore(null);
    try {
      const response = await calculateScore({
        monthlyRevenue: parseFloat(monthlyRevenue),
        monthlyTransactions: parseFloat(monthlyTransactions),
        businessAge: parseFloat(businessAge),
      });
      setCreditScore(response.data.creditScore);
    } catch (err) {
      console.error('Error calling Cloud Function:', err);
      setError('Failed to calculate credit score. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      id: 1,
      icon: 'Activity',
      title: 'Transaction Analytics',
      description: 'Capture every sale with AI-powered recognition. Real-time processing for instant insights.',
      color: 'primary',
      stats: '99.9% Accuracy'
    },
    {
      id: 2,
      icon: 'TrendingUp',
      title: 'Credit Score Engine',
      description: 'Build creditworthiness through analyzed history. Unlock formal bank loans faster.',
      color: 'accent',
      stats: '40% Faster Loans'
    },
    {
      id: 3,
      icon: 'FileText',
      title: 'Digital Invoicing',
      description: 'Generate GST invoices instantly. Professional records for every transaction.',
      color: 'success',
      stats: '80% Time Saved'
    },
    {
      id: 4,
      icon: 'Store',
      title: 'Market Expansion',
      description: 'Connect with ONDC and expand your reach to new digital customer segments.',
      color: 'warning',
      stats: '3x More Reach'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef?.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 bg-muted/10 relative overflow-hidden">
      {/* Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto content-spacing relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-6"
          >
            <Icon name="Zap" size={14} className="mr-2" />
            Cutting-Edge Technology
          </motion.div>
          <h2 className="text-4xl lg:text-7xl font-bold text-foreground mb-8">
            Powering the Future of
            <span className="block text-primary italic">Indian MSMEs</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From smart transaction tracking to credit visibility, we provide the tools you need to grow in the digital economy.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              onMouseEnter={() => setHoveredFeature(feature.id)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="group relative h-full"
            >
              <div className="h-full bg-background p-8 rounded-[2.5rem] border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col">
                <div className={`w-16 h-16 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon name={feature.icon} size={28} className={`text-${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/10">
                  <span className={`text-xs font-bold uppercase tracking-wider text-${feature.color}`}>
                    {feature.stats}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon name="ArrowRight" size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Credit Simulator Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative max-w-4xl mx-auto bg-foreground rounded-[3rem] p-8 lg:p-16 overflow-hidden shadow-2xl"
        >
          {/* Animated Glow */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10">
            <div className="text-center mb-12">
              <h3 className="text-3xl lg:text-4xl font-bold text-background mb-4">Credit Score Simulator</h3>
              <p className="text-background/60">See how your transaction history impacts your creditworthiness.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { label: 'Monthly Revenue', value: monthlyRevenue, set: setMonthlyRevenue, placeholder: '₹ 5,00,000' },
                { label: 'Transactions', value: monthlyTransactions, set: setMonthlyTransactions, placeholder: '500+' },
                { label: 'Business Age', value: businessAge, set: setBusinessAge, placeholder: 'Years' }
              ].map((input, idx) => (
                <div key={idx} className="space-y-2">
                  <label className="text-xs font-bold text-background/40 uppercase tracking-widest pl-2">
                    {input.label}
                  </label>
                  <input
                    type="number"
                    value={input.value}
                    onChange={(e) => input.set(e.target.value)}
                    placeholder={input.placeholder}
                    className="w-full h-14 bg-background/5 border border-background/10 rounded-2xl px-6 text-background placeholder:text-background/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>

            <Button
              variant="default"
              size="xl"
              fullWidth
              onClick={handleCalculateCreditScore}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-bold h-16 rounded-2xl shadow-xl shadow-primary/20"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  Analyzing Data...
                </div>
              ) : (
                <>
                  <Icon name="Calculator" size={20} className="mr-3" />
                  Calculate Estimated Score
                </>
              )}
            </Button>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 text-center text-destructive text-sm font-bold"
                >
                  {error}
                </motion.p>
              )}

              {creditScore !== null && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 text-center p-10 bg-background/5 rounded-[2rem] border border-background/10 backdrop-blur-md"
                >
                  <p className="text-xs font-bold text-background/40 uppercase tracking-[0.2em] mb-4">Estimated Digital Credit Score</p>
                  <div className="relative inline-block">
                    <span className="text-7xl lg:text-9xl font-black text-primary drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]">
                      {creditScore}
                    </span>
                  </div>
                  <p className="text-background/60 mt-6 max-w-md mx-auto italic">
                    Based on your transaction volume and business age, you have a
                    <span className="text-success font-bold px-1">Strong</span>
                    financial profile.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;