import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import FeaturesShowcase from './components/FeaturesShowcase';
import DashboardPreview from './components/DashboardPreview';
import WorkflowSection from './components/WorkflowSection';
import CTASection from './components/CTASection';
import ChatWidget from '../../components/ChatWidget';
import CustomLogo from '../../components/ui/CustomLogo';
import Icon from '../../components/AppIcon';

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>NoteNetra | Next-Gen IIoT Platform for MSMEs</title>
        <meta
          name="description"
          content="Transform your offline business into digital growth. NoteNetra captures cash and UPI transactions to build your digital credit profile and unlock bank loans."
        />
        <link rel="canonical" href="/landing-page" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary">
        <Header />

        <main>
          <HeroSection />
          <FeaturesShowcase />
          <DashboardPreview />
          <WorkflowSection />
          <CTASection />
        </main>

        {/* Premium Footer */}
        <footer className="relative bg-muted/20 border-t border-border mt-20 pt-24 pb-12 overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[70%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto content-spacing relative z-10">
            <div className="grid lg:grid-cols-12 gap-16 mb-20">
              {/* Brand & Mission */}
              <div className="lg:col-span-4 space-y-8">
                <CustomLogo design="custom" showText />
                <p className="text-muted-foreground text-lg leading-relaxed max-w-sm">
                  Empowering 63 million Indian MSMEs with smart transaction tracking and formal credit accessibility.
                </p>
                <div className="flex space-x-4">
                  {['Facebook', 'Twitter', 'Linkedin', 'Instagram'].map((social) => (
                    <a
                      key={social}
                      href="#"
                      className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                    >
                      <Icon name={social} size={18} />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links Grid */}
              <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/40">Product</h4>
                  <ul className="space-y-4">
                    {['Features', 'Pricing', 'Dashboard Demo', 'Hardware'].map((link) => (
                      <li key={link}>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/40">Company</h4>
                  <ul className="space-y-4">
                    {['About Us', 'Case Studies', 'Press Kit', 'Contact'].map((link) => (
                      <li key={link}>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/40">Newsletter</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Get regular updates on MSME growth hacks and financing tips.
                  </p>
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full h-12 bg-background border border-border rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                    <button className="absolute right-2 top-2 w-8 h-8 bg-primary text-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform">
                      <Icon name="Send" size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span>© {new Date().getFullYear()} NoteNetra</span>
                <span className="hidden md:block w-1.5 h-1.5 bg-border rounded-full" />
                <span>Made with ❤️ in India</span>
              </div>

              <div className="flex space-x-8 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="hover:text-primary transition-colors">Terms</a>
                <a href="#" className="hover:text-primary transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <ChatWidget />
    </>
  );
};

export default LandingPage;