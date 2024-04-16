import * as React from 'react';
import {AppBar, Box, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, Grid, ListItemIcon, ListItemText, Divider, Drawer, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';
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
import { useEffect } from 'react';
import { useFetchUserAttributes } from '../CognitoAPI';
import BaseURL from '../BaseURL';
import { useAuthenticator } from '@aws-amplify/ui-react';
import SwitchAccessShortcutIcon from '@mui/icons-material/SwitchAccessShortcut';
import inheritedUser from '../App.js'
import UndoIcon from '@mui/icons-material/Undo';
import ViewAsDriver from './ViewAsDriver.js';
import logo from '../bezosBunch.png';

export default function SponsorAppBar({inheritedSub}) {
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [open, setOpen] = React.useState(false);
  const [openSelect, setOpenSelect] = React.useState(false);

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

  const handleBackToAdmin = () => {
    inheritedUser.value = ''
    navigate('/adminProfile');
  };

  const handleViewAsDriver = () => {
    setOpenSelect(true);
  };

  const handleDriverViewClose = () => {
    setOpenSelect(false);
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
  const handleSignOut = () => {
    
    navigate('/')
    signOut();
  }

  const [sponsorOrgName, setSponsorOrgName] = React.useState('');

  const userAttributes = useFetchUserAttributes();

  useEffect(() => {
    if (userAttributes) {
      getAssociatedSponsor();
    }
  }, [userAttributes]);

  const getAssociatedSponsor = () => {
      fetch(BaseURL + '/associatedSponsor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({sub: inheritedSub?.value ? inheritedSub.value : userAttributes.sub})
      })
      .then(response => {
        if (response.ok) { 
          return response.json();
        } 
        else { console.error('Failed to post'); }
      })
      .then(data => {
        setSponsorOrgName(data[0].sponsorOrgName);	 
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
        {inheritedSub?.value && 
        <ListItem key={"Back To Admin"} disablePadding>
          <ListItemButton onClick={handleBackToAdmin}>
            <ListItemIcon>
              <UndoIcon/>
            </ListItemIcon>
            <ListItemText primary={"Back To Admin"} />
          </ListItemButton>
        </ListItem>
        }
        <ListItem key={"View As Driver"} disablePadding>
          <ListItemButton onClick={handleViewAsDriver}>
            <ListItemIcon>
              <SwitchAccessShortcutIcon/>
            </ListItemIcon>
            <ListItemText primary={"View As Driver"} />
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
    <div>
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
          <Grid container alignItems="center" spacing={1}>
              <Grid item sx={{ height: '64px', display: 'flex', alignItems: 'center' }}>
                <img src={logo} alt="logo" style={{ height: '100%' }} />
              </Grid>
              <Grid item>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Sponsor Portal
                </Typography>
              </Grid>
          </Grid>

            <Typography variant="h6">{sponsorOrgName}</Typography>
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
    <Dialog
      open={openSelect}
      onClose={handleDriverViewClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"View As A Driver"}</DialogTitle>
      <DialogContent>
        <ViewAsDriver inheritedSub={inheritedSub}/>
      </DialogContent>
      <DialogActions>
      <Button onClick={handleDriverViewClose} autoFocus>
        Close
      </Button>
      </DialogActions>
  </Dialog>
  </div>
  );
}