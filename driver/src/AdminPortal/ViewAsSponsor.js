import React, { useState, useEffect } from 'react';
import { Button, Grid, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BaseURL from '../BaseURL'
import { inheritedUser } from '../App.js';

export default function ViewAsSponsor() {
    const [sponsorIDs, setSponsorIDs] = useState('');
    const [orgList, setOrgList] = useState([]);
    const [sponsorList, setSponsorList] = useState([]);
    const [sponsorUser, setSponsorUser] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        getOrgs()
    }, []);

    function getOrgs() {
        fetch(BaseURL + '/getAllOrgs', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (response.ok) { 
                return response.json();
            } else { 
                console.error('Failed to retrieve organization list'); 
            }
        })
        .then(data => {
            if(data) {
                setOrgList(data);
            } else {
                setOrgList([]);
            }
        })
        .catch(error => {
            console.error('Error retrieving organizations:', error);
        });
    }

    const handleSponsorSelect = (sponsorID) => {
        setSponsorIDs(sponsorID);
        fetch(BaseURL + '/sponsorList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orgID: sponsorID })
        })
        .then(response => {
            if (response.ok) { 
                return response.json();
            } else { 
                console.error('Failed to retrieve sponsor list'); 
            }
        })
        .then(data => {
            setSponsorList(data);
        })
        .catch(error => {
            console.error('Error retrieving sponsors:', error);
        });
    }

    const submit = () => {
        inheritedUser.value = sponsorUser;
        navigate('/sponsorProfile');
    }

    return (
        <Grid container justifyContent="center" spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={12} sx={{ maxWidth: '400px' }}>
                <FormControl fullWidth>
                    <InputLabel id="sponsorSelectLabel">Select A Sponsor Organization</InputLabel>
                    <Select
                        labelId="sponsorSelectLabel"
                        id="sponsor-select"
                        value={sponsorIDs}
                        onChange={(e) => handleSponsorSelect(e.target.value)}
                        sx={{ minWidth: '200px' }}
                    >
                        {orgList.map(org => (
                            <MenuItem key={org.sponsorOrgID} value={org.sponsorOrgID}>
                                {org.sponsorOrgName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ maxWidth: '400px' }}>
                <FormControl fullWidth>
                    <InputLabel id="userSelectLabel">Select A User</InputLabel>
                    <Select
                        labelId="userSelectLabel"
                        id="user-select"
                        value={sponsorUser}
                        onChange={(e) => setSponsorUser(e.target.value)}
                        sx={{ minWidth: '200px' }}
                    >
                        {(sponsorList && sponsorList.length > 0) ? sponsorList.map(user => (
                            <MenuItem key={user.userID} value={user.sub}>
                                {user.firstName} {user.lastName}
                            </MenuItem>
                        )) : <MenuItem disabled>No users available</MenuItem>}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <Button variant="contained" onClick={submit} sx={{ width: '100%', maxWidth: '400px' }}>Submit</Button>
            </Grid>
        </Grid>
    );
}
