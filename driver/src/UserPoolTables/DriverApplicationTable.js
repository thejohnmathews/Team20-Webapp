import React, { useState, useEffect } from 'react';
import { TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button, Container, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import AdminAppBar from '../AdminPortal/AdminAppBar';
import SponsorAppBar from '../SponsorPortal/SponsorAppBar';
import DriverProfilePopUp from '../ProfilePopUps/DriverProfilePopUp'
import BaseURL from '../BaseURL';
import { useFetchUserAttributes } from '../CognitoAPI';

export default function DriverApplicationTable({permissions}) {
  const [viewProfile, setViewProfile] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [appList, setAppList] = useState([]);
  const [sponsorOrgID, setSponsorOrgID] = React.useState(null);
  const [userSub, setUserSub] = useState(-1);
  const [loading, setLoading] = React.useState(true);


  const userAttributes = useFetchUserAttributes();

  useEffect(() => {
	if (permissions === 'Sponsor'){
		if (userAttributes && sponsorOrgID === null) {
			getAssociatedSponsor();
		  }
	}
	else{
		setSponsorOrgID(-1);
	}
  }, [userAttributes]); 

  useEffect(() => {
	if(sponsorOrgID != null){
		setLoading(true);
		updateRows();
	} else { setLoading(true) }
  }, [sponsorOrgID]); 


  const getAssociatedSponsor = () => {
    fetch(BaseURL + '/associatedSponsor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({sub: userAttributes.sub})
    })
    .then(response => {
      if (response.ok) { 
        return response.json();
      } 
      else { console.error('Failed to post'); }
    })
    .then(data => {
      console.log(data[0].sponsorOrgID);
      setSponsorOrgID(data[0].sponsorOrgID);			
    })
    .catch(error => {
      console.error('Error retrieving successfully:', error);
    });
    
  }
  

	useEffect(() => {
		if (refresh == true) {
			setViewProfile(true);
		} 
	}, [refresh]);

	const updateRows = () => {
		fetch(BaseURL + '/driverApplications', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({orgID: sponsorOrgID})
		})
		.then(response => {
			if (response.ok) { 
				console.log('lists retrieved successfully'); 
				return response.json();
			} 
			else { console.error('Failed to retrieve'); }
		})
		.then(data => {
			console.log(data);
			setAppList(data)
			
		})
		.catch(error => {
			console.error('Error retrieving successfully:', error);
		});
	};


  const handleStatusChange = (appID, status, userID, sponsorID) => {
    fetch(BaseURL + '/updateApplicationStatus', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({appID, status, userID, sponsorID})
	})
	.then(response => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	})
	.then(data => {
		// Handle successful response
		console.log(data);
		updateRows();
	})
	.catch(error => {
		// Handle error
		console.error('There was a problem with the POST request:', error);
	});
  };

  const handleView = (sub) => {
	setUserSub(sub);
	setRefresh(true);
  };

  const handleCloseView = () => {
    setViewProfile(false);
	setRefresh(false);
	updateRows();
  };

  	const trimmedDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});

  return (
	<div>
		{permissions === 'Admin' && <AdminAppBar/>}
		{permissions === 'Sponsor' && <SponsorAppBar/>}
		<br></br>
		<Container>
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
				<TableRow>
					<TableCell>Application ID</TableCell>
					<TableCell>User ID</TableCell>
					<TableCell align="right">Name</TableCell>
					<TableCell align="right">Sponsor</TableCell>
					<TableCell align="right">Date Submitted (M/D/Y)</TableCell>
					<TableCell align="right">Application Status</TableCell>
					<TableCell align="right">Status Reason</TableCell>
					<TableCell align="right">View Profile</TableCell>
				</TableRow>
				</TableHead>
				<TableBody>
					{appList.map((appRow) => (
						<TableRow
						key={appRow.applicationID}
						sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row"> {appRow.applicationID} </TableCell>
							<TableCell align="right">{appRow.userID}</TableCell>
							<TableCell align="right">{appRow.firstName + " " + appRow.lastName}</TableCell>
							<TableCell align="right">{appRow.sponsorOrgName}</TableCell>
							<TableCell align="right">{trimmedDate(appRow.dateOfApplication)}</TableCell>
							<TableCell align="right"> 
							<FormControl>
								<InputLabel id="status-label">Status</InputLabel>
								<Select
									labelId="status-label"
									id="status-select"
									value={appRow.applicationStatus}
									onChange={(event) => handleStatusChange(appRow.applicationID, event.target.value, appRow.userID, appRow.sponsorOrgID)}
									label="Status"
								>
									<MenuItem value="Submitted">Submitted</MenuItem>
									<MenuItem value="Under Review">Under Review</MenuItem>
									<MenuItem value="Rejected">Rejected</MenuItem>
									<MenuItem value="Revoked">Revoked</MenuItem>
									<MenuItem value="Accepted">Accepted</MenuItem>
								</Select>
							</FormControl>
							</TableCell>
							<TableCell align="right">{appRow.statusReason}</TableCell>
							<TableCell align="right"> 
								<Button variant="contained" color="primary" onClick={() => handleView(appRow.sub)}>View/Edit Profile</Button> 
							</TableCell>
							
						</TableRow>
					))}
				</TableBody>
			</Table>
			</TableContainer>
			{ viewProfile && <DriverProfilePopUp sub={userSub} open={viewProfile} handleClose={handleCloseView} permission={'admin'}/> }
			</div>

		</Container>
	</div>
	);
}