import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Select, MenuItem } from '@mui/material';

export default function DriverProfilePopUp({ open, handleClose }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSave = () => {
    handleClose();
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
        Create A Sponsor User
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
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              fullWidth
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="password"
              label="Password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Phone Number"
              fullWidth
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <Select
              value={sponsor}
              onChange={(e) => setSponsor(e.target.value)}
              fullWidth
            >
              <MenuItem value="Sponsor 1">Sponsor 1</MenuItem>
              <MenuItem value="Sponsor 2">Sponsor 2</MenuItem>
              <MenuItem value="Sponsor 3">Sponsor 3</MenuItem>
            </Select>
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
