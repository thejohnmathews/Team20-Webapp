import React, { useEffect, useState, useRef } from 'react';
import { TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button, Container, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PointPage from "../PointPage";
import DriverAppBar from "./DriverAppBar";
import { useFetchUserAttributes, handleUpdateUserAttributes } from '../CognitoAPI';
import { Grid, Typography, Box, TextField, Stack, Divider } from '@mui/material';
import BaseURL from "../BaseURL";
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Chart from 'chart.js/auto';


export default function DriverPoints({ inheritedSub }){
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [sponsorOrgName, setSponsorOrgName] = useState('');
    const [username, setUsername] = useState('');
    const [changes, setChanges] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startAmount, setStartAmount] = useState('');
    const [endAmount, setEndAmount] = useState('');
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [activeFilter, setActiveFilter] = useState('date'); // 'date' or 'points'

    const userAttributes = useFetchUserAttributes();

    useEffect(() => {
        if (userAttributes) { getUserInfo(); }
    }, [userAttributes]);

    useEffect(() => {
        updateRows();
    }, []);

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

    const updateRows = () => {
        fetch(BaseURL + '/pointChanges', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (response.ok) { 
                return response.json();
            } 
            else { 
                throw new Error('Failed to retrieve data'); 
            }
        })
        .then(data => {
            console.log(data);
            setChanges(data);
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

    const [sortDirectionDate, setSortDirectionDate] = useState('asc'); // 'asc' or 'desc'
    const [sortDirectionPoint, setSortDirectionPoint] = useState('asc'); // 'asc' or 'desc'
    const sortRowsByDate = () => {
        const sortedList = [...changes].sort((a, b) => {
            const dateA = new Date(a['Date (M/D/Y)']);
            const dateB = new Date(b['Date (M/D/Y)']);
            return sortDirectionDate === 'asc' ? dateA - dateB : dateB - dateA;
        });
        setChanges(sortedList);
        setSortDirectionDate(sortDirectionDate === 'asc' ? 'desc' : 'asc');
    };
  
    const sortRowsByChangePointAmt = () => {
        const sortedList = [...changes].sort((a, b) => {
            return sortDirectionPoint === 'asc' ? a['Points Added/Reduced'] - b['Points Added/Reduced'] : b['Points Added/Reduced'] - a['Points Added/Reduced'];
        });
        setChanges(sortedList);
        setSortDirectionPoint(sortDirectionPoint === 'asc' ? 'desc' : 'asc');
    };

    const handleFilterDialogOpen = () => {
        setOpenFilterDialog(true);
    };

    const handleFilterDialogClose = () => {
        setOpenFilterDialog(false);
    };

    const applyDateRangeFilter = () => {
        // Filter the changes by the date range
        const filteredList = changes.filter(change => {
            const changeDate = new Date(change['Date (M/D/Y)']);
            return changeDate >= new Date(startDate) && changeDate <= new Date(endDate);
        });
        setChanges(filteredList); // Update the state with filtered data
    };

    const applyPointAmountFilter = () => {
        // Filter the changes by the point amount range
        const filteredList = changes.filter(change => {
            const pointsAddedReduced = parseInt(change['Points Added/Reduced']);
            return pointsAddedReduced >= parseInt(startAmount) && pointsAddedReduced <= parseInt(endAmount);
        });
        setChanges(filteredList); // Update the state with filtered data
    };

    const clearDateFilter = () => {
        setStartDate('');
        setEndDate('');
        updateRows(); // Reset the data back to its original state
    };

    const clearPointAmountFilter = () => {
        setStartAmount('');
        setEndAmount('');
        updateRows(); // Reset the data back to its original state
    };

    const canvasRef = useRef(null); // Create a ref for the canvas element
    const chartRef = useRef(null); // Create a ref for the Chart instance
    const generatedColors = [];

    useEffect(() => {
        if (canvasRef.current) {
            if (chartRef.current) {
                // If a Chart instance already exists, destroy it
                chartRef.current.destroy();
            }
    
            const ctx = canvasRef.current.getContext('2d');
            const uniqueSponsors = [...new Set(changes.map(change => change['Sponsor Name']))];
            const datasets = [];
    
            uniqueSponsors.forEach(sponsorName => {
                const filteredChanges = changes.filter(change => change['Driver Name'] === `${firstName} ${lastName}` && change['Sponsor Name'] === sponsorName);
    
                datasets.push({
                    label: sponsorName,
                    data: filteredChanges.map(change => ({
                        x: new Date(change['Date (M/D/Y)']).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
                        y: parseInt(change['Total Points'])
                    })),
                    borderColor: getRandomColorWithTracking(), // You can define this function to generate random colors
                    pointBackgroundColor: 'white', // Set point background color to white
                    //pointBorderColor: 'black', // Set point border color to black
                    pointBorderWidth: 3, // Set point border width
                    pointRadius: 5, // Increase point radius for better visibility
                    tension: 0.1
                });
            });
    
            chartRef.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: datasets
                }
            });
        }
    }, [changes, firstName, lastName]);
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    const getRandomColorWithTracking = () => {
        let color = getRandomColor(); // Get a random color
    
        // Ensure the generated color is unique
        while (generatedColors.includes(color)) {
            color = getRandomColor(); // If the color is not unique, generate a new one
        }
    
        // Add the generated color to the array
        generatedColors.push(color);
    
        return color;
    };

    return (
        <div>
            <DriverAppBar inheritedSub={inheritedSub}/>
            <PointPage />
            <br />
            <Container>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}> */}
                    <Paper elevation={8} sx={{ padding: '40px', width: '95%', backgroundColor: '#f5f5f5', position: 'relative' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h4" fontWeight="bold">
                                Point Change Log
                            </Typography>
                            <Grid container spacing={2} justifyContent={'center'}>
                        <Grid item>
                            <Button onClick={sortRowsByDate}>
                                Sort by Date ({sortDirectionDate === 'asc' ? '▲' : '▼'})
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={sortRowsByChangePointAmt}>
                                Sort by Point Change Amount ({sortDirectionPoint === 'asc' ? '▲' : '▼'})
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button onClick={handleFilterDialogOpen}>Filter</Button>
                        </Grid>
                    </Grid>
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
                                    if (change['Driver Name'] === `${firstName} ${lastName}`) {
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
                                    else {
                                        return null;
                                    }
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                        </div>
                    </Paper>
                {/* </Box> */}
                    <div style={{ marginTop: '20px', marginBottom: '50px', width: '100%' }}>
                        <canvas ref={canvasRef}></canvas>
                    </div>
                </div>
            </Container>

            {/* Date Range and Point Amount Filter Dialog */}
            <Dialog open={openFilterDialog} onClose={handleFilterDialogClose}>
                <DialogTitle>{activeFilter === 'date' ? 'Filter by Date Range' : 'Filter by Point Amount'}</DialogTitle>
                <DialogContent>
                    <div>
                        {activeFilter === 'date' ? (
                            <>
                                <TextField
                                    id="start-date"
                                    label="Start Date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{ // Add InputProps for the clear button
                                        endAdornment: (
                                            <IconButton
                                                aria-label="clear start date"
                                                onClick={() => {clearDateFilter(); updateRows();}} // Clear the value when clicked
                                                size="small"
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        ),
                                    }}
                                    style={{ marginTop: '20px' }}
                                />
                                <TextField
                                    id="end-date"
                                    label="End Date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{ // Add InputProps for the clear button
                                        endAdornment: (
                                            <IconButton
                                                aria-label="clear end date"
                                                onClick={() => {clearDateFilter(); updateRows();}}  // Clear the value when clicked
                                                size="small"
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        ),
                                    }}
                                    style={{ marginTop: '20px' }}
                                />
                            </>
                        ) : (
                            <>
                                <TextField
                                    id="start-amount"
                                    label="Start Amount"
                                    type="number"
                                    value={startAmount}
                                    onChange={(e) => setStartAmount(e.target.value)}
                                    InputProps={{
                                        inputProps: { min: 0 },
                                    }}
                                    style={{ marginTop: '20px' }}
                                />
                                <TextField
                                    id="end-amount"
                                    label="End Amount"
                                    type="number"
                                    value={endAmount}
                                    onChange={(e) => setEndAmount(e.target.value)}
                                    InputProps={{
                                        inputProps: { min: 0 },
                                    }}
                                    style={{ marginTop: '20px' }}
                                />
                            </>
                        )}
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFilterDialogClose}>Cancel</Button>
                    <Button onClick={() => setActiveFilter('date')}>Filter by Date</Button>
                    <Button onClick={() => setActiveFilter('points')}>Filter by Points</Button>
                    {activeFilter === 'date' ? (
                        <>
                            <Button onClick={applyDateRangeFilter}>Apply</Button>
                            <Button onClick={clearDateFilter}>Clear</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={applyPointAmountFilter}>Apply</Button>
                            <Button onClick={clearPointAmountFilter}>Clear</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </div>
    );
}