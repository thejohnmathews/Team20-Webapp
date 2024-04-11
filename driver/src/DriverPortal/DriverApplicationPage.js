import React, { useState, useEffect } from 'react';
import { Button, Grid, TextField, Card, CardHeader, CardContent, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useFetchUserAttributes} from '../CognitoAPI';
import { useNavigate } from 'react-router-dom';
import BaseURL from '../BaseURL'

export default function DriverApplicationPage() {
	const [sponsorIDs, setSponsorIDs] = useState([]);
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

	const userAttributes = useFetchUserAttributes();
	const navigate = useNavigate();

	function submit(){
		console.log(sponsorIDs)
		const addressValue = userAttributes.address;
		if (addressValue === null) {
			console.log("address value is null");
		} else {
			console.log("correct address:" + addressValue);
		}
		if(sponsorIDs.length > 0){

			fetch(BaseURL + '/newDriverFromApplication', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				//Add Address here because it goes to driverInfo 
				body: JSON.stringify({sub:userAttributes.sub, driverAddress:addressValue})
			})
			.then(response => {
				if (response.ok) { 
					console.log('User inserted successfully'); 
					return response.json();
				} 
				else { console.error('Failed to insert user'); }
			})
			.then(data => {
				console.log(data);
				var userID = data.userID;
				
				fetch(BaseURL + '/newApplication', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({id: userID, sponsorOrgIDs: sponsorIDs}) 
				})
				.then(response => {
					if (response.ok) { console.log('Application submitted successfully'); } 
					else { console.error('Failed to submit application'); }
				})
				.catch(error => {
					console.error('Error submitting application:', error);
				});
				navigate('/');
			})
			.catch(error => {
				console.error('Error inserting user:', error);
			});
		}
		else{
			return(
				alert("Please select at least one sponsor")
			);
		}

	}

	return (
		<Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
		  {/* card that everything is placed in */}
		  <Card raised='true' sx={{ width: 500, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
			<CardHeader title="Driver Application"> </CardHeader>

			<h2>Hello {userAttributes && userAttributes.given_name}, select your Sponsor to submit your application.</h2>

			{/* everything in the card */}
			<CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

				<Grid container spacing={2} direction="row" alignItems={'center'} >
					{/* Sponsor Select */}
					{/* NOTE that the menu items will get replaced with a list of the sponsors */}
					<Grid item>
						<FormControl sx={{ minWidth: 416 }}>
							<InputLabel id="sponsorSelectLabel">Choose Your Sponsor</InputLabel>
							<Select
								labelId="sponsor-select-label"
								id="sponsor-select"
								multiple
								value={sponsorIDs}
								onChange={(e) => setSponsorIDs(e.target.value)}
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
				<br></br>

				{/* Submit Button */}
				<Button id="submit" variant="contained" onClick={submit}>Submit</Button>

			</CardContent>
	
		  </Card>
		</Grid>
	)
}