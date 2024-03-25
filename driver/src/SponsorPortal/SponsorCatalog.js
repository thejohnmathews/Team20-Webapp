import React, { useEffect, useState } from 'react';
import { Button, CardContent, CardHeader, CardMedia, Checkbox, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import SponsorAppBar from './SponsorAppBar';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


export default function SponsorCatalog() {
  const navigate = useNavigate();
  function back(){
    navigate(-1);
  }
  
  const [data, setData] = useState([])
  useEffect(() => {
    fetch("https://itunes.apple.com/search?media=movie&term=jujutsu+kaisen")
    .then(res => res.json())
    .then(data => setData(data.results[0]))
    .then(console.log(data))
    .catch(err => console.log(err));
  }, [])

  const [expanded, setExpanded] = useState(false)
  const handleExpand = () => {
    setExpanded(!expanded);
  }

  const [showAdd, setShowAdd] = useState(false)
  const handleAdd = () => {
    setShowAdd(!showAdd)
  }

  const handleDriverCatalog = () => {
    navigate('/driverCatalog');
  };

  return (
    <div>
        <SponsorAppBar/>
        <div style={{ marginLeft: '25px' }}>
            <h1 className="catalog-header">Catalog Rules</h1>
            <div style={{display: 'flex'}}>
            <Button onClick={handleAdd}>Change/View Rules</Button>
            <Button onClick={handleDriverCatalog}>View As Driver</Button>
            </div>
            {showAdd && 
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{paddingRight: 20}}>
                        <FormGroup>
                            <h2>Allowed Content</h2>
                            <FormControlLabel control={<Checkbox/>} label="Music"/>
                            <FormControlLabel control={<Checkbox/>} label="Movies"/>
                            <FormControlLabel control={<Checkbox/>} label="TV Shows"/>
                            <FormControlLabel control={<Checkbox/>} label="Audio Books"/>
                            <FormControlLabel control={<Checkbox/>} label="E-Books"/>
                        </FormGroup>
                    </div>
                    <div>
                        <h2>Items per Page</h2>
                        <p style={{fontStyle: 'italic'}}>Please enter a value betwen 1 and 200</p>
                        <TextField sx={{width: 200}}></TextField>
                    </div>
                </div>
            }
            <p>iTunes api proof of concept</p>
            <p style={{fontStyle: 'italic'}}>Items provided by iTunes</p>
            {data !== [] &&
            <Card sx={{display: 'flex', width: 400}}>
                <CardMedia
                    component="img"
                    image={data.artworkUrl100}
                    sx={{width: 120}}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{flex: '1 0 auto'}}>
                        <CardHeader
                            title={data.trackName}
                            subheader={data.collectionPrice}
                        >
                        </CardHeader>
                    </CardContent>
                    <Button onClick={handleExpand}>
                        View More
                    </Button>
                </Box>
                <div>
                {expanded && 
                    <div>
                        <p>{data.longDescription}</p> 
                        <p>Created By: {data.artistName}</p>
                        <p>Genre: {data.primaryGenreName}</p>
                    </div>
                }
                </div>
            </Card>
            
            }
        </div>
   </div>
  );
}