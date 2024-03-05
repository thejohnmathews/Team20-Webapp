import React, {useEffect, useState} from 'react';
import Catalog from "../Catalog";
import SponsorAppBar from "./SponsorAppBar";


export default function SponsorCatalog(){
	const [dataFetched, setDataFetched] = useState(false);
	const [movies, setMovies] = useState([]);

	// Dependency Array
    useEffect(() => {
        fetch('https://itunes.apple.com/search?media=movie&term=jujutsu+kaisen')
            .then(response => response.json())
            .then(data => {
                setMovies(data.results);
            })
			// Handle any errors that occur during the fetch
            .catch(error => {
                
                console.error('Error fetching data:', error);
            });
    }, []); // This Empties the dependency array to ensure useEffect runs only once
	return(
		<div>
			<SponsorAppBar/>
			<Catalog/>
			<div style={{ marginLeft: '25px' }}>
				{/* Loops through returned data and displays it */}
                {movies.map(movie => (
                    <div key={movie.collectionId}>
                        <h2>{movie.collectionName}</h2>
                        <img src={movie.artworkUrl100} alt="Album Artwork" />
                        <p>Artist: {movie.artistName}</p>
                        <p>Genre: {movie.primaryGenreName}</p>
                        <p>Price: ${movie.collectionPrice}</p>
                        <p>Release Date: {movie.releaseDate}</p>
                        <a href={movie.collectionViewUrl} target="_blank">View on iTunes</a>
                    </div>
                ))}
            </div>
		</div>
	);
}