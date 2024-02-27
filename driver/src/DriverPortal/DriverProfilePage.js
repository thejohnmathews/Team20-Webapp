import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../App.css"
import DriverAppBar from './DriverAppBar';

import { Amplify } from 'aws-amplify';
import '@aws-amplify/ui-react/styles.css';
import config from '../amplifyconfiguration.json';
import { fetchUserAttributes } from 'aws-amplify/auth';
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

  // use amplify api call to Cognito to fetch userAttributes
  // NOTE: To prevent the API from getting rejected, I had to
  //       edit the Trust Relationship for the authRole
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

  console.log(data)
  return (
    <div>
      <DriverAppBar/>
      <div>
        {userAttributes && (
          <div>
            <h1 className="profile-header">({userAttributes.preferred_username})'s Profile</h1>
              <div>
                <p  className="profile-info">Sponsor: {userAttributes.Sponsor}</p>
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
          <Button variant="contained" onClick={back} style={{bottom: '-300px', fontSize: '18px', left: '20px'}}>back</Button>
        </div>
    </div>
  );
}
