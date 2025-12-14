
import React from 'react';

export default function LoadingSpinner() {
    return (
        // Center the spinner in the middle of the screen
        <div className="vh-100 d-flex justify-content-center align-items-center">
            {/* Bootstrap Spinner */}
            <div 
                className="spinner-border text-info" 
                role="status" 
                style={{ width: '3rem', height: '3rem' }}
            >
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}