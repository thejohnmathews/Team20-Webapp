import SponsorAppBar from "./SponsorAppBar";
import { Snackbar, Switch, InputLabel, Select, MenuItem, TextField, Button, Paper, Box, Typography, Divider, FormControl, Grid, FormGroup, FormControlLabel  } from "@mui/material";
import { useState, useEffect } from "react";
import BaseURL from '../BaseURL';
import { useFetchUserAttributes } from '../CognitoAPI';

export default function SponsorPoints({inheritedSub}){
    const [goodReasons, setGoodReasons] = useState([])
    const [open, setOpen] = useState(false)
    const [sponsorOrgID, setSponsorOrgID] = useState(null)
    const [badReasons, setBadReasons] = useState([])
    const userAttributes = useFetchUserAttributes();

    const handleClose = () => {
        setOpen(false);
    }

    const [checked, setChecked] = useState(true);
    const handleChecked = () => {
        setChecked(!checked);
    };

    // get the sponsor first using the user sub
    useEffect(() => {
        if (userAttributes && sponsorOrgID === null) {
            getAssociatedSponsor();
        }
    }, [userAttributes]); 

    // once the sponsor is set get the reasons
    useEffect(() => {
        if(sponsorOrgID != null){
            getGoodReasons();
            getBadReasons();
        }
    
    }, [sponsorOrgID]); 

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
          console.log(data[0].sponsorOrgID);
          setSponsorOrgID(data[0].sponsorOrgID);			
        })
        .catch(error => {
          console.error('Error retrieving successfully:', error);
        });
    }

    const getGoodReasons = () => {
        const url = new URL(BaseURL + "/goodReasons");
        url.searchParams.append('sponsorOrgID', sponsorOrgID);

        fetch(url)
        .then(res => res.json())
        .then(data => setGoodReasons(data))
        .catch(err => console.log(err));
    }

    const getBadReasons = () => {
        const url = new URL(BaseURL + "/badReasons");
        url.searchParams.append('sponsorOrgID', sponsorOrgID);

        fetch(url)
        .then(res => res.json())
        .then(data => setBadReasons(data))
        .catch(err => console.log(err));
    }
    const [selectedDriver, setSelectedDriver] = useState("");
    const handleDriverChange = (event) => {
        setSelectedDriver(event.target.value);
    };

    const [selectedReason, setSelectedReason] = useState("")
    const handleReasonChange = (event) => {
            setSelectedReason(event.target.value)
    };

    const [pointValue, setPointValue] = useState("");
    const handlePointValueChange = (event) => {
        let value = event.target.value;
        setPointValue(value);
    };
    const [drivers, setDrivers] = useState("")
    useEffect(() => {
        fetch(BaseURL + "/activeDrivers")
        .then(res => res.json())
        .then(data => {
            // Store the fetched driver data in state
            setDrivers(data);
        })
        .catch(err => console.error('Error fetching driver data:', err));
    }, []);
    const handleSubmit = () => {
        const reasonIDInt = parseInt(selectedReason)
        var pointValueInt = parseInt(pointValue)
        //const sponsor = getAssociatedSponsor();
        console.log("changing sponsor: "+ sponsorOrgID);
        
        if(checked){
            const data = {
                userID: selectedDriver,
                reasonID: selectedReason, 
                sponsorID: sponsorOrgID,
                driverPoints: pointValueInt, 
                changeType: checked ? "good" : "bad"
            };
            console.log(data)
            fetch(BaseURL + "/updatePointsGood", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success: ', data);
                setOpen(true);
                setSelectedReason('');
                setPointValue('');
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors, if needed
            });
        }
        if(!checked){
            pointValueInt = -Math.abs(parseFloat(pointValueInt));
            const data = {
                userID: selectedDriver,
                reasonID: selectedReason, 
                sponsorID: sponsorOrgID,
                driverPoints: pointValueInt, 
                changeType: checked ? "good" : "bad"
            };
            console.log(data);
            fetch(BaseURL + "/updatePointsBad", {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success: ', data);
                setOpen(true);
                setSelectedReason('');
                setPointValue('');
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors, if needed
            });
        }
    }

    return(
		<div>
            <SponsorAppBar inheritedSub={inheritedSub}/>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
                <Paper elevation={8} sx={{ padding: '40px', width: '75%', backgroundColor: '#f5f5f5', position: 'relative' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h4" fontWeight="bold">
                            Point Management
                        </Typography>
                    </div>
                    <br/>
                    <Divider/>
                    <br/>
                    <Grid container spacing={2}>
                        <Grid item>
                            <FormGroup>
                                <FormControlLabel label={checked ? "Add Points" : "Remove Points"} control ={ 
                                    <Switch 
                                        defaultChecked 
                                        color="default" 
                                        checked={checked} 
                                        onChange={handleChecked}/>} 
                                />
                            </FormGroup>

                        </Grid>
                        <Grid item>
                            <FormControl >
                                <InputLabel id="drivers">Driver</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Driver"
                                    sx={{minWidth: 200}}
                                    value={selectedDriver}
                                    onChange={handleDriverChange}
                                >
                                    {drivers.length > 0 ? (
                                        drivers.map(driver => (
                                            <MenuItem key={driver.userID} value={driver.userID}>
                                                {`${driver.userID} - ${driver.firstName} ${driver.lastName}`}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>
                                            Error: No drivers available
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl>
                                {checked && goodReasons.length > 0 &&<div><InputLabel id="good-reasons">Good Reasons</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Good Reasons"
                                    sx={{minWidth: 200}}
                                    value={selectedReason}
                                    onChange={handleReasonChange}
                                >
                                    {goodReasons.map((reasonItem, index) => (
                                        <MenuItem key={reasonItem.reasonID} value={reasonItem.reasonID}>
                                            {selectedReason === reasonItem.reasonID ? reasonItem.reasonString : `${reasonItem.reasonString} (Other)`}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value={"Other"}>Other</MenuItem>
                                </Select></div>}
                                {!checked && badReasons.length > 0 &&<div><InputLabel id="bad-reasons">Bad Reasons</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    label="Good Reasons"
                                    sx={{minWidth: 200}}
                                    value={selectedReason}
                                    onChange={handleReasonChange}
                                >
                                    {badReasons.map((reasonItem, index) => (
                                        <MenuItem key={reasonItem.reasonID} value={reasonItem.reasonID}>
                                            {reasonItem.reasonString}
                                        </MenuItem>
                                    ))}
                                    <MenuItem value={"Other"}>Other</MenuItem>
                                </Select></div>}
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <TextField id="outlined-basic" label="Point value" variant="outlined" type="number" value={pointValue} onChange={handlePointValueChange}/>
                        </Grid>
                        <Grid item alignContent={'flex-end'}>
                            <Button variant={'contained'} onClick={handleSubmit} sx={{ height: '100%' }}>Submit</Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
            <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    message="Points Logged Successfully"
                    />
		</div>
	)
}