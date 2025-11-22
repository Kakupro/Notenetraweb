import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../../firebase';

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
      title: 'Smart Transaction Tracking',
      description: 'Automatically capture and categorize every cash and UPI transaction with AI-powered recognition and real-time processing.',
      color: 'from-primary to-blue-600',
      stats: '99.9% Accuracy'
    },
    {
      id: 2,
      icon: 'TrendingUp',
      title: 'Credit Score Engine',
      description: 'Build creditworthiness through transaction history analysis and generate comprehensive financial profiles for loan applications.',
      color: 'from-accent to-green-600',
      stats: '40% Faster Approvals'
    },
    {
      id: 3,
      icon: 'FileText',
      title: 'One-Click Invoicing',
      description: 'Generate GST-compliant invoices instantly from transaction data with automated customer details and inventory management.',
      color: 'from-warning to-orange-600',
      stats: '80% Time Saved'
    },
    {
      id: 4,
      icon: 'Store',
      title: 'ONDC Storefront',
      description: 'Seamlessly integrate with Open Network for Digital Commerce to expand your reach and access new customer segments.',
      color: 'from-purple-500 to-pink-600',
      stats: '3x Market Reach'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef?.current) {
      observer?.observe(sectionRef?.current);
    }

    return () => observer?.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto content-spacing">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 mb-4">
              <Icon name="Zap" size={16} className="mr-2" />
              Powerful Features
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Everything You Need to
              <span className="block text-primary">Grow Your Business</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our comprehensive platform transforms your offline transactions into actionable insights, credit opportunities, and business growth tools.
            </p>
          </motion.div>
        </motion.div>

        {/* Credit Score Simulator Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="mt-20 p-8 bg-card rounded-2xl border border-border shadow-lg max-w-2xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Credit Score Simulator</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label htmlFor="monthlyRevenue" className="block text-sm font-medium text-muted-foreground mb-2">Monthly Revenue (₹)</label>
              <input
                type="number"
                id="monthlyRevenue"
                className="w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="e.g., 500000"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="monthlyTransactions" className="block text-sm font-medium text-muted-foreground mb-2">Monthly Transactions</label>
              <input
                type="number"
                id="monthlyTransactions"
                className="w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="e.g., 500"
                value={monthlyTransactions}
                onChange={(e) => setMonthlyTransactions(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="businessAge" className="block text-sm font-medium text-muted-foreground mb-2">Business Age (Years)</label>
              <input
                type="number"
                id="businessAge"
                className="w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="e.g., 5"
                value={businessAge}
                onChange={(e) => setBusinessAge(e.target.value)}
              />
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg flex items-center justify-center"
            onClick={handleCalculateCreditScore}
            disabled={loading}
          >
            {loading ? (
              <Icon name="Loader" size={20} className="animate-spin mr-2" />
            ) : (
              <Icon name="Calculator" size={20} className="mr-2" />
            )}
            {loading ? 'Calculating...' : 'Calculate Credit Score'}
          </motion.button>

          {error && (
            <div className="mt-4 text-red-500 text-center">
              {error}
            </div>
          )}

          {creditScore !== null && !loading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-center bg-primary/10 p-6 rounded-xl border border-primary/20"
            >
              <h4 className="text-xl font-bold text-primary mb-2">Your Estimated Credit Score:</h4>
              <p className="text-5xl font-extrabold text-foreground leading-tight">
                {creditScore}
              </p>
              <p className="text-muted-foreground mt-2">This is an estimated score based on your inputs.</p>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
        >
          {features?.map((feature) => (
            <motion.div
              key={feature?.id}
              variants={itemVariants}
              className="group relative"
              onMouseEnter={() => setHoveredFeature(feature?.id)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div className="relative bg-card rounded-2xl p-8 h-full border border-border shadow-card hover:shadow-interactive transition-all duration-300 transform hover:-translate-y-2">
                {/* 3D Icon Container */}
                <div className="relative mb-6">
                  <motion.div
                    animate={{
                      rotateY: hoveredFeature === feature?.id ? 360 : 0,
                      scale: hoveredFeature === feature?.id ? 1.1 : 1
                    }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature?.color} flex items-center justify-center shadow-lg`}
                  >
                    <Icon 
                      name={feature?.icon} 
                      size={28} 
                      color="white" 
                      strokeWidth={2}
                    />
                  </motion.div>
                  
                  {/* Glow Effect */}
                  <motion.div
                    animate={{
                      opacity: hoveredFeature === feature?.id ? 0.6 : 0,
                      scale: hoveredFeature === feature?.id ? 1.2 : 1
                    }}
                    transition={{ duration: 0.3 }}
                    className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature?.color} blur-xl -z-10`}
                  />
                </div>

                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature?.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature?.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {feature?.stats}
                  </span>
                  
                  <motion.div
                    animate={{
                      x: hoveredFeature === feature?.id ? 5 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon 
                      name="ArrowRight" 
                      size={20} 
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  </motion.div>
                </div>

                {/* Hover Border Effect */}
                <motion.div
                  animate={{
                    opacity: hoveredFeature === feature?.id ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature?.color} opacity-10 -z-10`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-6">
            Ready to transform your business with smart transaction tracking?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-lg"
              onClick={() => window.location.href = '/features-page'}
            >
              Explore All Features
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
              onClick={() => {
                // Open demo in new tab with proper error handling
                try {
                  window.open('/dashboard-demo', '_blank');
                } catch (error) {
                  console.error('Error opening demo:', error);
                  // Fallback to same window
                  window.location.href = '/dashboard-demo';
                }
              }}
            >
              View Live Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesShowcase;