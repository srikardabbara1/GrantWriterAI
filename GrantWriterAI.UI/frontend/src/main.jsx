import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Home from './pages/Home.jsx';
import GrantResult from './pages/GrantResult.jsx';
import IntakeForm from './pages/IntakeForm.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home />} />
        <Route path="/grant-result" element={<GrantResult />} />
        <Route path="/intake" element={<IntakeForm />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
