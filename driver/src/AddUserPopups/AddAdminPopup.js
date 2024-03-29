import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Select, MenuItem } from '@mui/material';
import BaseURL from '../BaseURL';

export default function DriverProfilePopUp({ open, handleClose, callback }) {
  const [email, setEmail] = useState('');

  const handleSave = () => {
    checkEmailInDB();
  };

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
      else { addUserToAdminPool(data.userData.userID); }
    })
    .catch(error => {
      console.error('Error:', error);
    });
	}

  const addUserToDB = () => {
    fetch(BaseURL + '/addAdmin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({email})
		})
		.then(response => {
			if (response.ok) { 
        callback();	
        handleClose();
				return response.json();
			} 
			else { console.error('Failed to post'); }
		})
		.then(data => {
			console.log(data);		
		})
		.catch(error => {
			console.error('Error retrieving successfully:', error);
		});
  }

  const addUserToAdminPool = (userID) => {
    fetch(BaseURL + '/addUserToAdminPool', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({userID:userID})
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Create An Admin User
      </DialogTitle>
      <br />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
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
