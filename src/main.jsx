import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'regenerator-runtime/runtime';
import './index.css';
import App from './App.jsx';
import ThemeContextProvider from './components/ThemeContext.jsx';

import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <ThemeContextProvider>
      <BrowserRouter>
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
  </ThemeContextProvider>
);