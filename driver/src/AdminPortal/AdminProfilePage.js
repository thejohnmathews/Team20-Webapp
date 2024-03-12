import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../App.css"
import AdminAppBar from './AdminAppBar';
import ProfilePopup from '../ProfilePopUps/AdminProfilePopup'
import { useFetchUserAttributes } from '../CognitoAPI';
import UpdatePassword from '../UpdatePassword';

export default function AdminProfilePage() {

  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [userID, setUserID] = React.useState(-1);

  
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
      <AdminAppBar/>
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
              { open && <ProfilePopup userID={userID} open={open} handleClose={handleClose}/> }

              <Button variant="contained" onClick={handleClickOpen2}>Change Password</Button>
              { open2 && <UpdatePassword open={open2} handleClose={handleClose2} permission={"driver"}/> }
            </div>
          </div>
          )}
          <Button variant="contained" onClick={back} style={{bottom: '-300px', fontSize: '18px', left: '20px'}}>back</Button>
        </div>
    </div>
  );
}
