import * as React from 'react';
import {AppBar, Box, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Drawer, Dialog, DialogActions, DialogContent, Grid, DialogTitle, Button} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LogoutIcon from '@mui/icons-material/Logout';
import SwitchAccessShortcutIcon from '@mui/icons-material/SwitchAccessShortcut';
import { useAuthenticator } from '@aws-amplify/ui-react';
import ViewAsSponsor from './ViewAsSponsor';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import logo from '../bezosBunch.png';

export default function AdminAppBar() {
  const [open, setOpen] = React.useState(false);
  const { user, signOut } = useAuthenticator((context) => [context.user]);
  const [openSelect, setOpenSelect] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/adminProfile');
  };

  const handleSponsorView = () => {
    setOpenSelect(true);
  }

  const handleSponsorViewClose = () => {
    setOpenSelect(false);
  }

  const handleAbout = () => {
    navigate('/adminAbout');
  };

  const handleAccount = () => {
    navigate('/adminAccountManagement');
  };

  const handleOrgManagement = () => {
    navigate('/adminOrgManagement');
  };

  const handleDriverApps = () => {
    navigate('/adminDriverApplicaitons');
  };

  const handlePointChanges = () => {
    navigate('/AdminPointChanges');
  };

  const handleReports = () => {
    navigate('/adminReports')
  }

  const handleSales = () => {
    navigate('/adminSales')
  }

  const handleSignOut = () => {
    
    navigate('/')
    signOut();
  }

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
      <ListItem key={"Account Management"} disablePadding>
          <ListItemButton onClick={handleAccount}>
            <ListItemIcon>
              <ManageAccountsIcon/>
            </ListItemIcon>
            <ListItemText primary={"Account Management"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Pending Driver Applications"} disablePadding>
          <ListItemButton onClick={handleDriverApps}>
            <ListItemIcon>
              <PendingActionsIcon/>
            </ListItemIcon>
            <ListItemText primary={"Pending Driver Applications"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Point Changes"} disablePadding>
          <ListItemButton onClick={handlePointChanges}>
            <ListItemIcon>
              <PointOfSaleIcon/>
            </ListItemIcon>
            <ListItemText primary={"Point Changes"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Organization Management"} disablePadding>
          <ListItemButton onClick={handleOrgManagement}>
            <ListItemIcon>
              <BusinessIcon/>
            </ListItemIcon>
            <ListItemText primary={"Organization Management"} />
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
        <ListItem key={"Sales"} disablePadding>
          <ListItemButton onClick={handleSales}>
            <ListItemIcon>
              <MonetizationOnIcon/>
            </ListItemIcon>
            <ListItemText primary={"Sales"} />
          </ListItemButton>
        </ListItem>
        <ListItem key={"Sponsor View"} disablePadding>
          <ListItemButton onClick={handleSponsorView}>
            <ListItemIcon>
              <SwitchAccessShortcutIcon/>
            </ListItemIcon>
            <ListItemText primary={"Sponsor View"} />
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
                Admin Portal
                </Typography>
              </Grid>
          </Grid>      
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
        onClose={handleSponsorViewClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"View As A Sponsor"}</DialogTitle>
        <DialogContent>
          <ViewAsSponsor/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSponsorViewClose} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
  
}