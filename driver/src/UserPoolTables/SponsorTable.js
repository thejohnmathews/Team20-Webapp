import React, { useState, useEffect } from 'react';
import {Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button} from '@mui/material';
import ProfilePopUp from '../ProfilePopUps/SponsorProfilePopup';
import AddSponsor from '../AddUserPopups/AddSponsorPopup';
import BaseURL from '../BaseURL';

export default function SponsorTable({permission, sponsorID}) {
	const [open, setOpen] = React.useState(false);
	const [userID, setUserID] = React.useState(-1);
	const [addSponsorOpen, setAddSponsorOpen] = React.useState(false);
	const [sponsorList, setSponsorList] = React.useState([]);

	const callback = () => {
		updateRows();
	}

	useEffect(() => {
		updateRows()
	}, []);
	const updateRows = () => {
		fetch(BaseURL + '/sponsorList', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({orgID: sponsorID})
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
			setSponsorList(data)
			
		})
		.catch(error => {
			console.error('Error retrieving successfully:', error);
		});
	};

	const handleClickOpen = (userID) => {
		setUserID(userID);
		setOpen(true);
	};
	
	const handleClose = () => {
		setOpen(false);
		setUserID(-1);
	};

	const handleAddSponsor = () => {
		setAddSponsorOpen(true);
	  };
	
	  const handleCloseAddSponsor = () => {
		setAddSponsorOpen(false);
		updateRows();
	  };
	
  return (
	<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
	{sponsorList && sponsorList.length ? (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell align="right">Sub</TableCell>
			{permission === 'admin' && <TableCell align="right">Sponsor</TableCell>}
            <TableCell align="right">Email</TableCell>
			<TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sponsorList.map((row) => (
            <TableRow
              key={row.userID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
				<TableCell component="th" scope="row"> {row.userID} </TableCell>
				<TableCell align="right">{(row.sub !== null && row.sub !== undefined && row.sub !== '') ? row.sub : "Cognito account not created"}</TableCell>
				{permission === 'admin' && <TableCell align="right">{row.SponsorOrgName}</TableCell>}
				<TableCell align="right">{row.email}</TableCell>
				<TableCell align="right">
					<Button variant="contained" color="primary" onClick={() => handleClickOpen(row.id)}>View/Edit Profile</Button>
				</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
	) : <p>No sponsors available.</p>}
	{ open && <ProfilePopUp userID={userID} open={open} handleClose={handleClose} permission={permission} /> }
	
	<Button variant="contained" color="primary" onClick={handleAddSponsor} style={{ marginTop: '20px' }}>Add Sponsor</Button>
    { addSponsorOpen && <AddSponsor inherited={sponsorID} open={addSponsorOpen} handleClose={handleCloseAddSponsor} callback={callback} /> }
	</div>
  );
}