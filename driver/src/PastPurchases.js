import React, { useEffect, useState } from 'react';
import DriverAppBar from './DriverPortal/DriverAppBar';
import { Card, CardContent, Typography, Grid, Button, Divider } from '@mui/material';
import BaseURL from './BaseURL';

export default function PastPurchases() {
    const [pastPurchases, setPastPurchases] = useState([]);

    // logic for cancel order button
    const handleCancelOrder = (orderId) => {
        console.log(`Cancelled order ${orderId}`);
    };

    // get purchase information from RDS
    const getPurchases = () => {
        fetch(BaseURL + '/getPurchase', {
            method: 'GET',
            headers: {
                'Content-Type': 'purchase/json'
            },
        })
        .then(response => {
            if (response.ok) { 
                console.log('Lists retrieved successfully'); 
                return response.json();
            } 
            else { 
                console.error('Failed to retrieve'); 
            }
        })
        .then(data => {
            console.log('Received data:', data);

            // This groups mulitple RDS entries to the same purchaseOrderNum
            const groupedPurchases = data.reduce((acc, purchase) => {
                const orderNum = purchase.purchaseOrderNum;
                if (!acc[orderNum]) {
                    acc[orderNum] = [];
                }
                acc[orderNum].push(purchase);
                return acc;
            }, {});
            setPastPurchases(groupedPurchases);
        })
        .catch(error => {
            console.error('Error retrieving data:', error);
        });
    };


    // useEffect(): request to RDS if there are any changes
    useEffect(() => {
        getPurchases();
    }, []);

    return (
        <div>
            <DriverAppBar />
            <h1 style={{ textAlign: 'center' }}>Past Purchases</h1>
            {Object.keys(pastPurchases).length === 0 ? (
                <Typography variant="h6" align="center">
                    There have been no purchases on this account.
                </Typography>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {Object.entries(pastPurchases).map(([orderNum, purchases]) => (
                        <Grid item key={orderNum} xs={12} md={6} lg={4}>
                            <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Order {orderNum}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Order Date: {purchases[0].purchaseDate}
                                    </Typography>
                                    <Divider />
                                    {purchases.map((purchase, index) => (
                                        <div key={purchase.purchaseID}>
                                            <Typography variant="subtitle1">
                                                {purchase.purchaseName} - ${purchase.purchaseCost}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Status: {purchase.purchaseStatus}
                                            </Typography>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
}
