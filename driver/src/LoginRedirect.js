import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFetchUserAttributes} from './CognitoAPI';
import BaseURL from './BaseURL'
import DriverApplicationStatus from './DriverPortal/DriverApplicationStatusPage';
import {Application} from './Pojo.js'

export default function LoginRedirect() {

	const [userSub, setUserSub] = useState(null)
	const [username, setUsername] = useState(null)
	const [applicationInProgress, setApplicationInProgress] = useState(false)
	const [loading, setLoading] = useState(true)
	const [application, setApplication] = useState(new Application())
	const userAttributes = useFetchUserAttributes();
	const navigate = useNavigate();

	useEffect(() => {
		const setUserSubIfNotNull = () => {
			if (userAttributes !== null) {
				setUserSub(userAttributes.sub);
				setUsername(userAttributes.preferred_username)
			} else {
				setTimeout(setUserSubIfNotNull, 1000); // Retry after 1 second
			}
		};
	
		setUserSubIfNotNull();
	}, [userAttributes]);

	const checkApplication = (id) => {
		fetch(BaseURL + '/checkDriverApplication/' + id)
		.then(response => {
			if (response.ok) {
				return response.json(); // Parse the JSON response
			} else {
				console.error('Failed to check driver application');
				throw new Error('Failed to check driver application');
			}
		})
		.then(data => {
			console.log(data);
			if (data.hasApplication) {
				// Driver application found
				if (data.application[0].applicationStatus !== "Accepted"){
					setApplicationInProgress(true);
					setLoading(false);
					setApplication(data.application[0]);
				}
				else{
					navigate('/driverProfile');
				}
				// Handle the application data as needed
			} else {
				navigate('/driverProfile');
			}
		})
		.catch(error => {
			console.error('Error checking driver application:', error);
		});
	}
	
	useEffect(() => {
        if (userSub !== null) {
            fetch(BaseURL+'/userAttributes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({sub: userSub})
            })
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json(); 
			})
            .then(data => {
                console.log(data);
				if(data.userExists !== true){ navigate('/newUser'); }
				else if(data.userData.userType === "Driver"){ checkApplication(data.userData.userID); }
				else if(data.userData.userType === "Sponsor"){ navigate('/sponsorProfile'); }
				else if(data.userData.userType === "Admin"){ navigate('/adminProfile'); }
				else { console.log("error logging in user type: " + data.userData.userType); }
			})
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, [userSub]);

	useEffect(() => {
		if (username !== null) {
			fetch(BaseURL+'/loginAudit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: username})
            })
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json(); 
			})
		}
	})

	return(
		<Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
			{ loading && <CircularProgress/>}
			{applicationInProgress && <DriverApplicationStatus application={application}/>}
		</Grid>
	);
}