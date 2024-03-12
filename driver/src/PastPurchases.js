import React, {useEffect, useState} from 'react';
import DriverAppBar from './DriverPortal/DriverAppBar';

export default function PastPurchases(){

    return(
        <div>
            <DriverAppBar />
            <h1>Past Purchases</h1>
            <p> Order 1: Processing</p>
        </div>
    );
}