import React, { useEffect, useState } from 'react';
import { Button, CardContent, CardHeader, CardMedia, Checkbox, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import SponsorAppBar from './SponsorAppBar';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import BaseURL from '../BaseURL';


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

  const handleSubmit = () => {

  }

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
                        <form id='catalogRules' method='POST' action={BaseURL + "/catalogRules"}>
                            <h2>Allowed Content</h2>
                            <input type='checkbox' id="music" name="music" value="music"></input>
                            <label htmlFor="music">Music</label>
                            <br></br>
                            <input type='checkbox' id="movie" name="movie" value="movie"></input>
                            <label htmlFor="movie">Movies</label>
                            <br></br>
                            <input type='checkbox' id="tvShow" name="tvShow" value="tvShow"></input>
                            <label htmlFor="tvShow">TV Shows</label>
                            <br></br>
                            <input type='checkbox' id="audiobook" name="audiobook" value="audiobook"></input>
                            <label htmlFor="audiobook">Audio Books</label>
                            <br></br>
                            <input type='checkbox' id="ebook" name="ebook" value="ebook"></input>
                            <label htmlFor="ebook">E-Books</label>
                            <br></br>
                            <input type='submit' value="Submit"></input>
                        </form>
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