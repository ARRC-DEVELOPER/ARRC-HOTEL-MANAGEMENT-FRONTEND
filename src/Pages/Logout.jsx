import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowRight, FaMoon, FaSun, FaEye, FaEyeSlash } from 'react-icons/fa';
import logo from '../assets/logo.png';

const Logout = () => {
    const [email, setEmail] = useState(''); // State for email input
    const [password, setPassword] = useState(''); // State for password input
    const [rememberMe, setRememberMe] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Authentication logic (placeholder for real authentication)
        if (email === 'test@example.com' && password === 'password123') {
            navigate('/admin');
        } else {
            alert('Invalid credentials');
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className={`flex items-center justify-center h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`w-full max-w-md p-8 ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'} shadow-lg rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <img src={logo} alt="ARRC TECH" className="h-20 w-20 mx-5 rounded-full shadow-xl" />
                        <span
                            className={`text-2xl w-25 mt-2 font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}
                            style={{
                                background: 'radial-gradient(circle, violet, blue)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            ARRC TECH
                        </span>
                    </div>
                    <button onClick={toggleTheme} className="text-xl p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        {isDarkMode ? <FaSun /> : <FaMoon />}
                    </button>
                </div>
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold mb-2">Welcome Back!</h1>
                    <p className="text-lg">Please log in to your account.</p>
                </div>
                <label className="block mb-6">
                    <span className="block text-sm mb-2">Email or Username</span>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Update email state
                        className={`block w-full border rounded-lg shadow-sm px-4 py-2 text-lg placeholder-gray-400 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'} focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50`}
                        placeholder="Enter your email or username"
                    />
                </label>
                <label className="block mb-4 relative">
                    <span className="block text-sm mb-2">Password</span>
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Update password state
                        className={`block w-full border rounded-lg shadow-sm px-4 py-2 text-lg placeholder-gray-400 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'border-gray-300'} focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50`}
                        placeholder="Enter your password"
                    />
                    <button 
                        type="button" 
                        onClick={togglePasswordVisibility} 
                        className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
                    >
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </label>
                <div className="flex items-center justify-between mb-6">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="form-checkbox text-indigo-600"
                        />
                        <span className="ml-2 text-sm">Remember Me</span>
                    </label>
                    <Link to="/forgotpassword" className="text-sm text-indigo-600 hover:text-indigo-500">Forgot Password?</Link>
                </div>
                <button
                    onClick={handleLogin}
                    className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
                >
                    Login <FaArrowRight className="inline ml-2" />
                </button>
                <p className="text-center text-sm mt-6">
                    © 2024 ARRC TECHNOLOGY
                </p>
            </div>
        </div>
    );
};

export default Logout;
