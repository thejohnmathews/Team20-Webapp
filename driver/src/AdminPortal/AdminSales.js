import AdminAppBar from "./AdminAppBar";
import React, { useEffect, useState } from 'react'; 
import {Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button} from '@mui/material';
import { useFetchUserAttributes } from '../CognitoAPI';
import { csv } from '../ConvertCSV';
import BaseURL from "../BaseURL";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

export default function AdminSales(){

    const userAttributes = useFetchUserAttributes();
    const [purchases, setPurchases] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [sponsorList, setSponsorList] = useState([])
    const [renderedList, setRenderedList] = useState([])
    const [sponsorName, setSponsorName] = useState("")
    const [sponsorOrgID, setSponsorOrgID] = React.useState(null);
    const [totalCost, setTotalCost] = React.useState(0)


    useEffect(() => {
        userAttributes != null ? setLoading(false) : setLoading(true);
        
    }, [userAttributes]); 

    useEffect(() => {
        if (userAttributes !== null) {
            getPurchases()
            getSponsors()
            setSponsorName("All")
            console.log(purchases)
            //console.log(loginAttempts)
        }
    }, [userAttributes]);

    useEffect(() => {
        if (renderedList.length == 0) {
            setRenderedList(purchases)
            console.log(renderedList)
        }
    }, [purchases])

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
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

    useEffect(() => {
        let totalCtr = 0
        for (let i = 0; i < renderedList.length; i++) {
            totalCtr += renderedList[i].purchaseCost
            //console.log("total: " + totalCtr)
        }
        setTotalCost(totalCtr)
    }, [renderedList])

    const sortRowsByDate = () => {

        const sortedList = [...renderedList].sort((a, b) => {
            const dateA = new Date(a.purchaseDate);
            const dateB = new Date(b.purchaseDate);
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
        });
        console.log(sortDirection)
        setRenderedList(sortedList);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      };

    

	return(
		<div>
			<AdminAppBar/>
            <div style={{display: "flex"}}>
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
                <Button onClick={sortRowsByDate}>Sort by Date ({sortDirection === 'asc' ? '▲' : '▼'})</Button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TableContainer component={Paper}>
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
                    {renderedList.map((row) => (
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
                        <TableCell align="center"></TableCell>
                        <TableCell align="right">{totalCost}</TableCell>
                        <TableCell align="right"></TableCell>
                        <TableCell align="right"></TableCell>
                        </TableRow> 
                    </TableBody>
                </Table>
                </TableContainer>
                <a href='#' onClick={() => csv(renderedList)}>Download as CSV</a>
            </div>
		</div>
	)
}