import React, { useEffect, useState } from 'react';
import DriverAppBar from './DriverPortal/DriverAppBar';
import { Card, CardContent, Typography, Grid, Divider } from '@mui/material';

export default function PastPurchases() {
    // Mock data for past purchases (replace with actual data)
    const [pastPurchases, setPastPurchases] = useState([
        {
            id: 1,
            status: 'Delivered',
            items: [
                { id: 1, name: 'Item 1', price: 10 },
                { id: 2, name: 'Item 2', price: 15 },
                // Add more items as needed
            ]
        },
        // Add more past purchases as needed
    ]);

    return (
        <div>
            <DriverAppBar />
            <h1 style={{ textAlign: 'center' }}>Past Purchases</h1>
            <Grid container spacing={3} justifyContent="center">
                {pastPurchases.map((purchase) => (
                    <Grid item key={purchase.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Order {purchase.id}
                                </Typography>
                                <Typography color="textSecondary">
                                    Status: {purchase.status}
                                </Typography>
                                <Divider style={{ margin: '12px 0' }} />
                                <Typography variant="subtitle1">Items:</Typography>
                                {purchase.items.map((item) => (
                                    <Typography key={item.id} variant="body2">
                                        {item.name} - ${item.price}
                                    </Typography>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
