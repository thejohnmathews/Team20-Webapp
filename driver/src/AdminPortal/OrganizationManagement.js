import React, { useState, useEffect } from 'react';
import { TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button, Container, Paper } from '@mui/material';
import AdminAppBar from './AdminAppBar';
import AddOrgPopup from '../AddUserPopups/AddOrganizationPopup';
import EditOrgPopup from '../ProfilePopUps/OrganizationPopup';
import { Organization } from '../Pojo';
import BaseURL from '../BaseURL';


function OrganizationManagement() {
  const [addOrg, setAddOrg] = React.useState(false);
  const [viewOrg, setViewOrg] = React.useState(false);
  const [sponsorID, setSponsorID] = React.useState(-1);
  const [orgList, setOrgList] = useState([new Organization()]);
  const [org, setOrg] = useState(new Organization());
  const [isFirstRender, setIsFirstRender] = useState(true);
  

	useEffect(() => {
		updateRows()
	}, []);

	useEffect(() => {
		if (!isFirstRender) {
			setViewOrg(true);
			console.log(org);
		} else {
			setIsFirstRender(false);
		}
	}, [org]);

	const updateRows = () => {
		fetch(BaseURL + '/getAllOrgs', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
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
			if(data){
				setOrgList(data);
			} else {
				setOrgList([]);
			}
			
		})
		.catch(error => {
			console.error('Error retrieving successfully:', error);
		});
	};

  const handleAdd = () => {
    setAddOrg(true);
  };

  const handleCloseAdd = () => {
    setAddOrg(false);
	updateRows();
  };

  const handleView = (organization) => {
	console.log(organization);
	setOrg(organization);
  };

  const handleCloseView = () => {
    setViewOrg(false);
	updateRows();
  };

  return (
	<div>
		<AdminAppBar/>
		<br></br>
		<Container>
		<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<TableContainer component={Paper}>
			<Table sx={{ minWidth: 650 }} aria-label="simple table">
				<TableHead>
				<TableRow>
					<TableCell>ID</TableCell>
					<TableCell align="right">Name</TableCell>
					<TableCell align="right">Description</TableCell>
					<TableCell align="right">Actions</TableCell>
				</TableRow>
				</TableHead>
				<TableBody>
					{orgList.map((orgRow) => (
						<TableRow
						key={orgRow.id}
						sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
						>
							<TableCell component="th" scope="row">
								{orgRow.sponsorOrgID}
							</TableCell>
							<TableCell align="right">{orgRow.sponsorOrgName}</TableCell>
							<TableCell align="right">{orgRow.sponsorOrgDescription}</TableCell>
							<TableCell align="right">
								<Button variant="contained" color="primary" onClick={() => handleView(orgRow)}>View/Edit Profile</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			</TableContainer>
			{ viewOrg && <EditOrgPopup org={org} sponsorID={sponsorID} open={viewOrg} handleClose={handleCloseView}/> }
			
			<Button variant="contained" color="primary" onClick={handleAdd} style={{ marginTop: '20px' }}>Add Organization</Button>
			{ addOrg &&  <AddOrgPopup open={addOrg} handleClose={handleCloseAdd}/> }
			</div>

		</Container>
	</div>
	);
}

export default OrganizationManagement;
