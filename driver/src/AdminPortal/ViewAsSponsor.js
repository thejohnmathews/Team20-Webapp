import React, { useState, useEffect } from 'react';
import { Button, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BaseURL from '../BaseURL'
import { inheritedUser } from '../App.js';

export default function ViewAsSponsor() {
	const [sponsorIDs, setSponsorIDs] = useState('');
	const [orgList, setOrgList] = useState([]);
	const [sponsorList, setSponsorList] = useState([]);
	const [sponsorUser, setSponsorUser] = useState('');

	useEffect(() => {
		console.log("ViewAsSponsor")
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

	const navigate = useNavigate();

	const handleSponsorSelect = (sponsorID) => {
		setSponsorIDs(sponsorID);
		fetch(BaseURL + '/sponsorList', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({orgID: sponsorID})
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
			setSponsorList(data)
			
		})
		.catch(error => {
			console.error('Error retrieving successfully:', error);
		});
	}

	const submit = () => {
		inheritedUser.value = sponsorUser;
		navigate('/sponsorProfile');
		console.log(inheritedUser)
	}

	return (
		<Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
		  

				<Grid container spacing={2} direction="row" alignItems={'center'} >
					
					<Grid item>
						<FormControl sx={{ minWidth: 416 }}>
							<InputLabel id="sponsorSelectLabel">Select A Sponsor Organization</InputLabel>
							<Select
								labelId="sponsor-select-label"
								id="sponsor-select"
								value={sponsorIDs}
								onChange={(e) => handleSponsorSelect(e.target.value)}
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
					<br/>
					<Grid item>
						<FormControl sx={{ minWidth: 416 }}>
							<InputLabel id="sponsorSelectLabel">Select A User</InputLabel>
							<Select
								labelId="sponsor-select-label"
								id="sponsor-select"
								value={sponsorUser}
								onChange={(e) => setSponsorUser(e.target.value)}
								fullWidth
								inputProps={{
								name: 'sponsor',
								id: 'sponsor-select',
								}}
							>
								{(sponsorList && sponsorList.length > 0) ? sponsorList.map(user => (
								<MenuItem key={user.userID} value={user.sub}>
									{user.firstName + ' ' + user.lastName}
								</MenuItem>
								)) : "No users available"}
							</Select>
						</FormControl>
					</Grid>
				</Grid>
				<br></br>

				<Button id="submit" variant="contained" onClick={submit}>Submit</Button>

		</Grid>
	)
}