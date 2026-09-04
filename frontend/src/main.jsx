import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './App.css';
import './styles/home.css';
import './styles/resources.css';
import './styles/forms.css';
import './styles/about.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
