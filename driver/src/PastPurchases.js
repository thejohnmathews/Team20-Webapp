import React, { useEffect, useState } from 'react';
import DriverAppBar from './DriverPortal/DriverAppBar';
import { Card, CardContent, Typography, Grid, Button, Divider } from '@mui/material';
import BaseURL from './BaseURL';
import { useFetchUserAttributes } from './CognitoAPI';

export default function PastPurchases({inheritedSub}) {
    const [pastPurchases, setPastPurchases] = useState([]);
    const userAttributes = useFetchUserAttributes();
    const [driverID, setID] = useState('');
    const [totalPointsSpent, setTotalPointsSpent] = useState(0); 

    // Get current user from UserInfo RDS table
    if(userAttributes !== null){
        fetch(BaseURL+'/userAttributes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({sub: inheritedSub?.value2 ? inheritedSub.value2 : userAttributes.sub})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); 
        })
        .then(data => {
            setID(data.userData.userID);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    }

    // get purchase information from RDS
    const getPurchases = () => {
        console.log("PastPurchse.js driverID: " + driverID);
        fetch(BaseURL + '/getPurchase/' + driverID)
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

    // Call getPurchases when the component mounts
    useEffect(() => {
        
        getPurchases();
    }, [driverID]); 

    // Calculate total points spent
    useEffect(() => {
        let totalPoints = 0;
        Object.values(pastPurchases).forEach(purchases => {
            purchases.forEach(purchase => {
                totalPoints += purchase.purchaseCost;
            });
        });
        setTotalPointsSpent(totalPoints);
    }, [pastPurchases]);

    // logic for cancel order button
    const handleCancelOrder = (orderNum) => {
        
        // Extracting purchase IDs associated with the orderNum
        const purchaseIDs = pastPurchases[orderNum].map(purchase => purchase.purchaseID);

        // Sending purchase IDs to backend to delete entries from the Purchase table
        fetch(BaseURL + '/removePurchase',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ purchaseIDs: purchaseIDs })
        })
        .then(response => {
            if (response.ok) { 
                
                // Fetch updated data
                getPurchases(); 
                const updatedPastPurchases = { ...pastPurchases };
                delete updatedPastPurchases[orderNum];
                setPastPurchases(updatedPastPurchases);
            } 
            else { 
                console.error('Failed to cancel order'); 
            }
        })
        .catch(error => {
            console.error('Failed to cancel order', error);
        });
    };



    return (
        <div>
            <DriverAppBar inheritedSub={inheritedSub}/>
            <Typography variant="h3" align="center" gutterBottom>
                Past Purchases
            </Typography>
            <Typography variant="h6" align="center">
                Total Points Spent: {totalPointsSpent}
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
