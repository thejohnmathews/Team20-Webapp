import React from 'react';
import { TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button, Container, Paper } from '@mui/material';
import AdminAppBar from './AdminAppBar';
import AddOrgPopup from '../AddUserPopups/AddOrganizationPopup';

function createData(id, name) {
	return { id, name };
  }
  
  const rows = [
	createData(1, "org1"),
	createData(2, "org2"),
	createData(3, "org3"),
	createData(4, "org4"),
	createData(5, "org5"),
  ];

function OrganizationManagement() {
  const [addOrg, setAddOrg] = React.useState(false);
  const [viewOrg, setViewOrg] = React.useState(false);
  const [userID, setUserID] = React.useState(-1);

  const handleAdd = () => {
    setAddOrg(true);
  };

  const handleCloseAdd = () => {
    setAddOrg(false);
  };

  const handleView = (id) => {
	setUserID(id);
    setViewOrg(true);
  };

  const handleCloseView = () => {
    setViewOrg(false);
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
							<TableCell align="right">{row.name}</TableCell>
							<TableCell align="right">
								<Button variant="contained" color="primary" onClick={() => handleView(row.id)}>View/Edit Profile</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			</TableContainer>
			{/* { viewOrg && <AddOrgPopup userID={userID} open={open} handleClose={handleCloseView}/> } */}
			
			<Button variant="contained" color="primary" onClick={handleAdd} style={{ marginTop: '20px' }}>Add Organization</Button>
			{ addOrg &&  <AddOrgPopup open={addOrg} handleClose={handleCloseAdd}/> }
			</div>

		</Container>
	</div>
	);
}

export default OrganizationManagement;
