// src/SearchResults/SearchResults.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MediaContext } from '../MediaContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder'; 

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function SearchResults({ userData }) {
    // 🔑 Get the search function from context
    const { searchMedia } = useContext(MediaContext);
    
    // 🔑 Get the query from the URL path
    const { query } = useParams(); 

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const performSearch = async () => {
            if (!query) {
                setResults([]);
                return;
            }
            setIsLoading(true);
            try {
                // 🔑 Call the search function from MediaContext
                const data = await searchMedia(query);
                setResults(data);
            } catch (error) {
                console.error("Search failed:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Perform search whenever the URL query changes
        performSearch();
    }, [query, searchMedia]);

    // 🔑 Helper to determine the link path
    const getDetailsPath = (media) => {
        if (media.media_type === 'movie') {
            return `/moviedetails/${media.id}`;
        } else if (media.media_type === 'tv') {
            return `/tvdetails/${media.id}`; 
        }
        return '#'; // No details page for 'person' or unknown types yet
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className='py-5 text-light'>
            <h2 className='mb-4'>Search Results for: <span className='text-info'>{query}</span></h2>
            
            <div className="brdr my-4 w-100"></div>

            {results.length === 0 && !isLoading ? (
                <div className="vh-50 d-flex justify-content-center align-items-center">
                    <p>No results found for "{query}".</p>
                </div>
            ) : (
                <div className="row g-3">
                    {results.map((media, index) => (
                        <div key={index} className="col-md-2">
                            {/* Link uses the determined path */}
                            <Link to={getDetailsPath(media)} className='text-decoration-none text-light'>
                                <div className="media-item">
                                    {/* Use poster_path for movies/tv, profile_path for people */}
                                    {media.poster_path || media.profile_path ? (
                                        <img 
                                            className="w-100" 
                                            src={`${IMAGE_BASE_URL}${media.poster_path || media.profile_path}`} 
                                            alt={media.title || media.name} 
                                        />
                                    ) : (
                                        <ImagePlaceholder 
                                            name={media.title || media.name} 
                                            type={media.media_type} 
                                        />
                                    )}
                                    <h3 className="h6 mt-2">{media.title || media.name}</h3>
                                    <p className='text-muted small'>{media.media_type.toUpperCase()}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}