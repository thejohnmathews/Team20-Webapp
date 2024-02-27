import React, { useState } from 'react';
import { Button, Grid, TextField, Card, CardHeader, CardContent, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

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
	constructor(firstName, lastName, username, password, email, phoneNumber, sponsor, address) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.password = password;
		this.email = email;
		this.phoneNumber = phoneNumber;
		this.sponsor = sponsor;
		this.address = address;
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

	

	function submit(){
		const driverAddress = new Address(address1, address2, city, state, zip);
		const driverApplication = new Application(firstName, lastName, username, password, email, phoneNumber, sponsor, driverAddress)
		console.log(driverApplication);
	}

	return (
		<Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
		  {/* card that everything is placed in */}
		  <Card raised='true' sx={{ width: 500, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
			<CardHeader title="Driver Application"> </CardHeader>
	
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
					
					<Grid item>
						{/* First Name Textbox */}
						<TextField id="firstName" label="First Name" sx={{width: '200px'}} onChange={(e) => { setFirstName(e.target.value); }} value={firstName} />
					</Grid>
					<Grid item>
						{/* Last Name Textbox */}
						<TextField id="lastName" label="Last Name" sx={{width: '200px'}} onChange={(e) => { setLastName(e.target.value); }} value={lastName} />
					</Grid>

					<Grid item>
						{/* Username Textbox */}
						<TextField id="username" label="Username" sx={{width: '200px'}} onChange={(e) => { setUsername(e.target.value); }} value={username} />
					</Grid>

					<Grid item>
						{/* Password Textbox */}
						<TextField id="password" label="Password" type={ "password"} sx={{width: '200px'}} onChange={(e) => { setPassword(e.target.value); }} value={password}/>
					</Grid>
					
					<Grid item>
						{/* Confirm Password Textbox */}
						<TextField id="comfirmPassword" label="Confirm Password" type={ "password"} sx={{width: '200px'}} onChange={(e) => { setConfirmPassword(e.target.value); }} value={confirmPassword}/>
					</Grid>

					<Grid item>
						{/* Email Textbox */}
						<TextField id="email" label="Email" sx={{width: '275px'}} onChange={(e) => { setEmail(e.target.value); }} value={email} />
					</Grid>

					<Grid item>
						{/* Phone number textbox */}
						<TextField id="phoneNumber" label="Phone Number" sx={{width: '275px'}} value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value); }} />
					</Grid>

					<Grid item>
						{/* Address Line 1 Textbox */}
						<TextField id="address1" label="Address Line 1" sx={{width: '416px'}} onChange={(e) => { setAddress1(e.target.value); }} value={address1} />
					</Grid>

					<Grid item>
						{/* Address Line 2 Textbox */}
						<TextField id="address2" label="Address Line 2" sx={{width: '416px'}} onChange={(e) => { setAddress2(e.target.value); }} value={address2} />
					</Grid>

					<Grid item>
						{/* City Textbox */}
						<TextField id="city" label="City" sx={{width: '150px'}} onChange={(e) => { setCity(e.target.value); }} value={city} />
					</Grid>

					<Grid item>
						{/* State select box: will need to add all the states in a more efficient way */}
						<FormControl sx={{ minWidth: 175 }}>
							<InputLabel id="stateSelectLabel">State</InputLabel>
							<Select  labelId="stateSelectLabel" id="stateSelect" value={state} label="State" onChange={(e) => { setState(e.target.value); }} >
								<MenuItem value={"SC"}>South Carolina</MenuItem>
								<MenuItem value={"NC"}>North Carolina</MenuItem>
								<MenuItem value={"GA"}>Georgia</MenuItem>
							</Select>
						</FormControl>

					</Grid>

					<Grid item>
						{/* Zip Textbox */}
						<TextField id="zip" label="Zip" sx={{width: '150px'}} onChange={(e) => { setZip(e.target.value); }} value={zip} />
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