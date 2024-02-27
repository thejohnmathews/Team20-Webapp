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
            <h1 className="profile-header">({userAttributes.sub})'s Profile</h1>
              <div>
                <p  className="profile-info">Sponsor: </p>
                <p  className="profile-info">First Name: </p>
                <p  className="profile-info">Last Name: </p>
                <p  className="profile-info">Username: {userAttributes.preferred_username}</p>
                <p  className="profile-info">Password: </p>
                <p  className="profile-info">Email: {userAttributes.email}</p>
                <p  className="profile-info">Phone Number: </p>
                <p  className="profile-info">Address Line 1: </p>
                <p  className="profile-info">Address Line 2: </p>
                <p  className="profile-info">City: </p>
                <p  className="profile-info">State: </p>
                <p  className="profile-info">Zip: </p>
              </div>
            </div>
          )}
          <Button variant="contained" onClick={back} style={{bottom: '-300px', fontSize: '18px', left: '20px'}}>back</Button>
        </div>
    </div>
  );
}
