import React, {useEffect, useState} from 'react';
import { TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button, Container, Paper, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import AdminAppBar from './AdminAppBar';
import BaseURL from '../BaseURL';

export default function AdminPointChanges({permissions}){

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

  
    return (
      <div>
          {permissions === 'Admin' && <AdminAppBar/>}
          <br></br>
          <Container>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1> Point Change Log</h1>
              <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                  <TableRow>
                      <TableCell>Driver ID</TableCell>
                      <TableCell align="right">Driver Name</TableCell>
                      <TableCell align="right">Sponsor Name</TableCell>
                      <TableCell align="right">Date of Point Change (M/D/Y)</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Point Change Reason</TableCell>
                  </TableRow>
                  </TableHead>
                  <TableBody>
                      {appList.map((appRow) => (
                          <TableRow
                          key={appRow.applicationID}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                              <TableCell component="th" scope="row"> {appRow.driverID} </TableCell>
                              <TableCell align="right">{appRow.firstName} {appRow.lastName}</TableCell>
                              <TableCell align="right">{appRow.sponsorOrgName}</TableCell>
                              <TableCell align="right">{trimmedDate(appRow.changeDate)}</TableCell>
                              <TableCell align="right">{appRow.changePointAmt}</TableCell>
                              <TableCell align="right">{appRow.reasonString}</TableCell>
                              <TableCell align="right"> 
                              </TableCell>
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