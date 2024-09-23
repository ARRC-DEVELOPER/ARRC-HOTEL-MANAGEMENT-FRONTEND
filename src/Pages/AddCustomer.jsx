import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation schema using Yup
const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phone: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
});

const AddCustomer = () => {
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (values, { setSubmitting }) => {
    axios.post('https://arrc-tech.onrender.com/api/customers', values)
      .then(() => {
        toast.success('Customer added successfully');
        navigate('/admin/customers'); // Redirect to customers list after adding
      })
      .catch(error => toast.error(`Failed to add customer: ${error.message}`))
      .finally(() => setSubmitting(false));
  };

  // Handle navigation back to the customers list
  const handleBackToList = () => {
    navigate('/admin/customers');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold mb-6">Add Customer</h1>
      <Formik
        initialValues={{ name: '', email: '', phone: '', address: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <Field
                type="text"
                name="name"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Field
                type="email"
                name="email"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <Field
                type="text"
                name="phone"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <Field
                as="textarea"
                name="address"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                disabled={isSubmitting}
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleBackToList}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Back to List
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  );
};

export default AddCustomer;