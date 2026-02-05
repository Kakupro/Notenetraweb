import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
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

  const handleCalculateCreditScore = async () => {
    if (!monthlyRevenue || !monthlyTransactions || !businessAge) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    setError(null);
    setCreditScore(null);

    // Simulated Logic for the Simulator (Corrected & Robust)
    setTimeout(() => {
      try {
        const rev = parseFloat(monthlyRevenue);
        const trans = parseFloat(monthlyTransactions);
        const age = parseFloat(businessAge);

        // Base Score (Deterministic starting point)
        let score = 350;

        // Revenue Factor (Logarithmic increase - rewarding scale)
        // A business with 1L revenue (10^5) gets ~175, 10L (10^6) gets ~210
        score += Math.min(250, (Math.log10(rev || 1) * 35));

        // Transaction Factor (Rewarding high volume/frequency)
        // 500 transactions/mo is a good baseline
        score += Math.min(150, (trans / 100) * 12);

        // Age Factor (Rewarding stability)
        // Max 100 points for 5+ years
        score += Math.min(100, age * 20);

        // Final Clamp (300-850 range)
        const finalScore = Math.floor(Math.max(300, Math.min(850, score)));
        setCreditScore(finalScore);
      } catch (err) {
        setError('Failed to calculate. Please check your inputs.');
      } finally {
        setLoading(false);
      }
    }, 1500); // Realistic delay
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
    <section ref={sectionRef} className="py-32 bg-[#020408] relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto content-spacing relative z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Icon name="Zap" size={14} className="mr-2" />
            Empowering Your Growth
          </motion.div>
          <h2 className="text-5xl lg:text-8xl font-black text-white mb-8 tracking-tighter">
            Digital Power for<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic">Indian MSMEs</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Turn your daily transactions into a formal credit identity.
            Scale your business with technology built for Bharat.
          </p>
        </div>

        {/* Feature Grid with Enhanced Contrast */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {features.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="group relative h-full"
            >
              <div className="h-full bg-white/5 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/10 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col">
                <div className={`w-16 h-16 rounded-2xl bg-${feature.color}/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon name={feature.icon} size={30} className={`text-${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed mb-8 flex-grow">
                  {feature.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                  <span className={`text-xs font-black uppercase tracking-widest text-${feature.color}`}>
                    {feature.stats}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <Icon name="ArrowRight" size={18} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Credit Simulator Card - Redesigned for High Contrast */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative max-w-4xl mx-auto bg-[#0a0c12] border border-white/10 rounded-[3.5rem] p-10 lg:p-20 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]"
        >
          {/* Internal Glow Effects */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-[100px]" />

          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
                <Icon name="TrendingUp" size={32} className="text-primary" />
              </div>
              <h3 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">Credit Score Simulator</h3>
              <p className="text-gray-400 text-lg max-w-lg mx-auto">Input your details to see how NoteNetra improves your bankability.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { label: 'Monthly Revenue', value: monthlyRevenue, set: setMonthlyRevenue, placeholder: '₹ 5,00,000', icon: 'DollarSign' },
                { label: 'Transactions', value: monthlyTransactions, set: setMonthlyTransactions, placeholder: '500+', icon: 'Activity' },
                { label: 'Business Age', value: businessAge, set: setBusinessAge, placeholder: 'Years', icon: 'Clock' }
              ].map((input, idx) => (
                <div key={idx} className="space-y-4">
                  <label className="flex items-center text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">
                    <Icon name={input.icon} size={10} className="mr-2 text-primary" />
                    {input.label}
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={input.value}
                      onChange={(e) => input.set(e.target.value)}
                      placeholder={input.placeholder}
                      className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-bold text-lg"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="default"
              size="xl"
              fullWidth
              onClick={handleCalculateCreditScore}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-black h-20 rounded-2xl shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin mr-4" />
                  <span className="tracking-wider">AI ANALYSIS IN PROGRESS...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <Icon name="Zap" size={24} />
                  <span className="text-lg">Generate Credit Visibility Report</span>
                </div>
              )}
            </Button>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center"
                >
                  <Icon name="AlertCircle" size={16} className="text-red-500 mr-2" />
                  <p className="text-red-500 text-sm font-bold">{error}</p>
                </motion.div>
              )}

              {creditScore !== null && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="mt-16 text-center p-12 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                  <p className="relative z-10 text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-8">Generated Credit Score Profile</p>

                  <div className="relative z-10 inline-flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full" />
                      <span className="relative text-8xl lg:text-[10rem] font-black text-white leading-none tracking-tighter">
                        {creditScore}
                      </span>
                    </div>

                    <div className={`mt-8 px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest ${creditScore > 750 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      creditScore > 650 ? 'bg-primary/20 text-primary border border-primary/30' :
                        'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                      {creditScore > 750 ? 'Excellent Profile' : creditScore > 650 ? 'Strong Profile' : 'Growing Profile'}
                    </div>
                  </div>

                  <p className="relative z-10 text-gray-400 mt-10 max-w-md mx-auto leading-relaxed">
                    With NoteNetra, your estimated score indicates a
                    <span className="text-white font-bold px-1.5">{creditScore > 700 ? 'High' : 'Moderate'}</span>
                    likelihood of unlocking formal bank loans within 3-6 months.
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