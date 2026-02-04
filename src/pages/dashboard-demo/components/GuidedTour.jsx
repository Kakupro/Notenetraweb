import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GuidedTour = ({ isActive, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const tourSteps = [
    {
      title: "Welcome to NoteNetra Dashboard",
      content: "This interactive demo showcases how our smart device transforms your business transactions into valuable insights and credit opportunities.",
      target: "header",
      position: "bottom"
    },
    {
      title: "Navigation Menu",
      content: "Use the sidebar to explore different sections: Overview for key metrics, Transactions for detailed logs, Credit Score for loan eligibility, and Reports for business analytics.",
      target: "sidebar",
      position: "right"
    },
    {
      title: "Key Performance Indicators",
      content: "These cards display your most important business metrics at a glance - revenue, transactions, credit score, and loan eligibility amounts.",
      target: "kpi-cards",
      position: "bottom"
    },
    {
      title: "Interactive Charts",
      content: "Hover over charts and graphs to see detailed information. These visualizations help you understand trends and make informed business decisions.",
      target: "charts",
      position: "top"
    },
    {
      title: "Credit Score Tracking",
      content: "Monitor your business credit score improvement over time. Higher scores unlock better loan terms and higher eligibility amounts.",
      target: "credit-section",
      position: "top"
    },
    {
      title: "Ready to Get Started?",
      content: "This demo shows real potential of NoteNetra\'s platform. Order your device today to start building your business credit profile and unlock growth opportunities.",
      target: "cta-section",
      position: "top"
    }
  ];

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      setCurrentStep(0);
    } else {
      setIsVisible(false);
    }
  }, [isActive]);

  const nextStep = () => {
    if (currentStep < tourSteps?.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    setIsVisible(false);
    onClose();
  };

  const completeTour = () => {
    setIsVisible(false);
    onComplete();
  };

  if (!isVisible) return null;

  const currentTourStep = tourSteps?.[currentStep];

  return (
    <>
      {/* Overlay with Backdrop Blur */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[9999] transition-all duration-500 animate-fade-in" />

      {/* Tour Tooltip centered for clarity */}
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="pointer-events-auto bg-[#1a1c24] border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] p-8 max-w-lg w-full relative overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[60px]" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">
                  Step {currentStep + 1} of {tourSteps?.length}
                </span>
              </div>
            </div>
            <button
              onClick={skipTour}
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {/* Progress Bar Container */}
          <div className="relative z-10 w-full h-1.5 bg-white/5 rounded-full mb-10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / tourSteps?.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-primary to-accent"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 mb-10">
            <h3 className="text-3xl font-bold text-white mb-4 tracking-tight leading-tight">
              {currentTourStep?.title}
            </h3>
            <p className="text-[16px] text-gray-400 leading-relaxed font-medium">
              {currentTourStep?.content}
            </p>
          </div>

          {/* Navigation */}
          <div className="relative z-10 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="border-white/10 text-white/70 hover:text-white hover:bg-white/5 px-6 py-6 rounded-2xl transition-all disabled:opacity-20"
            >
              <div className="flex items-center space-x-2">
                <Icon name="ChevronLeft" size={18} />
                <span className="font-bold">Previous</span>
              </div>
            </Button>

            <div className="flex items-center space-x-2.5">
              {tourSteps?.map((_, index) => (
                <div
                  key={index}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentStep ? 'bg-primary scale-125 shadow-[0_0_12px_rgba(8,145,178,0.5)]' : 'bg-white/10'
                    }`}
                />
              ))}
            </div>

            {currentStep === tourSteps?.length - 1 ? (
              <Button
                variant="default"
                onClick={completeTour}
                className="bg-primary text-white hover:bg-primary/90 px-8 py-6 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                <div className="flex items-center space-x-2">
                  <span>Get Started</span>
                  <Icon name="CheckCircle" size={18} />
                </div>
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={nextStep}
                className="bg-primary text-white hover:bg-primary/90 px-8 py-6 rounded-2xl font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                <div className="flex items-center space-x-2">
                  <span>Next Step</span>
                  <Icon name="ChevronRight" size={18} />
                </div>
              </Button>
            )}
          </div>

          {/* Skip Footer */}
          <div className="relative z-10 flex justify-center mt-8">
            <button
              onClick={skipTour}
              className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors py-2 px-4 rounded-xl hover:bg-white/5"
            >
              Skip Full Tour
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default GuidedTour;