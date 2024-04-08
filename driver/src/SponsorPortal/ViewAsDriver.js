import React, { useState, useEffect } from 'react';
import { Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BaseURL from '../BaseURL.js'
import { inheritedUser } from '../App.js';
import { useFetchUserAttributes } from '../CognitoAPI';

export default function ViewAsDriver({ inheritedSub }) {
    const [driverList, setDriverList] = useState([]);
    const [driverUser, setDriverUser] = useState('');
    const userAttributes = useFetchUserAttributes();
    const navigate = useNavigate();

    useEffect(() => {
        if (userAttributes) {
            getAssociatedSponsor();
        }
    }, [userAttributes]);

    const getAssociatedSponsor = () => {
        fetch(BaseURL + '/associatedSponsor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sub: inheritedSub?.value ? inheritedSub.value : userAttributes.sub })
        })
        .then(response => {
            if (response.ok) { 
                return response.json();
            } 
            else { 
                console.error('Failed to post'); 
            }
        })
        .then(data => {
            handleSponsorSelect(data[0].sponsorOrgID);    
        })
        .catch(error => {
            console.error('Error retrieving successfully:', error);
        });
        
    }

    const handleSponsorSelect = (sponsorID) => {
        fetch(BaseURL + '/driverList', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ orgID: sponsorID })
        })
        .then(response => {
            if (response.ok) { 
                console.log('lists retrieved successfully'); 
                return response.json();
            } 
            else { 
                console.error('Failed to retrieve'); 
            }
        })
        .then(data => {
            console.log(data);
            setDriverList(data)
        })
        .catch(error => {
            console.error('Error retrieving successfully:', error);
        });
    }

    const submit = () => {
        inheritedUser.value2 = driverUser;
        navigate('/driverProfile');
        console.log(inheritedUser.value2)
    }

    return (
        <Grid container alignItems="center" justifyContent="center" spacing={2} sx={{ mt: 5 }}>
            <Grid item xs={12} sx={{ maxWidth: '400px' }}>
                <FormControl fullWidth>
                    <InputLabel id="driverSelectLabel">Select A User</InputLabel>
                    <Select
                        labelId="driverSelectLabel"
                        id="driver-select"
                        value={driverUser}
                        onChange={(e) => setDriverUser(e.target.value)}
                        sx={{ minWidth: '200px' }}
                    >
                        {(driverList && driverList.length > 0) ? driverList.map(user => (
                            <MenuItem key={user.userID} value={user.sub}>
                                {user.firstName + ' ' + user.lastName}
                            </MenuItem>
                        )) : <MenuItem disabled>No users available</MenuItem>}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ maxWidth: '400px' }}>
                <Button variant="contained" onClick={submit} sx={{ width: '100%', maxWidth: '400px' }}>Submit</Button>
            </Grid>
        </Grid>
    )
}
