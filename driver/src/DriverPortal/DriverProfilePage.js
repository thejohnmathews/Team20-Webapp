// DriverProfilePage.js

// imports
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DriverAppBar from './DriverAppBar';
import ProfilePopup from '../ProfilePopUps/DriverProfilePopUp'
import "../App.css"
import { useFetchUserAttributes} from '../CognitoAPI';
// import VerificationCodeForm from '../VerificationCode'; 
import UpdatePassword from '../UpdatePassword';
import VerificationCode from '../VerificationCode';

// ProfilePage logic
export default function ProfilePage() {
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [open3, setOpen3] = React.useState(false);
  const [userID, setUserID] = React.useState(-1);
  const [showVerificationCodeForm, setShowVerificationCodeForm] = useState(false);
  const userAttributes = useFetchUserAttributes();
  const [data, setData] = useState([])


  useEffect(() => {
    fetch("http://localhost:8081/profilePage")
    .then(res => res.json())
    .then(data => setData(data[0]))
    .catch(err => console.log(err));
  }, [])

  const handleClickOpen3 = () => {
		setOpen3(true);
	};

  const handleClose3 = () => {
		setOpen3(false);
	};

  const handleClickOpen2 = () => {
		setOpen2(true);
	};

  const handleClose2 = () => {
		setOpen2(false);
	};

  const handleClickOpen = (userID) => {
		setUserID(userID);
		setOpen(true);
	};
	
	const handleClose = () => {
		setOpen(false);
		setUserID(-1);
	};

  // Add logic to check if email has been changed and show verification code form
  useEffect(() => {
    if (userAttributes && userAttributes.email !== data.email) {
      setShowVerificationCodeForm(true);
    } else {
      setShowVerificationCodeForm(false);
    }
  }, [userAttributes, data]);

  const navigate = useNavigate();

  function back(){
    navigate(-1);
  }

  console.log(data)

  return (
    <div>
      <DriverAppBar/>
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
                <p  className="profile-info">Address: {userAttributes.address}</p>
              </div>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', height: '100vh' }}>
            <Button variant="contained" onClick={handleClickOpen}>Edit Profile</Button>
            { open && <ProfilePopup userID={userID} open={open} handleClose={handleClose} permission={"driver"}/> }

            <Button variant="contained" onClick={handleClickOpen2}>Change Password</Button>
            { open2 && <UpdatePassword open={open2} handleClose={handleClose2} permission={"driver"}/> }

            <Button variant="contained" onClick={handleClickOpen3}>Verify Email</Button>
            { open3 && <VerificationCode open={open3} handleClose={handleClose3} permission={"driver"}/> }

          </div>
          <Button variant="contained" onClick={back} style={{bottom: '-300px', fontSize: '18px', left: '20px'}}>back</Button>
        </div>
    </div>
  );
}
