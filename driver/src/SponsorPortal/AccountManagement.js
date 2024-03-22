import React from 'react';
import { Box, Tabs, Tab, Typography, Container } from '@mui/material';
import SponsorAppBar from './SponsorAppBar';
import DriverTable from '../UserPoolTables/DriverTable'
import SponsorTable from '../UserPoolTables/SponsorTable'
import BaseURL from '../BaseURL'
import { useFetchUserAttributes } from '../CognitoAPI';


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

function AccountManagement() {
  const [value, setValue] = React.useState(0);  
  const [sponsorOrgID, setSponsorOrgID] = React.useState(null);
  const [loading, setLoading] = React.useState(true);


  const userAttributes = useFetchUserAttributes();

    React.useEffect(() => {
      getAssociatedSponsor();
  }, [userAttributes]); 

  React.useEffect(() => {
    sponsorOrgID != null ? setLoading(false) : setLoading(true);
    
  }, [sponsorOrgID]); 


  const getAssociatedSponsor = () => {
    fetch(BaseURL + '/associatedSponsor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({sub: '8448a408-6041-708e-33d8-e527c48e94b4'})
    })
    .then(response => {
      if (response.ok) { 
        return response.json();
      } 
      else { console.error('Failed to post'); }
    })
    .then(data => {
      console.log(data[0].sponsorOrgID);
      setSponsorOrgID(data[0].sponsorOrgID);			
    })
    .catch(error => {
      console.error('Error retrieving successfully:', error);
    });
    
  }
  

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
				{!loading && <DriverTable sponsorID={sponsorOrgID} permission={"sponsor"}/>}
			</TabPanel>
			<TabPanel value={value} index={1}>
        {!loading && <SponsorTable sponsorID={sponsorOrgID} permission={"sponsor"}/>}
			</TabPanel>
		</Container>
	</div>
	);
}

export default AccountManagement;
