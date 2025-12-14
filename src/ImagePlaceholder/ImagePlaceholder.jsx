import React from 'react';

export default function ImagePlaceholder({ name, type }) {
    // Determine the icon and text based on the type (movie/tv/person)
    const iconClass = type === 'People' ? 'fas fa-user' : 'fas fa-image';
    const fallbackText = name || `${type} Image Not Available`;

    return (
        // The 'placeholder-box' class will be styled in index.css
        <div className="placeholder-box">
            <i className={`${iconClass} placeholder-icon`}></i>
            <p className="placeholder-text">{fallbackText}</p>
        </div>
    );
}