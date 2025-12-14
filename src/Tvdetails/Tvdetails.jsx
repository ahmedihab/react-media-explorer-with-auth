// src/Tvdetails/Tvdetails.jsx

import React, { useState, useEffect, useCallback, useContext } from 'react'; 
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'; 
import { MediaContext } from '../MediaContext'; 

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_IMAGE_URL = '/image-not-found.png';

export default function Tvdetails() { 
    // 🔑 CRITICAL: Only pull the necessary function (getMediaDetails) from the context
    const { getMediaDetails } = useContext(MediaContext);
    
    const [tvShow, setTvShow] = useState({});
    const [isLoading, setIsLoading] = useState(true); 
    let params = useParams(); 

    const getTvShowDetails = useCallback(async () => {
        setIsLoading(true); 
        
        if (!params.id) {
            console.error("Tvdetails: No ID found in URL parameters. ID is undefined.");
            setIsLoading(false);
            return;
        }

        try {
            // 🔑 Fetch the single item details using the function from the context
            const data = await getMediaDetails('tv', params.id); 
            
            setTvShow(data || {}); 
            
        }catch (error) {
            console.error("Error fetching TV show details:", error);
            setTvShow({}); 
        } finally {
            setIsLoading(false); 
        }
    }, [params.id, getMediaDetails]); 
    

    useEffect(() => {
        // Fetch details when component mounts or ID changes
        getTvShowDetails();
    }, [getTvShowDetails]); 

    return (
        <div className='py-5 text-light'>
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                // Only render details if tvShow.id exists (data loaded successfully)
                tvShow.id ? (
                    <div className='row'>
                        <div className='col-md-4'>
                            <img 
                                className='w-100' 
                                src={tvShow.poster_path 
                                    ? `${IMAGE_BASE_URL}${tvShow.poster_path}` 
                                    : FALLBACK_IMAGE_URL 
                                } 
                                alt={tvShow.name} 
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = FALLBACK_IMAGE_URL;
                                }}
                            />
                        </div>
                        <div className='col-md-8'>
                            <h2>{tvShow.name}</h2>
                            <h3 className='h5 text-muted'>{tvShow.tagline}</h3>
                            <p>Rating: ⭐️ {tvShow.vote_average?.toFixed(1)} / 10</p>
                            
                            {/* WATCHLIST BUTTON DELETED HERE */}

                            <div className='my-3'>
                                {tvShow.genres?.map((genre, index) => (
                                    <span key={index} className='badge bg-info text-dark me-2'>
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            <p className='mt-4'>{tvShow.overview}</p>
                            <p>First Air Date: {tvShow.first_air_date}</p>
                            <p>Number of Seasons: {tvShow.number_of_seasons}</p>
                        </div>
                    </div>
                ) : (
                    // Fallback for failed fetch or non-existent media ID
                    <div className="vh-100 d-flex justify-content-center align-items-center">
                        <p>TV Show details not found.</p>
                    </div>
                )
            )}
        </div>
    );
}