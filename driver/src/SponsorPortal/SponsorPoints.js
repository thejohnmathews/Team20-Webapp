import SponsorAppBar from "./SponsorAppBar";
import { Switch, InputLabel, Select, MenuItem, TextField, Button } from "@mui/material";
import { useState, useEffect } from "react";

export default function SponsorPoints(){

    const [checked, setChecked] = useState(true);
    const handleChecked = () => {
        setChecked(!checked);
    };
    
    const [goodReasons, setGoodReasons] = useState([])
    useEffect(() => {
        fetch("https://team20.cpsc4911.com/goodReasons")
        .then(res => res.json())
        .then(goodReasons => setGoodReasons(goodReasons))
        .catch(err => console.log(err));
    }, [])

    const [badReasons, setBadReasons] = useState([])
    useEffect(() => {
        fetch("https://team20.cpsc4911.com/badReasons")
        .then(res => res.json())
        .then(badReasons => setBadReasons(badReasons))
        .catch(err => console.log(err));
    }, [])

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
                <MenuItem value={goodReasons[0].reasonString}>{goodReasons[0].reasonString}</MenuItem>
                <MenuItem value={goodReasons[1].reasonString}>{goodReasons[1].reasonString}</MenuItem>
                <MenuItem value={goodReasons[2].reasonString}>{goodReasons[2].reasonString}</MenuItem>
                <MenuItem value={goodReasons[3].reasonString}>{goodReasons[3].reasonString}</MenuItem>
                <MenuItem value={goodReasons[4].reasonString}>{goodReasons[4].reasonString}</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
            </Select></div>}
            {!checked && badReasons.length > 0 &&<div><InputLabel id="bad-reasons">Bad Reasons</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Bad Reasons"
                sx={{minWidth: 200}}
            >
                <MenuItem value={badReasons[0].reasonString}>{badReasons[0].reasonString}</MenuItem>
                <MenuItem value={badReasons[1].reasonString}>{badReasons[1].reasonString}</MenuItem>
                <MenuItem value={badReasons[2].reasonString}>{badReasons[2].reasonString}</MenuItem>
                <MenuItem value={badReasons[3].reasonString}>{badReasons[3].reasonString}</MenuItem>
                <MenuItem value={badReasons[4].reasonString}>{badReasons[4].reasonString}</MenuItem>
                <MenuItem value={badReasons[5].reasonString}>{badReasons[5].reasonString}</MenuItem>
                <MenuItem value={"Other"}>Other</MenuItem>
            </Select></div>}
            <br></br>
            <TextField id="outlined-basic" label="Point value" variant="outlined" type="number" />
            <br></br>
            <Button>Submit</Button>
		</div>
	)
}