import React, { useState, useEffect } from 'react';
import {Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button} from '@mui/material';
import ProfilePopUp from '../ProfilePopUps/SponsorProfilePopup';
import AddSponsor from '../AddUserPopups/AddSponsorPopup';
import BaseURL from '../BaseURL';

export default function SponsorTable({permission, sponsorID}) {
	const [open, setOpen] = React.useState(false);
	const [userSub, setUserSub] = React.useState(-1);
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

	const removeUser = (userID) => {
        const url = new URL(BaseURL + "/removeSponsor");
        url.searchParams.append('userID', userID);

        fetch(url)
        .then(res => res.json())
        .then(data => updateRows())
        .catch(err => console.log(err));
    }

	const handleClickOpen = (sub) => {
		setUserSub(sub);
		setOpen(true);
	};
	
	const handleClose = () => {
		setOpen(false);
		setUserSub(-1);
		updateRows();
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
            {permission === 'admin' && <TableCell align="center">Sub</TableCell>}
			<TableCell align="center">Name</TableCell>
			{permission === 'admin' && <TableCell align="center">Sponsor</TableCell>}
            <TableCell align="center">Email</TableCell>
			<TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sponsorList.map((row) => (
            <TableRow
              key={row.userID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
				<TableCell component="th" scope="row"> {row.userID} </TableCell>
				{permission === 'admin' && <TableCell align="right">{(row.sub !== null && row.sub !== undefined && row.sub !== '') ? row.sub : "Cognito account not created"}</TableCell>}
				<TableCell component="th" scope="row"> {row.firstName === null ? ' ' : row.firstName + " " + row.lastName} </TableCell>
				{permission === 'admin' && <TableCell align="right">{row.SponsorOrgName}</TableCell>}
				<TableCell align="right">{row.email}</TableCell>
				<TableCell align="right">
					{permission === 'admin' ? (
						<div style={{ display: 'flex', flexDirection: 'column' }}>
							<div style={{ marginBottom: '8px', width: '100%' }}>
								<Button variant="contained" color="primary" fullWidth onClick={() => handleClickOpen(row.sub)}>View/Edit Profile</Button>
							</div>
							<div style={{ width: '100%' }}>
								<Button variant="contained" style={{ backgroundColor: '#d32f2f' }} fullWidth onClick={() => removeUser(row.userID)}>Delete Account</Button>
							</div>
						</div>
					
					) : (
						<>
							<Button variant="contained" color="primary" onClick={() => handleClickOpen(row.sub)}>View/Edit Profile</Button>
							<Button variant="contained" style={{ backgroundColor: '#d32f2f', marginLeft: '8px' }} onClick={() => removeUser(row.userID)}>Delete Account</Button>
						</>
					)}
				</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
	) : <p>No sponsors available.</p>}
	{ open && <ProfilePopUp sub={userSub} open={open} handleClose={handleClose} permission={permission} /> }
	
	<Button variant="contained" color="primary" onClick={handleAddSponsor} style={{ marginTop: '20px' }}>Add Sponsor</Button>
    { addSponsorOpen && <AddSponsor inherited={sponsorID} open={addSponsorOpen} handleClose={handleCloseAddSponsor} callback={callback} /> }
	</div>
  );
}