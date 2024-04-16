import * as React from 'react';
import {AppBar, Box, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Drawer} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import SavingsIcon from '@mui/icons-material/Savings';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BaseURL from '../BaseURL';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { inheritedUser } from '../App';
import UndoIcon from '@mui/icons-material/Undo';
import { useFetchUserAttributes } from '../CognitoAPI';
import ProfilePage from '../ProfilePage';

export default function DriverAppBar({inheritedSub}) {
  const [open2, setOpen2] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [sponsorOrgName, setSponsorOrgName] = useState('');
  const [open, setOpen] = React.useState(false);
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const userAttributes = useFetchUserAttributes();
  const userType = 'driver';

  useEffect(() => {
    if (userAttributes) { getUserInfo(); }
  }, [userAttributes]);

  const getUserInfo = () => {
    console.log("getting user info");
    getAssociatedSponsor(); getDriverInfo();
  }
  const setUserAttributes = (user) => {
    if (userType === 'driver'){ setAddress(user.driverAddress); }
    setPhoneNumber(user.userPhoneNumber);
    setEmail(user.email);
    setLastName(user.lastName);
    setFirstName(user.firstName);
    setUsername(user.userUsername);
  }

  const getDriverInfo = () => {
    fetch(BaseURL + '/driverInfoFromSub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sub: inheritedSub?.value2 ? inheritedSub.value2 : userAttributes.sub })
    })
    .then(response => {
      if (response.ok) { 
        return response.json();
      } 
      else { console.error('Failed to get user'); }
    })
    .then(data => {
      setUserAttributes(data[0]);
    })
    .catch(error => {
      console.error('Failed to get user:', error);
    });
  }

  const [drivers, setDrivers, data] = useState([])
    useEffect(() => {
        fetch(BaseURL + "/activeDrivers")
        .then(res => res.json())
        .then(data => {
            // Store the fetched driver data in state
            setDrivers(data);  
            //console.log(data);
            data.forEach((driver, index) => {
              // console.log(`Driver ${index + 1} points:`, driver.driverPoints);
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
  const handleGuidelines = () => {
    navigate('/guidelines')
  }
  const handleSignOut = () => {
    
    navigate('/')
    signOut();
  }

  const handleBackToSponsor = () => {
    inheritedUser.value2 = '';
    navigate('/sponsorProfile');
  }

  const getAssociatedSponsor = () => {
    var endpoint = '';
    if(userType === 'driver'){ endpoint = '/driverAssociatedSponsor' }
    else{ endpoint = '/associatedSponsor' }
      fetch(BaseURL + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({sub: inheritedSub?.value2 ? inheritedSub.value2 : (inheritedSub?.value ? inheritedSub.value : userAttributes.sub)})
      })
      .then(response => {
        if (response.ok) { 
          return response.json();
        } 
        else { console.error('Failed to post'); }
      })
      .then(data => {
        if(userType === 'driver'){ 
          console.log("sponsor set: " + data);
          setSponsorOrgName(data);	
        } else {
          setSponsorOrgName(data[0].sponsorOrgName);	 
        }
      })
      .catch(error => {
        console.error('Error retrieving successfully:', error);
      });
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
        {inheritedSub?.value2 && 
        <ListItem key={"Back To Sponsor"} disablePadding>
          <ListItemButton onClick={handleBackToSponsor}>
            <ListItemIcon>
              <UndoIcon/>
            </ListItemIcon>
            <ListItemText primary={"Back To Sponsor"} />
          </ListItemButton>
        </ListItem>
        }
        <ListItem key={"Driver Guidelines"} disablePadding>
          <ListItemButton onClick={handleGuidelines}>
            <ListItemIcon>
              <HelpCenterIcon/>
            </ListItemIcon>
            <ListItemText primary={"Driver Guidelines"} />
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
          <ListItemButton onClick={handleSignOut}>
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
          {/*<Typography variant="h6">My Sponsors:<>&nbsp;</></Typography>
            {sponsorOrgName.map((sponsor, index) => (
                <React.Fragment key={sponsor.sponsorOrgID}>
                    <Typography variant="h6">{sponsor.sponsorOrgName}{index < sponsorOrgName.length - 1 && <>,&nbsp;</>}</Typography>
                </React.Fragment>
            ))}
            */}
          <Typography variant="h6" style={{marginRight: '20px'}}>
            {sponsorOrgName.length > 0 && drivers.length > 0 && drivers[1] && drivers[1].driverPoints !== null ? 
            `Sponsors: ${sponsorOrgName.map(sponsor => sponsor.sponsorOrgName).join(', ')}` 
            : "No points available"}
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