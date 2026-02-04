import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CTASection = () => {
  const [hoveredButton, setHoveredButton] = useState(null);
  const navigate = useNavigate();

  const benefits = [
    { icon: 'Zap', text: '5-Minute Setup' },
    { icon: 'Shield', text: 'Bank-Grade Security' },
    { icon: 'Users', text: '24/7 Support' },
    { icon: 'TrendingUp', text: 'Instant Insights' }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      business: 'Kumar Electronics',
      rating: 5,
      text: "NoteNetra transformed my electronics shop. I got approved for a ₹3L loan within 3 months thanks to my digital records."
    },
    {
      name: 'Priya Sharma',
      business: 'Sharma Textiles',
      rating: 5,
      text: "The device is seamless. My credit score jumped 130 points in 6 months. Banks are now reaching out to me!"
    },
    {
      name: 'Amit Patel',
      business: 'Patel General Store',
      rating: 5,
      text: "Best investment for my store. The dashboard is intuitive and helped me secure a ₹5L loan in just 24 hours."
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto content-spacing relative z-10">
        {/* Trust Header */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-8"
          >
            <Icon name="Users" size={14} className="mr-2" />
            Join 10,000+ MSMEs
          </motion.div>

          <h2 className="text-4xl lg:text-7xl font-bold text-foreground mb-8 cursor-default">
            Trusted by Businesses
            <span className="block text-primary italic">Across India</span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center space-y-3"
              >
                <div className="w-14 h-14 bg-muted/50 text-primary rounded-2xl flex items-center justify-center border border-border/50 shadow-sm">
                  <Icon name={benefit.icon} size={24} />
                </div>
                <span className="text-sm font-bold text-foreground">{benefit.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-muted/10 p-8 rounded-[2rem] border border-border/50 hover:border-primary/20 transition-all duration-500 group"
            >
              <div className="flex space-x-1 mb-6">
                {[...Array(5)].map((_, star) => (
                  <Icon key={star} name="Star" size={14} className="text-warning fill-current" />
                ))}
              </div>
              <p className="text-lg text-foreground/80 leading-relaxed mb-8 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{testimonial.business}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative bg-foreground rounded-[3rem] p-10 lg:p-20 overflow-hidden shadow-2xl"
        >
          {/* Accent Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-center lg:text-left lg:max-w-2xl">
              <h3 className="text-3xl lg:text-5xl font-bold text-background mb-6">
                Don't wait for growth.<br />
                <span className="text-primary italic">Let's build it together.</span>
              </h3>
              <p className="text-xl text-background/60 mb-8 leading-relaxed">
                Join our platform today and start building the digital credit profile your business deserves. Setup takes less than 5 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  variant="default"
                  size="xl"
                  onClick={() => navigate('/contact-page')}
                  className="bg-primary text-white font-bold h-16 px-10 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Order Device
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  onClick={() => navigate('/dashboard-demo')}
                  className="border-background text-background font-bold h-16 px-10 rounded-2xl hover:bg-background hover:text-foreground transition-all duration-300"
                >
                  Explore Demo
                </Button>
              </div>
            </div>

            <div className="relative flex-shrink-0">
              <div className="w-48 h-48 lg:w-64 lg:h-64 bg-background/5 rounded-full border border-background/10 flex items-center justify-center animate-pulse">
                <Icon name="Rocket" size={80} className="text-primary" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center space-x-2 text-sm font-bold">
            <Icon name="Shield" size={18} className="text-success" />
            <span>RBI Compliant</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-bold">
            <Icon name="Award" size={18} className="text-primary" />
            <span>ISO 27001 Certified</span>
          </div>
          <div className="flex items-center space-x-2 text-sm font-bold">
            <Icon name="Zap" size={18} className="text-warning" />
            <span>Fast Setup</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;