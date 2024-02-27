import * as React from 'react';
import {Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button} from '@mui/material';
import ProfilePopup from '../ProfilePopUps/DriverProfilePopUp'
import AddDriver from '../AddUserPopups/AddDriverPopup'

function createData(id, username, sponsor, application, email, points) {
  return { id, username, sponsor, application, email, points };
}

const rows = [
  createData(1, "uname1", "Sponsor1", "Approved" ,"email1", 4.0),
  createData(2, "uname2", "Sponsor1", "Approved" ,"email2", 4.3),
  createData(3, "uname3", "Sponsor2", "Pending" ,"email3", 0),
  createData(4, "uname4", "Sponsor2", "Pending" ,"email4", 0),
  createData(5, "uname5", "Sponsor3", "Rejected" ,"email5", 0),
];

export default function DriverTable() {
  const [open, setOpen] = React.useState(false);
	const [userID, setUserID] = React.useState(-1);
  const [addDriverOpen, setAddDriverOpen] = React.useState(false);

	const handleClickOpen = (userID) => {
		setUserID(userID);
		setOpen(true);
	};
	
	const handleClose = () => {
		setOpen(false);
		setUserID(-1);
	};

  const handleAddDriver = () => {
    setAddDriverOpen(true);
  };

  const handleCloseAddDriver = () => {
    setAddDriverOpen(false);
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
              <TableCell align="right">Application</TableCell>
              <TableCell align="right">Points</TableCell>
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
                <TableCell align="right">{row.application}</TableCell>
                <TableCell align="right">{row.points}</TableCell>
                <TableCell align="right">
                  <Button variant="contained" color="primary" onClick={() => handleClickOpen(row.id)}>View/Edit Profile</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      { open && <ProfilePopup userID={userID} open={open} handleClose={handleClose}/> }

      <Button variant="contained" color="primary" onClick={handleAddDriver} style={{ marginTop: '20px' }}>Add Driver</Button>
      { addDriverOpen && <AddDriver open={addDriverOpen} handleClose={handleCloseAddDriver}/> }
    </div>
  );
}
