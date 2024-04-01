import * as React from 'react';
import {AppBar, Box, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Drawer} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import SavingsIcon from '@mui/icons-material/Savings';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BaseURL from '../BaseURL';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function DriverAppBar() {
  const [open, setOpen] = React.useState(false);
  const [pointTotal, setPointTotal] = useState("");
  const userID = 5;
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const [drivers, setDrivers, data] = useState([])
    useEffect(() => {
        fetch(BaseURL + "/activeDrivers")
        .then(res => res.json())
        .then(data => {
            // Store the fetched driver data in state
            setDrivers(data);  
            console.log(data);
            data.forEach((driver, index) => {
              console.log(`Driver ${index + 1} points:`, driver.driverPoints);
            });

        })
        .catch(err => console.error('Error fetching driver data:', err));
  }, []);


  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/driverProfile');
  };

  const handleAbout = () => {
    navigate('/driverAbout');
  };

  const handleCatalog = () => {
    navigate('/driverCatalog');
  };

  const handlePastPurchases = () => {
    navigate('/pastPurchases');
  };
  const handleDrivingPoints = () => {
    navigate('/driverPoints')
  }
  
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        <ListItem key={"Item Catalog"} disablePadding>
          <ListItemButton onClick={handleCatalog}>
            <ListItemIcon>
              <StoreIcon/>
            </ListItemIcon>
            <ListItemText primary={"Item Catalog"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Past Purchases"} disablePadding>
          <ListItemButton onClick={handlePastPurchases}>
            <ListItemIcon>
              <HistoryIcon/>
            </ListItemIcon>
            <ListItemText primary={"Past Purchases"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Driving Points"} disablePadding>
          <ListItemButton onClick={handleDrivingPoints}>
            <ListItemIcon>
              <SavingsIcon/>
            </ListItemIcon>
            <ListItemText primary={"Driving Points"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"About"} disablePadding>
          <ListItemButton onClick={handleAbout}>
            <ListItemIcon>
              <InfoIcon/>
            </ListItemIcon>
            <ListItemText primary={"About"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Sign Out"} disablePadding>
          <ListItemButton onClick={signOut}>
            <ListItemIcon>
              <LogoutIcon/>
            </ListItemIcon>
            <ListItemText primary={"Sign Out"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
            <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-controls="menu"
            aria-haspopup="true"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Driver Portal
          </Typography>
          <Typography variant="h6" style={{marginRight: '20px'}}>
            {drivers.length > 0 && drivers[2] && drivers[2].driverPoints !== null ? `Current Point Total: ${drivers[2].driverPoints}` : "No points available"}
          </Typography>           
          
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleProfile}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </Box>
  );
}