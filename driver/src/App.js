// React App imports
import React from 'react';
import './App.css';
import AboutPage from './AboutPage.js';
import ForgotPasswordPage from './ForgotPasswordPage.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ForgotUsernamePage from './ForgotUsernamePage.js';
import DriverApplicationPage from './DriverApplicationPage.js';
import DriverApplicationStatusPage from './DriverApplicationStatusPage';
import ProfilePage from './ProfilePage.js'
import LoginRedirect from './LoginRedirect.js';
 
// Amplify/UI/Cognito imports
import { Amplify } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import config from './amplifyconfiguration.json';
Amplify.configure(config);
 
 
function App({signOut, user}) {
  return (
  <Router>
    <Routes>
    <Route exact path="/" element={<LoginRedirect />} />
    <Route exact path="/about" element={<AboutPage />} />
    <Route exact path="/forgotPassword" element={<ForgotPasswordPage/>} />
    <Route exact path="/forgotUsername" element={<ForgotUsernamePage/>} />
    <Route exact path="/driverApplication" element={<DriverApplicationPage/>} />
    <Route exact path="/driverApplicationStatus" element={<DriverApplicationStatusPage/>} />
    <Route exact path="/profile" element={<ProfilePage/>} />
    </Routes>
  </Router>
  );
}
 
//export default App;
export default withAuthenticator(App);