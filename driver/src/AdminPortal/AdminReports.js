import { Heading } from "@aws-amplify/ui-react";
import AboutPage from "../AboutPage";
import AdminAppBar from "./AdminAppBar";
import React, { useEffect, useState } from 'react'; 
import { Box, Tabs, Tab, Typography, Container } from '@mui/material';
import {Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button} from '@mui/material';
import { useFetchUserAttributes } from '../CognitoAPI';


export default function AdminReports(){
    const [value, setValue] = React.useState(0);  


    const userAttributes = useFetchUserAttributes();

    
    const handleChange = (event, newValue) => {
        console.log(userAttributes)
    };

	return(
		<div>
			<AdminAppBar/>
            <Container>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                          <Tab label="Login Attempts" />
                          <Tab label="Driver Applications" />
                          <Tab label="Password Changes" />
                          <Tab label="Driver Point Changes"/>
                      </Tabs>
                  </Box>
              </Container>
		</div>
	)
}