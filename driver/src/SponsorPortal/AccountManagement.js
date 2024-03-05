import React from 'react';
import { Box, Tabs, Tab, Typography, Container } from '@mui/material';
import SponsorAppBar from './SponsorAppBar';
import DriverTable from '../UserPoolTables/DriverTable'
import SponsorTable from '../UserPoolTables/SponsorTable'

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
	<div>
		<SponsorAppBar/>
		<Container>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
					<Tab label="Drivers" />
					<Tab label="Sponsors" />
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				<DriverTable permission={"sponsor"}/>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<SponsorTable permission={"sponsor"}/>
			</TabPanel>
		</Container>
	</div>
	);
}

export default App;
