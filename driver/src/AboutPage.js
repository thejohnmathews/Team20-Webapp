import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();
  function back(){
    navigate(-1);
  }
  

  return (
        <div>
          <h1 style={{marginLeft:'20px', fontSize: '40px'}}>ABOUT</h1>
          <p  style={{marginLeft:'20px', fontSize: '20px'}}>Team 20</p>
          <p  style={{marginLeft:'20px', fontSize: '20px'}}>Version 0.1</p>
          <p  style={{marginLeft:'20px', fontSize: '20px'}}>Release Date: April 30th, 2024</p>
          <p  style={{marginLeft:'20px', fontSize: '20px'}}>Product: Truck Driver Incentive Program</p>
          <p  style={{marginLeft:'20px', fontSize: '20px'}}>Product Description</p>
          <Button variant="contained" onClick={back} style={{bottom: '-300px', fontSize: '18px', left: '20px'}}>back</Button>
        </div>
  );
}