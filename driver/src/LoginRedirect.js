import React, { useState, useEffect } from 'react';
import { CircularProgress  } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function LoginRedirect() {

	const navigate = useNavigate();

	const [isDriver, setIsDriver] = useState(false);
  	const [isAccepted, setIsAccepted] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isSponsor, setIsSponsor] = useState(false);

	// TODO: replace with backend logic to get user type
	useEffect(() => {
		setIsDriver(true);
		setIsAccepted(true);
	}, []);

	
	if(isDriver){
		if(isAccepted){
			navigate('/profile');
		}
		else{
			navigate('/driverApplicationStatus');
		}
	}
	else if (isAdmin){

	}
	else if(isSponsor){

	}

	return(
		<CircularProgress/>
	);
}