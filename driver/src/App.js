import React from 'react';
import './App.css';
import LoginPage from './LoginPage.js';
import AboutPage from './AboutPage.js';
import ForgotPasswordPage from './ForgotPasswordPage.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ForgotUsernamePage from './ForgotUsernamePage.js';
import DriverApplicationPage from './DriverApplicationPage.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/about" element={<AboutPage />} />
        <Route exact path="/forgotPassword" element={<ForgotPasswordPage/>} />
        <Route exact path="/forgotUsername" element={<ForgotUsernamePage/>} />
        <Route exact path="/driverApplication" element={<DriverApplicationPage/>} />
      </Routes>
    </Router>
  );
}

export default App;