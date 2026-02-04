import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Logo from './Logo';
import CustomLogo from './CustomLogo';


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();


  const navigationItems = [
    { label: 'Home', path: '/landing-page', icon: 'Home' },
    { label: 'Features', path: '/features-page', icon: 'Zap' },
    { label: 'Pricing', path: '/pricing-page', icon: 'DollarSign' },
    { label: 'Demo', path: '/dashboard-demo', icon: 'Monitor' },
    { label: 'Contact', path: '/contact-page', icon: 'MessageCircle' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show header when scrolling up or at top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      }
      // Hide header when scrolling down and not at top
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }

      setIsScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  // Close mobile menu when header is hidden
  useEffect(() => {
    if (!isVisible) {
      setIsMobileMenuOpen(false);
    }
  }, [isVisible]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    return location?.pathname === path || (path !== '/landing-page' && location?.pathname.startsWith(`${path}/`));
  };

  // Clean navigation without admin panel
  const visibleNavigationItems = navigationItems;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-navigation transition-all duration-500 ${isVisible
          ? 'translate-y-0 opacity-100'
          : '-translate-y-full opacity-0'
          } ${isScrolled
            ? 'bg-background/80 backdrop-blur-md shadow-lg border-b border-border/50'
            : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-20 nav-spacing">
            {/* Logo */}
            <div className="flex-shrink-0">
              <CustomLogo design="custom" showText />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-4">
              {visibleNavigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-full hover:bg-primary/5 ${isActivePath(item?.path)
                    ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                    }`}
                >
                  {item?.label}
                  {isActivePath(item?.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-1 left-4 right-4 h-0.5 bg-primary rounded-full shadow-[0_0_10px_rgba(8,145,178,0.5)]"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login-page')}
                iconName="LogIn"
                iconPosition="left"
                className="font-bold text-foreground/80 hover:text-primary transition-all duration-300"
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate('/register-page')}
                iconName="UserPlus"
                iconPosition="left"
                className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2.5 rounded-xl text-foreground/70 hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border transition-all duration-300"
              aria-label="Toggle mobile menu"
            >
              <Icon
                name={isMobileMenuOpen ? "X" : "Menu"}
                size={22}
                strokeWidth={2.5}
              />
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-mobile-menu md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div className="absolute inset-0 bg-background/40 backdrop-blur-sm animate-fade-in" />

          <div
            className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-background border-l border-border shadow-2xl animate-slide-in-right flex flex-col"
            onClick={(e) => e?.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <CustomLogo design="custom" showText />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-foreground/70 hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-border transition-all duration-300"
                aria-label="Close mobile menu"
              >
                <Icon name="X" size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-6 space-y-2 flex-grow overflow-y-auto">
              {visibleNavigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-4 px-4 py-4 rounded-2xl text-base font-bold transition-all duration-300 ${isActivePath(item?.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                    }`}
                >
                  <Icon
                    name={item?.icon}
                    size={20}
                    color={isActivePath(item?.path) ? 'var(--primary)' : 'currentColor'}
                    strokeWidth={2.5}
                  />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile CTA Buttons */}
            <div className="p-6 space-y-4 border-t border-border bg-muted/20">
              <Button
                variant="outline"
                fullWidth
                size="lg"
                onClick={() => {
                  navigate('/login-page');
                  setIsMobileMenuOpen(false);
                }}
                iconName="LogIn"
                iconPosition="left"
                className="font-bold border-2"
              >
                Sign In
              </Button>
              <Button
                variant="default"
                fullWidth
                size="lg"
                onClick={() => {
                  navigate('/register-page');
                  setIsMobileMenuOpen(false);
                }}
                iconName="UserPlus"
                iconPosition="left"
                className="font-bold bg-primary text-white shadow-lg shadow-primary/20"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
};

export default Header;