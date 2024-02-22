// React App imports
import React from 'react';
import './App.css';
import LoginPage from './LoginPage.js';
import AboutPage from './AboutPage.js';
import ForgotPasswordPage from './ForgotPasswordPage.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ForgotUsernamePage from './ForgotUsernamePage.js';
import DriverApplicationPage from './DriverApplicationPage.js';
import DriverApplicationStatusPage from './DriverApplicationStatusPage';
import Profile from './Profile.js'
 
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
    {/* <Route exact path="/" render={() => <h1>Home</h1>} /> */}
    <Route exact path="/" element={<LoginPage />} />
    <Route exact path="/profile" element={<Profile />} />
    <Route exact path="/about" element={<AboutPage />} />
    <Route exact path="/forgotPassword" element={<ForgotPasswordPage/>} />
    <Route exact path="/forgotUsername" element={<ForgotUsernamePage/>} />
    <Route exact path="/driverApplication" element={<DriverApplicationPage/>} />
    <Route exact path="/driverApplicationStatus" element={<DriverApplicationStatusPage/>} />
    </Routes>
  </Router>
    // <>
    // <h1>Hello {user.username}</h1>
    // <button onClick={signOut}>Sign out</button>
    // </>     
  );
}
 
//export default App;
export default withAuthenticator(App);