import * as React from 'react';
import {AppBar, Box, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Drawer} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InfoIcon from '@mui/icons-material/Info';
import StoreIcon from '@mui/icons-material/Store';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { useNavigate } from 'react-router-dom';


export default function SponsorAppBar() {
  const [open, setOpen] = React.useState(false);

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

  const handleAccountManage = () => {
    navigate('/sponsorAccountManagement');
  };

  const handleOrgManage = () => {
    navigate('/sponsorOrganizationManagement');
  };

  const handleCatalog = () => {
    navigate('/sponsorCatalog');
  };
  

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
              <ManageAccountsIcon/>
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