import SponsorAppBar from './SponsorAppBar';
import React, { useEffect, useState } from 'react'; 
import BaseURL from '../BaseURL'
import { useFetchUserAttributes } from '../CognitoAPI';
import "../App.css";
import { Box, Tabs, Tab, Typography, Container } from '@mui/material';
import {Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button} from '@mui/material';
import { csv } from '../ConvertCSV';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export default function SponsorReports() {
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
    const [loading, setLoading] = React.useState(true);
    const [loginAttempts, setLoginAttempts] = React.useState([]);
    const [loginAttemptsDesc, setLoginAttemptsDesc] = React.useState([]);
    const [passwordChange, setPasswordChange] = React.useState([]);
    const [passwordChangeDesc, setPasswordChangeDesc] = React.useState([]);
    const [driverApp, setDriverApp] = React.useState([]);
    const [driverAppDesc, setDriverAppDesc] = React.useState([]);
    const [dateOrder, setDateOrder] = React.useState(true)
    
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
    
    // get the sponsor first using the user sub
    useEffect(() => {
        if (userAttributes && sponsorOrgID === null) {
            getAssociatedSponsor();
        }
    }, [userAttributes]); 

    // once the sponsor is set get the audit info
    useEffect(() => {
        if(sponsorOrgID != null){
            getLoginAttempts();
            getPasswordChange();
            getDriverAppInfo();
        }
    
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
        const url = new URL(BaseURL + "/passwordChange");
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
          body: JSON.stringify({sub: userAttributes.sub})
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
        })
        .catch(error => {
          console.error('Error retrieving successfully:', error);
        });
    }

//BELOW ARE USED FOR POINT TRACKING REPORTING
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
      

        return (
          <div>
              <SponsorAppBar/>
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
                                <TableCell align="right">{row.loginSuccess}</TableCell>
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
                                <TableCell align="right">{row.loginSuccess}</TableCell>
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
                              <Button style={{marginBottom: "30px"}}onClick={sortRowsByDriverName}>Sort by Driver Name ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
                              <div style={{ position: 'absolute', marginTop: '10px', right: '40px' }}>
                                  <a href='#' onClick={() => csv(passwordChange)}>Download as CSV</a>
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
                        </div>
                    </Container>
                  
                  </TabPanel>
              </Container>
          </div>
          );
}