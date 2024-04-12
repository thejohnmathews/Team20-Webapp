import React, { useState, useEffect } from 'react';
import {Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button} from '@mui/material';
import ProfilePopup from '../ProfilePopUps/AdminProfilePopup';
import AddAdmin from '../AddUserPopups/AddAdminPopup'
import BaseURL from '../BaseURL'

export default function AdminTable({refresh, setRefresh}) {
	const [open, setOpen] = React.useState(false);
	const [userSub, setUserSub] = React.useState(-1);
	const [addAdminOpen, setAddAdminOpen] = React.useState(false);
	const [adminList, setAdminList] = useState([]);

  	const callback = () => {
		updateRows();
	}

  	useEffect(() => {
		updateRows()
	}, []);

	const removeUser = (userID) => {
        const url = new URL(BaseURL + "/removeAdmin");
        url.searchParams.append('userID', userID);

        fetch(url)
        .then(res => res.json())
        .then(data => updateRows())
        .catch(err => console.log(err));
    }

const updateRows = () => {
		fetch(BaseURL + '/adminList', {
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
			setAdminList(data)
			
		})
		.catch(error => {
			console.error('Error retrieving successfully:', error);
		});
	};

	const handleClickOpen = (sub) => {
		setUserSub(sub);
		setOpen(true);
	};
	
	const handleClose = () => {
		setOpen(false);
		setUserSub(-1);
		updateRows();
	};

  const handleAddAdmin = () => {
    setAddAdminOpen(true);
  };

  const handleCloseAddAdmin = () => {
    setAddAdminOpen(false);
    updateRows();
    setRefresh(!refresh)
  };
	
  	return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell align="center">Sub</TableCell>
			<TableCell align="center">Name</TableCell>
            <TableCell align="center">Email</TableCell>
			<TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {adminList.map((adminRow) => (
            <TableRow
              key={adminRow.userID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
        		<TableCell component="th" scope="row"> {adminRow.userID} </TableCell>
				<TableCell align="right">{adminRow.sub === null ? "Cognito Account not created" : adminRow.sub}</TableCell>
				<TableCell align="right">{adminRow.firstName === null ? " " : adminRow.firstName + " " + adminRow.lastName}</TableCell>
				<TableCell align="right">{adminRow.email}</TableCell>
				<TableCell align="right">
					<Button variant="contained" color="primary" onClick={() => handleClickOpen(adminRow.sub)}>View/Edit Profile</Button>
					<Button variant="contained" style={{ backgroundColor: '#d32f2f', marginLeft: '8px' }} onClick={() => removeUser(adminRow.userID)}>Delete Account</Button>
				</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    { open && <ProfilePopup sub={userSub} open={open} handleClose={handleClose}/> }
    
    <Button variant="contained" color="primary" onClick={handleAddAdmin} style={{ marginTop: '20px' }}>Add Admin</Button>
    { addAdminOpen && <AddAdmin open={addAdminOpen} handleClose={handleCloseAddAdmin} callback={callback}/> }
    </div>
  );
}