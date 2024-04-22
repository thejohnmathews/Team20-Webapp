import SponsorAppBar from './SponsorAppBar';
import React, { useEffect, useState, useRef } from 'react'; 
import BaseURL from '../BaseURL'
import { useFetchUserAttributes } from '../CognitoAPI';
import "../App.css";
import { Box, Tabs, Tab, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { TextField, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button, Container, Paper} from '@mui/material';
import { csv } from '../ConvertCSV';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import Chart from 'chart.js/auto';



export default function SponsorReports({inheritedSub}) {
    function TabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
    }
    
    const [value, setValue] = React.useState(0);  
    const [sponsorOrgID, setSponsorOrgID] = React.useState(null);
    const [sponsorOrgName, setSponsorName] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [loginAttempts, setLoginAttempts] = React.useState([]);
    const [loginAttemptsDesc, setLoginAttemptsDesc] = React.useState([]);
    const [passwordChange, setPasswordChange] = React.useState([]);
    const [passwordChangeDesc, setPasswordChangeDesc] = React.useState([]);
    const [driverApp, setDriverApp] = React.useState([]);
    const [driverAppDesc, setDriverAppDesc] = React.useState([]);
    const [dateOrder, setDateOrder] = React.useState(true)
    const [openFilterDialog, setOpenFilterDialog] = useState(false);
    const [activeFilter, setActiveFilter] = useState('date'); // 'date' or 'points'
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startAmount, setStartAmount] = useState('');
    const [endAmount, setEndAmount] = useState('');
    const [passwordChanges, setPasswordChanges] = useState([]);
    
    const userAttributes = useFetchUserAttributes();

    
    useEffect(() => {
        if (userAttributes && sponsorOrgID === null) {
        getAssociatedSponsor();
        }
    }, [userAttributes]); 
    
    useEffect(() => {
        sponsorOrgID != null ? setLoading(false) : setLoading(true);
        
    }, [sponsorOrgID]); 
    
    
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // once the sponsor is set get the audit info
    useEffect(() => {
        if(sponsorOrgID != null){
            getLoginAttempts();
            getPasswordChange();
            getDriverAppInfo();
        }
        updateRows();
        renderChart();
    
    }, [sponsorOrgID]); 

    // get login attempts table
    const getLoginAttempts = () => {
        const url = new URL(BaseURL + "/loginAttempts");
        url.searchParams.append('sponsorOrgID', sponsorOrgID);

        fetch(url)
        .then(res => res.json())
        .then(data => setLoginAttempts(data))
        .then(data => setLoginAttemptsDesc(loginAttempts.reverse()))
        .catch(err => console.log(err));

    }

    //get password change table
    const getPasswordChange = () => {
        const url = new URL(BaseURL + "/getPasswordChange");
        url.searchParams.append('sponsorOrgID', sponsorOrgID);

        fetch(url)
        .then(res => res.json())
        .then(data => setPasswordChange(data))
        .then(data => setPasswordChangeDesc(passwordChange.reverse()))
        .catch(err => console.log(err));
    }

    const getDriverAppInfo = () => {
        const url = new URL(BaseURL + "/driverAppInfo");
        url.searchParams.append('sponsorOrgID', sponsorOrgID);

        fetch(url)
        .then(res => res.json())
        .then(data => setDriverApp(data))
        .then(data => setDriverAppDesc(driverApp.reverse()))
        .catch(err => console.log(err));
    }

    const handleDateChange = () => {
        setDateOrder(!dateOrder)

    }

    const getAssociatedSponsor = () => {
        fetch(BaseURL + '/associatedSponsor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({sub: inheritedSub?.value ? inheritedSub.value : userAttributes.sub})
        })
        .then(response => {
          if (response.ok) { 
            return response.json();
          } 
          else { console.error('Failed to post'); }
        })
        .then(data => {
          console.log(data[0].sponsorOrgID);
          setSponsorOrgID(data[0].sponsorOrgID);	
          console.log("sponsor"+ data[0].sponsorOrgName);
          setSponsorName(data[0].sponsorOrgName);		
        })
        .catch(error => {
          console.error('Error retrieving successfully:', error);
        });
    }


