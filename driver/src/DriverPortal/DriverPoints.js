import React, { useEffect, useState } from 'react';
import { TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button, Container, Paper } from '@mui/material';
import PointPage from "../PointPage";
import DriverAppBar from "./DriverAppBar";
import { useFetchUserAttributes, handleUpdateUserAttributes } from '../CognitoAPI';
import { Grid, Typography, Box, TextField, Stack, Divider } from '@mui/material';
import BaseURL from "../BaseURL";

export default function DriverPoints({ inheritedSub }){
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [sponsorOrgName, setSponsorOrgName] = useState('');
    const [username, setUsername] = useState('');

    const userAttributes = useFetchUserAttributes();

    useEffect(() => {
        if (userAttributes) { getUserInfo(); }
    }, [userAttributes]);

    const getUserInfo = () => {
        getAssociatedSponsor(); 
        getDriverInfo();
    }
    

    const setUserAttributes = (user) => {
        setAddress(user.driverAddress);
        setPhoneNumber(user.userPhoneNumber);
        setEmail(user.email);
        setLastName(user.lastName);
        setFirstName(user.firstName);
        setUsername(user.userUsername);
        console.log(firstName)
        console.log(lastName)
    }
    const getAssociatedSponsor = () => {
        fetch(BaseURL + "/driverAssociatedSponsor", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({sub: inheritedSub?.value2 ? inheritedSub.value2 : userAttributes.sub})
        })
        .then(response => {
        if (response.ok) { 
            return response.json();
        } 
        else { console.error('Failed to post'); }
        })
        .then(data => {
        console.log(data);
        setSponsorOrgName(data);	
        })
        .catch(error => {
        console.error('Error retrieving successfully:', error);
        });
        
      }
      const getDriverInfo = () => {
        fetch(BaseURL + '/driverInfoFromSub', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sub: inheritedSub?.value2 ? inheritedSub.value2 : userAttributes.sub })
        })
        .then(response => {
          if (response.ok) { 
            return response.json();
          } 
          else { console.error('Failed to get user'); }
        })
        .then(data => {
          setUserAttributes(data[0]);
        })
        .catch(error => {
          console.error('Failed to get user:', error);
        });
      }




    const [changes, setChanges] = useState([]);
    const [changeTypes, setChangeTypes] = useState([]);

    useEffect(() => {
        updateRows();
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
            else { 
                throw new Error('Failed to retrieve data'); 
            }
        })
        .then(data => {
            console.log(data);
            setChanges(data);
            console.log(Array.isArray(data));
        })
        .catch(error => {
            console.error('Error retrieving data:', error);
        });
    };

    const trimmedDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const sortRowsByDate = () => {
        // Sort the changes by date
        const sortedList = [...changes].sort((a, b) => new Date(a['Date (M/D/Y)']) - new Date(b['Date (M/D/Y)']));
        setChanges(sortedList);
    };

    const sortRowsByChangePointAmt = () => {
        // Sort the changes by changePointAmt
        const sortedList = [...changes].sort((a, b) => a['Points Added/Reduced'] - b['Points Added/Reduced']);
        setChanges(sortedList);
    };

    return(
        <div>
            <DriverAppBar/>
            <PointPage/>
        
            <br></br>
            <Container>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h1> Point Change Log</h1>
                    <Button onClick={sortRowsByDate}>Sort by Date</Button>
                    <Button onClick={sortRowsByChangePointAmt}>Sort by Point Change Amount</Button>
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
                                {changes.map((change, index) => {
                                    if(change['Driver Name'] === `${firstName} ${lastName}`){
                                        return (
                                            <TableRow key={index}>
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? "red" : change['Change Type'] === "good" ? "green" : "yellow"}}>{trimmedDate(change['Date (M/D/Y)'])}</TableCell>
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? 'red' : change['Change Type'] === "good" ? 'green' : 'inherit' }}>{change['Driver Name']}</TableCell>
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? 'red' : change['Change Type'] === "good" ? 'green' : 'inherit' }}>{change['Sponsor Name']}</TableCell>
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? 'red' : change['Change Type'] === "good" ? 'green' : 'inherit' }}>{change['Point Change Reason']}</TableCell>
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? 'red' : change['Change Type'] === "good" ? 'green' : 'inherit' }}>{change['Points Added/Reduced']}</TableCell>                                        
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? 'red' : change['Change Type'] === "good" ? 'green' : 'inherit' }}>{change['Total Points']}</TableCell>
                                            </TableRow>
                                        );
                                    }
                                    else{
                                        return null;
                                    }
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Container>
        </div>
    );
}