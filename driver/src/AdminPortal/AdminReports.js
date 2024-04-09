import { Heading } from "@aws-amplify/ui-react";
import AdminAppBar from "./AdminAppBar";
import React, { useEffect, useState } from 'react'; 
import { Box, Tabs, Tab, Typography, Container } from '@mui/material';
import {Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button} from '@mui/material';
import { useFetchUserAttributes } from '../CognitoAPI';
import { csv } from '../ConvertCSV';

import BaseURL from "../BaseURL";

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

export default function AdminReports(){
    const [value, setValue] = React.useState(0);  
    const [loading, setLoading] = React.useState(true);
    const [loginAttempts, setLoginAttempts] = React.useState([]);
    const [passwordChange, setPasswordChange] = React.useState([]);
    const [driverApp, setDriverApp] = React.useState([]);
    const [pointChange, setPointChange] = React.useState([]);

    const userAttributes = useFetchUserAttributes();

    useEffect(() => {
        userAttributes != null ? setLoading(false) : setLoading(true);
        
    }, [userAttributes]); 

    useEffect(() => {
        if (userAttributes !== null) {
            getLoginAttempts()
            getPasswordChange()
            getDriverAppInfo()
            getPointChange()
            console.log(pointChange)
            //console.log(loginAttempts)
        }
    }, [userAttributes]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getLoginAttempts = () => {
        const url = new URL(BaseURL + "/allLogins");
        fetch(url)
        .then(res => res.json())
        .then(data => setLoginAttempts(data))
        .catch(err => console.log(err));

    }
    const getPasswordChange = () => {
        const url = new URL(BaseURL + "/allPasswordChanges");

        fetch(url)
        .then(res => res.json())
        .then(data => setPasswordChange(data))
        .catch(err => console.log(err));
    }
    const getDriverAppInfo = () => {
        const url = new URL(BaseURL + "/allDriverApps");

        fetch(url)
        .then(res => res.json())
        .then(data => setDriverApp(data))
        .catch(err => console.log(err));
    }

    const getPointChange = () => {
        const url = new URL(BaseURL + "/pointChanges");

        fetch(url)
        .then(res => res.json())
        .then(data => setPointChange(data))
        .catch(err => console.log(err));
    }

	return(
		<div>
			<AdminAppBar/>
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
                                <TableCell align="center">
                                    Date
                                </TableCell>
                              <TableCell align="right">Success</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {loginAttempts.map((row) => (
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
                                <TableCell align="center">
                                    Date of Application
                                </TableCell>
                              <TableCell align="center">Application Status</TableCell>
                              <TableCell align="center">Status Reason</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {driverApp.map((row) => (
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
                                <TableCell align="center">
                                    Date
                                </TableCell>
                              <TableCell align="right">Type of Change</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {passwordChange.map((row) => (
                              <TableRow
                                key={row.passwordChangeID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.userUsername}
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
                            {/*}
                            <h1 style={{marginTop: "0px", marginBottom: "20px"}}> Driver Point Change Tracking</h1>
                              <Button onClick={sortRowsByDate}>Sort by Date ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
                              <Button onClick={sortRowsByChangePointAmt}>Sort by Point Change Amount ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
                              <Button style={{marginBottom: "30px"}}onClick={sortRowsByDriverName}>Sort by Driver Name ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
                              <div style={{ position: 'absolute', marginTop: '10px', right: '40px' }}>
                                  <a href='#' onClick={() => csv(passwordChange)}>Download as CSV</a>
                              </div>
                            */}
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
                                        {pointChange.map((change, index) => (
                                            <TableRow key={index}>
                                                <TableCell style={{ color: change['Change Type'] === "bad" ? "red" : change['Change Type'] === "good" ? "green" : "yellow"}}>{(change['Date (M/D/Y)'])}</TableCell>
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
                            <br></br>
                      <a href='#' onClick={() => csv(pointChange)}>Download as CSV</a>
                        </div>
                    </Container>
                  
                  </TabPanel>
              </Container>
		</div>
	)
}