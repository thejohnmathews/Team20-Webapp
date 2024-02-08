import React, { useState } from 'react';
import { Button, Grid, TextField, Card, CardHeader, CardContent, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';

export default function ForgotUsernamePage() {
	const [email, setEmail] = useState("");

	function sendUsername(){
		console.log(email);
	}

	return (
		<Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
		  {/* card that everything is placed in */}
		  <Card sx={{ minWidth: 275, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
			<CardHeader title="Forgot Username"> </CardHeader>
	
			{/* everything in the card */}
			<CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

				{/* Email text box */}
				<TextField id="email" label="Enter Email" sx={{width: '275px'}} onChange={(e) => { setEmail(e.target.value); }} value={email}
					InputProps={{
					startAdornment: (
						<InputAdornment position="start">
						<EmailIcon />
						</InputAdornment>
					),
					}}
				/>
				
				<br></br>

				{/* Send Username Button */}
				<Button id="reset" variant="contained" onClick={sendUsername}>Send Username</Button>

			</CardContent>
	
		  </Card>
		</Grid>
	)
}