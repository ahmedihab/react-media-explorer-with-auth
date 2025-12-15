import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MediaContext } from '../MediaContext'; 
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function Home({ userData }) {
    const { trendingMovies, trendingTv } = useContext(MediaContext);
    
    function renderMedia(mediaList, title) {
        // Determine the property name for the poster
        const pathKey = (title === 'People') ? 'profile_path' : 'poster_path';
        
        //HELPER FUNCTION TO GET THE CORRECT ROUTE PATH
        const getDetailsPath = (media) => {
            if (media.media_type === 'movie') {
                return `/moviedetails/${media.id}`;
            } else if (media.media_type === 'tv') {
                return `/tvdetails/${media.id}`; // FIXED: Use the correct TV details route
            }
            return '/'; // Fallback for people or other types
        };

        return (
            <>
                <div className="col-md-4 py-3 text-light">
                    <div className="brdr w-25 my-3"></div>
                    <h2 className="h3 my-2">Trending {title} <br /> To Watch Now</h2>
                    <p className="text-light">Lorem ipsum dolor sit amet consectetur.</p>
                    <div className="brdr my-3"></div>
                </div>

                {mediaList.map((media, index) => (
                    <div key={index} className="col-md-2"> 
                        <div className="movie">
                            
                            <Link 
                                // FIXED: Use the new dynamic path helper function
                                to={getDetailsPath(media)}
                            >
                                
                                {media[pathKey] ? (
                                    <img 
                                        className="w-100" 
                                        src={`${IMAGE_BASE_URL}${media[pathKey]}`} 
                                        alt={media.title || media.name} 
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            // Fallback for image load error (network error or bad path)
                                            e.target.src = 'path/to/a/simple/network/fallback.png'; 
                                        }}
                                    />
                                ) : (
                                    // If path is missing from API, show the cool Placeholder Component
                                    <ImagePlaceholder 
                                        name={media.title || media.name} 
                                        type={media.media_type} // Use media.media_type for specific type 
                                    />
                                )}
                                <h3 className="h6">{media.title || media.name}</h3>
                            </Link>
                        </div>
                    </div>
                ))}
            </>
        );
    }

    return (
        <div className="py-5 text-light">
            {userData && <h1 className='text-light mb-5'>Welcome</h1>}

            <div className="row g-3 mb-5">
                {trendingMovies.length > 0 ? (
                    renderMedia(trendingMovies, 'Movies')
                ) : (
                    <p className='text-light'>Loading trending movies...</p>
                )}
            </div>

            <div className="row g-3 mb-5 text-light">
                {trendingTv.length > 0 ? (
                    renderMedia(trendingTv, 'TV Shows')
                ) : (
                    <p className='text-light'>Loading trending TV shows...</p>
                )}
            </div>
            
            {/* ... (commented out People section remains unchanged) ... */}
        </div>
    );
}