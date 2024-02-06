import React from 'react';
import './App.css';
import LoginPage from './LoginPage.js';
import AboutPage from './AboutPage.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route exact path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;