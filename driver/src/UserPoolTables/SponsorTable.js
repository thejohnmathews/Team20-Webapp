import * as React from 'react';
import {Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button} from '@mui/material';
import ProfilePopUp from '../ProfilePopUps/SponsorProfilePopup';
import AddSponsor from '../AddUserPopups/AddSponsorPopup'


function createData(id, username, sponsor, email) {
  return { id, username, sponsor, email };
}

const rows = [
  createData(1, "uname1", "Sponsor1", "email1"),
  createData(2, "uname2", "Sponsor1", "email2"),
  createData(3, "uname3", "Sponsor2", "email3"),
  createData(4, "uname4", "Sponsor2", "email4"),
  createData(5, "uname5", "Sponsor3", "email5"),
];

export default function SponsorTable(permission) {
	const [open, setOpen] = React.useState(false);
	const [userID, setUserID] = React.useState(-1);
	const [addSponsorOpen, setAddSponsorOpen] = React.useState(false);

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
	  };
	
  return (
	<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell align="right">Username</TableCell>
            <TableCell align="right">Sponsor</TableCell>
            <TableCell align="right">Email</TableCell>
			<TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
				<TableCell component="th" scope="row">
					{row.id}
				</TableCell>
				<TableCell align="right">{row.username}</TableCell>
				<TableCell align="right">{row.sponsor}</TableCell>
				<TableCell align="right">{row.email}</TableCell>
				<TableCell align="right">
					<Button variant="contained" color="primary" onClick={() => handleClickOpen(row.id)}>View/Edit Profile</Button>
				</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
	{ open && <ProfilePopUp userID={userID} open={open} handleClose={handleClose} permission={permission} /> }
	
	<Button variant="contained" color="primary" onClick={handleAddSponsor} style={{ marginTop: '20px' }}>Add Sponsor</Button>
    { addSponsorOpen && <AddSponsor open={addSponsorOpen} handleClose={handleCloseAddSponsor}/> }
	</div>
  );
}