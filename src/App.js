import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MainDashboard from './MainDashboard';
import DownloadsPage from './DownloadsPage';
import MySubmissionsPage from './MySubmissionsPage';
import UploadValidationPage from './UploadValidationPage';
import WizardPage from './WizardPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <div className="nav-brand">
            <div className="logo">HFL</div>
            <div>
              <div className="nav-title">LR Deviation Correction</div>
              <div className="nav-subtitle">Hinduja Leyland Finance</div>
            </div>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/downloads" className="nav-link">Downloads</Link>
            <Link to="/submissions" className="nav-link">My Submissions</Link>
            <Link to="/upload" className="nav-link">Upload Validation</Link>
            <Link to="/wizard" className="nav-link">Wizard</Link>
          </div>
        </nav>
        
        <main className="main">
          <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/downloads" element={<DownloadsPage />} />
            <Route path="/submissions" element={<MySubmissionsPage />} />
            <Route path="/upload" element={<UploadValidationPage />} />
            <Route path="/wizard" element={<WizardPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
