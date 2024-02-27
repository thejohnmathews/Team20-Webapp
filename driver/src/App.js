// React App imports
import React from 'react';
import './App.css';
import ForgotPasswordPage from './ForgotPasswordPage.js'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ForgotUsernamePage from './ForgotUsernamePage.js';
import DriverApplicationPage from './DriverPortal/DriverApplicationPage.js';
import DriverApplicationStatusPage from './DriverPortal/DriverApplicationStatusPage.js';
import DriverProfilePage from './DriverPortal/DriverProfilePage.js'
import LoginRedirect from './LoginRedirect.js';
import SponsorProfilePage from './SponsorPortal/SponsorProfilePage.js';
import AdminProfilePage from './AdminPortal/AdminProfilePage.js';
import SponsorOrgManagementPage from './SponsorPortal/OrganizationManagementPage.js';
import AdminAbout from './AdminPortal/AdminAbout.js';
import SponsorAbout from './SponsorPortal/SponsorAbout.js';
import DriverAbout from './DriverPortal/DriverAbout.js';
import AdminAccountManagement from './AdminPortal/AccountManagement.js'
import SponsorAccountManagement from './SponsorPortal/AccountManagement.js'
 
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
      <Route exact path="/adminAbout" element={<AdminAbout />} />
      <Route exact path="/sponsorAbout" element={<SponsorAbout />} />
      <Route exact path="/driverAbout" element={<DriverAbout />} />
      <Route exact path="/forgotPassword" element={<ForgotPasswordPage/>} />
      <Route exact path="/forgotUsername" element={<ForgotUsernamePage/>} />
      <Route exact path="/driverApplication" element={<DriverApplicationPage/>} />
      <Route exact path="/driverApplicationStatus" element={<DriverApplicationStatusPage/>} />
      <Route exact path="/driverProfile" element={<DriverProfilePage/>} />
      <Route exact path="/adminProfile" element={<AdminProfilePage/>} />
      <Route exact path="/sponsorProfile" element={<SponsorProfilePage/>} />
      <Route exact path="/sponsorAccountManagement" element={<SponsorAccountManagement/>} />
      <Route exact path="/adminAccountManagement" element={<AdminAccountManagement />} />
      <Route exact path="/sponsorOrganizationManagement" element={<SponsorOrgManagementPage />} /> 
    </Routes>
  </Router>
  );
}
 
//export default App;
export default withAuthenticator(App);