// src/Login/Login.jsx

import React, { useState } from 'react';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; 
import { signInWithEmailAndPassword } from "firebase/auth"; 


export default function Login() {
    
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: '',
        password: '',
    });

    const [validationErrors, setValidationErrors] = useState(null); 
    
    // Joi Validation Schema for Login (Kept as is)
    const loginSchema = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
        password: Joi.string().min(6).required().label('Password')
    });


    // --- HANDLERS (Validation and Input Handlers are Unchanged) ---
    function getUser(e) {
        let myUser = { ...user };
        myUser[e.target.name] = e.target.value;
        setUser(myUser);
        
        if (validationErrors && validationErrors[e.target.name]) {
            setValidationErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[e.target.name];
                return newErrors;
            });
        }
    }

    function validateUserData() {
        const validationResult = loginSchema.validate(user, { abortEarly: false });
        
        if (validationResult.error) {
            let errorsObject = {};
            for (let item of validationResult.error.details) {
                errorsObject[item.path[0]] = item.message.replace(/"(.*?)"/g, item.context.label);
            }
            setValidationErrors(errorsObject);
            return false;
        }

        setValidationErrors(null);
        return true;
    }

    // 🔑 The submitLogin function now uses Firebase Auth
    async function submitLogin(e) {
        e.preventDefault();

        // 1. Client-side Validation (Joi)
        if (!validateUserData()) {
            return;
        }
        
        try {
            // 🛑 2. Replace axios.post with Firebase signInWithEmailAndPassword
            const userCredential = await signInWithEmailAndPassword(
                auth, // The imported Auth object
                user.email, 
                user.password
            ); 
            
            // 🔑 3. Get the Firebase ID Token (JWT)
            const token = await userCredential.user.getIdToken();
            
            // 4. Save the Token to Local Storage
            localStorage.setItem('userToken', token);
            
            console.log("Login Successful. Token Saved."); 
            navigate('/home'); 
            
        } catch (error) {
            // 5. Handle official Firebase Auth errors
            let errorMessage = "Login failed.";
            if (error.code) {
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        errorMessage = 'Invalid credentials. Please check your email or password.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Invalid email format.';
                        break;
                    default:
                        errorMessage = error.message;
                }
            } else {
                errorMessage = error.message;
            }
            
            setValidationErrors({ server: errorMessage });
            console.error("Firebase Login Failed:", error);

        }
    }

    // 🔑 NEW: Function to navigate to the register page
    function goToRegister() {
        navigate('/register'); 
    }

    // --- RENDER (Modified to add navigation link) ---
    return (
        <div className="container py-5 text-light">
            <h2 className="mb-4">Login</h2>
            
            {/* Display general server error message if it exists */}
            {validationErrors && validationErrors.server && (
                <div className="alert alert-danger mb-4">
                    {validationErrors.server}
                </div>
            )}

            <form onSubmit={submitLogin}>

                {/* --- EMAIL --- */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input 
                        onChange={getUser} 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        name="email" 
                        value={user.email}
                    />
                    {validationErrors && validationErrors.email && (
                        <div className="alert alert-danger p-1 mt-1">{validationErrors.email}</div>
                    )}
                </div>

                {/* --- PASSWORD --- */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                        onChange={getUser} 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        name="password" 
                        value={user.password}
                    />
                    {validationErrors && validationErrors.password && (
                        <div className="alert alert-danger p-1 mt-1">{validationErrors.password}</div>
                    )}
                </div>

                {/* --- SUBMIT BUTTON --- */}
                <button 
                    type="submit" 
                    className="btn btn-primary mt-3">
                    Login 
                </button>
            </form>

            {/* 🔑 ADDED: Navigation Link to Register */}
            <p className="text-center text-light">
                Don't have an account? 
                {/* Use an anchor tag and the click handler to navigate */}
<button 
    onClick={goToRegister} 
    className="btn text-info fw-bold ms-2" // Use Bootstrap's 'btn' and remove button default styling
    type="button" // Use type="button" to prevent form submission
    style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} // Remove default button padding/border
>
    Register Now
</button>
            </p>
        </div>
    );
}