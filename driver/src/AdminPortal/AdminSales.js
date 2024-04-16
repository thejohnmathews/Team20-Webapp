import AdminAppBar from "./AdminAppBar";
import React, { useEffect, useState, useRef } from 'react'; 
import {Box, Tabs, Tab, Typography, Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button, Checkbox} from '@mui/material';
import { useFetchUserAttributes } from '../CognitoAPI';
import { csv } from '../ConvertCSV';
import BaseURL from "../BaseURL";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Chart from 'chart.js/auto';


export default function AdminSales(){

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

    const userAttributes = useFetchUserAttributes();
    const [purchases, setPurchases] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [sponsorList, setSponsorList] = useState([])
    const [driverList, setDriverList] = useState([])
    const [renderedInvoiceList, setRenderedInvoiceList] = useState([])
    const [renderedList, setRenderedList] = useState([])
    const [renderedDriver, setRenderedDriver] = useState([])
    const [sponsorName, setSponsorName] = useState("")
    const [driverSponsorName, setDriverSponsorName] = useState("")
    const [driverName, setDriverName] = useState("")
    const [reportType, setReportType] = useState("")
    const [reportTypeBool, setReportTypeBool] = useState(false)
    const [sponsorOrgID, setSponsorOrgID] = React.useState(null);
    const [totalCost, setTotalCost] = React.useState(0)
    const [totalDriverCost, setTotalDriverCost] = React.useState(0)
    const [value, setValue] = React.useState(0);  
    const [disabledSponsorSelect, setDisabledSponsorSelect] = React.useState(false);
    const [disabledDriverSelect, setDisabledDriverSelect] = React.useState(false);    

    useEffect(() => {
        userAttributes != null ? setLoading(false) : setLoading(true);
        
    }, [userAttributes]); 

    useEffect(() => {
        if (userAttributes !== null) {
            getPurchases()
            getSponsors()
            getDrivers()
            setSponsorName("All")
            setDriverSponsorName("All")
            setDriverName("All")
            setReportType("Summary")
            console.log(purchases)
            //console.log(driverList)
            //console.log(loginAttempts)
        }
    }, [userAttributes]);

    useEffect(() => {
        if (renderedList.length == 0 || renderedDriver.length == 0) {
            setRenderedList(purchases)
            setRenderedInvoiceList(purchases)
            setRenderedDriver(purchases)
            //console.log(renderedList)
        }
    }, [purchases])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const getPurchases = () => {
        const url = new URL(BaseURL + "/allPurchases");
        fetch(url)
        .then(res => res.json())
        .then(data => setPurchases(data))
        .catch(err => console.log(err));

    }

    const getSponsors = () => {
        const url = new URL(BaseURL + "/getAllOrgs");
        fetch(url)
        .then(res => res.json())
        .then(data => setSponsorList(data))
        .catch(err => console.log(err));
    }

    const getDrivers = () => {
        const url = new URL(BaseURL + "/activeDrivers");
        fetch(url)
        .then(res => res.json())
        .then(data => setDriverList(data))
        .catch(err => console.log(err));
    }

    const handleSelectSponsor = (e) => {
        //console.log(sponsorList)
        setSponsorName(e.target.value)
        if (e.target.value != "All") {
            for (let i = 0; i < sponsorList.length; i++) {
                if (sponsorList[i].sponsorOrgName == e.target.value) {
                    //console.log("setting sponsor id to "+ sponsorList[i].sponsorOrgID)
                    setRenderedList(purchases.filter((p) => p.sponsorID == sponsorList[i].sponsorOrgID))
                }
            }
        }
        else {
            setRenderedList(purchases)
        }
    }

    const handleSelectSponsorForDriver = (e) => {
        //console.log(sponsorList)
        setDriverSponsorName(e.target.value)
        setDisabledSponsorSelect(true)
        if (e.target.value != "All") {
            for (let i = 0; i < sponsorList.length; i++) {
                if (sponsorList[i].sponsorOrgName == e.target.value) {
                    //console.log("setting sponsor id to "+ sponsorList[i].sponsorOrgID)
                    setRenderedDriver(renderedDriver.filter((p) => p.sponsorID == sponsorList[i].sponsorOrgID))
                }
            }
        }
        else {
            setRenderedDriver(purchases)
        }
    }

    const handleReset = (e) => {
        setDisabledSponsorSelect(false)
        setDisabledDriverSelect(false)
        setRenderedDriver(purchases)
        setDriverSponsorName("All")
        setDriverName("All")
    }

    const handleReportType = (e) => {
        setReportType(e.target.value)
        if (e.target.value == "Summary") {
            setReportTypeBool(false)
        }
        if (e.target.value == "Detailed Report") {
            setReportTypeBool(true)
        }
    }

    const handleSelectDriver = (e) => {
        //console.log(sponsorList)
        setDriverName(e.target.value)
        setDisabledDriverSelect(true)
        if (e.target.value != "All") {
            for (let i = 0; i < driverList.length; i++) {
                if (driverList[i].userUsername == e.target.value) {
                    //console.log("setting sponsor id to "+ sponsorList[i].sponsorOrgID)
                    setRenderedDriver(purchases.filter((p) => p.userUsername == driverList[i].userUsername))
                }
            }
        }
        else {
            setRenderedDriver(purchases)
        }
    }
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

    useEffect(() => {
        let totalCtr = 0
        for (let i = 0; i < renderedList.length; i++) {
            totalCtr += renderedList[i].purchaseCost
            //console.log("total: " + totalCtr)
        }
        setTotalCost(totalCtr.toFixed(2))
    }, [renderedList])

    useEffect(() => {
        let totalCtr = 0
        for (let i = 0; i < renderedDriver.length; i++) {
            totalCtr += renderedDriver[i].purchaseCost
            //console.log("total: " + totalCtr)
        }
        setTotalDriverCost(totalCtr.toFixed(2))
    }, [renderedDriver])

    const sortRowsByDate = () => {

        const sortedList = [...renderedInvoiceList].sort((a, b) => {
            const dateA = new Date(a.purchaseDate);
            const dateB = new Date(b.purchaseDate);
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
        console.log(sortDirection)
        setRenderedInvoiceList(sortedList);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };
    //CHARTS
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (canvasRef.current) {
            // Get the canvas context
            const ctx = canvasRef.current.getContext('2d');
            
            // Extract purchaseCost and purchaseDate from renderedInvoiceList
            const purchaseCosts = renderedInvoiceList.map(purchase => parseFloat(purchase.purchaseCost));
            console.log("cost:" + purchaseCosts);
            const purchaseDates = renderedInvoiceList.map(purchase => new Date(purchase.purchaseDate).toLocaleDateString());
            console.log("date:" + purchaseDates);

            // Create the chart
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: purchaseDates,
                    datasets: [{
                        label: 'Purchase Cost',
                        data: purchaseCosts,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Purchase Cost'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Purchase Date'
                            }
                        }
                    }
                }
            });

            // Return a cleanup function to destroy the chart when the component unmounts
            return () => {
                chart.destroy();
            };
        }
    }, [renderedInvoiceList]);

      const sortSponsorsByDate = () => {

        const sortedList = [...renderedList].sort((a, b) => {
            const dateA = new Date(a.purchaseDate);
            const dateB = new Date(b.purchaseDate);
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
        console.log(sortDirection)
        setRenderedList(sortedList);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      };

      const sortDriversByDate = () => {

        const sortedList = [...renderedDriver].sort((a, b) => {
            const dateA = new Date(a.purchaseDate);
            const dateB = new Date(b.purchaseDate);
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
        console.log(sortDirection)
        setRenderedDriver(sortedList);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      };
    

	return(
		<div>
			<AdminAppBar/>
            <h1 style={{textAlign:"center"}}>Invoices</h1>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={value} onChange={handleChange} aria-label="sponsor tabs">
                          <Tab label="Summary" />
                          <Tab label="Sales by Sponsor" />
                          <Tab label="Sales by Driver" />
                      </Tabs>
                  </Box>
            <TabPanel value={value} index={0}>
                <div style={{display: "flex"}}>
                    <div>
                    <InputLabel id="selectLabel" style={{marginLeft:"20px"}}>Report Type</InputLabel>
                        <Select
                        label="Report Type"
                        value={reportType}
                        onChange={handleReportType}
                        style={{width: "180px", marginLeft:"20px"}}>
                            <MenuItem value={"Summary"}>Summary</MenuItem>
                            <MenuItem value={"Detailed Report"}>Detailed Report</MenuItem>
                        </Select>
                    </div>
                    <Button onClick={sortRowsByDate}>Sort by Date ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TableContainer component={Paper}>
                    {!reportTypeBool &&
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="center">Order Contents</TableCell>
                            <TableCell align="center">Cost</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {renderedInvoiceList.map((row) => (
                            <TableRow
                            key={row.purchaseID}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" align="center" scope="row">{row.purchaseName}</TableCell>
                            <TableCell align="center">{row.purchaseCost}</TableCell>
                            </TableRow> 
                        ))}
                        <TableRow
                            key={0}
                            sx={{ '&:last-child td, &:last-child th': { border: 0, backgroundColor: "#eeeeee"} }}
                            >
                            <TableCell component="th" align="center" scope="row">TOTAL</TableCell>
                            <TableCell align="center">{totalCost}</TableCell>
                            </TableRow> 
                        </TableBody>
                    </Table>}
                    {reportTypeBool &&
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="center">Order Contents</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="right">Cost</TableCell>
                            <TableCell align="right">Driver User</TableCell>
                            <TableCell align="right">Sponsor</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {renderedInvoiceList.map((row) => (
                            <TableRow
                            key={row.purchaseID}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">{row.purchaseName}</TableCell>
                            <TableCell align="center">{row.purchaseStatus}</TableCell>
                            <TableCell align="center">{row.purchaseDate}</TableCell>
                            <TableCell align="right">{row.purchaseCost}</TableCell>
                            <TableCell align="right">{row.userUsername}</TableCell>
                            <TableCell align="right">{row.sponsorOrgName}</TableCell>
                            </TableRow> 
                        ))}
                        <TableRow
                            key={0}
                            sx={{ '&:last-child td, &:last-child th': { border: 0, backgroundColor: "#eeeeee"} }}
                            >
                            <TableCell component="th" scope="row">TOTAL</TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="right">$</TableCell>
                            <TableCell align="right">{totalCost}</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right"></TableCell>
                            </TableRow> 
                        </TableBody>
                    </Table>}
                    </TableContainer>
                    <a href='#' onClick={() => csv(renderedInvoiceList)}>Download as CSV</a>
                    <canvas ref={canvasRef} />
                </div>
            </TabPanel>
            <TabPanel value={value} index={1}>
            <div style={{display: "flex", paddingBottom: "10px"}}>
                <div>
                    <InputLabel id="selectLabel" style={{marginLeft:"20px"}}>Report Type</InputLabel>
                        <Select
                        label="Report Type"
                        value={reportType}
                        onChange={handleReportType}
                        style={{width: "180px", marginLeft:"20px"}}>
                            <MenuItem value={"Summary"}>Summary</MenuItem>
                            <MenuItem value={"Detailed Report"}>Detailed Report</MenuItem>
                        </Select>
                    </div>
                    <div>
                        <InputLabel id="selectLabel" style={{marginLeft:"20px"}}>Current Sponsor</InputLabel>
                        <Select
                        label="Current Sponsor"
                        value={sponsorName}
                        onChange={handleSelectSponsor}
                        style={{width: "180px", marginLeft:"20px"}}>
                            <MenuItem value={"All"}>All</MenuItem>
                        {sponsorList?.map(id => (
                            <MenuItem value={id.sponsorOrgName}>{id.sponsorOrgName}</MenuItem>
                        ))}
                        </Select>
                    </div>
                    <Button onClick={sortSponsorsByDate}>Sort by Date ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
                </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TableContainer component={Paper}>
                    {reportTypeBool && 
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="right">Sponsor</TableCell>
                            <TableCell align="center">Order Contents</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="right">Cost</TableCell>
                            <TableCell align="right">Driver User</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {renderedList.map((row) => (
                            <TableRow
                            key={row.purchaseID}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell align="right">{row.sponsorOrgName}</TableCell>
                            <TableCell component="th" scope="row">{row.purchaseName}</TableCell>
                            <TableCell align="center">{row.purchaseStatus}</TableCell>
                            <TableCell align="center">{row.purchaseDate}</TableCell>
                            <TableCell align="right">{row.purchaseCost}</TableCell>
                            <TableCell align="right">{row.userUsername}</TableCell>
                            </TableRow> 
                        ))}
                        <TableRow
                            key={0}
                            sx={{ '&:last-child td, &:last-child th': { border: 0, backgroundColor: "#eeeeee"} }}
                            >
                            <TableCell component="th" scope="row">TOTAL</TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="right">$</TableCell>
                            <TableCell align="right">{totalCost}</TableCell>
                            <TableCell align="right"></TableCell>
                            </TableRow> 
                        </TableBody>
                    </Table>}
                    {!reportTypeBool && 
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="center">Sponsor</TableCell>
                            <TableCell align="right">Driver User</TableCell>
                            <TableCell align="right">Cost</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {renderedList.map((row) => (
                            <TableRow
                            key={row.purchaseID}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell align="center">{row.sponsorOrgName}</TableCell>
                            <TableCell align="right">{row.userUsername}</TableCell>
                            <TableCell align="right">{row.purchaseCost}</TableCell>
                            </TableRow> 
                        ))}
                        <TableRow
                            key={0}
                            sx={{ '&:last-child td, &:last-child th': { border: 0, backgroundColor: "#eeeeee"} }}
                            >
                            <TableCell component="th" align="center" scope="row">TOTAL</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">{totalCost}</TableCell>
                            </TableRow> 
                        </TableBody>
                    </Table>}
                    </TableContainer>
                    <a href='#' onClick={() => csv(renderedList)}>Download as CSV</a>
                    <canvas ref={canvasRef} />
                </div>
            </TabPanel>
            <TabPanel value={value} index={2}>
            <div style={{display: "flex", padding: "10px", gap: "10px"}}>
                    <div>
                        <InputLabel id="selectLabel" style={{marginLeft:"20px"}}>Report Type</InputLabel>
                        <Select
                        label="Report Type"
                        value={reportType}
                        onChange={handleReportType}
                        style={{width: "180px", marginLeft:"20px"}}>
                            <MenuItem value={"Summary"}>Summary</MenuItem>
                            <MenuItem value={"Detailed Report"}>Detailed Report</MenuItem>
                        </Select>
                    </div>
                    <div>
                        <InputLabel id="selectLabel" style={{marginLeft:"20px"}}>Current Driver</InputLabel>
                        <Select
                        disabled={disabledDriverSelect}
                        label="Current Driver"
                        value={driverName}
                        onChange={handleSelectDriver}
                        style={{width: "180px", marginLeft:"20px"}}>
                            <MenuItem value={"All"}>All</MenuItem>
                        {driverList?.map(id => (
                            <MenuItem value={id.userUsername}>{id.userUsername}</MenuItem>
                        ))}
                        </Select>
                    </div>
                    <div>
                        <InputLabel id="selectLabel" style={{marginLeft:"20px"}}>Current Sponsor</InputLabel>
                        <Select
                        disabled={disabledSponsorSelect}
                        id="select-sponsor-for-driver"
                        label="Current Sponsor"
                        value={driverSponsorName}
                        onChange={handleSelectSponsorForDriver}
                        style={{width: "180px", marginLeft:"20px"}}>
                            <MenuItem value={"All"}>All</MenuItem>
                        {sponsorList?.map(id => (
                            <MenuItem value={id.sponsorOrgName}>{id.sponsorOrgName}</MenuItem>
                        ))}
                        </Select>
                    </div>
                    <Button style={{color: "red"}} onClick={handleReset}>RESET DRIVER/SPONSOR</Button>
                    <Button onClick={sortDriversByDate}>Sort by Date ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
                </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <TableContainer component={Paper}>
                    {reportTypeBool &&
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="right">Driver User</TableCell>
                            <TableCell align="center">Order Contents</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Date</TableCell>
                            <TableCell align="right">Cost</TableCell>
                            <TableCell align="right">Sponsor</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {renderedDriver.map((row) => (
                            <TableRow
                            key={row.purchaseID}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell align="right">{row.userUsername}</TableCell>
                            <TableCell component="th" scope="row">{row.purchaseName}</TableCell>
                            <TableCell align="center">{row.purchaseStatus}</TableCell>
                            <TableCell align="center">{row.purchaseDate}</TableCell>
                            <TableCell align="right">{row.purchaseCost}</TableCell>
                            <TableCell align="right">{row.sponsorOrgName}</TableCell>
                            </TableRow> 
                        ))}
                        <TableRow
                            key={0}
                            sx={{ '&:last-child td, &:last-child th': { border: 0, backgroundColor: "#eeeeee"} }}
                            >
                            <TableCell component="th" align="right" scope="row">TOTAL</TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="right">$</TableCell>
                            <TableCell align="right">{totalDriverCost}</TableCell>
                            <TableCell align="right"></TableCell>
                            </TableRow> 
                        </TableBody>
                    </Table>
                    }
                    {!reportTypeBool &&
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align="right">Driver User</TableCell>
                            <TableCell align="right">Cost</TableCell>
                            <TableCell align="right">Sponsor</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {renderedDriver.map((row) => (
                            <TableRow
                            key={row.purchaseID}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell align="right">{row.userUsername}</TableCell>
                            <TableCell align="right">{row.purchaseCost}</TableCell>
                            <TableCell align="right">{row.sponsorOrgName}</TableCell>
                            </TableRow> 
                        ))}
                        <TableRow
                            key={0}
                            sx={{ '&:last-child td, &:last-child th': { border: 0, backgroundColor: "#eeeeee"} }}
                            >
                            <TableCell component="th" align="right" scope="row">TOTAL</TableCell>
                            <TableCell align="right">{totalDriverCost}</TableCell>
                            <TableCell align="right"></TableCell>
                            </TableRow> 
                        </TableBody>
                    </Table>
                    }
                    </TableContainer>
                    <a href='#' onClick={() => csv(renderedDriver)}>Download as CSV</a>
                    
                </div>
            </TabPanel>
		</div>
	)
}