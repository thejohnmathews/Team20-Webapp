import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Select, MenuItem } from '@mui/material';
import BaseURL from '../BaseURL';

export default function SponsorProfilePopUp({ sub, open, handleClose, permission }) {

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  useEffect(() => {
    getSponsorInfo();
  }, []);

  const getSponsorInfo = () => {
    fetch(BaseURL + '/sponsorInfoFromSub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sub:sub })
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

  const setUserAttributes = (user) => {
    setPhoneNumber(user.userPhoneNumber);
    setEmail(user.email);
    setLastName(user.lastName);
    setFirstName(user.firstName);
    setUsername(user.userUsername);
  }

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    handleClose();
  };

  // update all attributes in edit profile screen everytime
  const handleSave = async () => {
    fetch(BaseURL + '/updateSponsor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email:email, firstName:firstName, lastName:lastName, userUsername:username, userPhoneNumber:phoneNumber, sub:sub })
    })
    .then(response => {
      if (response.ok) { 
        getSponsorInfo();
        handleClose();
        return response.json();
      } 
      else { console.error('Failed to update'); }
    })
    .catch(error => {
      console.error('Error updating successfully:', error);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Profile for {username}
      </DialogTitle>
      <br />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              fullWidth
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Phone Number"
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={!editMode}
            />
          </Grid>
          {/* {permission.permission == "admin" &&
          <Grid item xs={6}>
            <Select
              value={sponsor}
              onChange={(e) => setSponsor(e.target.value)}
              disabled={!editMode}
              fullWidth
            >
              <MenuItem value="Sponsor 1">Sponsor 1</MenuItem>
              <MenuItem value="Sponsor 2">Sponsor 2</MenuItem>
              <MenuItem value="Sponsor 3">Sponsor 3</MenuItem>
            </Select>
          </Grid>
          } */}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent="flex-start">
          <Grid item>
            <Button sx={{ color: 'red' }} onClick={handleClose}>Close</Button>
          </Grid>
        </Grid>
        {editMode ? (
          <Button sx={{ color: 'red' }} onClick={handleCancel}>Cancel</Button>
        ) : (
          <Button onClick={handleEdit}>Edit</Button>
        )}
        <Button onClick={handleSave} disabled={!editMode}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
