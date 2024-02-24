import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./App.css"
import DriverAppBar from './DriverAppBar';

export default function AboutPage() {
  const navigate = useNavigate();
  function back(){
    navigate(-1);
  }
  
  const [data, setData] = useState([])
  useEffect(() => {
    fetch("http://localhost:8081/About")
    .then(res => res.json())
    .then(data => setData(data[0]))
    .catch(err => console.log(err));
  }, [])

  //NOTE: product description is not pulled from the backend

  console.log(data)
  return (
    <div>
      <DriverAppBar/>
        <div>
          <h1 className="about-header">ABOUT</h1>
            <div>
              <p  className="about-info">Team: #{data.teamNum}, {data.teamName}</p>
              <p  className="about-info">Version:{data.versionNum}</p>
              <p  className="about-info">Release Date:{data.releaseDate}</p>
              <p  className="about-info">Product Name:{data.productName}</p>
            </div>
          <p  className="about-info">
            Product Description: A "Truck Driver Incentive Program" where truck drivers can earn points for good driving behavior.
          </p>
          <Button variant="contained" onClick={back} style={{bottom: '-300px', fontSize: '18px', left: '20px'}}>back</Button>
        </div>
      </div>
  );
}