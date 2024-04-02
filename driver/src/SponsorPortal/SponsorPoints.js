import SponsorAppBar from "./SponsorAppBar";
import { Switch, InputLabel, Select, MenuItem, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import BaseURL from '../BaseURL';
import { useFetchUserAttributes } from '../CognitoAPI';

export default function SponsorPoints(){
    const [goodReasons, setGoodReasons] = useState([])
    const [sponsorOrgID, setSponsorOrgID] = useState(null)
    const [badReasons, setBadReasons] = useState([])
    const userAttributes = useFetchUserAttributes();

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
          body: JSON.stringify({sub: userAttributes.sub})
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
        
        if(checked){
            const data = {
                userID: selectedDriver,
                reasonID: selectedReason, 
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
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors, if needed
            });
        }
    }

    return(
		<div>
			<SponsorAppBar/>
            <h1>Point Management</h1>
            {checked && <p>Add Points</p>}
            {!checked && <p>Remove Points</p>}
            <Switch 
                defaultChecked 
                color="default" 
                checked={checked} 
                onChange={handleChecked}/>
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
            <br></br>
            <TextField id="outlined-basic" label="Point value" variant="outlined" type="number" value={pointValue} onChange={handlePointValueChange}/>
            <br></br>
            <Button onClick={handleSubmit}>Submit</Button>
		</div>
	)
}