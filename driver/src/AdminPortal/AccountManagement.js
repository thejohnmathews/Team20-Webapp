import React from 'react';
import { Box, Tabs, Tab, Typography, Container } from '@mui/material';
import AdminAppBar from './AdminAppBar';
import DriverTable from '../UserPoolTables/DriverTable'
import SponsorTable from '../UserPoolTables/SponsorTable'
import AdminTable from '../UserPoolTables/AdminTable'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function App() {
  const [value, setValue] = React.useState(0);
  const [refresh, setRefresh] = React.useState(true);



  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
	<div>
		<AdminAppBar/>
		<Container>
			
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					<Tab label="Drivers" />
					<Tab label="Sponsors" />
					<Tab label="Admins" />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				<DriverTable permission={"admin"}/>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<SponsorTable sponsorID={-1} permission={"admin"}/>
			</TabPanel>
			<TabPanel value={value} index={2}>
				<AdminTable refresh={refresh} setRefresh={setRefresh}/>
			</TabPanel>
		</Container>
	</div>
	);
}

export default App;
