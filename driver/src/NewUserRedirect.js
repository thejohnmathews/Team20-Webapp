import React, { useState, useEffect } from 'react';
import { Button, Grid, Card, CardHeader, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BaseURL from './BaseURL'
import { useFetchUserAttributes} from './CognitoAPI';

export default function NewUserRedirect() {
	const [sponsor, setSponsor] = useState(false);
	const [admin, setAdmin] = useState(false);
	const userAttributes = useFetchUserAttributes();
	const navigate = useNavigate();

	// searches the db to see if somone already added the user on the admin/sponsor portals
	// if so it adds their info from cognito to current db entry if not, creates a new db entry with cognito info
	const checkEmailInDB = () => {
		if(userAttributes !== null){
			fetch(BaseURL + '/userExistsFromEmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: userAttributes.email})
            })
			.then(response => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json(); 
			})
            .then(data => {
				// check if the user exists from email in RDS, if not insert info into userinfo, 
				// if so add info to the user then navigate back to login redirect
				if(!data.userExists){ insertNewUser(); }
				else { 
					if(data.userData.sub === null){
						updateExistingDBUser(data.userData.userID); 
					}
				}
			})
            .catch(error => {
                console.error('Error:', error);
            });
		}
	}

	const insertNewUser = () => {
		fetch(BaseURL + '/addUser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			//Add address and phone number 
			body: JSON.stringify({sub:userAttributes.sub, email:userAttributes.email, firstName:userAttributes.given_name, lastName:userAttributes.family_name, userUsername:userAttributes.preferred_username})
		})
		.then(response => {
			if (response.ok) { return response.json(); 
     	 	} else { console.error('Failed to post'); }
		})
		.catch(error => {
			console.error('Error retrieving successfully:', error);
		});
	}

	const updateExistingDBUser = (id) => {
		fetch(BaseURL + '/newCognitoExistingDB', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({sub:userAttributes.sub, id:id, firstName:userAttributes.given_name, lastName:userAttributes.family_name, userUsername:userAttributes.preferred_username})
		})
		.then(response => {
			if (response.ok) { 
				navigate('/');
				return response.json(); 
     	 	} else { console.error('Failed to post'); }
		})
		.catch(error => {
			console.error('Error retrieving successfully:', error);
		});
	}

	useEffect(() => {
		if(userAttributes !== null){ checkEmailInDB(); }
	}, [userAttributes]);

	const hanldeDriver = () => {
		navigate('/driverApplication');
	}
	
	const hanldeSponsor = () => {
		setSponsor(true);
	}
	const hanldeSponsorClose = () => {
		setSponsor(false);
	}

	const hanldeAdmin = () => {
		setAdmin(true);
	}

	const hanldeAdminClose = () => {
		setAdmin(false);
	}
	

	
	return (
		<Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
		  {/* card that everything is placed in */}
		  <Card raised='true' sx={{ width: 500, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
			<CardHeader title="Select User Type"> </CardHeader>
	
			{/* everything in the card */}
			<CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<Grid container spacing={2} direction="row" alignItems={'center'} >
					<Grid item>
						<Button id="submit" variant="contained" onClick={hanldeDriver}>Driver</Button>
					</Grid>
					<Grid item>
						<Button id="submit" variant="contained" onClick={hanldeSponsor}>Sponsor</Button>
					</Grid>
					<Grid item>
						<Button id="submit" variant="contained" onClick={hanldeAdmin}>Admin</Button>
					</Grid>	
				</Grid>
			</CardContent>
			{ sponsor && <Dialog
				open={sponsor}
				onClose={hanldeSponsorClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Contact a Sponsor"}</DialogTitle>
				<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Please contact a sponsor or admin to get your account set up.
				</DialogContentText>
				</DialogContent>
				<DialogActions>
				<Button onClick={hanldeSponsorClose} autoFocus>
					Close
				</Button>
				</DialogActions>
			</Dialog>}
			{ admin && <Dialog
				open={admin}
				onClose={hanldeSponsorClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{"Contact an Admin"}</DialogTitle>
				<DialogContent>
				<DialogContentText id="alert-dialog-description">
					Please contact an admin to get your account set up.
				</DialogContentText>
				</DialogContent>
				<DialogActions>
				<Button onClick={hanldeAdminClose} autoFocus>
					Close
				</Button>
				</DialogActions>
			</Dialog>}
	
		  </Card>
		</Grid>
	)
}