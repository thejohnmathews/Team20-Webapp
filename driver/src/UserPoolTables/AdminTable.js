import * as React from 'react';
import {Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button} from '@mui/material';
import ProfilePopup from '../ProfilePopUps/AdminProfilePopup';
import AddAdmin from '../AddUserPopups/AddAdminPopup'

function createData(id, username, email) {
  return { id, username, email };
}

const rows = [
  createData(1, "uname1", "email1"),
  createData(2, "uname2", "email2"),
  createData(3, "uname3", "email3"),
  createData(4, "uname4", "email4"),
  createData(5, "uname5", "email5"),
];

export default function AdminTable() {
	const [open, setOpen] = React.useState(false);
	const [userID, setUserID] = React.useState(-1);
  const [addAdminOpen, setAddAdminOpen] = React.useState(false);

	const handleClickOpen = (userID) => {
		setUserID(userID);
		setOpen(true);
	};
	
	const handleClose = () => {
		setOpen(false);
		setUserID(-1);
	};

  const handleAddAdmin = () => {
    setAddAdminOpen(true);
  };

  const handleCloseAddAdmin = () => {
    setAddAdminOpen(false);
  };
	
  	return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>User ID</TableCell>
            <TableCell align="right">Username</TableCell>
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
				<TableCell align="right">{row.email}</TableCell>
				<TableCell align="right">
						<Button variant="contained" color="primary" onClick={() => handleClickOpen(row.id)}>View/Edit Profile</Button>
				</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    { open && <ProfilePopup userID={userID} open={open} handleClose={handleClose}/> }
    
    <Button variant="contained" color="primary" onClick={handleAddAdmin} style={{ marginTop: '20px' }}>Add Admin</Button>
    { addAdminOpen && <AddAdmin open={addAdminOpen} handleClose={handleCloseAddAdmin}/> }
    </div>
  );
}