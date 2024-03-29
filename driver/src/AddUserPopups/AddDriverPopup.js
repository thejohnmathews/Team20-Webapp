import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import BaseURL from '../BaseURL'

export default function DriverProfilePopUp({ open, handleClose, inherited, callback }) {
  const [email, setEmail] = useState('');
  const [sponsorID, setSponsorID] = useState([]);
  const [orgList, setOrgList] = useState([]);

  useEffect(() => {
    if(inherited < 1){
      getOrgs()
    } else {
      setSponsorID(inherited);
    }
	}, []);

  const checkEmailInDB = () => {
    fetch(BaseURL + '/userExistsFromEmail', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({email:email})
    }).then(response => {
      if (!response.ok) { throw new Error('Network response was not ok'); }
      return response.json(); 
    }).then(data => {
      // check if the user exists from email in RDS, if not insert info into userinfo, 
      // if so add info to the user then navigate back to login redirect
      if(!data.userExists){ addUserToDB(); }
      else { addUserToDriverPool(data.userData.userID); }
    })
    .catch(error => {
      console.error('Error:', error);
    });
	}

  const addUserToDB = () => {
    if(sponsorID.length > 0){
      fetch(BaseURL + '/newDriver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email:email, sponsorID:sponsorID})
      })
      .then(response => {
        if (response.ok) { 
          callback();
          handleClose();
          return response.json();
        } 
        else { console.error('Failed to post'); }
      })
      .catch(error => {
        console.error('Error retrieving successfully:', error);
      });
    } else {
      alert("Select at least 1 sponsor");
    }
  }

  const addUserToDriverPool = (userID) => {
    fetch(BaseURL + '/addUserToDriverPool', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({userID:userID, sponsorID:sponsorID})
		})
		.then(response => {
			if (response.ok) { 
        callback();
        handleClose();
				return response.json(); 
      } else { console.error('Failed to post'); }
		})
		.catch(error => {
			console.error('Error retrieving successfully:', error);
		});
  }

  function getOrgs(){
    fetch(BaseURL + '/getAllOrgs', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
		})
		.then(response => {
			if (response.ok) { 
				console.log('lists retrieved successfully'); 
				return response.json();
			} 
			else { console.error('Failed to retrieve'); }
		})
		.then(data => {
			console.log(data);
			if(data){
				setOrgList(data);
			} else {
				setOrgList([]);
			}
			
		})
		.catch(error => {
			console.error('Error retrieving successfully:', error);
		});
  }

  const handleSave = () => {
    checkEmailInDB();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Create A Driver
      </DialogTitle>
      <br />
      <DialogContent>
        <Grid container spacing={2}>
          
          
          <Grid item xs={12}>
            <TextField
              type="Email"
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          {inherited < 1 && 
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="sponsor-select">Sponsor</InputLabel>
              <Select
                multiple
                value={sponsorID}
                onChange={(e) => setSponsorID(e.target.value)}
                fullWidth
                inputProps={{
                  name: 'sponsor',
                  id: 'sponsor-select',
                }}
              >
                {orgList.map(org => (
                  <MenuItem key={org.sponsorOrgID} value={org.sponsorOrgID}>
                    {org.sponsorOrgName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          }
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent="flex-start">
          <Grid item>
            <Button sx={{ color: 'red' }} onClick={handleClose}>Close</Button>
          </Grid>
        </Grid>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
