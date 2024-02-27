import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import "../App.css"
import AdminAppBar from './AdminAppBar';

export default function AdminProfilePage() {
  const navigate = useNavigate();
  function back(){
    navigate(-1);
  }
  
  const [data, setData] = useState([])
  useEffect(() => {
    fetch("http://localhost:8081/profilePage")
    .then(res => res.json())
    .then(data => setData(data[0]))
    .catch(err => console.log(err));
  }, [])

  //NOTE: product description is not pulled from the backend

  console.log(data)
  return (
    <div>
      <AdminAppBar/>
        <div>
          <h1 className="profile-header">(Username)'s Profile</h1>
            <div>
              <p  className="profile-info">Sponsor: </p>
              <p  className="profile-info">First Name: </p>
              <p  className="profile-info">Last Name: </p>
              <p  className="profile-info">Username: </p>
              <p  className="profile-info">Password: </p>
              <p  className="profile-info">Email: </p>
              <p  className="profile-info">Phone Number: </p>
              <p  className="profile-info">Address Line 1: </p>
              <p  className="profile-info">Address Line 2: </p>
              <p  className="profile-info">City: </p>
              <p  className="profile-info">State: </p>
              <p  className="profile-info">Zip: </p>
            </div>
          
          <Button variant="contained" onClick={back} style={{bottom: '-300px', fontSize: '18px', left: '20px'}}>back</Button>
        </div>
    </div>
  );
}
