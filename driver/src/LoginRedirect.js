import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress  } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFetchUserAttributes} from './CognitoAPI';

export default function LoginRedirect() {

	const [userSub, setUserSub] = useState(null)

	const userAttributes = useFetchUserAttributes();
	const navigate = useNavigate();

	useEffect(() => {
		const setUserSubIfNotNull = () => {
			if (userAttributes !== null) {
				setUserSub(userAttributes.sub);
				console.log(userSub);
			} else {
				setTimeout(setUserSubIfNotNull, 1000); // Retry after 1 second
			}
		};
	
		setUserSubIfNotNull();
	}, [userAttributes]);
	
	useEffect(() => {
        if (userSub !== null) {
            fetch('https://team20.cpsc4911.com/userAttributes', {
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
				else if(data.userData.userType === "Driver"){ navigate('/driverProfile'); }
				else if(data.userData.userType === "Sponsor"){ navigate('/sponsorProfile'); }
				else if(data.userData.userType === "Admin"){ navigate('/adminProfile'); }
				else { console.log("error logging in user type: " + data.userData.userType); }
			})
            .catch(error => {
                console.error('Error:', error);
            });
        }
    }, [userSub]);

	return(
		<Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
			<CircularProgress/>
		</Grid>
	);
}