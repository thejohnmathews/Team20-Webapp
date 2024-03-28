import React, { useState, useEffect } from 'react';
import { TextField, Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button, Dialog, DialogActions, DialogTitle, DialogContent, FormControl, InputLabel, MenuItem, Select, Grid} from '@mui/material';
import AddSponsor from '../AddUserPopups/AddSponsorPopup';
import BaseURL from '../BaseURL';

export default function SponsorTable({ sponsorID }) {
	const [addReason, setAddReason] = useState(false);
	const [goodReasons, setGoodReasons] = useState([]);
	const [badReasons, setBadReasons] = useState([]);
	const [selectedID, setSelectedID] = useState('');
	const [selectedDescription, setSelectedDescription] = useState('');
	const [newDescription, setNewDescription] = useState('');
	const [editBehavior, setEditBehavior] = useState(false);
	const [newReasonType, setNewReasonType] = useState('');

	const callback = () => {
		updateRows();
	}

	useEffect(() => {
		updateRows()
	}, []);

	const updateRows = () => {
		getGoodReasons();
		getBadReasons();
	};

	const getGoodReasons = () => {
        const url = new URL(BaseURL + "/goodReasons");
        url.searchParams.append('sponsorOrgID', sponsorID);

        fetch(url)
        .then(res => res.json())
        .then(data => setGoodReasons(data))
        .catch(err => console.log(err));
    }

    const getBadReasons = () => {
        const url = new URL(BaseURL + "/badReasons");
        url.searchParams.append('sponsorOrgID', sponsorID);

        fetch(url)
        .then(res => res.json())
        .then(data => setBadReasons(data))
        .catch(err => console.log(err));
    }

	const handleAddReason = (type) => { 
		setAddReason(true); 
		setNewReasonType(type);
	};
	const handleCloseAddReason = () => { setAddReason(false); };

	const handleSaveAddReason = () => { 
		fetch(BaseURL + '/addReason', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({description:newDescription, type:newReasonType, sponsorID:sponsorID})
		  })
		  .then(response => {
			if (response.ok) { 
				updateRows();
				setAddReason(false); 
				setNewDescription('');
			  return response.json();
			} 
			else { console.error('Failed to insert'); }
		  })
		  .catch(error => {
			console.error('Error inserting successfully:', error);
		  });
	};

	const handleEditReason = (ID, description) => {
		setEditBehavior(true);
		setSelectedID(ID);
		setSelectedDescription(description);
	}

	const handleEditClose = () => {
		setEditBehavior(false);
		setSelectedDescription('');
	}

	const handleEditSave = () => {
		fetch(BaseURL + '/updateReason', {
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json'
			},
			body: JSON.stringify({description:selectedDescription, ID:selectedID })
		  })
		  .then(response => {
			if (response.ok) { 
				updateRows();
				setEditBehavior(false);
				setSelectedDescription('');
			  return response.json();
			} 
			else { console.error('Failed to update'); }
		  })
		  .catch(error => {
			console.error('Error updating successfully:', error);
		  });
	}
	
  return (
	<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
	{goodReasons && goodReasons.length ? (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
			<TableCell align="left" style={{ fontWeight: 'bold' }}>Description</TableCell>
			<TableCell align="right" style={{ fontWeight: 'bold' }}>Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {goodReasons.map((row) => (
            <TableRow
              key={row.reasonID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
				<TableCell component="th" scope="row">{row.reasonString}</TableCell>
				<TableCell align="right">
					<Button variant="contained" color="primary" onClick={() => handleEditReason(row.reasonID, row.reasonString)}>Edit Description</Button>
				</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
	) : <p>No reasons available.</p>}
	<Button variant="contained" color="primary" onClick={() => handleAddReason('good')} style={{ marginTop: '20px' }}>Add Good Behavior</Button>

	<br/>

	{badReasons && badReasons.length ? (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
			<TableCell align="left" style={{ fontWeight: 'bold' }}>Description</TableCell>
			<TableCell align="right" style={{ fontWeight: 'bold' }}>Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {badReasons.map((row) => (
            <TableRow
              key={row.reasonID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
				<TableCell component="th" scope="row">{row.reasonString}</TableCell>
				<TableCell align="right">
					<Button variant="contained" color="primary" onClick={() => handleEditReason(row.reasonID, row.reasonString)}>Edit Description</Button>
				</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
	) : <p>No reasons available.</p>}
	
	<Button variant="contained" color="primary" onClick={() => handleAddReason('bad')} style={{ marginTop: '20px' }}>Add Bad Behavior</Button>
    
	{addReason && 
		<Dialog
		open={addReason}
		onClose={handleCloseAddReason}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
	  >
		<DialogTitle id="alert-dialog-title"> Add Behavior </DialogTitle>
		<br />
		<DialogContent>
		  <Grid container spacing={2}>
			<Grid item xs={12}>
			  <TextField
				label="Description"
				fullWidth
				value={newDescription}
				onChange={(e) => setNewDescription(e.target.value)}
			  />
			</Grid>
		  </Grid>
		</DialogContent>
		<DialogActions>
		  <Grid container justifyContent="flex-start">
			<Grid item>
			  <Button sx={{ color: 'red' }} onClick={handleCloseAddReason}>Close</Button>
			</Grid>
		  </Grid>
		  <Button onClick={handleSaveAddReason}>Save</Button>
		</DialogActions>
	  </Dialog>
	}

	{ editBehavior && 
		<Dialog
		open={editBehavior}
		onClose={handleEditClose}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
	  >
		<DialogTitle id="alert-dialog-title"> Edit Behavior Description </DialogTitle>
		<br />
		<DialogContent>
		  <Grid container spacing={2}>
			<Grid item xs={12}>
			  <TextField
				label="Description"
				fullWidth
				value={selectedDescription}
				onChange={(e) => setSelectedDescription(e.target.value)}
			  />
			</Grid>
		  </Grid>
		</DialogContent>
		<DialogActions>
		  <Grid container justifyContent="flex-start">
			<Grid item>
			  <Button sx={{ color: 'red' }} onClick={handleEditClose}>Close</Button>
			</Grid>
		  </Grid>
		  <Button onClick={handleEditSave}>Save</Button>
		</DialogActions>
	  </Dialog>
	}
	</div>
  );
}