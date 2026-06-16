import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import './index.css'
import { useThemeStore } from './store/useThemeStore.js'

// Inicializar el tema si es necesario
try {
  useThemeStore.getState().initTheme();
} catch (e) {
  console.error("Theme initialization failed", e);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
