import React, {useEffect, useState} from 'react';
import DriverAppBar from "./DriverAppBar";
import CartPage from "../CartPage";



export default function DriverCart(){
    return(
		<div>
			<DriverAppBar/>
            <CartPage/>
			<div style={{ marginLeft: '25px' }}>
                <h1 className="cart-header">Driver's Cart</h1>
            </div>	
		</div>
    );
}