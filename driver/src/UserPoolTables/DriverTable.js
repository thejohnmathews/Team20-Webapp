import * as React from 'react';
import {Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button} from '@mui/material';
import ProfilePopup from '../ProfilePopUps/DriverProfilePopUp'
import AddDriver from '../AddUserPopups/AddDriverPopup'
import BaseURL from '../BaseURL'

export default function DriverTable({permission, sponsorID}) {
  const [open, setOpen] = React.useState(false);
	const [userSub, setUserSub] = React.useState(-1);
  const [addDriverOpen, setAddDriverOpen] = React.useState(false);
  const [driverList, setDriverList] = React.useState([]);

  const callback = () => {
    updateRows();
  }

  React.useEffect(() => {
		updateRows();
	}, []);

	const updateRows = () => {
		fetch(BaseURL + '/driverList', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({orgID: sponsorID})
		})
		.then(response => {
			if (response.ok) { 
				return response.json();
			} 
			else { console.error('Failed to retrieve'); }
		})
		.then(data => {
			setDriverList(data)
			
		})
		.catch(error => {
			console.error('Error retrieving successfully:', error);
		});
	};

  const removeUser = (userID) => {
    const url = new URL(BaseURL + "/removeDriver");
    url.searchParams.append('userID', userID);

    fetch(url)
    .then(res => res.json())
    .then(data => updateRows())
    .catch(err => console.log(err));
}

  const removeUserFromSponsor = (userID) => {
    const url = new URL(BaseURL + "/removeDriverFromSponsor");
    url.searchParams.append('userID', userID);
    url.searchParams.append('sponsorOrgID', sponsorID);

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

  const handleAddDriver = () => {
    setAddDriverOpen(true);
  };

  const handleCloseAddDriver = () => {
    setAddDriverOpen(false);
    // updateRows();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              {permission === 'admin' && <TableCell align="right">Sub</TableCell>}
              <TableCell align="right">Name</TableCell>
              {permission === 'admin' && <TableCell align="right">Sponsor</TableCell>}
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {driverList.map((row) => (
              <TableRow
                key={row.userID}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.userID}
                </TableCell>
                {permission === 'admin' && <TableCell align="right">{(row.sub !== null && row.sub !== undefined && row.sub !== '') ? row.sub : "Cognito account not created"}</TableCell> }
                <TableCell align="right">{row.firstName === null ? " " : row.firstName + " " + row.lastName}</TableCell>
                {permission === 'admin' && (
                    <TableCell align="right">
                        {row.organization_names && row.organization_names.split(',').join(', ')}
                    </TableCell>
                )}
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
      { open && <ProfilePopup sub={userSub} open={open} handleClose={handleClose} permission={permission}/> }

      <Button variant="contained" color="primary" onClick={handleAddDriver} style={{ marginTop: '20px' }}>Add Driver</Button>
      { addDriverOpen && <AddDriver inherited={sponsorID} open={addDriverOpen} handleClose={handleCloseAddDriver} callback={callback} /> }
    </div>
  );
}
