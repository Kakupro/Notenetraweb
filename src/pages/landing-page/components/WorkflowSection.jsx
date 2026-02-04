import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const WorkflowSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  const workflowSteps = [
    {
      id: 1,
      title: 'Transaction Capture',
      subtitle: 'Seamless IoT Integration',
      description: 'Our smart device automatically detects every cash and UPI payment in real-time, building a verifiable record for your business.',
      icon: 'Zap',
      color: 'primary',
      details: ['AI cash detection', 'UPI sync', 'Real-time logs']
    },
    {
      id: 2,
      title: 'Smart Analytics',
      subtitle: 'Business Intelligence',
      description: 'Raw data is transformed into actionable insights. Track revenue, monitor inventory, and understand customer trends instantly.',
      icon: 'PieChart',
      color: 'accent',
      details: ['Growth trends', 'Inventory alerts', 'Customer data']
    },
    {
      id: 3,
      title: 'Credit Growth',
      subtitle: 'Unlock Bank Loans',
      description: 'Your digital transaction history builds a trusted credit profile, opening doors to low-interest loans from major banks.',
      icon: 'TrendingUp',
      color: 'success',
      details: ['Credit score building', 'Loan eligibility', 'Bank partnerships']
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (sectionRef?.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % workflowSteps.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <section ref={sectionRef} className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto content-spacing relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-20">
          {/* Left Content */}
          <div className="flex-1 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              className="space-y-6"
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                <Icon name="Activity" size={14} className="mr-2" />
                The Workflow
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold text-foreground leading-[1.1]">
                Simple 3-Step Process<br />
                To <span className="text-primary italic">Transform Growth</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We've simplified the journey from traditional bookkeeping to digital financial power.
              </p>
            </motion.div>

            <div className="space-y-4">
              {workflowSteps.map((step, idx) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setActiveStep(idx)}
                  className={`group cursor-pointer p-6 rounded-3xl border transition-all duration-500 ${activeStep === idx
                      ? 'bg-muted/10 border-primary/20 shadow-xl'
                      : 'border-transparent hover:bg-muted/5'
                    }`}
                >
                  <div className="flex items-center space-x-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-500 ${activeStep === idx ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-muted/50 text-muted-foreground'
                      }`}>
                      {step.id}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold transition-colors ${activeStep === idx ? 'text-primary' : 'text-foreground/70'}`}>
                        {step.title}
                      </h3>
                      <p className={`text-sm mt-1 transition-opacity ${activeStep === idx ? 'opacity-100' : 'opacity-60'}`}>
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeStep === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-4 pl-[72px]"
                      >
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          {step.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {step.details.map((detail, i) => (
                            <span key={i} className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded-md">
                              {detail}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <Button
              variant="default"
              size="lg"
              className="bg-foreground text-background font-bold h-14 rounded-2xl px-10 shadow-xl"
              onClick={() => navigate('/register-page')}
            >
              Get Started Now
            </Button>
          </div>

          {/* Right Visual */}
          <div className="flex-1 relative lg:h-[600px] w-full flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-[400px] aspect-square"
              >
                {/* Visual Glass Card */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-[3rem] p-8 border border-border/50 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center text-center">
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={`w-32 h-32 rounded-3xl bg-${workflowSteps[activeStep].color}/10 flex items-center justify-center mb-10 border border-${workflowSteps[activeStep].color}/20`}
                  >
                    <Icon name={workflowSteps[activeStep].icon} size={64} className={`text-${workflowSteps[activeStep].color}`} />
                  </motion.div>

                  <h4 className="text-3xl font-bold mb-4">{workflowSteps[activeStep].title}</h4>
                  <div className="flex flex-col space-y-4 w-full">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="h-2 bg-muted/20 rounded-full overflow-hidden w-full">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 0.5 + (i * 0.2), duration: 2, repeat: Infinity }}
                          className={`h-full bg-${workflowSteps[activeStep].color}/40`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating Tags */}
                <motion.div
                  animate={{ y: [0, -10, 0], x: [0, 5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-background border border-border h-12 px-6 rounded-full flex items-center shadow-lg"
                >
                  <span className="text-xs font-bold text-success flex items-center">
                    <span className="w-1.5 h-1.5 bg-success rounded-full mr-2" />
                    Live Syncing
                  </span>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Background Glow */}
            <div className={`absolute inset-0 bg-${workflowSteps[activeStep].color}/5 rounded-full blur-[100px] -z-10`} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;