import React, { useEffect, useState } from 'react';
import { CircularProgress, Paper, Table, Divider, CardContent, CardHeader, Grid, Typography, Box, Container, TableContainer, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { useFetchUserAttributes } from '../CognitoAPI';
import BaseURL from '../BaseURL';

export default function DriverApplicationStatusPage(){
	const [applications, setApplications] = useState(null)
	const userAttributes = useFetchUserAttributes();
	const [loading, setLoading] = useState(true);


	const trimmedDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});

	useEffect(() => {
        if (userAttributes && applications === null) {
            const url = new URL(BaseURL + "/singleDriverApplications");
			url.searchParams.append('sub', userAttributes.sub);

			fetch(url)
			.then(res => res.json())
			.then(data => {
				setApplications(data);
				setLoading(false);
			})
			.catch(err => console.log(err));
        }
    }, [userAttributes]); 

	return(
		<div>
			{loading && <CircularProgress/>}
			{!loading && 
				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
					<Paper elevation={8} sx={{ padding: '40px', width: '100%', backgroundColor: '#f5f5f5', position: 'relative' }}>
					<Typography variant="h4" fontWeight="bold">
						My Applications
					</Typography>
					<Divider />
					<br/>
						<Container>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<TableContainer component={Paper}>
							<Table sx={{ minWidth: 650 }} aria-label="simple table">
								<TableHead>
								<TableRow>
									{/* <TableCell align="right">Name</TableCell> */}
									<TableCell align="Left" style={{ fontWeight: 'bold' }}>Sponsor</TableCell>
									<TableCell align="right" style={{ fontWeight: 'bold' }}>Date Submitted (M/D/Y)</TableCell>
									<TableCell align="right" style={{ fontWeight: 'bold' }}>Application Status</TableCell>
									<TableCell align="right" style={{ fontWeight: 'bold' }}>Status Reason</TableCell>
								</TableRow>
								</TableHead>
								<TableBody>
									{applications.map((appRow) => (
										<TableRow
										key={appRow.applicationID}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											{/* <TableCell align="right">{appRow.firstName + " " + appRow.lastName}</TableCell> */}
											<TableCell align="Left">{appRow.sponsorOrgName}</TableCell>
											<TableCell align="right">{trimmedDate(appRow.dateOfApplication)}</TableCell>
											<TableCell align="right">{appRow.applicationStatus}</TableCell>
											<TableCell align="right">{appRow.statusReason === "" ? "N/A" : appRow.statusReason}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
							</TableContainer>
							</div>
						</Container>
					</Paper>
				</Box>
			}
		</div>
	);
}