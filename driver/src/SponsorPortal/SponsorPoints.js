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

    const [reason, setReason] = useState("")
    const handleReasonChange = (event) => {
        setReason(event.currentTarget.value)
        console.log(reason)
    } 

    console.log(goodReasons)
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
            >
                <MenuItem value={"driver1"}>driver 1</MenuItem>
                <MenuItem value={"driver2"}>driver 2</MenuItem>
                <MenuItem value={"driver3"}>driver 3</MenuItem>
            </Select>
            {checked && goodReasons.length > 0 &&<div><InputLabel id="good-reasons">Good Reasons</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Good Reasons"
                sx={{minWidth: 200}}
            >
                {goodReasons.map((reason, index) => (
                    <MenuItem key={index} value={reason.reasonString}>{reason.reasonString}</MenuItem>
                ))}
                <MenuItem value={"Other"}>Other</MenuItem>
            </Select></div>}
            {!checked && badReasons.length > 0 &&<div><InputLabel id="bad-reasons">Bad Reasons</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Good Reasons"
                sx={{minWidth: 200}}
            >
                {badReasons.map((reason, index) => (
                    <MenuItem key={index} value={reason.reasonString}>{reason.reasonString}</MenuItem>
                ))}
                <MenuItem value={"Other"}>Other</MenuItem>
            </Select></div>}
            <br></br>
            <TextField id="outlined-basic" label="Point value" variant="outlined" type="number" />
            <br></br>
            <Button>Submit</Button>
		</div>
	)
}