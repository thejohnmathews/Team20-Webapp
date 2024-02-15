import React, { useState } from 'react';
import { Button, Grid, TextField, Card, CardHeader, CardActions, CardContent, InputAdornment } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

export default function LoginPage() {

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();


  const [showAboutPage, setShowAboutPage] = useState(false);

  const handleAboutButtonClick = () => {
    setShowAboutPage(true);
  };



  function login(){
    console.log("Username: " + username + "\nPassword: " + password)
    navigate('/about');
  }
  function forgotPassword(){
    navigate('/forgotPassword');
  }
  function forgotUsername(){
    navigate('/forgotUsername');
  }

  function driverApplication(){
    navigate('/driverApplication');
  }

  return (
    <Grid container alignItems="center" justifyContent="center" sx={{ mt: 10 }} >
      {/* card that everything is placed in */}
      <Card sx={{ minWidth: 275, p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
        <CardHeader title="Log In"> </CardHeader>

        {/* everything in the card */}
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {/* username text box */}
          <TextField id="username" label="Enter Username" sx={{width: '275px'}} onChange={(e) => { setUserName(e.target.value); }} value={username}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <br/>

          {/* password text box */}
          <TextField id="password" label="Enter Password" type={ "password"} sx={{width: '275px'}} onChange={(e) => { setPassword(e.target.value); }} value={password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />
          <br/>

          {/* Login button */}
          <Button variant="contained" onClick={login}>Login</Button>
        </CardContent>

        {/* Forgot password and Driver Application buttons*/}
        <CardActions sx={{ alignSelf: 'flex-start' }}>
          <Button size="small" onClick={forgotPassword}>Forgot Password</Button>
          <Button size="small" onClick={forgotUsername}>Forgot Username</Button>
          <Button size="small" onClick={driverApplication}>Driver Application</Button>
        </CardActions>
      </Card>


      {/*About Button*/}
      {/*Everything below here is for the About Button*/}
      
      <div style={{ textAlign: 'center', paddingTop: '300px' }}>
        {/* Button to navigate to About page */}
        <Link to="/about" style={{ textDecoration: 'none' }}>
        {/*<button style={{ backgroundColor: 'white', cursor: 'pointer', fontSize: '16px', position: 'absolute', top: '10px', left: '50%', transform: 'translate(-50%)' }}>About Page</button>*/}
        <Button variant="contained" style={{cursor: 'pointer', fontSize: '16px', position: 'absolute', top: '10px', left: '50%', transform: 'translate(-50%)' }}>
          About Page</Button>
        </Link>
      </div>
      

      
    </Grid>
  );
}