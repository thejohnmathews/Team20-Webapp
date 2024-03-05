import React, { useEffect, useState } from 'react';
import { Button, CardContent, CardHeader, CardMedia } from '@mui/material';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import SponsorAppBar from './SponsorAppBar';
import InfoIcon from '@mui/icons-material/Info';


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

  return (
    <div>
        <SponsorAppBar/>
        <div style={{ marginLeft: '25px' }}>
            <h1 className="catalog-header">Catalog</h1>
            <p>iTunes api proof of concept</p>
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