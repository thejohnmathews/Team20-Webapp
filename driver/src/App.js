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
import AdminAccountManagement from './AdminPortal/AccountManagement.js';
import SponsorAccountManagement from './SponsorPortal/AccountManagement.js';
import DriverCatalog from './DriverPortal/DriverCatalog.js';
import SponsorCatalog from './SponsorPortal/SponsorCatalog';
import DriverCart from './DriverPortal/DriverCart';
import AdminOrgManagement from './AdminPortal/OrganizationManagement.js'

// Amplify/UI/Cognito imports
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import { Authenticator, PhoneNumberField, TextField } from '@aws-amplify/ui-react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import config from './amplifyconfiguration.json';
Amplify.configure(config);


export default function App() {
  return (
    <Authenticator

      // Default to sign in screen
      initialState = "signIn"

      // Customize the create user page
      components={{

        SignUp: {
          FormFields() {
            const { validationErrors } = useAuthenticator();
            return (
              <>
                {/* Re-use default `Authenticator.SignUp.FormFields` */}
                <Authenticator.SignUp.FormFields />
                
                {/* I get a strange error when using phone_number, so im making it custom:Phone*/}
                <PhoneNumberField
                  defaultDialCode = "+1"
                  label = "Phone Number"
                  name = "custom:Phone"
                  key = "custom:Phone"
                  placeholder="234-567-8910"
                />

                <TextField
                  label = "Preferred Username"
                  key = "preferred_username"
                  name = "preferred_username"
                  placeholder = "Enter your Preferred Username"
                />

                <TextField
                  label = "Given Name"
                  key = "given_name"
                  name = "given_name"
                  placeholder = "Enter your Given Name"
                />

                <TextField
                  label = "Family Name"
                  key = "family_name"
                  name = "family_name"
                  placeholder = "Enter your Family Name"
                />

                <TextField
                  label = "Address"
                  key = "address"
                  name = "address"
                  placeholder = "Enter your Address"
                />

                <TextField
                  label = "Sponsor"
                  key = "custom:Sponsor"
                  name = "custom:Sponsor"
                  placeholder = "Enter your Sponsor"
                />
              </>
            );
          },
        },
      }}
    >
      {({ signOut, user }) => (
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
            <Route exact path="/driverCatalog" element={<DriverCatalog />}/>
            <Route exact path="/sponsorCatalog" element={<SponsorCatalog />}/>
            <Route exact path="/driverCart" element={<DriverCart />}/>
            <Route exact path="/adminOrgManagement" element={<AdminOrgManagement/>}/>
          </Routes>
      </Router>
      )}
    </Authenticator>
  );
}