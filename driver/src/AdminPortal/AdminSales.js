import AdminAppBar from "./AdminAppBar";
import React, { useEffect, useState } from 'react'; 
import { Box, Tabs, Tab, Typography, Container } from '@mui/material';
import {Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button} from '@mui/material';
import { useFetchUserAttributes } from '../CognitoAPI';
import { csv } from '../ConvertCSV';
import BaseURL from "../BaseURL";

export default function AdminSales(){

    const userAttributes = useFetchUserAttributes();
    const [purchases, setPurchases] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        userAttributes != null ? setLoading(false) : setLoading(true);
        
    }, [userAttributes]); 

    useEffect(() => {
        if (userAttributes !== null) {
            getPurchases()
            console.log(purchases)
            //console.log(loginAttempts)
        }
    }, [userAttributes]);

    const getPurchases = () => {
        const url = new URL(BaseURL + "/allPurchases");
        fetch(url)
        .then(res => res.json())
        .then(data => setPurchases(data))
        .catch(err => console.log(err));

    }

	return(
		<div>
			<AdminAppBar/>
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
                    {purchases.map((row) => (
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
                    </TableBody>
                </Table>
                </TableContainer>
                <a href='#' onClick={() => csv(purchases)}>Download as CSV</a>
            </div>
		</div>
	)
}