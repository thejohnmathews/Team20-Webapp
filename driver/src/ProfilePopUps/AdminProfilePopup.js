import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Select, MenuItem } from '@mui/material';
import { useFetchUserAttributes } from '../CognitoAPI';

export default function SponsorProfilePopUp({ userID, open, handleClose }) {
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('Given Name');
  const [lastName, setLastName] = useState('Family Name');
  const [username, setUsername] = useState('Preferred Username');
  const [password, setPassword] = useState('PSWD');
  const [phoneNumber, setPhoneNumber] = useState('1111111111');

  // get cognito attributes
  const userAttributes = useFetchUserAttributes();

  // CALL FROM COGNITO TO SET USER USESTATE ATTRIBUTES ABOVE
  useEffect(() => {

    // when Cognito sends information back, update useState attributes
    if (userAttributes) {
      setFirstName(userAttributes.given_name || 'Given Name');
      setLastName(userAttributes.family_name || 'Family Name');
      setUsername(userAttributes.preferred_username || 'Preferred Username');
      setPhoneNumber(userAttributes["custom:Phone"] || '1111111111');
    }
  }, [userAttributes]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    handleClose();
  };

  const handleSave = () => {
    handleClose();
    setEditMode(false);
    // MAKE COGNITO CALLS HERE TO UPDATE WITH THE NEW USER INFO
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
              type="password"
              label="Password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
