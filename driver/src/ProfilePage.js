import React, { useEffect, useState } from 'react';
import "./App.css";
import { useFetchUserAttributes, handleUpdateUserAttributes } from './CognitoAPI';
import UpdatePassword from './UpdatePassword';
import { Grid, Typography, Box, Button, TextField, Paper, Stack, Divider } from '@mui/material';
import BaseURL from './BaseURL';

export default function ProfilePage({userType, inheritedSub}) {
  const [open2, setOpen2] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [sponsorOrgName, setSponsorOrgName] = useState('');

  const userAttributes = useFetchUserAttributes();
  useEffect(() => {
    if (userAttributes) { getUserInfo(); }
  }, [userAttributes]);

  const getUserInfo = () => {
    if(userType === 'admin'){ getAdminInfo(); }
    else if (userType === 'sponsor'){ getAssociatedSponsor(); getSponsorInfo(); }
    else{ getAssociatedSponsor(); getDriverInfo();}
  }

  const setUserAttributes = (user) => {
    if (userType === 'driver'){ setAddress(user.driverAddress); }
    setPhoneNumber(user.userPhoneNumber);
    setEmail(user.email);
    setLastName(user.lastName);
    setFirstName(user.firstName);
    setUsername(user.userUsername);
  }
  const handleClickOpen2 = () => { setOpen2(true); };
  const handleClose2 = () => { setOpen2(false); };
  const handleEdit = () => { setEditMode(true); };

  const updateAdmin = () => { 
    fetch(BaseURL + '/updateAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email:email, firstName:firstName, lastName:lastName, userUsername:username, userPhoneNumber:phoneNumber, sub:userAttributes.sub })
    })
    .then(response => {
      if (response.ok) { 
        getUserInfo();
        return response.json();
      } 
      else { console.error('Failed to update'); }
    })
    .catch(error => {
      console.error('Error updating successfully:', error);
    });
  };
  const updateDriver = () => { 
    fetch(BaseURL + '/updateDriver', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email:email, firstName:firstName, lastName:lastName, userUsername:username, userPhoneNumber:phoneNumber, driverAddress:address, sub: inheritedSub?.value2 ? inheritedSub.value2 : userAttributes.sub })
    })
    .then(response => {
      if (response.ok) { 
        getUserInfo();
        return response.json();
      } 
      else { console.error('Failed to update'); }
    })
    .catch(error => {
      console.error('Error updating successfully:', error);
    });
  };
  const updateSponsor = () => { 
    fetch(BaseURL + '/updateSponsor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email:email, firstName:firstName, lastName:lastName, userUsername:username, userPhoneNumber:phoneNumber, sub: inheritedSub?.value ? inheritedSub.value : userAttributes.sub })
    })
    .then(response => {
      if (response.ok) { 
        getUserInfo();
        return response.json();
      } 
      else { console.error('Failed to update'); }
    })
    .catch(error => {
      console.error('Error updating successfully:', error);
    });
  };

  const handleSave = () => {
    if(userType === 'admin'){
      updateAdmin();
    } else if (userType === 'sponsor'){
      updateSponsor();
    } else {
      updateDriver();
    }
    setEditMode(false);
  };

  const getAdminInfo = () => {
    fetch(BaseURL + '/adminInfoFromSub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sub:userAttributes.sub })
    })
    .then(response => {
      if (response.ok) { 
        return response.json();
      } 
      else { console.error('Failed to get user'); }
    })
    .then(data => {
      setUserAttributes(data[0]);
    })
    .catch(error => {
      console.error('Failed to get user:', error);
    });
  }

  const getSponsorInfo = () => {
    fetch(BaseURL + '/sponsorInfoFromSub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sub: inheritedSub?.value ? inheritedSub.value : userAttributes.sub })
    })
    .then(response => {
      if (response.ok) { 
        return response.json();
      } 
      else { console.error('Failed to get user'); }
    })
    .then(data => {
      setUserAttributes(data[0]);
    })
    .catch(error => {
      console.error('Failed to get user:', error);
    });
  }

  const getDriverInfo = () => {
    fetch(BaseURL + '/driverInfoFromSub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sub: inheritedSub?.value2 ? inheritedSub.value2 : userAttributes.sub })
    })
    .then(response => {
      if (response.ok) { 
        return response.json();
      } 
      else { console.error('Failed to get user'); }
    })
    .then(data => {
      setUserAttributes(data[0]);
    })
    .catch(error => {
      console.error('Failed to get user:', error);
    });
  }

  const handleCancel = () => {
    setEditMode(false);
    getUserInfo();
  };

  const getAssociatedSponsor = () => {
    var endpoint = '';
    if(userType === 'driver'){ endpoint = '/driverAssociatedSponsor' }
    else{ endpoint = '/associatedSponsor' }
      fetch(BaseURL + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({sub: inheritedSub?.value2 ? inheritedSub.value2 : (inheritedSub?.value ? inheritedSub.value : userAttributes.sub)})
      })
      .then(response => {
        if (response.ok) { 
          return response.json();
        } 
        else { console.error('Failed to post'); }
      })
      .then(data => {
        if(userType === 'driver'){ 
          console.log(data);
          setSponsorOrgName(data);	
        } else {
          setSponsorOrgName(data[0].sponsorOrgName);	 
        }
      })
      .catch(error => {
        console.error('Error retrieving successfully:', error);
      });
    
  }

  return (
    <div>
      <br />
      {userAttributes && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <Paper elevation={8} sx={{ padding: '40px', width: '75%', backgroundColor: '#f5f5f5', position: 'relative' }}>
            <Typography variant="h4" fontWeight="bold">
              My Profile
            </Typography>
            <Divider />
            <br />
            <Grid container spacing={3} justifyContent="center">
				{(userType === "driver" && sponsorOrgName.length > 0) && (
					<Grid container item xs={12} alignItems="center">
            <Typography variant="h6">My Sponsors:<>&nbsp;</></Typography>
            {sponsorOrgName.map((sponsor, index) => (
                <React.Fragment key={sponsor.sponsorOrgID}>
                    <Typography variant="h6">{sponsor.sponsorOrgName}{index < sponsorOrgName.length - 1 && <>,&nbsp;</>}</Typography>
                </React.Fragment>
            ))}
          </Grid>
				)}
				{userType === "sponsor" && (
					<Grid item xs={12}>
						<Typography variant="h6">My Sponsor: {sponsorOrgName}</Typography>
          </Grid>
				)}
              
              <Grid item xs={12} sm={4}>
                <TextField
                  variant="outlined"
                  label="Username"
                  fullWidth
                  value={username}
                  disabled={!editMode}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  variant="outlined"
                  label="First Name"
                  fullWidth
                  value={firstName}
                  disabled={!editMode}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  variant="outlined"
                  label="Last Name"
                  fullWidth
                  value={lastName}
                  disabled={!editMode}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  label="Email"
                  fullWidth
                  value={email}
                  disabled={!editMode}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  label="Phone Number"
                  fullWidth
                  value={phoneNumber}
                  disabled={!editMode}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Grid>
              {userType === 'driver' && (
                <Grid item xs={12} sm={12}>
                  <TextField
                    variant="outlined"
                    label="Address"
                    fullWidth
                    value={address}
                    disabled={!editMode}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Grid>
              )}
            </Grid>
            <br />
            <Divider />
            <br />
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              {editMode ? (
                <Button sx={{ color: 'red' }} onClick={handleCancel}>Cancel</Button>
              ) : (
                <Button onClick={handleEdit}>Edit</Button>
              )}
              <Button onClick={handleSave} disabled={!editMode}>Save</Button>
              <Button onClick={handleClickOpen2}>Change Password</Button>
              {open2 && <UpdatePassword open={open2} handleClose={handleClose2} permission={"driver"} />}
            </Stack>
          </Paper>
        </Box>
      )}
    </div>
  );
}
