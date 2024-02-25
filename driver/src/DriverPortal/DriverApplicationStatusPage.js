import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Grid, Typography, Box } from '@mui/material';


export default function DriverApplicationStatusPage(){
	const [sponsorName, setSponsorName] = useState("");
	const [applicationStatus, setApplicationStatus] = useState("Pending");

	useEffect(() => {

		setSponsorName("Sponsor1");
		setApplicationStatus("Pending");
	}, [])


	return(
		<Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
			<Card sx={{ minWidth: 275, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<CardHeader title="Application Status"></CardHeader>
				<CardContent>
					<Box height={20} width={20} my={4} display="flex" alignItems="center" gap={4}>
					
					</Box>
					<Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
						Your current application for {sponsorName} is {applicationStatus}
					</Typography>

				</CardContent>
			</Card>
		</Grid>
		

	);
}