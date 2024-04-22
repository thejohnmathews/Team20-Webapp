import { Heading } from "@aws-amplify/ui-react";
import AdminAppBar from "./AdminAppBar";
import React, { useEffect, useState } from 'react'; 
import { Box, Tabs, Tab, Typography, Container } from '@mui/material';
import {Paper, TableRow, TableHead, TableContainer, TextField, TableCell, TableBody, Table, Button} from '@mui/material';
import { useFetchUserAttributes } from '../CognitoAPI';
import { csv } from '../ConvertCSV';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
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
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [dateSelectOpen, setDateSelectOpen] = useState(false)

    const [renderedLogins, setRenderedLogins] = useState([])
    const [renderedDriverApp, setRenderedDriverApp] = useState([])
    const [renderedPasswordChange, setRenderedPasswordChange] = useState([])

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

    useEffect(() => {
      if (loginAttempts !== null) {
          setRenderedLogins(loginAttempts)
          //console.log(loginAttempts)
      }
  }, [loginAttempts]);

  useEffect(() => {
    if (driverApp !== null) {
        setRenderedDriverApp(driverApp)
        //console.log(loginAttempts)
    }
}, [driverApp]);

useEffect(() => {
  if (passwordChange !== null) {
      setRenderedPasswordChange(passwordChange)
      //console.log(loginAttempts)
  }
}, [passwordChange]);

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

    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
    const sortLoginByDate = () => {

      const sortedList = [...loginAttempts].sort((a, b) => {
          const dateA = new Date(a.loginAttemptDate);
          const dateB = new Date(b.loginAttemptDate);
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
      setRenderedLogins(sortedList);
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };
    
    const sortAppByDate = () => {

      const sortedList = [...driverApp].sort((a, b) => {
          const dateA = new Date(a.dateOfApplication);
          const dateB = new Date(b.dateOfApplication);
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
      setRenderedDriverApp(sortedList);
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const sortPassByDate = () => {

      const sortedList = [...passwordChange].sort((a, b) => {
          const dateA = new Date(a.changeDate);
          const dateB = new Date(b.changeDate);
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
      setRenderedPasswordChange(sortedList);
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const sortPointsByDate = () => {

      const sortedList = [...pointChange].sort((a, b) => {
          const dateA = new Date(a['Date (M/D/Y)']);
          const dateB = new Date(b['Date (M/D/Y)']);
          return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      });
      setPointChange(sortedList);
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const handleDateOpen = () => {
      setDateSelectOpen(!dateSelectOpen)
  }

    const handleDateSortLogin = () => {
      //console.log(startDate)
      //console.log(endDate)
      const dateA = new Date(startDate);
      const dateB = new Date(endDate);
      dateA.setDate(dateA.getDate() + 1)
      dateB.setDate(dateB.getDate() + 1)
      console.log(dateA)
      console.log(dateB)
      //if (startDate && endDate) {
          let newList = []
          let checkDate = ""
          for (let i = 0; i < loginAttempts.length; i++) {
              checkDate = new Date(loginAttempts[i].loginAttemptDate)
              console.log("date: " + checkDate)
              if (checkDate >= dateA && checkDate <= dateB) {
                  newList.push(loginAttempts[i])
              }
          }
          setRenderedLogins(newList)
      //}
  }

  const handleDateResetLogin = () => {
    setRenderedLogins(loginAttempts)
  }

  const handleDateSortDriver = () => {
    //console.log(startDate)
    //console.log(endDate)
    const dateA = new Date(startDate);
    const dateB = new Date(endDate);
    dateA.setDate(dateA.getDate() + 1)
    dateB.setDate(dateB.getDate() + 1)
    console.log(dateA)
    console.log(dateB)
    //if (startDate && endDate) {
        let newList = []
        let checkDate = ""
        for (let i = 0; i < driverApp.length; i++) {
            checkDate = new Date(driverApp[i].loginAttemptDate)
            console.log("date: " + checkDate)
            if (checkDate >= dateA && checkDate <= dateB) {
                newList.push(driverApp[i])
            }
        }
        setRenderedDriverApp(newList)
    //}
}

const handleDateResetDriver = () => {
  setRenderedDriverApp(driverApp)
}

const handleDateSortPassword = () => {
  //console.log(startDate)
  //console.log(endDate)
  const dateA = new Date(startDate);
  const dateB = new Date(endDate);
  dateA.setDate(dateA.getDate() + 1)
  dateB.setDate(dateB.getDate() + 1)
  console.log(dateA)
  console.log(dateB)
  //if (startDate && endDate) {
      let newList = []
      let checkDate = ""
      for (let i = 0; i < passwordChange.length; i++) {
          checkDate = new Date(passwordChange[i].loginAttemptDate)
          console.log("date: " + checkDate)
          if (checkDate >= dateA && checkDate <= dateB) {
              newList.push(passwordChange[i])
          }
      }
      setRenderedPasswordChange(newList)
  //}
}

const handleDateResetPassword = () => {
  setRenderedPasswordChange(passwordChange)
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
                      <Button onClick={handleDateOpen}>Select Date Range</Button>
                {dateSelectOpen && 
                    <div>
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
                                        //onClick={handleDateSelect} // Clear the value when clicked
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
                                        //onClick={handleDateSelect}  // Clear the value when clicked
                                        size="small"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                ),
                            }}
                            style={{ marginTop: '20px' }}
                        />
                        <Button onClick={handleDateSortLogin}>SORT</Button>
                        <Button sx={{color: "red"}} onClick={handleDateResetLogin}>RESET</Button>
                    </div>}
                      <Button onClick={sortLoginByDate}>Sort by Date ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
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
                            {renderedLogins.map((row) => (
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
                      <Button onClick={handleDateOpen}>Select Date Range</Button>
                {dateSelectOpen && 
                    <div>
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
                                        //onClick={handleDateSelect} // Clear the value when clicked
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
                                        //onClick={handleDateSelect}  // Clear the value when clicked
                                        size="small"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                ),
                            }}
                            style={{ marginTop: '20px' }}
                        />
                        <Button onClick={handleDateSortDriver}>SORT</Button>
                        <Button sx={{color: "red"}} onClick={handleDateResetDriver}>RESET</Button>
                    </div>}
                      <Button onClick={sortAppByDate}>Sort by Date ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
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
                            {renderedDriverApp.map((row) => (
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
                      <Button onClick={handleDateOpen}>Select Date Range</Button>
                {dateSelectOpen && 
                    <div>
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
                                        //onClick={handleDateSelect} // Clear the value when clicked
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
                                        //onClick={handleDateSelect}  // Clear the value when clicked
                                        size="small"
                                    >
                                        <ClearIcon />
                                    </IconButton>
                                ),
                            }}
                            style={{ marginTop: '20px' }}
                        />
                        <Button onClick={handleDateSortPassword}>SORT</Button>
                        <Button sx={{color: "red"}} onClick={handleDateResetPassword}>RESET</Button>
                    </div>}
                      <Button onClick={sortPassByDate}>Sort by Date ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
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
                            {renderedPasswordChange.map((row) => (
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
                        <Button onClick={sortPointsByDate}>Sort by Date ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
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