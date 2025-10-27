import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './styles/global.css';

// Remove loading screen when app is ready
const removeLoadingScreen = () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    loadingScreen.style.transition = 'opacity 0.3s ease-out';
    setTimeout(() => loadingScreen.remove(), 300);
  }
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);

// Remove loading screen after render
removeLoadingScreen();
