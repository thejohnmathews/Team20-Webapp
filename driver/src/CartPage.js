import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./App.css"
// //import eBayApi from 'ebay-api'

export default function CartPage() {
   const navigate = useNavigate();
   function back(){
     navigate(-1);
   }
  
   const [data, setData] = useState([])
   useEffect(() => {
     fetch("http://localhost:3000/CartPage")
     .then(res => res.json())
     .then(data => setData(data[0]))
     .catch(err => console.log(err));
   }, [])
}