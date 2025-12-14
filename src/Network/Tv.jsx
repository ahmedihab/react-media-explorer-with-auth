
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { MediaContext } from '../MediaContext';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { Link } from 'react-router-dom'; 

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_IMAGE_URL = '/image-not-found.png';

export default function Network() {
    const { getMediaList } = useContext(MediaContext);
    
    const [popularTvShows, setPopularTvShows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPopularTvShows = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await getMediaList('tv', 'popular', 1);
            setPopularTvShows(data.results);
        } catch (error) {
            console.error("Failed to fetch popular TV shows:", error);
            setPopularTvShows([]);
        } finally {
            setIsLoading(false);
        }
    }, [getMediaList]);

    useEffect(() => {
        fetchPopularTvShows();
    }, [fetchPopularTvShows]);

    return (
        <div className='py-5 text-light'>
            <h2>TV Shows</h2>
            
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <div className='row'>
                    {popularTvShows.length > 0 ? (
                        popularTvShows.map((tvShow) => (
                            <div className='col-md-2 mb-4' key={tvShow.id}>
                                
                                {/* LINK TO TV DETAILS: Correct path is /tvdetails/:id */}
                                <Link to={`/tvdetails/${tvShow.id}`} className='text-light text-decoration-none'>
                                    <div className='media-item position-relative'>
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
                                        <h3 className='h6 mt-2 text-center'>{tvShow.name}</h3>
                                    </div>
                                </Link>
                                
                            </div>
                        ))
                    ) : (
                        <div className="text-center w-100">
                            <p>No TV shows found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}