// src/components/AddSupplier.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation schema using Yup
const validationSchema = Yup.object({
  supplierName: Yup.string().required('Supplier Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
});

const AddSupplier = () => {
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axios.post('https://arrc-tech.onrender.com/api/suppliers', values);
      toast.success('Supplier added successfully');
      navigate('/admin/suppliers');
    } catch (error) {
      toast.error(`Failed to add supplier: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-xl font-semibold mb-6">Add Supplier</h1>
      <Formik
        initialValues={{ supplierName: '', email: '', phoneNumber: '', address: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
              <Field
                type="text"
                name="supplierName"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <ErrorMessage name="supplierName" component="div" className="text-red-500 text-sm mt-1" />
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
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <Field
                type="text"
                name="phoneNumber"
                className="p-2 border border-gray-300 rounded-md w-full"
              />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm mt-1" />
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
                onClick={() => navigate('/admin/suppliers')}
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

export default AddSupplier;