//BELOW ARE USED FOR POINT TRACKING REPORTING
    const [changes, setChanges] = useState([]);
    const [changeTypes, setChangeTypes] = useState([]);

    const updateRows = () => {
        fetch(BaseURL + '/pointChanges', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => {
            if (response.ok) { 
                //console.log('lists retrieved successfully'); 
                return response.json();
            } 
            else { 
                throw new Error('Failed to retrieve data'); 
            }
        })
        .then(data => {
          if(Array.isArray(data)){
            /*
            console.log(data)
            console.log("sponsor" + sponsorOrgID)
            const filteredChanges = data.filter(change => {
              console.log("change: " + change['Sponsor ID']); // Log the Sponsor ID value
              return change['Sponsor ID'] === sponsorOrgID;
            });*/
            
            //const filteredChanges = data.filter(change => change['Sponsor Name'] === sponsorOrgName);
            if(!sponsorOrgName){
              setChanges(data);
            }
            else{
              const filteredChanges = data.filter(change => change['Sponsor Name'] === sponsorOrgName);
              setChanges(filteredChanges);
            }
          }
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

    //used for direction of sort 
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

    const sortRowsByDate = () => {
      const sortedList = [...changes].sort((a, b) => {
          const dateA = new Date(a['Date (M/D/Y)']);
          const dateB = new Date(b['Date (M/D/Y)']);
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
      setChanges(sortedList);
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const sortRowsByChangePointAmt = () => {
        const sortedList = [...changes].sort((a, b) => {
            return sortDirection === 'asc' ? a['Points Added/Reduced'] - b['Points Added/Reduced'] : b['Points Added/Reduced'] - a['Points Added/Reduced'];
        });
        setChanges(sortedList);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const sortRowsByDriverName = () => {
        const sortedList = [...changes].sort((a, b) => {
            const nameA = a['Driver Name'].toUpperCase();
            const nameB = b['Driver Name'].toUpperCase();
            return sortDirection === 'asc' ? (nameA < nameB ? -1 : nameA > nameB ? 1 : 0) : (nameA > nameB ? -1 : nameA < nameB ? 1 : 0);
        });
        setChanges(sortedList);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
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

  const [drivers, setDrivers] = useState("")
  const [selectedDriver, setSelectedDriver] = useState("");
  useEffect(() => {
      fetch(BaseURL + "/activeDrivers")
      .then(res => res.json())
      .then(data => {
          // Store the fetched driver data in state
          setDrivers(data);
      })
      .catch(err => console.error('Error fetching driver data:', err));
  }, []);

  const handleDriverChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedDriver(selectedValue);
    //console.log("selectedDriver: " + selectedDriver);
    applyDriverFilter(selectedValue); 
  }

  // Define a new state to hold the filtered changes
  const [filteredChanges, setFilteredChanges] = useState([]);
  // Function to apply the driver filter
  const applyDriverFilter = (selectedDriverValue) => {
    // If no driver is selected, set filteredChanges to the original changes
    if (!selectedDriverValue) {
        console.log("no driver selected");
        setFilteredChanges(changes);
        return;
    }
    // Filter the changes based on the selected driver name
    const filteredList = changes.filter(change => {
      const driverName = change['Driver Name'];
      return driverName === selectedDriverValue;
    });
    console.log(filteredList);

    // Update the filtered changes with the filtered list
    setChanges(filteredList);
  };
  const clearNameFilter = () => {
    setSelectedDriver(null)
    updateRows();
  };
  useEffect(() => {
    renderChart();
  })

  //CHARTS
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const generatedColors = [];
  const MIN_CONTRAST = 5;
  const MAX_ATTEMPTS = 100000;
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const getRandomColorWithTracking = () => {
    let attempts = 0;
    let color;

    do {
        color = getRandomColor();
        const luminance = calculateLuminance(color);
        const hasSufficientContrast = !generatedColors.some(existingColor => calculateContrastRatio(luminance, existingColor) < MIN_CONTRAST);


        if (hasSufficientContrast) {
            generatedColors.push(color);
            return color; // Return the color if it has sufficient contrast
        }

        attempts++;
    } while (attempts < MAX_ATTEMPTS);

    console.error("Failed to generate a color with sufficient contrast after", MAX_ATTEMPTS, "attempts.");
    // If MAX_ATTEMPTS is reached without finding a suitable color, log an error and return a default color
    const isGrayIncluded = generatedColors.some(existingColor => existingColor === '#A9A9A9');

    // If gray is not included, add it to the generatedColors array
    if (!isGrayIncluded) {
        generatedColors.push('#A9A9A9');
        return '#A9A9A9'; // Return white
    }

    // If white is already included, return a default color
    return getRandomColor(); // Fallback to black if no suitable color is found
  };
  const calculateLuminance = (color) => {
    const rgb = parseInt(color.substring(1), 16); // Convert hex to RGB
    const r = (rgb >> 16) & 0xff; // Extract red channel
    const g = (rgb >> 8) & 0xff; // Extract green channel
    const b = (rgb >> 0) & 0xff; // Extract blue channel
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; // Calculate luminance
  };
  const calculateContrastRatio = (luminance1, color2) => {
    const luminance2 = calculateLuminance(color2);
    const brighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    return (brighter + 0.05) / (darker + 0.05); // Calculate contrast ratio with a small adjustment
  };
  const renderChart = () => {
    if (Array.isArray(changes) && changes.length > 0 && canvasRef.current) {
      if (chartRef.current) {
        // If a chart exists, destroy it before creating a new one
        chartRef.current.destroy();
      }
      // Get the canvas context
        const ctx = canvasRef.current.getContext('2d');
        // Group changes by driver name
        const groupedChanges = {};
        changes.forEach(change => {
            const driverName = change['Driver Name'];
            if (!groupedChanges[driverName]) {
                groupedChanges[driverName] = [];
            }
            groupedChanges[driverName].push(change);
        });
        // Create datasets for each driver
        const datasets = [];
        Object.entries(groupedChanges).forEach(([driverName, driverChanges]) => {
            datasets.push({
                label: driverName,
                data: driverChanges.map(change => ({
                  x: new Date(change['Date (M/D/Y)']).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' }),
                  y: parseInt(change['Total Points'])
                })),     
                borderColor: getRandomColorWithTracking(), // Define a function to generate random colors
                //borderWidth: 1,
                pointBackgroundColor: 'white', // Set point background color to white
                //pointBorderColor: 'black', // Set point border color to black
                pointBorderWidth: 3, // Set point border width
                pointRadius: 5, // Increase point radius for better visibility
                tension: 0.1
            });
            
        });
        // Create the chart
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                //labels: changes.map(change => new Date(change['Date (M/D/Y)']).toLocaleDateString()),
                datasets: datasets
            }
        });
        // Return a cleanup function to destroy the chart when the component unmounts
        return () => {
            chart.destroy();
        };
    }
  };
      
        return (
          <div>
              <SponsorAppBar inheritedSub={inheritedSub}/>
              <Container>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                          <Tab label="Login Attempts" />
                          <Tab label="Driver Applications" />
                          <Tab label="Password Changes" />
                          <Tab label="Driver Point Changes"/>
                      </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                      {!loading && loginAttempts.length > 0 &&  
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Username</TableCell>
                                {dateOrder &&
                                <TableCell align="center">
                                    Date
                                    <ArrowDropUpIcon sx={{position: "absolute", marginTop: "2px"}} cursor="pointer" onClick={() => handleDateChange()}/>
                                </TableCell>
                                }
                                {!dateOrder &&
                                <TableCell align="center">
                                    Date
                                    <ArrowDropDownIcon cursor="pointer" sx={{position: "absolute", marginTop: "2px"}} onClick={() => handleDateChange()}/>
                                </TableCell>
                                }
                              <TableCell align="right">Success</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dateOrder && loginAttempts.map((row) => (
                              <TableRow
                                key={row.loginAttemptID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.userName}
                                </TableCell>
                                <TableCell align="center">{row.loginAttemptDate}</TableCell>
                                <TableCell align="right">{row.success}</TableCell>
                              </TableRow> 
                            ))}
                            {!dateOrder && loginAttemptsDesc.map((row) => (
                              <TableRow
                                key={row.loginAttemptID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.userName}
                                </TableCell>
                                <TableCell align="center">{row.loginAttemptDate}</TableCell>
                                <TableCell align="right">{row.success}</TableCell>
                              </TableRow> 
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <br></br>
                      <a href='#' onClick={() => csv(loginAttempts)}>Download as CSV</a>
                    </div>
                      }
                      {!loading && loginAttempts.length == 0 && 
                      <div>
                      <p align="center">No data to display.</p>
                      </div>}
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                  {!loading && driverApp.length > 0 && 
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Username</TableCell>
                              {dateOrder &&
                                <TableCell align="center">
                                    Date of Application
                                    <ArrowDropUpIcon sx={{position: "absolute", marginTop: "2px"}} cursor="pointer" onClick={() => handleDateChange()}/>
                                </TableCell>
                                }
                                {!dateOrder &&
                                <TableCell align="center">
                                    Date of Application
                                    <ArrowDropDownIcon cursor="pointer" sx={{position: "absolute", marginTop: "2px"}} onClick={() => handleDateChange()}/>
                                </TableCell>
                                }
                              <TableCell align="center">Application Status</TableCell>
                              <TableCell align="center">Status Reason</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dateOrder && driverApp.map((row) => (
                              <TableRow
                                key={row.applicationID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell align="center">{row.userUsername}</TableCell>
                                <TableCell align="center">{row.dateOfApplication}</TableCell>
                                <TableCell align="center">{row.applicationStatus}</TableCell>
                                <TableCell align="center">{row.statusReason}</TableCell>
                              </TableRow> 
                            ))}
                            {!dateOrder && driverAppDesc.map((row) => (
                              <TableRow
                                key={row.applicationID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell align="center">{row.userUsername}</TableCell>
                                <TableCell align="center">{row.dateOfApplication}</TableCell>
                                <TableCell align="center">{row.applicationStatus}</TableCell>
                                <TableCell align="center">{row.statusReason}</TableCell>
                              </TableRow> 
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <br></br>
                      <a href='#' onClick={() => csv(driverApp)}>Download as CSV</a>
                    </div>
                      }
                      {!loading && driverApp.length == 0 && 
                      <div>
                      <p align="center">No data to display.</p>
                      </div>}
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                  {!loading && passwordChange.length > 0 && 
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell align="center">Username</TableCell>
                              {dateOrder &&
                                <TableCell align="center">
                                    Date
                                    <ArrowDropUpIcon sx={{position: "absolute", marginTop: "2px"}} cursor="pointer" onClick={() => handleDateChange()}/>
                                </TableCell>
                                }
                                {!dateOrder &&
                                <TableCell align="center">
                                    Date
                                    <ArrowDropDownIcon cursor="pointer" sx={{position: "absolute", marginTop: "2px"}} onClick={() => handleDateChange()}/>
                                </TableCell>
                                }
                              <TableCell align="right">Type of Change</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dateOrder && passwordChange.map((row) => (
                              <TableRow
                                key={row.passwordChangeID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.userID}
                                </TableCell>
                                <TableCell align="center">{row.changeDate}</TableCell>
                                <TableCell align="right">Password Reset</TableCell>
                              </TableRow> 
                            ))}
                            {!dateOrder && passwordChangeDesc.map((row) => (
                              <TableRow
                                key={row.passwordChangeID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.userID}
                                </TableCell>
                                <TableCell align="center">{row.changeDate}</TableCell>
                                <TableCell align="right">Password Reset</TableCell>
                              </TableRow> 
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <br></br>
                      <a href='#' onClick={() => csv(passwordChange)}>Download as CSV</a>
                    </div>
                      }
                      {!loading && passwordChange.length == 0 && 
                      <div>
                      <p align="center">No data to display.</p>
                      </div>}
                  </TabPanel>
                  <TabPanel value={value} index={3}>
                    <br></br>
                    <Container>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <h1 style={{marginTop: "0px", marginBottom: "20px"}}> Driver Point Change Tracking</h1>
                              <Button onClick={sortRowsByDate}>Sort by Date ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
                              <Button onClick={sortRowsByChangePointAmt}>Sort by Point Change Amount ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
                              <Button style={{marginBottom: "10px"}}onClick={sortRowsByDriverName}>Sort by Driver Name ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
                              <div style={{ position: 'absolute', marginTop: '10px', right: '40px' }}>
                                  <a href='#' onClick={() => csv(changes)}>Download as CSV</a>
                              </div>
                              <Button onClick={handleFilterDialogOpen}>Filter</Button>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Driver"
                                sx={{minWidth: 200}}
                                value={selectedDriver}
                                onChange={(event) => {
                                  const selectedValue = event.target.value;
                                  setSelectedDriver(selectedValue);
                                  if (selectedValue === '') {
                                      clearNameFilter();
                                  } else {
                                      applyDriverFilter(selectedValue);
                                  }
                                }}
                              >
                                <MenuItem value="">All Drivers</MenuItem>
                                {drivers.length > 0 ? (
                                    drivers.map(driver => (
                                        <MenuItem key={driver.userID} value={driver.firstName +" "+ driver.lastName}>
                                            {`${driver.userID} - ${driver.firstName} ${driver.lastName}`}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>
                                        Error: No drivers available
                                    </MenuItem>
                                )}
                            </Select>
                            {filteredChanges.map((change, index) => (
                              <TableRow key={index}>
                                {/* Render table row content */}
                              </TableRow>
                            ))}
                              </div>

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
                                        {changes.map((change, index) => (
                                            <TableRow key={index}>
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? "red" : change['Change Type'] === "good" ? "green" : "yellow"}}>{trimmedDate(change['Date (M/D/Y)'])}</TableCell>
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? 'red' : change['Change Type'] === "good" ? 'green' : 'inherit' }}>{change['Driver Name']}</TableCell>
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? 'red' : change['Change Type'] === "good" ? 'green' : 'inherit' }}>{change['Sponsor Name']}</TableCell>
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? 'red' : change['Change Type'] === "good" ? 'green' : 'inherit' }}>{change['Point Change Reason']}</TableCell>
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? 'red' : change['Change Type'] === "good" ? 'green' : 'inherit' }}>{change['Points Added/Reduced']}</TableCell>                                        
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? 'red' : change['Change Type'] === "good" ? 'green' : 'inherit' }}>{change['Total Points']}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <canvas ref={canvasRef} />                    

                        </div>
                        </Container>
                  
                  </TabPanel>
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
              </Container>
          </div>
          );

} 
