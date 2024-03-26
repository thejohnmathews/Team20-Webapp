import React, {useEffect, useState} from 'react';
import DriverAppBar from "./DriverAppBar";
import CartPage from "../CartPage";
import DriverCatalog from "./DriverCatalog"
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, TextField, Select, MenuItem } from '@mui/material';
import {useFetchUserAttributes, handleUpdateAddress} from "../CognitoAPI"

export default function DriverCart(){
    const [cartItems, setCartItems] = useState([]);
    const [newAddress, setNewAddress] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [orderSubmitted, setOrderSubmitted] = useState(false);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.collectionPrice, 0);
    const userAttributes = useFetchUserAttributes();

    useEffect(() => {
        const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems'));
        if (storedCartItems) {
            setCartItems(storedCartItems);
        }
    }, []);

    // removeFromCart(): removes an item from cartItems
    const removeFromCart = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);
        sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    // handleAddressChange(): change delivery address
    const handleAddressChange = async () => {
        
        await handleUpdateAddress(newAddress);
        setShowAddressForm(false);
    };

    // handlePurchase(): simulate purchase and set orderSubmitted to true
    const handlePurchase = () => {

        // set OrderSubmitted
        setOrderSubmitted(true);

        // subtract driver points here

        // clear cart of items for next order

    };

    return(
		<div>
            <DriverAppBar />
            <CartPage />
            <div style={{ marginLeft: '25px', maxWidth: '600px', margin: '0 auto' }}>
                <h1 className="cart-header">Driver's Cart</h1>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {cartItems.map((item, index) => (
                        <li key={index} style={{ marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '20px', display: 'flex', alignItems: 'center' }}>
                            <div style={{ marginRight: '20px' }}>
                                <img src={item.artworkUrl100} alt="Album Artwork" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h3>{item.collectionName}</h3>
                                <p>Artist: {item.artistName}</p>
                                <p>Price: {Math.ceil(item.collectionPrice)} Points</p>
                                
                                {/* If order is sumbitted, remove button for this order*/}
                                {/* Later make it so everything is removed from page*/}
                                {!orderSubmitted ? (
                                    <Button style={{ cursor: 'pointer', marginRight: '25px' }} variant="contained" color="primary"onClick={() => removeFromCart(index)}>Remove Item</Button>
                                    ) : (
                                    <p></p>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <h2>Total: {Math.ceil(totalPrice.toFixed(2))} Points</h2>
                    {userAttributes && (<p>Address: {userAttributes.address}</p> )}
                    <Button style={{ cursor: 'pointer'}} variant="contained" color="primary"onClick={() => setShowAddressForm(true)}> Change Address</Button>
                </div>

                {/* Address Change Form */}
                <Dialog open={showAddressForm} onClose={() => setShowAddressForm(false)}>
                    <DialogTitle>Change Address</DialogTitle>
                    <DialogContent>
                        {userAttributes && 
                        <TextField
                            label={userAttributes.address}
                            variant="outlined"
                            fullWidth
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                        />}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowAddressForm(false)}>Cancel</Button>
                        <Button onClick={handleAddressChange} variant="contained" color="primary">Submit</Button>
                    </DialogActions>
                </Dialog>

                {/* Purchase Button and Order Submitted Message */}
                {!orderSubmitted ? (
                    <Button style={{ cursor: 'pointer', marginTop: '10px' }} variant="contained" color="primary" onClick={handlePurchase}>Purchase Items In Cart</Button>
                ) : (
                    <p>Order Submitted</p>
                )}
            </div>
        </div>

    );
}