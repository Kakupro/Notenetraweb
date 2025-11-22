import React from "react";
import Routes from "./Routes";
import useTheme from "./hooks/useTheme";

function App() {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Routes theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
