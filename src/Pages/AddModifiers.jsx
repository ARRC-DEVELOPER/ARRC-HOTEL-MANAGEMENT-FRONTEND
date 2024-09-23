import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const AddModifier = () => {
    const [consumptions, setConsumptions] = useState([{ name: 'Egg', stock: '594kg', consumption: 1 }]);
    const [ingredientItem, setIngredientItem] = useState('');

    const navigate = useNavigate();

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
        consumptions: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Ingredient name is required'),
                consumption: Yup.number().required('Consumption is required').positive('Consumption must be positive'),
            })
        ),
    });

    const handleSave = (values, { setSubmitting }) => {
        axios.post('http://127.0.0.1:5000/api/modifiers', values)
            .then(() => {
                toast.success('Modifier created successfully');
                navigate('/admin/modifiers');
            })
            .catch(error => {
                toast.error('Error creating modifier');
                console.error('Error creating modifier:', error);
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    const handleAddConsumption = () => {
        setConsumptions([...consumptions, { name: ingredientItem, stock: '100kg', consumption: 1 }]);
    };

    const handleDeleteConsumption = (index, setFieldValue) => {
        const newConsumptions = consumptions.filter((_, i) => i !== index);
        setConsumptions(newConsumptions);
        setFieldValue('consumptions', newConsumptions);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <h1 className="text-xl font-bold">Add Modifier</h1>
                <div className="text-gray-500">
                    <span>Home</span> {'>'} <span>Modifiers</span> {'>'} <span>Add Modifier</span>
                </div>
            </div>
            <div className="bg-white p-4 rounded shadow">
                <Formik
                    initialValues={{
                        title: '',
                        price: 0,
                        consumptions: consumptions,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form>
                            <div className="mb-4">
                                <label className="block text-gray-700">Title *</label>
                                <Field
                                    type="text"
                                    name="title"
                                    className="border p-2 rounded w-full"
                                />
                                <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Price *</label>
                                <Field
                                    type="number"
                                    name="price"
                                    className="border p-2 rounded w-full"
                                />
                                <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Ingredient Consumptions</label>
                                <select
                                    className="border p-2 rounded w-full mb-2"
                                    value={ingredientItem}
                                    onChange={e => setIngredientItem(e.target.value)}
                                >
                                    <option value="">Select an ingredient</option>
                                    <option value="Meat">Meat</option>
                                    <option value="Milk">Milk</option>
                                    <option value="Sugar">Sugar</option>
                                    <option value="Tomato">Tomato</option>
                                    <option value="Salt">Salt</option>
                                    <option value="Cheese">Cheese</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleAddConsumption();
                                        setFieldValue('consumptions', [...values.consumptions, { name: ingredientItem, stock: '100kg', consumption: 1 }]);
                                    }}
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    Add Ingredient
                                </button>
                                <table className="min-w-full bg-white mt-4">
                                    <thead>
                                        <tr>
                                            <th>Item Name</th>
                                            <th>Stock</th>
                                            <th>Consumption</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {values.consumptions.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name}</td>
                                                <td>{item.stock}</td>
                                                <td>
                                                    <Field
                                                        type="number"
                                                        name={`consumptions[${index}].consumption`}
                                                        className="border p-2 rounded w-full"
                                                    />
                                                    <ErrorMessage name={`consumptions[${index}].consumption`} component="div" className="text-red-500 text-sm" />
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="text-red-500"
                                                        onClick={() => handleDeleteConsumption(index, setFieldValue)}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                >
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => navigate('/admin/modifiers')}
                                    className="bg-gray-500 text-white px-4 py-2 rounded"
                                >
                                    Back To List
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default AddModifier;
