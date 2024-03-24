import React, { useState } from 'react';
import { Button, Grid, TextField, Card, CardHeader, CardContent, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useFetchUserAttributes} from '../CognitoAPI';
import { useNavigate } from 'react-router-dom';
import BaseURL from '../BaseURL'

class Address{
	constructor(address1, address2, city, state, zip){
		this.address1 = address1;
		this.address2 = address2;
		this.city = city;
		this.state = state;
		this.zip = zip;
	}
}
class Application{
	constructor(firstName, lastName, username, email, sub) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.email = email;
		this.sub = sub;
		// this.phoneNumber = phoneNumber;
		// this.sponsor = sponsor;
		// this.address = address;
	  }
}

export default function DriverApplicationPage() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [address1, setAddress1] = useState("");
	const [address2, setAddress2] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [zip, setZip] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [sponsor, setSponsor] = useState(null);
	// const [address, setAddress] = useState(null);

	const userAttributes = useFetchUserAttributes();
	const navigate = useNavigate();

	function submit(){
		// const driverAddress = new Address(address1, address2, city, state, zip);
		
		const driverApplication = new Application(userAttributes.given_name, userAttributes.family_name, userAttributes.preferred_username, userAttributes.email, userAttributes.sub)
		console.log("frontend application");
		console.log(driverApplication);

		fetch(BaseURL + '/newDriver', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(driverApplication)
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
				body: JSON.stringify({id: userID}) 
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
		

		// Navigate to DriverApplicationStatusPage here!
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
							<Select  labelId="sponsorSelectLabel" id="sponsorSelect" value={sponsor} label="Choose Your Sponsor" onChange={(e) => { setSponsor(e.target.value); }} >
								<MenuItem value={1}>Sponsor Example 1</MenuItem>
								<MenuItem value={2}>Sponsor Example 2</MenuItem>
								<MenuItem value={3}>Sponsor Example 3</MenuItem>
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