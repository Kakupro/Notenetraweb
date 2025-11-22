import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { LOGO_CONFIG } from '../../../utils/logoConfig';

const DemoHeader = ({ onExitDemo, onStartTour }) => {
  return (
    <header className="bg-dark-bg-secondary border-b border-dark-border-primary shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo and Demo Badge */}
        <div className="flex items-center space-x-4">
          <Link to="/landing-page" className="flex items-center space-x-2">
            <div className={`${LOGO_CONFIG.size.width} ${LOGO_CONFIG.size.height} rounded-lg flex items-center justify-center shadow-md overflow-hidden`}>
              <img 
                src={LOGO_CONFIG.imagePath} 
                alt={LOGO_CONFIG.altText} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to default logo if custom logo fails to load
                  e.target.src = LOGO_CONFIG.fallbackPath;
                }}
              />
            </div>
            <span className="text-xl font-bold text-dark-text-primary">{LOGO_CONFIG.companyName}</span>
          </Link>
          <div className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm font-medium border border-amber-500/30">
            <Icon name="Play" size={14} className="inline mr-1" />
            Demo Mode
          </div>
        </div>

        {/* Demo Controls */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onStartTour}
            iconName="HelpCircle"
            iconPosition="left"
          >
            Take Tour
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onExitDemo}
            iconName="ExternalLink"
            iconPosition="left"
          >
            Exit Demo
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => window.location.href = '/contact-page'}
            iconName="ShoppingCart"
            iconPosition="left"
          >
            Order Device
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DemoHeader;