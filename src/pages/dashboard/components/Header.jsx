import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { getAuth, signOut } from 'firebase/auth';
import useTheme from '../../../hooks/useTheme';
import { LOGO_CONFIG } from '../../../utils/logoConfig';

const Header = ({ user, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login-page');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="flex items-center space-x-2">
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
            <span className="text-xl font-bold text-foreground">{LOGO_CONFIG.companyName}</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200 ease-in-out shadow-md hover:shadow-lg"
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          {/* Welcome message and logout moved to sidebar bottom */}
        </div>
      </div>
    </header>
  );
};

export default Header;
