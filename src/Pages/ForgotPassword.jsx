import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; // Update this path accordingly

// Validation Schema
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  const isDarkMode = false; // Replace with your actual dark mode state if available

  // Formik setup
  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        // Simulate sending email
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success('Verification email sent successfully!');
        navigate(`/resetpassword?email=${encodeURIComponent(values.email)}`);
      } catch (error) {
        toast.error('Failed to send verification email');
      }
    },
  });

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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Enter your email address so we can reset your password.
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:border-blue-500'
              }`}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="mt-1 text-red-500 text-sm">{formik.errors.email}</p>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
            >
            Forgot Password
          </button>
          <button
            type="button"
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
            onClick={() => navigate('/')}
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-6">
                    © 2024 ARRC TECHNOLOGY
                </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
