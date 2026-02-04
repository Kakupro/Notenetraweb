import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[70%] bg-accent/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto content-spacing py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="flex flex-col space-y-10"
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider border border-primary/20 backdrop-blur-sm">
                <Icon name="Zap" size={14} className="mr-2" />
                Next-Gen IIoT Platform for MSMEs
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                Transform Your
                <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent italic">
                  Offline Business
                </span>
                Into Digital Growth
              </h1>

              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                NoteNetra's plug-and-play device captures every transaction, building your digital credit profile to unlock bank loans and business insights.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5">
              <Button
                variant="default"
                size="xl"
                iconName="ArrowRight"
                iconPosition="right"
                className="bg-primary text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95 group"
                onClick={() => navigate('/contact-page')}
              >
                Get Started Now
              </Button>

              <Button
                variant="outline"
                size="xl"
                iconName="Play"
                iconPosition="left"
                className="font-bold h-14 px-8 rounded-2xl border-2 border-border hover:border-primary hover:text-primary transition-all duration-300 backdrop-blur-sm"
                onClick={() => navigate('/dashboard-demo')}
              >
                Watch Demo
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center space-x-8 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">10,000+</span>
                <span className="text-sm text-muted-foreground font-medium">Active MSMEs</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">₹500Cr+</span>
                <span className="text-sm text-muted-foreground font-medium">Tracked Volume</span>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-foreground">98%</span>
                <span className="text-sm text-muted-foreground font-medium">Loan Approval</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Modern Device Visualization */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="relative lg:h-[600px] flex items-center justify-center pt-10 lg:pt-0"
          >
            <div className="relative w-full max-w-[400px] aspect-square">
              {/* Animated Rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[120%] h-[120%] border border-primary/10 rounded-full"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[90%] h-[90%] border border-accent/10 rounded-full"
                />
              </div>

              {/* Main Device Mock */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotateY: [-5, 5, -5]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-full h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20 rounded-[3rem] p-3 shadow-2xl backdrop-blur-xl border border-white/10">
                  <div className="w-full h-full bg-slate-900 rounded-[2.5rem] overflow-hidden border border-white/5 relative group">
                    {/* Screen Content */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                          <Icon name="Cpu" size={20} className="text-primary" />
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase font-bold text-muted-foreground">System Status</p>
                          <p className="text-xs font-bold text-success flex items-center">
                            <span className="w-1.5 h-1.5 bg-success rounded-full mr-1.5 animate-pulse" />
                            Live & Secure
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground font-medium">Daily Transactions</p>
                          <div className="flex items-end space-x-1 h-20">
                            {[40, 70, 45, 90, 65, 80, 50, 85].map((h, i) => (
                              <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: 1 + (i * 0.1), duration: 1 }}
                                className="flex-1 bg-gradient-to-t from-primary to-accent rounded-t-sm"
                              />
                            ))}
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold">Credit Score</p>
                            <p className="text-lg font-bold text-white">785</p>
                          </div>
                          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: '78%' }}
                              transition={{ delay: 2, duration: 1.5 }}
                              className="h-full bg-gradient-to-r from-success to-primary"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gloss Effect */}
                    <div className="absolute top-0 left-0 w-full h-[150%] bg-gradient-to-b from-white/10 to-transparent -rotate-45 -translate-y-[50%] pointer-events-none group-hover:translate-y-[100%] transition-transform duration-1000" />
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-background/80 backdrop-blur-md border border-border p-4 rounded-2xl shadow-xl flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Payment Verified</p>
                    <p className="text-sm font-bold">₹12,450.00</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  className="absolute -bottom-6 -left-6 bg-background/80 backdrop-blur-md border border-border p-4 rounded-2xl shadow-xl flex items-center space-x-3"
                >
                  <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon name="TrendingUp" size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">Growth Index</p>
                    <p className="text-sm font-bold">+24.5%</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative Blur */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-20" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center space-y-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer px-4 pt-10"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center p-1.5 pt-1">
          <motion.div
            animate={{ height: [4, 12, 4], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 bg-primary rounded-full"
          />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">Scroll to Explore</span>
      </motion.div>
    </section>
  );
};

export default HeroSection;