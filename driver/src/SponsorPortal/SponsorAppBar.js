import * as React from 'react';
import {AppBar, Box, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Drawer} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useNavigate } from 'react-router-dom';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BusinessIcon from '@mui/icons-material/Business';
import SavingsIcon from '@mui/icons-material/Savings';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import { useEffect, useState } from 'react';
import { useFetchUserAttributes, handleUpdateUserAttributes } from '../CognitoAPI';
import BaseURL from '../BaseURL';
import { useAuthenticator } from '@aws-amplify/ui-react';


export default function SponsorAppBar() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [open, setOpen] = React.useState(false);
  const userType = 'sponsor'

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/sponsorProfile');
  };

  const handleAbout = () => {
    navigate('/sponsorAbout');
  };

  const handleReports = () => {
    navigate('/sponsorReports');
  };

  const handleAccountManage = () => {
    navigate('/sponsorAccountManagement');
  };

  const handleOrgManage = () => {
    navigate('/sponsorOrganizationManagement');
  };

  const handleCatalog = () => {
    navigate('/sponsorCatalog');
  };

  const handlePointManagement = () => {
    navigate('/SponsorPoints');
  };

  const handleDriverApplications = () => {
    navigate('/sponsorDriverApplicaitons');
  };

  const [open2, setOpen2] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [sponsorOrgName, setSponsorOrgName] = React.useState('');

  const userAttributes = useFetchUserAttributes();

  useEffect(() => {
    if (userAttributes) {
      setUsername(userAttributes.preferred_username || '');
      setFirstName(userAttributes.given_name || '');
      setLastName(userAttributes.family_name || '');
      setEmail(userAttributes.email || '');
      setPhoneNumber(userAttributes["custom:Phone"] || '');
      setAddress(userAttributes.address || '');
      if(userType !== 'admin'){ getAssociatedSponsor(); }
      else{ getUserInfo();}
      
    }
  }, [userAttributes]);

  const getUserInfo = () => {
    fetch(BaseURL + '/adminInfoFromSub', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({sub:userAttributes.sub })
    })
    .then(response => {
      if (response.ok) { 
        return response.json();
      } 
      else { console.error('Failed to get user'); }
    })
    .then(data => {
      setUsername(data[0].userUsername || '');
      setFirstName(data[0].firstName || '');
      setLastName(data[0].lastName || '');
      setEmail(data[0].email || '');
    })
    .catch(error => {
      console.error('Failed to get user:', error);
    });
  }

  const [sponsors, setSponsors] = useState([])
    useEffect(() => {
        fetch(BaseURL + "/activeSponsors")
        .then(res => res.json())
        .then(data => {
            // Store the fetched driver data in state
            setSponsors(data);  
            console.log(data);

        })
        .catch(err => console.error('Error fetching driver data:', err));
  }, []);

  const getAssociatedSponsor = () => {
    var endpoint = '';
    if(userType === 'driver'){ endpoint = '/driverAssociatedSponsor' }
    else{ endpoint = '/associatedSponsor' }
      fetch(BaseURL + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({sub: userAttributes.sub})
      })
      .then(response => {
        if (response.ok) { 
          return response.json();
        } 
        else { console.error('Failed to post'); }
      })
      .then(data => {
        if(userType === 'driver'){ 
          console.log(data);
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
      <ListItem key={"Account Management"} disablePadding>
          <ListItemButton onClick={handleAccountManage}>
            <ListItemIcon>
              <ManageAccountsIcon/>
            </ListItemIcon>
            <ListItemText primary={"Account Management"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Organization Management"} disablePadding>
          <ListItemButton onClick={handleOrgManage}>
            <ListItemIcon>
              <BusinessIcon/>
            </ListItemIcon>
            <ListItemText primary={"Organization Management"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Driver Applications"} disablePadding>
          <ListItemButton onClick={handleDriverApplications}>
            <ListItemIcon>
              <PendingActionsIcon/>
            </ListItemIcon>
            <ListItemText primary={"Driver Applications"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Point Management"} disablePadding>
          <ListItemButton onClick={handlePointManagement}>
            <ListItemIcon>
              <SavingsIcon/>
            </ListItemIcon>
            <ListItemText primary={"Point Management"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Reports"} disablePadding>
          <ListItemButton onClick={handleReports}>
            <ListItemIcon>
              <AssessmentIcon/>
            </ListItemIcon>
            <ListItemText primary={"Reports"} />
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
            Sponsor Portal
          </Typography>
          <Typography variant="h6">My Sponsor: {sponsorOrgName}</Typography>
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