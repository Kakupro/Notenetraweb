import React from 'react';
import { Link } from 'react-router-dom';
import { LOGO_CONFIG } from '../../utils/logoConfig';

const Logo = ({ variant = 'default', className = '', showText = true }) => {
  const config = { ...LOGO_CONFIG, showText: showText !== undefined ? showText : LOGO_CONFIG.variants[variant]?.showText ?? true };
  
  const LogoIcon = () => (
    <div className="relative">
      <img 
        src={config.imagePath} 
        alt={config.altText} 
        className={`${config.size.width} ${config.size.height} rounded-lg shadow-md transition-micro group-hover:scale-105 object-contain`}
        onError={(e) => {
          // Fallback to default logo if custom logo fails to load
          e.target.src = config.fallbackPath;
        }}
      />
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <Link to="/landing-page" className={`group ${className}`}>
        <LogoIcon />
      </Link>
    );
  }

  return (
    <Link to="/landing-page" className={`flex items-center space-x-3 group ${className}`}>
      <LogoIcon />
      {config.showText && (
        <div className="flex flex-col">
          <span className="text-xl font-bold text-dark-text-primary tracking-tight">
            {config.companyName}
          </span>
          <span className="text-xs text-dark-text-muted -mt-1 font-medium">
            {config.tagline}
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;