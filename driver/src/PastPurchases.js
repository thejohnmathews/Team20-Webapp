import React, { useEffect, useState } from 'react';
import DriverAppBar from './DriverPortal/DriverAppBar';
import { Card, CardContent, Typography, Grid, Button, Divider } from '@mui/material';
import BaseURL from './BaseURL';

export default function PastPurchases() {
    const [pastPurchases, setPastPurchases] = useState([]);

    // logic for cancel order button
    const handleCancelOrder = (orderId) => {
        
        // remove all items associated from Purchase table
        
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
            <Typography variant="h3" align="center" gutterBottom>
                Past Purchases
            </Typography>
            {Object.keys(pastPurchases).length === 0 ? (
                <Typography variant="h6" align="center">
                    There have been no purchases on this account.
                </Typography>
            ) : (
                <div>
                    {Object.entries(pastPurchases).map(([orderNum, purchases]) => (
                        <div key={orderNum}>
                            <Card style={{ marginBottom: '20px' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Order {orderNum}
                                    </Typography>
                                    <Typography color="textSecondary" gutterBottom>
                                        Order Date: {purchases[0].purchaseDate}
                                    </Typography>
                                    <Divider />
                                    {purchases.map((purchase, index) => (
                                        <div key={purchase.purchaseID} style={{ marginBottom: '10px' }}>
                                            <Typography variant="subtitle1">
                                                {purchase.purchaseName} - ${purchase.purchaseCost}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Status: {purchase.purchaseStatus}
                                            </Typography>
                                        </div>
                                    ))}
                                    <Button onClick={() => handleCancelOrder(orderNum)} variant="contained" color="secondary" style={{ marginTop: '10px' }}>
                                        Cancel Order
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
