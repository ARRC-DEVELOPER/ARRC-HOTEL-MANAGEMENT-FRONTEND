// src/components/Company.jsx
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

// Validation schema with Yup
const validationSchema = Yup.object({
    companyName: Yup.string().required('Company Name is required'),
    companyPhone: Yup.string().required('Phone Number is required').matches(/^\+\d{1,3} \(\d{3}\) \d{3}-\d{4}$/, 'Phone Number is not valid'),
    companyEmail: Yup.string().email('Invalid email address').required('Email is required'),
    companyTaxNumber: Yup.string().required('Tax Number is required'),
    companyAddress: Yup.string().required('Address is required'),
});

const Company = () => {
    const [initialValues, setInitialValues] = useState({
        companyName: '',
        companyPhone: '',
        companyEmail: '',
        companyTaxNumber: '',
        companyAddress: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await fetch('/api/companies');
                if (response.ok) {
                    const data = await response.json();
                    setInitialValues(data);
                } else {
                    toast.error('Failed to fetch company details');
                }
            } catch (error) {
                toast.error('An error occurred while fetching company details');
                console.error('Error fetching company details:', error);
            }
        };

        fetchCompany();
    }, []);

    const handleSubmit = async (values) => {
        try {
            const response = await fetch('/api/companies', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                toast.success('Company updated successfully!');
                navigate('/dashboard'); // Redirect to the desired page
            } else {
                toast.error('Failed to update company');
            }
        } catch (error) {
            toast.error('An error occurred');
            console.error('Error updating company:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch('/api/companies', {
                method: 'DELETE',
            });

            if (response.ok) {
                toast.success('Company deleted successfully!');
                navigate('/dashboard'); // Redirect to the desired page
            } else {
                toast.error('Failed to delete company');
            }
        } catch (error) {
            toast.error('An error occurred');
            console.error('Error deleting company:', error);
        }
    };

    return (
        <div className="p-8 bg-white shadow-lg rounded-lg border border-gray-200">
            <div className="flex items-center mb-4">
                <FaHome className="text-gray-500 mr-2" />
                <span className="text-gray-700 text-lg">Home  Company</span>
            </div>
            <h1 className="text-3xl font-bold mb-6">Company</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {() => (
                    <Form>
                        <label className="block mb-4">
                            <span className="block text-sm font-medium text-gray-700 mb-2">Company Name *</span>
                            <Field
                                type="text"
                                name="companyName"
                                className="block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-lg placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                            <ErrorMessage name="companyName" component="div" className="text-red-600 text-sm mt-1" />
                        </label>

                        <label className="block mb-4">
                            <span className="block text-sm font-medium text-gray-700 mb-2">Company Phone Number *</span>
                            <Field
                                type="text"
                                name="companyPhone"
                                className="block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-lg placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                            <ErrorMessage name="companyPhone" component="div" className="text-red-600 text-sm mt-1" />
                        </label>

                        <label className="block mb-4">
                            <span className="block text-sm font-medium text-gray-700 mb-2">Company Email *</span>
                            <Field
                                type="email"
                                name="companyEmail"
                                className="block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-lg placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                            <ErrorMessage name="companyEmail" component="div" className="text-red-600 text-sm mt-1" />
                        </label>

                        <label className="block mb-4">
                            <span className="block text-sm font-medium text-gray-700 mb-2">Company Tax Number *</span>
                            <Field
                                type="text"
                                name="companyTaxNumber"
                                className="block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-lg placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                            <ErrorMessage name="companyTaxNumber" component="div" className="text-red-600 text-sm mt-1" />
                        </label>

                        <label className="block mb-6">
                            <span className="block text-sm font-medium text-gray-700 mb-2">Company Address *</span>
                            <Field
                                type="text"
                                name="companyAddress"
                                className="block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-lg placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                            />
                            <ErrorMessage name="companyAddress" component="div" className="text-red-600 text-sm mt-1" />
                        </label>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
                        >
                            Save Changes
                        </button>
                    </Form>
                )}
            </Formik>
            <button
                type="button"
                onClick={handleDelete}
                className="mt-4 w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150"
            >
                Delete Company
            </button>
            <ToastContainer />
        </div>
    );
};

export default Company;
