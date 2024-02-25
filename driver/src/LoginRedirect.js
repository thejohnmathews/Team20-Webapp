import React, { useState } from 'react';
import { Grid, Card, CardHeader, Button, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LoginRedirect() {

	const [isDriver, setIsDriver] = useState(false);
  	const [isAccepted, setIsAccepted] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isSponsor, setIsSponsor] = useState(false);

	const navigate = useNavigate();

	const handleDriverClick = () => {
		setIsDriver(true);
		setIsAccepted(true);
	  };
	
	  const handleAdminClick = () => {
		setIsAdmin(true);
	  };
	
	  const handleSponsorClick = () => {
		setIsSponsor(true);
	  };

	if(isDriver){
		if(isAccepted){
			navigate('/driverProfile');
		}
		else{
			navigate('/driverApplicationStatus');
		}
	}
	else if (isAdmin){
		navigate('/adminProfile');
	}
	else if(isSponsor){
		navigate('/sponsorProfile');
	}

	return(
		<Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
			<Card sx={{ minWidth: 275, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<CardHeader title="Temp manual login"></CardHeader>
				<CardContent>
				<Button onClick={handleDriverClick}>Driver</Button>
				<Button onClick={handleAdminClick}>Admin</Button>
				<Button onClick={handleSponsorClick}>Sponsor</Button>
				</CardContent>
			</Card>
		</Grid>
		// <CircularProgress/>
	);
}