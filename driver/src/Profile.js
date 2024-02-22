<<<<<<< HEAD
// Profile.js
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "./App.css"

export default function Profile() {
  const navigate = useNavigate();
  function back(){
    navigate(-1);
  }
  
  const [data, setData] = useState([])
  useEffect(() => {
    fetch("http://localhost:8081/Profile")
    .then(res => res.json())
    .then(data => setData(data[0]))
    .catch(err => console.log(err));
  }, [])

  //NOTE: product description is not pulled from the backend

  console.log(data)
  return (
        <div>
          <h1 className="about-header">PROFILE</h1>
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
  );
=======
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, Grid, Typography, Box } from '@mui/material';


export default function Profile(){
	const [sponsorName, setSponsorName] = useState("Sponsor1");
	const [applicationStatus, setApplicationStatus] = useState("Pending");
 
	return(
		<Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
			<Card sx={{ minWidth: 275, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<CardHeader title="Application Status"></CardHeader>
				<CardContent>
					<Box height={20} width={20} my={4} display="flex" alignItems="center" gap={4}>
					
					</Box>
					<Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
						Your current application for {sponsorName} is {applicationStatus}
					</Typography>

				</CardContent>
			</Card>
		</Grid>
		

	);
>>>>>>> refs/remotes/origin/sprint4
}