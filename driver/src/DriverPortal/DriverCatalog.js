import React, {useEffect, useState} from 'react';
import Catalog from "../Catalog";
import DriverAppBar from "./DriverAppBar";


export default function DriverCatalog(){
	const [dataFetched, setDataFetched] = useState(false);
	const [albums, setAlbums] = useState([]);

	// Dependency Array
    useEffect(() => {
        fetch('https://itunes.apple.com/search?term=glass+animals&limit=10&entity=album')
            .then(response => response.json())
            .then(data => {
                setAlbums(data.results);
            })
			// Handle any errors that occur during the fetch
            .catch(error => {
                
                console.error('Error fetching data:', error);
            });
    }, []); // This Empties the dependency array to ensure useEffect runs only once
	return(
		<div>
			<DriverAppBar/>
			<Catalog/>
			<div style={{ marginLeft: '25px' }}>
				{/* Loops through returned data and displays it */}
                {albums.map(album => (
                    <div key={album.collectionId}>
                        <h2>{album.collectionName}</h2>
                        <img src={album.artworkUrl100} alt="Album Artwork" />
                        <p>Artist: {album.artistName}</p>
                        <p>Genre: {album.primaryGenreName}</p>
                        <p>Price: ${album.collectionPrice}</p>
                        <p>Release Date: {album.releaseDate}</p>
                        <a href={album.collectionViewUrl} target="_blank">View on iTunes</a>
                    </div>
                ))}
            </div>
		</div>
	);
}