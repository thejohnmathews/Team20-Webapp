import SponsorAppBar from "./SponsorAppBar";
import { Switch, InputLabel, Select, MenuItem, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";
import BaseURL from "../BaseURL"

export default function SponsorPoints(){

    const [checked, setChecked] = useState(true);
    const handleChecked = () => {
        setChecked(!checked);
    };
    
    const [goodReasons, setGoodReasons] = useState([])
    useEffect(() => {
        fetch(BaseURL + "/goodReasons")
        .then(res => res.json())
        .then(goodReasons => setGoodReasons(goodReasons))
        .catch(err => console.log(err));
    }, [])

    const [badReasons, setBadReasons] = useState([])
    useEffect(() => {
        fetch(BaseURL + "/badReasons")
        .then(res => res.json())
        .then(badReasons => setBadReasons(badReasons))
        .catch(err => console.log(err));
    }, [])

    const [selectedDriver, setSelectedDriver] = useState("");
    const handleDriverChange = (event) => {
        setSelectedDriver(event.target.value);
    };

    const [reason, setReason] = useState("")
    const handleReasonChange = (event) => {
        if (event && event.target){
            const selectedReasonID = event.target.value
            setReason(selectedReasonID)
        }
    } 

    const [pointValue, setPointValue] = useState("");
    const handlePointValueChange = (event) => {
        setPointValue(event.target.value);
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
        const data = {
            userID: selectedDriver,
            reasonID: reason, 
            driverPoints: pointValue 
        };
        console.log(data)
        if(checked){
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
                value={reason}
                onChange={handleReasonChange}
            >
                {goodReasons.map((reason, index) => (
                    <MenuItem key={reason.reasonID} value={reason.reasonID}>
                        {reason.reasonString}
                    </MenuItem>
                ))}
                <MenuItem value={"Other"}>Other</MenuItem>
            </Select></div>}
            {!checked && badReasons.length > 0 &&<div><InputLabel id="bad-reasons">Bad Reasons</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Bad Reasons"
                sx={{minWidth: 200}}
                value={reason}
                onChange={handleReasonChange}
            >
                {badReasons.map((reason, index) => (
                    <MenuItem key={reason.reasonID} value={reason.reasonID}>
                        {reason.reasonString}
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