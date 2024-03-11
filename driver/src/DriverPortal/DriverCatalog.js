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
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom'
import DriverCart from './DriverCart';


export default function DriverCatalog(){
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
            sorted = [...albums].sort((a, b) => a.collectionName.localeCompare(b.collectionName));
        }
        else if(option.id === 1){
            sorted = [...albums].sort((a, b) => a.collectionPrice - b.collectionPrice);
        }
        else if(option.id === 2){
            sorted = [...albums].sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
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
        setAlbums(originalAlbums);
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
        const filtered = albums.filter(album => {
            const price = parseFloat(album.collectionPrice);
            const min = parseFloat(priceFilter.min);
            const max = parseFloat(priceFilter.max);
            return (!min || price >= min) && (!max || price <= max);
        });
        const sortedFiltered = [...filtered].sort((a, b) => a.collectionPrice - b.collectionPrice);
        setSortedAlbums(sortedFiltered);
        setIsFilterOpen(false);
    };



	// Dependency Array
    useEffect(() => {
        fetch('https://itunes.apple.com/search?term=glass+animals&limit=10&entity=album')
            .then(response => response.json())
            .then(data => {
                setAlbums(data.results);
                setOriginalAlbums(data.results);
            })
			// Handle any errors that occur during the fetch
            .catch(error => {
                
                console.error('Error fetching data:', error);
            });
    }, []); // This Empties the dependency array to ensure useEffect runs only once
	return (
        <div>
            <DriverAppBar />        
            <Catalog />
            <div style={{ marginLeft: '25px' }}>
                {/* Loops through returned data and displays it */}
                {(sortedAlbums.length > 0 ? sortedAlbums : albums).map(album => (
                <div key={album.collectionId}>
                    <h2>{album.collectionName}</h2>
                    <img src={album.artworkUrl100} alt="Album Artwork" />
                    <p>Artist: {album.artistName}</p>
                    <p>Genre: {album.primaryGenreName}</p>
                    <p>Price: ${album.collectionPrice}</p>
                    <p>Release Date: {album.releaseDate}</p>
                    <Button style={{ cursor: 'pointer', marginRight: '25px' }} variant="contained" color="primary" onClick={() => addToCart(album)}>Add to Cart</Button>
                    <a href={album.collectionViewUrl} target="_blank">View on iTunes</a>
                </div>
                ))}
            </div>
            
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