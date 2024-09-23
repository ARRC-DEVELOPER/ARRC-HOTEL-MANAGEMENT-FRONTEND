import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddIngredient = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(3, 'Name should be at least 3 characters'),
    price: Yup.number()
      .required('Price is required')
      .positive('Price must be a positive number'),
    quantity: Yup.number()
      .required('Quantity is required')
      .min(1, 'Quantity should be at least 1'),
    unit: Yup.string()
      .required('Unit is required')
      .min(1, 'Unit cannot be empty'),
    alertQuantity: Yup.number()
      .required('Alert Quantity is required')
      .min(1, 'Alert Quantity should be at least 1'),
  });

  const handleSave = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('https://arrc-tech.onrender.com/api/ingredients/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      toast.success('Ingredient added successfully');
      navigate('/ingredients');
    } catch (error) {
      toast.error('Error adding ingredient: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center">
        <h1 className="text-2xl font-bold">Add Ingredients</h1>
      </div>

      <div className="mb-4">
        <nav className="text-gray-600">
          <a href="/" className="hover:underline">Home</a> &gt;
          <a href="/ingredients" className="hover:underline">Ingredients</a> &gt;
          <span className="font-semibold">Add Ingredients</span>
        </nav>
      </div>

      <Formik
        initialValues={{
          name: '',
          description: '',
          price: 0,
          quantity: 0,
          unit: '',
          alertQuantity: 1,
        }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            <div>
              <label className="block text-gray-700">Name *</label>
              <Field
                type="text"
                name="name"
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label className="block text-gray-700">Description</label>
              <Field
                as="textarea"
                name="description"
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-gray-700">Price *</label>
                <Field
                  type="number"
                  name="price"
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-gray-700">Quantity *</label>
                <Field
                  type="number"
                  name="quantity"
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                <ErrorMessage
                  name="quantity"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-gray-700">Unit *</label>
                <Field
                  type="text"
                  name="unit"
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                <ErrorMessage
                  name="unit"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-gray-700">Alert Quantity *</label>
                <Field
                  type="number"
                  name="alertQuantity"
                  className="border border-gray-300 rounded px-4 py-2 w-full"
                />
                <ErrorMessage
                  name="alertQuantity"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/ingredient')}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Back to List
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddIngredient;
