import React, {useEffect, useState} from 'react';
import DriverAppBar from "./DriverAppBar";
import CartPage from "../CartPage";
import DriverCatalog from "./DriverCatalog"

export default function DriverCart(){
    const [cartItems, setCartItems] = useState([]);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.collectionPrice, 0);


    useEffect(() => {
        const storedCartItems = JSON.parse(sessionStorage.getItem('cartItems'));
        if (storedCartItems) {
            setCartItems(storedCartItems);
        }
    }, []);
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
                                <p>Price: ${item.collectionPrice}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <div style={{ textAlign: 'right', marginTop: '20px' }}>
                    <h2>Total: ${totalPrice.toFixed(2)}</h2>
                </div>
            </div>
        </div>

    );
}