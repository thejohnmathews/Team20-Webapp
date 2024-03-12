import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Select, MenuItem } from '@mui/material';
import BaseURL from '../BaseURL';

export default function OrgPopup({ org, open, handleClose }) {
  const [name, setName] = useState(org.sponsorOrgName);
  const [orgDescription, setOrgDescription] = useState(org.sponsorOrgDescription);
  const [ID, setID] = useState(org.sponsorOrgID);
  const [editMode, setEditMode] = useState(false);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    handleClose();
  };

  const handleSave = () => {
    console.log(ID)
    fetch(BaseURL + '/editOrg', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          sponsorOrgID: ID,
          sponsorOrgName: name,
          sponsorOrgDescription: orgDescription
      })
  })
  .then(response => {
      if (response.ok) {
          console.log('Organization updated successfully');
      } else {
          console.error('Failed to update organization');
      }
      handleClose();
  })
  .catch(error => {
      console.error('Error updating organization:', error);
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
       Edit {name}
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
              disabled={!editMode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Name"
              fullWidth
              value={orgDescription}
              onChange={(e) => setOrgDescription(e.target.value)}
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
