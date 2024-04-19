import React, {useEffect, useState} from 'react';
import DriverAppBar from "./DriverAppBar";
import CartPage from "../CartPage";
import DriverCatalog from "./DriverCatalog"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Select, MenuItem, Typography } from '@mui/material';
import BaseURL from '../BaseURL';
import { useFetchUserAttributes } from '../CognitoAPI';

export default function DriverCart({inheritedSub}){

    // const local variables
    const [cartItems, setCartItems] = useState([]);
    const [orderSubmitted, setOrderSubmitted] = useState(false); 
    const totalPrice = cartItems.reduce((acc, item) => acc + item.convertedPrice, 0);
    const userAttributes = useFetchUserAttributes();

    // const updatePurchase 
    const [ID, setID] = useState('');
    const [purchaseName, setPurchaseName] = useState('');
    const [purchaseCost, setPurchaseCost] = useState('');
    const [purchaseOrderNum, setPurchaseOrderNum] = useState('');
    const [sponsor, setSponsor] = useState('')

    // get purchase information from RDS
    const getOrderMax = () => {
        fetch(BaseURL + '/getMaxOrderNum', {
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
            setPurchaseOrderNum(data[0].maxPurchaseOrderNum);
            console.log("data for max " + data[0].maxPurchaseOrderNum);
            if (data[0].maxPurchaseOrderNum == null) {

                setPurchaseOrderNum(0);
                console.log("maxPurchseOrdernNum is null, setting to 0");
            }
        })
        .catch(error => {
            console.error('Error retrieving data:', error);
        });
    };

    useEffect(() => {
        getOrderMax();
    }, []);


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
            console.log(data);
            setID(data.userData.userID);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Update cart if anything changes
    useEffect(() => {
        const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems'));
        if (storedCartItems) {
            setCartItems(storedCartItems);
        }
    }, []);

    // Clear cart when order is submitted
    useEffect(() => {

        if (orderSubmitted) {
            setCartItems([]);
            sessionStorage.removeItem('cartItems');
        }
    }, [orderSubmitted]);

    // removeFromCart(): removes an item from cartItems
    const removeFromCart = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);
        sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    // handlePurchase(): simulate purchase and set orderSubmitted to true
    const handlePurchase = () => {

        // Iterate over each item in cartItems and update purchase for each item
        cartItems.forEach((item, index) => {
            updatePurchase(item, index);
        });

        // set OrderSubmitted
        setOrderSubmitted(true);

        // update points here
    };




    // Insert new data into Purchase RDS table
    const updatePurchase = (item, index) => {
        console.log("sponsorID: " + item.sponsorOrgID)
        fetch(BaseURL + '/updatePurchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //body: JSON.stringify({driverID: ID, purchaseName: purchaseName, purchaseCost: purchaseCost, purchaseOrderNum: purchaseOrderNum})
            body: JSON.stringify({
                driverID: ID,
                sponsorID: item.sponsorOrgID,
                purchaseName: item.collectionName, 
                purchaseCost: item.collectionPrice, 
                purchaseOrderNum: purchaseOrderNum + 1
            })
        })
        .then(response => {
            console.log("ID: " + ID + " name:" + item.collectionName + " price:" + item.collectionPrice + " ordernum:" + purchaseOrderNum + index);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Handle successful response
            console.log(data);
        })
        .catch(error => {
            // Handle error
            console.error('There was a problem with the POST request:', error);
        });
        {/*
        const userIDString = ID.toString();
        const reasonIDString = "12"; // Assuming reasonID is a string constant
        const sponsorIDString = item.sponsorOrgID.toString(); // Convert to string
        const driverPointsString = item.collectionPrice.toString(); // Convert to string
        const changeTypeString = "bad"; // Assuming changeType is a string constant
        console.log("test: " + userIDString + reasonIDString + sponsorIDString + driverPointsString + changeTypeString);
    */}
        const data = {
            userID: ID,
            reasonID: 12,
            sponsorID: item.sponsorOrgID,
            driverPoints: JSON.stringify(item.collectionPrice),
            changeType: "bad"
        };
        console.log("updateBad " + data);
        fetch(BaseURL + "/updatePointsBad", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Successful point update: ', data);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors, if needed
        });
    };

    // Change Address removed. Can re-add later if time.

    return (
        <div>
            <DriverAppBar />
            <CartPage />
            <div style={{ marginLeft: '25px', maxWidth: '600px', margin: '0 auto' }}>
            <Typography variant="h2" align="center">Cart</Typography>
                {cartItems.length === 0 ? (
                    <Typography variant="h6" align="center">
                        There are no items in the cart.
                    </Typography>
                ) : (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {cartItems.map((item, index) => (
                            <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '20px', display: 'flex', alignItems: 'center' }}>
                                <div style={{ marginRight: '20px' }}>
                                    <img src={item.artworkUrl100} alt="Album Artwork" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                </div>
                                <div>
                                    <h3>{item.collectionName}</h3>
                                    <p>Artist: {item.artistName}</p>
                                    <p>Price: {item.convertedPrice} Points</p>
    
                                    {/* If order is submitted, remove button for this order*/}
                                    {/* Later make it so everything is removed from the page*/}
                                    {!orderSubmitted ? (
                                        <Button style={{ cursor: 'pointer', marginRight: '25px' }} variant="contained" color="primary" onClick={() => removeFromCart(index)}>Remove Item</Button>
                                    ) : (
                                        <p></p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {cartItems.length > 0 && (
                    <div style={{ textAlign: 'right', marginTop: '20px' }}>
                        <h2>Total: {Math.ceil(totalPrice.toFixed(2))} Points</h2>
                    </div>
                )}
    
                {/* Purchase Button and Order Submitted Message */}
                {!orderSubmitted && cartItems.length > 0 && (
                    <Button style={{ cursor: 'pointer', marginTop: '10px' }} variant="contained" color="primary" onClick={handlePurchase}>Purchase Items In Cart</Button>
                )}
                {orderSubmitted && (
                    <p>Order Submitted</p>
                )}
            </div>
        </div>
    );
    
}