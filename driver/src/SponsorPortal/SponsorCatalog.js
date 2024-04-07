import React, { useEffect, useState } from 'react';
import { Button, CardContent, CardHeader, CardMedia, Checkbox, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import SponsorAppBar from './SponsorAppBar';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import BaseURL from '../BaseURL';
import { useFetchUserAttributes } from '../CognitoAPI';


export default function SponsorCatalog() {
  const navigate = useNavigate();
  function back(){
    navigate(-1);
  }

  const MOVIES = "movies"
  const MUSIC = "music"
  const TVSHOWS = "tvShows"
  const AUDIOBOOKS = "audiobooks"
  const EBOOKS = "ebooks"

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
    const [sponsorOrgID, setSponsorOrgID] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

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

  const [showAdd, setShowAdd] = useState(true)
  const handleAdd = () => {
    setShowAdd(!showAdd)
  }

  const handleDriverCatalog = () => {
    navigate('/driverCatalog');
  };

  const userAttributes = useFetchUserAttributes();
    
    useEffect(() => {
        if (userAttributes && sponsorOrgID === null) {
        getAssociatedSponsor();
        }
    }, [userAttributes]); 
    
    useEffect(() => {
        sponsorOrgID != null ? setLoading(false) : setLoading(true);
        
    }, [sponsorOrgID]); 
    
    // get the sponsor first using the user sub
    useEffect(() => {
        if (userAttributes && sponsorOrgID === null) {
            getAssociatedSponsor();
        }
    }, [userAttributes]); 

    const [musicChecked, setMusicChecked] = useState(false)
    const [movieChecked, setMovieChecked] = useState(false)
    const [tvChecked, setTvChecked] = useState(false)
    const [audiobookChecked, setAudiobookChecked] = useState(false)
    const [ebookChecked, setEbookChecked] = useState(false)
    const [rulesCheck, setRulesCheck] = useState([])
    
    // once the sponsor is set get the catalog rules
    useEffect(() => {
        if(sponsorOrgID != null){
            getCatalogRules();
        }
    }, [sponsorOrgID]); 

    useEffect(() => {
        if(rulesCheck.length == 0) {
            const rules = originalRules.map((x) => x.catalogRuleName)
            setRulesCheck(rules)
            if (rules.includes(MUSIC)) {
                setMusicChecked(true)
                //document.getElementById("music").checked = true
            }
            if (rules.includes(MOVIES)) {
                setMovieChecked(true)
                //document.getElementById("movie").checked = true
            }
            if (rules.includes(TVSHOWS)) {
                setTvChecked(true)
                //document.getElementById("tvShow").checked = true
            }
            if (rules.includes(EBOOKS)) {
                setEbookChecked(true)
                //document.getElementById("ebook").checked = true
            }
            if (rules.includes(AUDIOBOOKS)) {
                setAudiobookChecked(true)
                //document.getElementById("audiobook").checked = true
            }
        }
    }, [rulesCheck])

    const [originalRules, setOriginalRules] = useState([])
    const getCatalogRules = () => {
        const url = new URL(BaseURL + "/sponsorCatalogRules");
        url.searchParams.append('sponsorOrgID', sponsorOrgID);
        fetch(url)
        .then(res => res.json())
        .then(data => setOriginalRules(data))
        .catch(err => console.log(err));
        const rules = originalRules.map((x) => x.catalogRuleName)
            setRulesCheck(rules)
            if (rules.includes(MUSIC)) {
                setMusicChecked(true)
                //document.getElementById("music").checked = true
            }
            if (rules.includes(MOVIES)) {
                setMovieChecked(true)
                //document.getElementById("movie").checked = true
            }
            if (rules.includes(TVSHOWS)) {
                setTvChecked(true)
                //document.getElementById("tvShow").checked = true
            }
            if (rules.includes(EBOOKS)) {
                setEbookChecked(true)
                //document.getElementById("ebook").checked = true
            }
            if (rules.includes(AUDIOBOOKS)) {
                setAudiobookChecked(true)
                //document.getElementById("audiobook").checked = true
            }
    }
  
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(musicChecked)
        console.log(movieChecked)
        console.log(tvChecked)
        console.log(audiobookChecked)
        console.log(ebookChecked)
        if (!musicChecked && !movieChecked && !tvChecked && !audiobookChecked && !ebookChecked) {
            document.getElementById("errorMsg").style.display = "";
        }
        else {
            if (musicChecked && !rulesCheck.includes(MUSIC)) {
                console.log(sponsorOrgID)
                fetch(BaseURL + '/addCatalogRule', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({sponsorOrgID: sponsorOrgID, catalogRuleName: MUSIC})
                })
                .then(response => {
                    if (response.ok) { 
                    return response.json();
                    } 
                    else { console.error('Failed to post'); }
                })
                .catch(error => {
                    console.error('Error retrieving successfully:', error);
                });
            }
            else if (!musicChecked && rulesCheck.includes(MUSIC)) {
                console.log(sponsorOrgID)
                fetch(BaseURL + '/removeCatalogRule', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({sponsorOrgID: sponsorOrgID, catalogRuleName: MUSIC})
                })
                .then(response => {
                    if (response.ok) { 
                    return response.json();
                    } 
                    else { console.error('Failed to post'); }
                })
                .catch(error => {
                    console.error('Error retrieving successfully:', error);
                });
            }
            if (movieChecked && !rulesCheck.includes(MOVIES)) {
                console.log(sponsorOrgID)
                fetch(BaseURL + '/addCatalogRule', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({sponsorOrgID: sponsorOrgID, catalogRuleName: MOVIES})
                })
                .then(response => {
                    if (response.ok) { 
                    return response.json();
                    } 
                    else { console.error('Failed to post'); }
                })
                .catch(error => {
                    console.error('Error retrieving successfully:', error);
                });
            }
            else if (!movieChecked && rulesCheck.includes(MOVIES)) {
                console.log(sponsorOrgID)
                fetch(BaseURL + '/removeCatalogRule', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({sponsorOrgID: sponsorOrgID, catalogRuleName: MOVIES})
                })
                .then(response => {
                    if (response.ok) { 
                    return response.json();
                    } 
                    else { console.error('Failed to post'); }
                })
                .catch(error => {
                    console.error('Error retrieving successfully:', error);
                });
            }
            if (tvChecked && !rulesCheck.includes(TVSHOWS)) {
                console.log(sponsorOrgID)
                fetch(BaseURL + '/addCatalogRule', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({sponsorOrgID: sponsorOrgID, catalogRuleName: TVSHOWS})
                })
                .then(response => {
                    if (response.ok) { 
                    return response.json();
                    } 
                    else { console.error('Failed to post'); }
                })
                .catch(error => {
                    console.error('Error retrieving successfully:', error);
                });
            }
            else if (!tvChecked && rulesCheck.includes(TVSHOWS)) {
                console.log(sponsorOrgID)
                fetch(BaseURL + '/removeCatalogRule', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({sponsorOrgID: sponsorOrgID, catalogRuleName: TVSHOWS})
                })
                .then(response => {
                    if (response.ok) { 
                    return response.json();
                    } 
                    else { console.error('Failed to post'); }
                })
                .catch(error => {
                    console.error('Error retrieving successfully:', error);
                });
            }
            if (audiobookChecked && !rulesCheck.includes(AUDIOBOOKS)) {
                console.log(sponsorOrgID)
                fetch(BaseURL + '/addCatalogRule', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({sponsorOrgID: sponsorOrgID, catalogRuleName: AUDIOBOOKS})
                })
                .then(response => {
                    if (response.ok) { 
                    return response.json();
                    } 
                    else { console.error('Failed to post'); }
                })
                .catch(error => {
                    console.error('Error retrieving successfully:', error);
                });
            }
            else if (!audiobookChecked && rulesCheck.includes(AUDIOBOOKS)) {
                console.log(sponsorOrgID)
                fetch(BaseURL + '/removeCatalogRule', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({sponsorOrgID: sponsorOrgID, catalogRuleName: AUDIOBOOKS})
                })
                .then(response => {
                    if (response.ok) { 
                    return response.json();
                    } 
                    else { console.error('Failed to post'); }
                })
                .catch(error => {
                    console.error('Error retrieving successfully:', error);
                });
            }
            if (ebookChecked && !rulesCheck.includes(EBOOKS)) {
                console.log(sponsorOrgID)
                fetch(BaseURL + '/addCatalogRule', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({sponsorOrgID: sponsorOrgID, catalogRuleName: EBOOKS})
                })
                .then(response => {
                    if (response.ok) { 
                    return response.json();
                    } 
                    else { console.error('Failed to post'); }
                })
                .catch(error => {
                    console.error('Error retrieving successfully:', error);
                });
            }
            else if (!ebookChecked && rulesCheck.includes(EBOOKS)) {
                console.log(sponsorOrgID)
                fetch(BaseURL + '/removeCatalogRule', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({sponsorOrgID: sponsorOrgID, catalogRuleName: EBOOKS})
                })
                .then(response => {
                    if (response.ok) { 
                    return response.json();
                    } 
                    else { console.error('Failed to post'); }
                })
                .catch(error => {
                    console.error('Error retrieving successfully:', error);
                });
            }
            window.location.reload();
        }
    }

    const handleTvChange = (e) => {
        setTvChecked(e.target.checked)
    }
    const handleMusicChange = (e) => {
        setMusicChecked(e.target.checked)
    }
    const handleMovieChange = (e) => {
        setMovieChecked(e.target.checked)
    }
    const handleAudioChange = (e) => {
        setAudiobookChecked(e.target.checked)
    }
    const handleEbookChange = (e) => {
        setEbookChecked(e.target.checked)
    }

  return (
    <div>
        <SponsorAppBar/>
        <div style={{ marginLeft: '25px' }}>
            <h1 className="catalog-header">Catalog Rules</h1>
            <div style={{display: 'flex'}}>
                {rulesCheck.length != 0 &&
            <Button onClick={handleAdd}>Change/View Rules</Button>
                }
            <Button onClick={handleDriverCatalog}>View As Driver</Button>
            </div>
            {showAdd &&     
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{paddingRight: 20}}>
                        <form id='catalogRules' onSubmit={handleSubmit}>
                            <h2>Allowed Content</h2>
                            <input style={{accentColor: "#90caf9", color:"white", width:"20px", height:"20px"}}
                            type='checkbox' id="music" name="music" value="music" onChange={handleMusicChange} checked={musicChecked}></input>
                            <label htmlFor="music">
                                <Typography variant='h6' sx={{display:"inline"}}>Music</Typography>
                            </label>
                            <br></br>
                            <input style={{accentColor: "#90caf9", color:"white", width:"20px", height:"20px"}} 
                            type='checkbox' id="movie" name="movie" value="movie" onChange={handleMovieChange} checked={movieChecked}></input>
                            <label htmlFor="movie">
                                <Typography variant='h6' sx={{display:"inline"}}>Movies</Typography>
                            </label>
                            <br></br>
                            <input style={{accentColor: "#90caf9", color:"white", width:"20px", height:"20px"}}
                            type='checkbox' id="tvShow" name="tvShow" value="tvShow" onChange={handleTvChange} checked={tvChecked}></input>
                            <label htmlFor="tvShow">
                                <Typography variant='h6' sx={{display:"inline"}}>TV Shows</Typography>
                            </label>
                            <br></br>
                            <input style={{accentColor: "#90caf9", color:"white", width:"20px", height:"20px"}}
                            type='checkbox' id="audiobook" name="audiobook" value="audiobook" onChange={handleAudioChange} checked={audiobookChecked}></input>
                            <label htmlFor="audiobook">
                                <Typography variant='h6' sx={{display:"inline"}}>Audio Books</Typography>
                            </label>
                            <br></br>
                            <input style={{accentColor: "#90caf9", color:"white", width:"20px", height:"20px"}}
                            type='checkbox' id="ebook" name="ebook" value="ebook" onChange={handleEbookChange} checked={ebookChecked}></input>
                            <label htmlFor="ebook">
                                <Typography variant='h6' sx={{display:"inline"}}>E-Books</Typography>
                            </label>
                            <br></br>
                            <input style={{padding: "10px 30px", backgroundColor: "#90caf9", border: "0px", borderRadius: "5px", cursor:"pointer"}}
                            id='submitButton'
                            onMouseOver={() => {
                                document.getElementById("submitButton").style.backgroundColor="#c5e3fb"
                            }}
                            onMouseOut={() => {
                                document.getElementById("submitButton").style.backgroundColor="#90caf9"
                            }}
                            type='submit' value="Submit"></input>
                        </form>
                    </div>
                    <p id='errorMsg' style={{color: "red", display:"none"}}>At least one item must be selected!</p>
                </div>
            }
            {/* old card styling -- commenting out just to have in case
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
            */
            }
        </div>
   </div>
  );
}