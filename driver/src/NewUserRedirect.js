import React, { useState } from 'react';
import { Button, Grid, TextField, Card, CardHeader, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function DriverApplicationPage() {
	const [sponsor, setSponsor] = useState(false);
	const [admin, setAdmin] = useState(false);
	const navigate = useNavigate();

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