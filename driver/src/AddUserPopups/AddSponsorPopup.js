import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import BaseURL from '../BaseURL'

export default function AddSponsorPopup({ open, handleClose }) {
  const [sponsorID, setSponsorID] = useState('');
  const [email, setEmail] = useState('');
  const [orgList, setOrgList] = useState([]);
 
  useEffect(() => {
		getOrgs()
	}, []);

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
    fetch(BaseURL + '/addSponsor', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({email, sponsorID})
		})
		.then(response => {
			if (response.ok) { 
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

    handleClose();
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
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel htmlFor="sponsor-select">Sponsor</InputLabel>
              <Select
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
