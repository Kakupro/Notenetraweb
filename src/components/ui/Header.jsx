import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    return location?.pathname === path || location?.pathname.startsWith(`${path}/`);
  };

  // Clean navigation without admin panel
  const visibleNavigationItems = navigationItems;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-navigation transition-all duration-300 ${
          isVisible 
            ? 'translate-y-0' 
            : '-translate-y-full'
        } ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-700' 
            : 'bg-gray-900'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 nav-spacing">
            {/* Logo */}
            <CustomLogo design="custom" showText />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {visibleNavigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`relative px-3 py-2 text-sm font-medium transition-micro hover:text-primary ${
                    isActivePath(item?.path)
                      ? 'text-primary' :'text-gray-300 hover:text-white'
                  }`}
                >
                  {item?.label}
                  {isActivePath(item?.path) && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/login-page'}
                iconName="LogIn"
                iconPosition="left"
                className="transition-micro hover-lift"
              >
                Sign In
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => window.location.href = '/register-page'}
                iconName="UserPlus"
                iconPosition="left"
                className="transition-micro hover-lift"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-micro"
              aria-label="Toggle mobile menu"
            >
              <Icon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                size={24} 
                strokeWidth={2}
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
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" />
          
          <div 
            className="absolute top-0 right-0 w-80 max-w-[85vw] h-full bg-gray-900 shadow-interactive animate-slide-in-right"
            onClick={(e) => e?.stopPropagation()}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <Logo showText />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-micro"
                aria-label="Close mobile menu"
              >
                <Icon name="X" size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="p-4 space-y-2">
              {visibleNavigationItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-micro ${
                    isActivePath(item?.path)
                      ? 'bg-primary/10 text-primary border border-primary/20' :'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <Icon 
                    name={item?.icon} 
                    size={18} 
                    color={isActivePath(item?.path) ? 'var(--primary)' : 'currentColor'}
                    strokeWidth={2}
                  />
                  <span>{item?.label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile CTA Buttons */}
            <div className="p-4 space-y-3 border-t border-gray-700 mt-auto">
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  window.location.href = '/login-page';
                  setIsMobileMenuOpen(false);
                }}
                iconName="LogIn"
                iconPosition="left"
              >
                Sign In
              </Button>
              <Button
                variant="default"
                fullWidth
                onClick={() => {
                  window.location.href = '/register-page';
                  setIsMobileMenuOpen(false);
                }}
                iconName="UserPlus"
                iconPosition="left"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
};

export default Header;