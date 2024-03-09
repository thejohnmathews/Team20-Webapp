import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Select, MenuItem } from '@mui/material';

export default function AddOrgPopup({ open, handleClose }) {
  const [name, setName] = useState('');

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
        Create A Sponsor Organization
      </DialogTitle>
      <br />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
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
