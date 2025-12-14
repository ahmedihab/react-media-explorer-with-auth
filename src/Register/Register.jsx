// src/Register/Register.jsx

import React, { useState } from 'react';
import Joi from 'joi';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; 
import { createUserWithEmailAndPassword } from "firebase/auth"; 


export default function Register() {
    
    const navigate = useNavigate();
    const [user, setUser] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
    });

    const [validationErrors, setValidationErrors] = useState(null); 
    
    // Joi Validation Schema for Registration (Example)
    const registerSchema = Joi.object({
        first_name: Joi.string().min(3).required().label('First Name'),
        last_name: Joi.string().min(3).required().label('Last Name'),
        email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
        password: Joi.string().min(6).required().label('Password')
    });


    // --- HANDLERS (Standard input change and validation logic) ---
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
        const validationResult = registerSchema.validate(user, { abortEarly: false });
        
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

    // --- SUBMIT REGISTRATION (Firebase Auth) ---
    async function submitRegister(e) {
        e.preventDefault();

        if (!validateUserData()) {
            return;
        }
        
        try {
            // 🛑 Use Firebase createUserWithEmailAndPassword
            await createUserWithEmailAndPassword(
                auth, 
                user.email, 
                user.password
            ); 
            
            alert("Registration successful! Please log in.");
            navigate('/login'); 
            
        } catch (error) {
            let errorMessage = "Registration failed.";
            if (error.code) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email is already registered.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Password should be at least 6 characters.';
                        break;
                    default:
                        errorMessage = error.message;
                }
            }
            
            setValidationErrors({ server: errorMessage });
            console.error("Firebase Registration Failed:", error);

        }
    }

    // 🔑 NEW: Function to navigate back to the login page
    function goToLogin() {
        navigate('/login'); 
    }

    // --- RENDER (Modified to add navigation link) ---
    return (
        <div className="container py-5 text-light">
            <h2 className="mb-4">Register</h2>
            
            {/* Display general server error message if it exists */}
            {validationErrors && validationErrors.server && (
                <div className="alert alert-danger mb-4">
                    {validationErrors.server}
                </div>
            )}

            <form onSubmit={submitRegister}>

                {/* --- FIRST NAME --- */}
                <div className="mb-3">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input 
                        onChange={getUser} 
                        type="text" 
                        className="form-control" 
                        id="first_name" 
                        name="first_name" 
                        value={user.first_name}
                    />
                    {validationErrors && validationErrors.first_name && (
                        <div className="alert alert-danger p-1 mt-1">{validationErrors.first_name}</div>
                    )}
                </div>
                
                {/* --- LAST NAME --- */}
                <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input 
                        onChange={getUser} 
                        type="text" 
                        className="form-control" 
                        id="last_name" 
                        name="last_name" 
                        value={user.last_name}
                    />
                    {validationErrors && validationErrors.last_name && (
                        <div className="alert alert-danger p-1 mt-1">{validationErrors.last_name}</div>
                    )}
                </div>

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
                    Register 
                </button>
            </form>

            {/* 🔑 ADDED: Navigation Link to Login */}
            <p className="text-center text-light">
                Already have an account? 
                {/* Use an anchor tag and the click handler to navigate */}
                <button 
                    onClick={goToLogin} 
                    className="btn text-info fw-bold ms-2" // Use Bootstrap's 'btn' and remove button default styling
                    type="button" // Use type="button" to prevent form submission
                    style={{ padding: 0, border: 'none', background: 'none', cursor: 'pointer' }}>
                    Login Here
                </button>
            </p>
        </div>
    );
}