import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from './firebaseConfig'; 
import About from './About/About';
import './App.css';
import Home from './Home/Home';
import Login from './Login/Login';
import Navbar from './Navbar/Navbar';
import Tv from './Network/Tv';
import Register from './Register/Register';
import Movies from './Movies/Movies';
import Moviedetails from './MovieDetalis/Moviedetalis';
import { MediaContextProvider } from './MediaContext'; 
import Footer from './Footer/Footer';
import Tvdetails from './Tvdetails/Tvdetails';
import SearchResults from './SearchResults/SearchResults'; 


function ProtectedRoute({ userData, children }) {
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!userData) {
            navigate('/login');
        }
    }, [userData, navigate]); 

    return userData ? children : null; 
}


function PublicRoute({ userData, children }) {
    const navigate = useNavigate();
    
    useEffect(() => {
        // If the user data exists (logged in), redirect them to the home page
        if (userData) {
            navigate('/home');
        }
    }, [userData, navigate]); 

    // Render children only if userData does NOT exist
    return userData ? null : children; 
}


function App() {
    
    const navigate = useNavigate();
    
    const [userData, setUserData] = useState(null);
    //  NEW: State to track if the initial authentication check is complete
    const [isAuthReady, setIsAuthReady] = useState(false); 

    // useEffect runs once to set up the authentication observer
    useEffect(() => {
        // Subscribe to the authentication state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in.
                setUserData(user); 
                // Get and store the current token
                const token = await user.getIdToken();
                localStorage.setItem('userToken', token);
                //  AUTOMATIC REDIRECT: If the user is logged in, and they try to visit 
                // the login/register pages or the root '/', redirect them to home.
                if (window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/') {
                    navigate('/home', { replace: true });
                }

                console.log("Auth State Changed: User logged in.");
            } else {
                // User is signed out.
                setUserData(null);
                localStorage.removeItem('userToken');
                console.log("Auth State Changed: User logged out.");
            }
            
            // Mark auth check as complete
            setIsAuthReady(true);
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, [navigate]); 

    //  Render a loading indicator until the initial authentication check is done
    if (!isAuthReady) {
        return (
            <div className="vh-100 d-flex justify-content-center align-items-center text-light">
                <p>Checking authentication status...</p>
            </div>
        );
    }


    return (
        <MediaContextProvider> 
            <div>
                <Navbar userData={userData} navigate={navigate} /> 
                <div className='container'>
                    <Routes>
                        
                        {/* -------------------- PROTECTED ROUTES -------------------- */}
                        <Route path='/' element={
                            <ProtectedRoute userData={userData}>
                                <Home userData={userData} /> 
                            </ProtectedRoute>
                        } />
                        <Route path='home' element={
                            <ProtectedRoute userData={userData}>
                                <Home userData={userData} /> 
                            </ProtectedRoute>
                        } /> 
                        <Route path='movies' element={
                            <ProtectedRoute userData={userData}>
                                <Movies />
                            </ProtectedRoute>
                        } />
                        <Route path='moviedetails/:id' element={
                            <ProtectedRoute userData={userData}>
                                <Moviedetails userData={userData} /> 
                            </ProtectedRoute>
                        } />
                        <Route path='tv' element={
                            <ProtectedRoute userData={userData}>
                                <Tv/>
                            </ProtectedRoute>
                        } /> 
                    <Route path='tvdetails/:id' element={
                        <ProtectedRoute userData={userData}>
                            <Tvdetails userData={userData} />
                        </ProtectedRoute>
                        } />
                        <Route path='about' element={
                            <ProtectedRoute userData={userData}>
                                <About />
                            </ProtectedRoute>
                        } /> 
                        
                        {/*  NEW: SEARCH RESULTS ROUTE */}
                        <Route path='search/:query' element={
                            <ProtectedRoute userData={userData}>
                                <SearchResults userData={userData} /> 
                            </ProtectedRoute>
                        } />
                        
                        {/* -------------------- PUBLIC ROUTES (Logged Out Only) -------------------- */}
                        <Route path='register' element={
                            <PublicRoute userData={userData}>
                                <Register />
                            </PublicRoute>
                        } /> 
                        <Route path='login' element={
                            <PublicRoute userData={userData}>
                                <Login />
                            </PublicRoute>
                        } /> 
                        
                        <Route path='*' element={<h2> 404 Notfound </h2>} /> 
                    </Routes>
                </div>
                <Footer/>
            </div>
        </MediaContextProvider>
    );
}

export default App;