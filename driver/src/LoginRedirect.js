import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFetchUserAttributes} from './CognitoAPI';
import BaseURL from './BaseURL'
import DriverApplicationStatus from './DriverPortal/DriverApplicationStatusPage';

export default function LoginRedirect() {

	const [applicationInProgress, setApplicationInProgress] = useState(false)
	const [loading, setLoading] = useState(true)
	const userAttributes = useFetchUserAttributes();
	const navigate = useNavigate();

	useEffect(() => {

		// once the userAttributes are set get their info from RDS
		if(userAttributes !== null){
			fetch(BaseURL+'/userAttributes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({sub: userAttributes.sub})
            })
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json(); 
			})
            .then(data => {
				// check if the user exists in RDS from sub, if not go to new user, if so navigate to correct portal
				if(!data.userExists){ navigate('/newUser'); }
				else if(data.userData.userType === "Driver"){ checkOrg(data.userData.userID); }
				else if(data.userData.userType === "Sponsor"){ navigate('/sponsorProfile'); }
				else if(data.userData.userType === "Admin"){ navigate('/adminProfile'); }
				else { navigate('/newUser'); }
			})
            .catch(error => {
                console.error('Error:', error);
            });

			// login auditing
			fetch(BaseURL+'/loginAudit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: userAttributes.username})
            })
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json(); 
			})
		}
	}, [userAttributes]);

	// check if the user has an organization, if so go to their profile, if not check applications
	const checkOrg = (id) => {
		const url = new URL(BaseURL + "/driverHasOrg");
		url.searchParams.append('userID', id);

		fetch(url)
		.then(res => res.json())
		.then(data => {
			if(data.hasOrg){
				navigate('/driverProfile')
			} else { checkApplication(id); }
		})
		.catch(err => console.log(err));
	}

	// chech if the user has an application, and if they do then remder the application status page
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
			if (data.hasApplication) {
				setApplicationInProgress(true);
				setLoading(false);
			}
		})
		.catch(error => {
			console.error('Error checking driver application:', error);
		});
	}


	return(
		<Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
			{ loading && <CircularProgress/>}
			{applicationInProgress && <DriverApplicationStatus/>}
		</Grid>
	);
}