import React, {useEffect, useState} from 'react';
import { Box } from '@mui/material';
import { Modal } from '@mui/material';
import Catalog from "../Catalog";
import DriverAppBar from "./DriverAppBar";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FilterIcon from '@mui/icons-material/Tune';
import SortIcon from '@mui/icons-material/SwapVert';
import DollarIcon from '@mui/icons-material/AttachMoney';
import AlphaIcon from '@mui/icons-material/SortByAlpha';
import DateIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import {Button} from '@mui/material';
import { Link } from 'react-router-dom'
import DriverCart from './DriverCart';
import BaseURL from '../BaseURL';
import { useFetchUserAttributes } from '../CognitoAPI';
import SearchIcon from '@mui/icons-material/Search';
import {Card} from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';


export default function DriverCatalog(){

    const MOVIES = "movies"
    const MUSIC = "music"
    const TVSHOWS = "tvShows"
    const AUDIOBOOKS = "audiobooks"
    const EBOOKS = "ebooks"

    //get sponsor id (will need to fanagle with this to see multiple sponsors)
    const userAttributes = useFetchUserAttributes();
    const getAssociatedSponsor = () => {
        fetch(BaseURL + '/driverAssociatedSponsor', {
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
            //console.log('list:')
            setSponsorList(data)
            setSponsorOrgID(data[0].sponsorOrgID);
        })
        .catch(error => {
          console.error('Error retrieving successfully:', error);
        });
    }
    useEffect(() => {
        if (userAttributes && sponsorOrgID === null) {
            getAssociatedSponsor();
        }
    }, [userAttributes]); 
    const [sponsorOrgID, setSponsorOrgID] = React.useState(null);
    const [sponsorName, setSponsorName] = useState("")
    const [sponsorList, setSponsorList] = useState([])
    const [databaseInfo, setDatabaseInfo] = useState([])
    const [loading, setLoading] = useState([])

    useEffect(() => {
        if(sponsorOrgID != null){
            console.log(sponsorOrgID)
            console.log(sponsorList)
            for (let i = 0; i < sponsorList.length; i++) {
                if (sponsorList[i].sponsorOrgID === sponsorOrgID) {
                    setSponsorName(sponsorList[i].sponsorOrgName)
                }
            }
            getCatalogRules();
        }
        else {
            console.log("womp womp")
        }
    }, [sponsorOrgID]); 

    useEffect(() => {
        sponsorOrgID != null ? setLoading(false) : setLoading(true);
        
    }, [sponsorOrgID]);
    
	const navigate = useNavigate();
    const [dataFetched, setDataFetched] = useState(false);
	const [albums, setAlbums] = useState([]);
    const [originalAlbums, setOriginalAlbums] = useState([]);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [selectedSortOption, setSelectedSortOption] = useState(null);
    const [sortedAlbums, setSortedAlbums] = useState([]);
    const [sortOptions, setSortOptions] = useState([
        {id: 0, label: 'Alphabetical', icon: AlphaIcon, selected: false},
        {id: 1, label: 'By Price', icon: DollarIcon, selected: false},
        {id: 2, label: 'By Release Date', icon: DateIcon, selected: false}
    ]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });
    const [filteredAlbums, setFilteredAlbums] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [sponsorRules, setSponsorRules] = useState([])
    const [catalogItems, setCatalogItems] = useState([])

    const [movieList, setMovieList] = useState([])
    const [musicList, setMusicList] = useState([])
    const [tvList, setTvList] = useState([])
    const [audioList, setAudioList] = useState([])
    const [ebookList, setEbookList] = useState([])

    const addToCart = album => {
        const updatedCartItems = [...cartItems, album];
        setCartItems(updatedCartItems);
        sessionStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    }
	const handleCart = () => {
		navigate('/driverCart');
	};
    {/*Sort Functions*/}
    const handleSort = () => {
        setIsSortOpen(true);
    };
    const handleCloseSort = () => {
        setIsSortOpen(false);
    };
    const handleSortOptionSelect = (option) => {
        let sorted; 
        if(option.id === 0){
            sorted = [...musicList].sort((a, b) => a.collectionName.localeCompare(b.collectionName));
        }
        else if(option.id === 1){
            sorted = [...musicList].sort((a, b) => a.collectionPrice - b.collectionPrice);
        }
        else if(option.id === 2){
            sorted = [...musicList].sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        }
        setSortedAlbums(sorted);

        setSortOptions(prevOptions => {
            return prevOptions.map(opt => ({
                ...opt,
                selected: opt.id === option.id
            }));
        });

        setIsSortOpen(false);
    };
    const handleUndoSort = () => {
        setMusicList(originalAlbums);
        setSortedAlbums([]);
        setSortOptions(prevOptions => prevOptions.map(opt => ({ ...opt, selected: false })));
    };
    {/*Filter Functions*/}
    const handleFilter = () => {
        setIsFilterOpen(true);
    };
    const handleCloseFilter = () => {
        setIsFilterOpen(false);
    };

    const handleApplyFilter = () => {
        // Filter albums based on price range
        const filtered = musicList.filter(album => {
            const price = parseFloat(album.collectionPrice);
            const min = parseFloat(priceFilter.min);
            const max = parseFloat(priceFilter.max);
            return (!min || price >= min) && (!max || price <= max);
        });
        const sortedFiltered = [...filtered].sort((a, b) => a.collectionPrice - b.collectionPrice);
        setSortedAlbums(sortedFiltered);
        setIsFilterOpen(false);
    };

    const getCatalogRules = () => {
        const url = new URL(BaseURL + "/sponsorCatalogRules");
        url.searchParams.append('sponsorOrgID', sponsorOrgID);
        fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => {
            if (response.ok) { 
              return response.json();
            } 
            else { console.error('Failed to post'); }
          })
          .then(data => {
            setDatabaseInfo(data)
          })
    }
    useEffect(() => {
        var rules = databaseInfo.map((x) => x.catalogRuleName)
        setSponsorRules(rules)
        console.log("rules:")
        console.log(rules)
    }, [databaseInfo])
    
    const handleCatalog = () => {
        //handle searchbar text
        setLoading(true)
        var text = document.getElementById('searchbar').value
        var content = text.replace(" ","+")
        setCatalogItems([])
        setMusicList([])
        setSortedAlbums([])
        //1. check what rules are available
        //call fetch from within these checks
        if (sponsorRules.includes(MOVIES)) {
            fetch('https://itunes.apple.com/search?limit=10&media=movie&term='+content)
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                let newData = data.results
                //console.log(data.results)
                newData = newData.filter((element) => element.collectionPrice > 0)
                setMovieList(newData)
                //console.log(data.results)
            })
			// Handle any errors that occur during the fetch
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
        if (sponsorRules.includes(MUSIC)) {
            fetch('https://itunes.apple.com/search?limit=10&entity=album&term='+content)
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                let newData = data.results
                //console.log(newData)
                newData = newData.filter((element) => element.collectionPrice > 0)
                setMusicList(newData)
                setOriginalAlbums(data.results)
            })
			// Handle any errors that occur during the fetch
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
        if (sponsorRules.includes(TVSHOWS)) {
            fetch('https://itunes.apple.com/search?limit=10&media=tvShow&term='+content)
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                let newData = data.results
                //console.log(data.results)
                newData = newData.filter((element) => element.collectionPrice > 0)
                setTvList(newData)
            })
			// Handle any errors that occur during the fetch
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
        if (sponsorRules.includes(AUDIOBOOKS)) {
            fetch('https://itunes.apple.com/search?limit=10&media=audiobook&term='+content)
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                let newData = data.results
                //console.log(data.results)
                newData = newData.filter((element) => element.collectionPrice > 0)
                setAudioList(newData)
            })
			// Handle any errors that occur during the fetch
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
        if (sponsorRules.includes(EBOOKS)) {
            fetch('https://itunes.apple.com/search?limit=10&media=ebook&term='+content)
            .then(response => response.json())
            .then(data => {
                //console.log(data)
                //setEbookList(data.results)
                let newData = data.results
                //console.log(data.results)
                newData = newData.filter((element) => element.price > 0)
                //console.log("new data:")
                setEbookList(newData)
            })
			// Handle any errors that occur during the fetch
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        }
        setLoading(false)
        //1.5 set loading to true
        //2. fetch all types with valid rules
        //3. get all the data in one place
        //4. map the data
        //4.5 set loading to false
        //5. show the data to the user
    }

    const handleSelectSponsor = (e) => {
        setSponsorName(e.target.value)
        for (let i = 0; i < sponsorList.length; i++) {
            if (sponsorList[i].sponsorOrgName == e.target.value) {
                setSponsorOrgID(sponsorList[i].sponsorOrgID)
            }
        }
    }

	// Dependency Array
	return (
        <div>
            <DriverAppBar />
            <Catalog />
            <InputLabel id="selectLabel" style={{marginLeft:"20px"}}>Current Sponsor</InputLabel>
            <Select
                label="Current Sponsor"
                value={sponsorName}
                onChange={handleSelectSponsor}
                style={{width: "180px", marginLeft:"20px"}}>
                {sponsorList?.map(id => (
                    <MenuItem value={id.sponsorOrgName}>{id.sponsorOrgName}</MenuItem>
                ))}
            </Select>
            <Box sx={{ marginLeft: '10px', display: 'flex', alignItems: 'flex-end', paddingBottom:"20px"}}>
                <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField 
                    id="searchbar" 
                    label="Search the catalog..." 
                    variant="standard" 
                    sx={{width: "300px"}}/>
                <Button variant='contained' onClick={handleCatalog}>Search</Button>
            </Box>
            {!loading && 
            <div style={{ marginLeft: '25px', display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"30px"}}>
                {/* Loops through returned data and displays it */}
                {musicList.length > 0 && (sortedAlbums.length > 0 ? sortedAlbums : musicList).map(album => (
                
                <Card key={album.collectionId} sx={{width: '300px'}}>
                    <CardContent>
                        <h2 style={{textAlign:"center"}}>{album.collectionName}</h2>
                        <img style={{margin:"auto", marginTop:"-10px", width:"100px", display:"block"}} src={album.artworkUrl100} alt="Album Artwork" />
                        <p style={{fontSize: "large", textAlign:"center"}}>{album.artistName}</p>
                        <p style={{fontStyle: "italic", textAlign:"center", marginTop:"-20px"}}>{album.primaryGenreName}</p>
                        <p style={{fontStyle: "italic", textAlign:"center", marginTop:"-20px"}}>Album</p>
                        <p style={{fontSize: "large", textAlign:"center"}}>Price: {album.collectionPrice} Points</p>
                    </CardContent>
                    <CardActions>
                        <div style={{display: "flex", justifyContent:"center"}}>
                            <Button style={{ cursor: 'pointer', marginRight: '25px'}} variant="contained" color="primary" onClick={() => addToCart(album)}>Add to Cart</Button>
                            <a href={album.collectionViewUrl} target="_blank">View on iTunes</a>
                        </div>
                    </CardActions>
                </Card>
                ))}
                {movieList.length > 0 && movieList.map(movie => (
                     <Card key={movie.collectionId} sx={{width: '300px'}}>
                     <CardContent>
                         <h2 style={{textAlign:"center"}}>{movie.trackName}</h2>
                         <img style={{margin:"auto", marginTop:"-10px", width:"100px", display:"block"}} src={movie.artworkUrl100} alt="Movie Artwork" />
                         <p style={{fontSize: "large", textAlign:"center"}}>{movie.artistName}</p>
                         <p style={{fontStyle: "italic", textAlign:"center", marginTop:"-20px"}}>{movie.primaryGenreName}</p>
                         <p style={{fontStyle: "italic", textAlign:"center", marginTop:"-20px"}}>Movie</p>
                         <p style={{fontSize: "large", textAlign:"center"}}>Price: {movie.collectionPrice} Points</p>
                     </CardContent>
                     <CardActions>
                         <div style={{display: "flex", justifyContent:"center"}}>
                             <Button style={{ cursor: 'pointer', marginRight: '25px'}} variant="contained" color="primary" onClick={() => addToCart(movie)}>Add to Cart</Button>
                             <a href={movie.collectionViewUrl} target="_blank">View on iTunes</a>
                         </div>
                     </CardActions>
                 </Card>
                ))
                }
                {tvList.length > 0 && tvList.map(tvShow => (
                     <Card key={tvShow.collectionId} sx={{width: '300px'}}>
                     <CardContent>
                         <h2 style={{textAlign:"center"}}>{tvShow.collectionName}</h2>
                         <img style={{margin:"auto", marginTop:"-10px", width:"100px", display:"block"}} src={tvShow.artworkUrl100} alt="Movie Artwork" />
                         <p style={{fontSize: "large", textAlign:"center"}}>{tvShow.contentAdvisoryRating}</p>
                         <p style={{fontStyle: "italic", textAlign:"center", marginTop:"-20px"}}>{tvShow.primaryGenreName}</p>
                         <p style={{fontStyle: "italic", textAlign:"center", marginTop:"-20px"}}>TV-Show</p>
                         <p style={{fontSize: "large", textAlign:"center"}}>Price: {tvShow.collectionPrice} Points</p>
                     </CardContent>
                     <CardActions>
                         <div style={{display: "flex", justifyContent:"center"}}>
                             <Button style={{ cursor: 'pointer', marginRight: '25px'}} variant="contained" color="primary" onClick={() => addToCart(tvShow)}>Add to Cart</Button>
                             <a href={tvShow.collectionViewUrl} target="_blank">View on iTunes</a>
                         </div>
                     </CardActions>
                 </Card>
                ))
                }
                {audioList.length > 0 && audioList.map(audio => (
                     <Card key={audio.collectionId} sx={{width: '300px'}}>
                     <CardContent>
                         <h2 style={{textAlign:"center"}}>{audio.collectionName}</h2>
                         <img style={{margin:"auto", marginTop:"-10px", width:"100px", display:"block"}} src={audio.artworkUrl100} alt="Movie Artwork" />
                         <p style={{fontSize: "large", textAlign:"center"}}>{audio.artistName}</p>
                         <p style={{fontStyle: "italic", textAlign:"center", marginTop:"-20px"}}>{audio.primaryGenreName}</p>
                         <p style={{fontStyle: "italic", textAlign:"center", marginTop:"-20px"}}>Audio Book</p>
                         <p style={{fontSize: "large", textAlign:"center"}}>Price: {audio.collectionPrice} Points</p>
                     </CardContent>
                     <CardActions>
                         <div style={{display: "flex", justifyContent:"center"}}>
                             <Button style={{ cursor: 'pointer', marginRight: '25px'}} variant="contained" color="primary" onClick={() => addToCart(audio)}>Add to Cart</Button>
                             <a href={audio.collectionViewUrl} target="_blank">View on iTunes</a>
                         </div>
                     </CardActions>
                 </Card>
                ))
                }
                {ebookList.length > 0 && ebookList.map(ebook => (
                    <div>
                     <Card key={ebook.collectionId} sx={{width: '300px'}}>
                     <CardContent>
                         <h2 style={{textAlign:"center"}}>{ebook.trackName}</h2>
                         <img style={{margin:"auto", marginTop:"-10px", width:"100px", display:"block"}} src={ebook.artworkUrl100} alt="Movie Artwork" />
                         <p style={{fontSize: "large", textAlign:"center"}}>{ebook.artistName}</p>
                         <p style={{fontStyle: "italic", textAlign:"center", marginTop:"-20px"}}>E-Book</p>
                         <p style={{fontSize: "large", textAlign:"center"}}>Price: {ebook.price} Points</p>
                     </CardContent>
                     <CardActions>
                         <div style={{display: "flex", justifyContent:"center"}}>
                             <Button style={{ cursor: 'pointer', marginRight: '25px'}} variant="contained" color="primary" onClick={() => addToCart(ebook)}>Add to Cart</Button>
                             <a href={ebook.trackViewUrl} target="_blank">View on iTunes</a>
                         </div>
                     </CardActions>
                 </Card>
                 </div>
                ))
                }
            </div>
            }
            
            <div style={{ position: 'absolute', top: 100, right: 25, padding: '10px' }}>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <SortIcon style={{ fontSize: '2rem' }} onClick={handleSort} />
                </button>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <FilterIcon style={{ fontSize: '2rem' }} onClick={handleFilter} />
                </button>
                <button style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                <ShoppingCartIcon style={{ fontSize: '2rem' }} onClick={handleCart} />
                </button>
            </div>
            {/* Sort Operations */}
            <Modal
                open={isSortOpen}
                onClose={handleCloseSort}
                aria-labelledby="sort-options"
                aria-describedby="select-sort-option"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 350 }}>
                <h2 id="sort-options">Select Sort Option</h2>
                {sortOptions.map((option, index) => (
                    <div key={option.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <button style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => handleSortOptionSelect(option)}>
                        <option.icon style={{ fontSize: '2rem', marginRight: '20px' }} />
                        <span>{option.label}</span>
                        {option.selected && <span style={{ marginLeft: '10px' }}> (Selected)</span>}
                    </button>
                    </div>
                ))}
                <Button variant="contained" style={{ cursor: 'pointer', marginTop: '30px' }} onClick={handleUndoSort}>Undo Sort</Button>
                </Box>
            </Modal>
            {/* Filter Operations */}
            <Modal
                open={isFilterOpen}
                onClose={handleCloseFilter}
                aria-labelledby="filter-options"
                aria-describedby="select-filter-option"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, width: 300 }}>
                <h2 id="filter-options">Price Filter</h2>
                <TextField
                    label="Minimum Price"
                    variant="outlined"
                    value={priceFilter.min}
                    onChange={(e) => setPriceFilter({ ...priceFilter, min: e.target.value })}
                    style={{ marginBottom: '10px' }}
                />
                <TextField
                    label="Maximum Price"
                    variant="outlined"
                    value={priceFilter.max}
                    onChange={(e) => setPriceFilter({ ...priceFilter, max: e.target.value })}
                    style={{ marginBottom: '10px' }}
                />
                <Button variant="contained" style={{ cursor: 'pointer', marginTop: '15px' }} color="primary" onClick={handleApplyFilter}>Apply Filter</Button>
                <Button variant="contained" style={{ cursor: 'pointer', marginTop: '15px' }} color="primary" onClick={handleUndoSort}>Undo Filter</Button>
                </Box>
            </Modal>
        </div>
      );
}