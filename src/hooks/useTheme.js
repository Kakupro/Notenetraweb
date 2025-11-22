
import { useState, useEffect } from 'react';

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Ensure the saved theme is either 'light' or 'dark', otherwise default to 'dark'
    return (savedTheme === 'dark' || savedTheme === 'light') ? savedTheme : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply theme immediately on mount
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return [theme, toggleTheme];
}

export default useTheme;
