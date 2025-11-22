// Utility to reset theme to dark mode
export function resetThemeToDark() {
  localStorage.setItem('theme', 'dark');
  document.documentElement.classList.add('dark');
  console.log('Theme reset to dark mode');
}

// Run this once to reset theme
resetThemeToDark();
