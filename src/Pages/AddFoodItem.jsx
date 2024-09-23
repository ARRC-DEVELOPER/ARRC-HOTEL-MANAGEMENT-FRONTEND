import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import { FaPlus, FaTrash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const AddFoodItem = () => {
  const [ingredientsList, setIngredientsList] = useState([]);
  const navigate = useNavigate();

  const initialValues = {
    foodGroup: '',
    itemName: '',
    description: '',
    price: 0.00,
    image: null,
    ingredientItems: [],
  };

  const validationSchema = Yup.object({
    foodGroup: Yup.string().required('Food Group is required'),
    itemName: Yup.string().required('Item Name is required'),
    price: Yup.number().required('Price is required').positive('Price must be positive'),
  });

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append('foodGroup', values.foodGroup);
    formData.append('itemName', values.itemName);
    formData.append('description', values.description);
    formData.append('price', values.price);
    if (values.image) {
      formData.append('image', values.image);
    }
    formData.append('ingredientItems', JSON.stringify(ingredientsList));

    axios.post('https://arrc-tech.onrender.com/api/foodItems', formData)
      .then(response => {
        const { data } = response;
        if (data.id) {
          toast.success('Food item added successfully!', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            className: 'text-sm text-white bg-green-500 p-3 rounded-md shadow-lg',
          });
          resetForm(); // Reset the form fields
          setIngredientsList([]); // Clear the ingredients list
        } else {
          toast.error('Failed to retrieve the item ID. Please try again.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 3000,
            className: 'text-sm text-white bg-red-500 p-3 rounded-md shadow-lg',
          });
        }
      })
      .catch(error => {
        toast.error('Error adding food item. Please try again.', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          className: 'text-sm text-white bg-red-500 p-3 rounded-md shadow-lg',
        });
      })
      .finally(() => {
        setSubmitting(false); // Enable the submit button again
      });
  };

  const handleFileChange = (event, setFieldValue) => {
    setFieldValue('image', event.currentTarget.files[0]);
  };

  const handleAddIngredient = () => {
    const ingredientName = document.querySelector('select[name="ingredientItem"]').value;
    if (ingredientName && !ingredientsList.some(item => item.name === ingredientName)) {
      setIngredientsList([...ingredientsList, { name: ingredientName, stock: 'N/A', consumption: 'N/A' }]);
    }
  };

  const handleDeleteIngredient = (ingredientName) => {
    setIngredientsList(ingredientsList.filter(item => item.name !== ingredientName));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <ToastContainer />

      <nav className="mb-6 bg-gray-100 p-4 rounded-lg shadow-md">
        <ol className="list-reset flex text-gray-700">
          <li><a href="/" className="text-green-600 hover:underline">Home</a></li>
          <li><span className="mx-2">/</span></li>
          <li><a href="/food-items" className="text-green-600 hover:underline">Food Items</a></li>
          <li><span className="mx-2">/</span></li>
          <li>Add Food Item</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold mb-6">Add Food Item</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, setFieldValue, resetForm }) => (
          <Form>
            <div className="mb-6 flex space-x-4">
              <div className="flex-1">
                <label htmlFor="foodGroup" className="block text-gray-700">Food Group *</label>
                <Field as="select" name="foodGroup" className="w-full mt-2 p-2 border rounded">
                  <option value="">Choose Option</option>
                  <option value="1">Pizza</option>
                  <option value="2">Burger</option>
                  <option value="3">Drinks</option>
                  <option value="4">Home Delivery Menu</option>
                  <option value="5">Takem</option>
                  <option value="6">Chinese</option>
                </Field>
                <ErrorMessage name="foodGroup" component="div" className="text-red-500 text-sm" />
              </div>
              <div className="flex-1">
                <label htmlFor="itemName" className="block text-gray-700">Item Name *</label>
                <Field type="text" name="itemName" className="w-full mt-2 p-2 border rounded" />
                <ErrorMessage name="itemName" component="div" className="text-red-500 text-sm" />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700">Description</label>
              <Field as="textarea" name="description" className="w-full mt-2 p-2 border rounded" />
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-700">Price *</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l border border-r-0 bg-gray-200 text-gray-600">
                ₹
                </span>
                <Field type="number" name="price" className="w-full mt-2 p-2 border rounded-r" />
              </div>
              <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-gray-700">Image</label>
              <input
                id="image"
                name="image"
                type="file"
                className="mt-2 p-2 border rounded w-full"
                onChange={(event) => handleFileChange(event, setFieldValue)}
              />
            </div>

            <h2 className="text-lg font-bold text-green-600 mt-6">Ingredient Consumptions</h2>
            <div className="mb-4">
              <label htmlFor="ingredientItem" className="block text-gray-700">Ingredient Item</label>
              <Field as="select" name="ingredientItem" className="w-full mt-2 p-2 border rounded">
                <option value="">Choose Option</option>
                <option value="Milk">Milk</option>
                <option value="Egg">Egg</option>
                <option value="Potato">Potato</option>
                <option value="Meat">Meat</option>
                <option value="Onion">Onion</option>
                <option value="Sugar">Sugar</option>
                <option value="Tomato">Tomato</option>
              </Field>
              <button
                type="button"
                className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
                onClick={handleAddIngredient}
              >
                <FaPlus className="inline mr-2" /> Add
              </button>
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b border-gray-200 text-left">Ingredient</th>
                    <th className="px-4 py-2 border-b border-gray-200 text-left">Stock</th>
                    <th className="px-4 py-2 border-b border-gray-200 text-left">Consumption</th>
                    <th className="px-4 py-2 border-b border-gray-200 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientsList.map((ingredient) => (
                    <tr key={ingredient.name}>
                      <td className="px-4 py-2 border-b border-gray-200">{ingredient.name}</td>
                      <td className="px-4 py-2 border-b border-gray-200">{ingredient.stock}</td>
                      <td className="px-4 py-2 border-b border-gray-200">{ingredient.consumption}</td>
                      <td className="px-4 py-2 border-b border-gray-200">
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => handleDeleteIngredient(ingredient.name)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-start mt-6">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Save'}
              </button>
              <button
                type="button"
                className="bg-gray-600 text-white px-4 py-2 rounded mx-3"
                onClick={() => navigate('/admin/foodItems')}
              >
                Back To List
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddFoodItem;
