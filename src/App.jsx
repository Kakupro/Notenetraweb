import React from "react";
import Routes from "./Routes";
import useTheme from "./hooks/useTheme";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [theme, toggleTheme] = useTheme();

  return (
    <AuthProvider>
      <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
        <Routes theme={theme} toggleTheme={toggleTheme} />
      </div>
    </AuthProvider>
  );
}

export default App;
