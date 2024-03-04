import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../App.css"
import SponsorAppBar from './SponsorAppBar';
import SponsorProfilePopUp from '../ProfilePopUps/SponsorProfilePopup';
import { useFetchUserAttributes } from '../CognitoAPI';

export default function SponsorProfilePage() {

  const [open, setOpen] = React.useState(false);
  const [userID, setUserID] = React.useState(-1);

  const handleClickOpen = (userID) => {
		setUserID(userID);
		setOpen(true);
	};
	
	const handleClose = () => {
		setOpen(false);
		setUserID(-1);
	};

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

  // get Cognito attributes
  const userAttributes = useFetchUserAttributes();

  console.log(data)
  return (
    <div>
      <SponsorAppBar/>
        <div>
          {userAttributes && (
          <div>
          <h1 className="profile-header"> {userAttributes.preferred_username}'s Profile</h1>
            <div>
                <p  className="profile-info">Sponsor: {userAttributes["custom:Sponsor"]}</p>
                <p  className="profile-info">First Name: {userAttributes.given_name}</p>
                <p  className="profile-info">Last Name: {userAttributes.family_name}</p>
                <p  className="profile-info">Username: {userAttributes.preferred_username}</p>
                <p  className="profile-info">Server Username: {userAttributes.sub}</p>
                <p  className="profile-info">Email: {userAttributes.email}</p>
                <p  className="profile-info">Phone Number: {userAttributes["custom:Phone"]}</p>
                <p  className="profile-info">Address Line: {userAttributes.address}</p>
              <Button variant="contained" onClick={handleClickOpen}>Edit Profile</Button>
              { open && <SponsorProfilePopUp userID={userID} open={open} handleClose={handleClose} permission={"sponsor"}/> }
            </div>
          </div>
          )}
          <Button variant="contained" onClick={back} style={{bottom: '-300px', fontSize: '18px', left: '20px'}}>back</Button>
        </div>
    </div>
  );
}
