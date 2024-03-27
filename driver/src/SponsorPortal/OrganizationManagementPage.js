import React, { useEffect, useState } from 'react';
import SponsorAppBar from './SponsorAppBar';
import { Grid, Typography, Box, Button, TextField, Paper, Stack, Divider, CircularProgress } from '@mui/material'
import { useFetchUserAttributes } from '../CognitoAPI';
import BaseURL from '../BaseURL';

export default function SponsorManagementPage() {
  const userAttributes = useFetchUserAttributes();
  const [sponsorOrgID, setSponsorOrgID] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [ratio, setRatio] = useState('')
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  

  const handleEdit = () => { setEditMode(true); };

  const handleSave = () => {
    setEditMode(false);
    updateOrg();
  };

  const handleCancel = () => {
    setEditMode(false);
    getSponsorInfo();
  };

  // get the sponsor first using the user sub
  useEffect(() => {
    if (userAttributes && sponsorOrgID === null) {
        getAssociatedSponsor();
    }
  }, [userAttributes]); 

  const getAssociatedSponsor = () => {
    fetch(BaseURL + '/associatedSponsor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({sub: userAttributes.sub})
    })
    .then(response => {
      if (response.ok) { 
        return response.json();
      } 
      else { console.error('Failed to post'); }
    })
    .then(data => {
      console.log(data[0].sponsorOrgID);
      setSponsorOrgID(data[0].sponsorOrgID);			
    })
    .catch(error => {
      console.error('Error retrieving successfully:', error);
    });
}

  // once the sponsor is set get the reasons
  useEffect(() => {
    if(sponsorOrgID != null){
        getSponsorInfo();
    }
  }, [sponsorOrgID]); 

  const getSponsorInfo = () => {
    const url = new URL(BaseURL + "/sponsorOrg");
    url.searchParams.append('sponsorOrgID', sponsorOrgID);

    fetch(url)
    .then(res => res.json())
    .then(data => {
      setName(data[0].sponsorOrgName)
      setDescription(data[0].sponsorOrgDescription)
      setRatio(data[0].sponsorDolarPointRatio)
      setLoading(false);
    })
    .catch(err => console.log(err));
  }

  const updateOrg = () => { 
    fetch(BaseURL + '/updateOrg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name:name, description:description, ID:sponsorOrgID, ratio:parseFloat(ratio) })
    })
    .then(response => {
      if (response.ok) { 
        getSponsorInfo();
        return response.json();
      } 
      else { console.error('Failed to update'); }
    })
    .catch(error => {
      console.error('Error updating successfully:', error);
    });
  };

  return (
    <div>
    <SponsorAppBar/>

    {loading && 
    <Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
			<CircularProgress/>
		</Grid>
    }

    {!loading && 
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <Paper elevation={8} sx={{ padding: '40px', width: '75%', backgroundColor: '#f5f5f5', position: 'relative' }}>
          <Typography variant="h4" fontWeight="bold">
            My Organization
          </Typography>
          <Divider />
          <br />
          <Grid container spacing={3} justifyContent="center">

            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                label="Organization Name"
                fullWidth
                value={name}
                disabled={!editMode}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                label="Organization Description"
                fullWidth
                value={description}
                disabled={!editMode}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                variant="outlined"
                label="$$$ To Point Ratio"
                fullWidth
                value={ratio}
                disabled={!editMode}
                onChange={(e) => setRatio(e.target.value)}
              />
            </Grid>
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
          </Stack>
        </Paper>
      </Box>
    }
    </div>
  );
}