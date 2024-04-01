import * as React from 'react';
import {AppBar, Box, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Drawer} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import BusinessIcon from '@mui/icons-material/Business';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthenticator } from '@aws-amplify/ui-react';

export default function AdminAppBar() {
  const [open, setOpen] = React.useState(false);
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate('/adminProfile');
  };

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
            Admin Portal
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