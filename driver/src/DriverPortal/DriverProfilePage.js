import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../App.css"
import DriverAppBar from './DriverAppBar';

// here are amplify imports, not sure we need all of them; may only need fetchUserAttributes import
import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import config from '../amplifyconfiguration.json';
import { fetchUserAttributes } from 'aws-amplify/auth';
import { updateUserAttribute } from 'aws-amplify/auth';
Amplify.configure(config);


export default function ProfilePage() {

  const navigate = useNavigate();
  
  function back(){
    navigate(-1);
  }
  
  const [data, setData] = useState([])
  useEffect(() => {
    fetch("http://localhost:8081/profilePage")
    .then(res => res.json())
    .then(data => setData(data[0]))
    .catch(err => console.log(err));
  }, [])

  console.log(data)

  // use amplify api call to Cognito to fetch userAttributes
  // NOTE: To prevent the API fetch from getting rejected,
  //        I had to edit the Trust Relationship for the 
  //        authRole
  const [userAttributes, setUserAttributes] = useState(null);
  useEffect(() => {
    async function handleFetchUserAttributes() {
      try {
        const userAttributes = await fetchUserAttributes();
        setUserAttributes(userAttributes);
        console.log(userAttributes);
      } catch (error) {
        console.log("Error fetching Cognito User Attributes");
      }
    }

    handleFetchUserAttributes();
  }, []);

  

  async function handleUpdateUserAttribute(attributeKey, value) {
    try {
      const output = await updateUserAttribute({
        userAttribute: {
          attributeKey,
          value
        }
      });
      handleUpdateUserAttributeNextSteps(output);
    } catch (error) {
      console.log(error);
    }
  }

  function handleUpdateUserAttributeNextSteps(output) {
    const { nextStep } = output;

    switch (nextStep.updateAttributeStep) {
      case 'CONFIRM_ATTRIBUTE_WITH_CODE':
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails?.deliveryMedium}.`
        );
        // Collect the confirmation code from the user and pass to confirmUserAttribute.
        break;
      case 'DONE':
        console.log(`attribute was successfully updated.`);
        break;
    }
  }


  return (
    <div>
      <DriverAppBar/>
      <div>
        {userAttributes && (
          <div>
            <h1 className="profile-header">({userAttributes.preferred_username})'s Profile</h1>
              <div>
                <p  className="profile-info">Sponsor: {userAttributes.attributes['custom:Sponsor']}</p>
                <p  className="profile-info">First Name: {userAttributes.given_name}</p>
                <p  className="profile-info">Last Name: {userAttributes.family_name}</p>
                <p  className="profile-info">Username: {userAttributes.preferred_username}</p>
                <p  className="profile-info">Server Username: {userAttributes.sub}</p>
                <p  className="profile-info">Email: {userAttributes.email}</p>
                <p  className="profile-info">Phone Number: {userAttributes.phone_number}</p>
                <p  className="profile-info">Address Line 1: {userAttributes.address}</p>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: '100vh' }}>
            <Button variant="contained">Change Username</Button>
            <Button variant="contained">Change Password</Button>
            <Button variant="contained">Change E-Mail</Button>
            <Button variant="contained">Change Address</Button>
          </div>
          <Button variant="contained" onClick={back} style={{bottom: '-300px', fontSize: '18px', left: '20px'}}>back</Button>
        </div>
    </div>
  );
}
