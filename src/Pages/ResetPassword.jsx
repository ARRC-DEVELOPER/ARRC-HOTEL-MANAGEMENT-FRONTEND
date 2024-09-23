import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Update this path accordingly

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDarkMode = false; // Replace with your actual dark mode state if available

  // Parse the query parameters
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
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
        <div className='mb-4 flex justify-center items-center'>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{email}</h2>

        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          {email && `We sent a verification email link to ${email}. If this email address is registered, you'll receive instructions on how to set a new password.`}
        </h2>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
            >
            Login
          </button>
        </div>
        <p className="text-center text-sm mt-6">
                    © 2024 ARRC TECHNOLOGY
                </p>
      </div>
     
    </div>
  );
};

export default ResetPassword;
