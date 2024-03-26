import React, { useEffect, useState } from 'react';
import { TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button, Container, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import PointPage from "../PointPage";
import DriverAppBar from "./DriverAppBar";
import BaseURL from "../BaseURL"

export default function DriverPoints(){
	const [data, setData] = useState([])
	useEffect(() => {
		fetch("https://team20.cpsc4911.com/About")
		.then(res => res.json())
		.then(data => setData(data[0]))
		.catch(err => console.log(err));
  	}, [])

	  useEffect(() => {
        updateRows()
    }, []);

  
    const [refresh, setRefresh] = React.useState(false);
    const [appList, setAppList] = useState([]);
    const [userSub, setUserSub] = useState(-1);
    
    useEffect(() => {
        updateRows()
    }, []);

    const updateRows = () => {
        fetch(BaseURL + '/pointChanges', {
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
            setAppList(data)
            
        })
        .catch(error => {
            console.error('Error retrieving successfully:', error);
        });
    };

    const trimmedDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

	return(
		<div>
			<DriverAppBar/>
			<PointPage/>
		
			<br></br>
			<Container>
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<h1> Point Change Log</h1>
				<TableContainer component={Paper}>
				<Table sx={{ minWidth: 650 }} aria-label="simple table">
					<TableHead>
					<TableRow>
						<TableCell>Date (M/D/Y)</TableCell>
						<TableCell>Driver Name</TableCell>
						<TableCell>Sponsor Name</TableCell>
						<TableCell>Point Change Reason</TableCell>
						<TableCell>Points Added/Reduced</TableCell>
						<TableCell>Total Points</TableCell>
					</TableRow>
					</TableHead>
					<TableBody>
						{appList.map((appRow) => (
							<TableRow
							key={appRow.applicationID}
							sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell component="th" scope="row" >{trimmedDate(appRow.changeDate)}</TableCell>
								<TableCell>{appRow.firstName} {appRow.lastName}</TableCell>
								<TableCell>{appRow.sponsorOrgName}</TableCell>
								<TableCell>{appRow.reasonString}</TableCell>
								<TableCell>{appRow.changePointAmt}</TableCell>
								<TableCell>~</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				</TableContainer>
				</div>
	
			</Container>
		</div>
		);
}