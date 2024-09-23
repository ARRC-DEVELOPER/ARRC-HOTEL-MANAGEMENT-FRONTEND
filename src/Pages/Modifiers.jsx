import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const Modifiers = () => {
    const [modifiers, setModifiers] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentModifier, setCurrentModifier] = useState(null);

    useEffect(() => {
        const fetchModifiers = async () => {
            try {
                const response = await axios.get('https://arrc-tech.onrender.com/api/modifiers');
                const data = Array.isArray(response.data) ? response.data : [];
                setModifiers(data);
            } catch (error) {
                toast.error('Error fetching data. Please try again later.');
                console.error('Error fetching data:', error);
                setModifiers([]); // Set an empty array in case of an error
            }
        };

        fetchModifiers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://arrc-tech.onrender.com/api/modifiers/${id}`);
            toast.success('Modifier deleted successfully');
            setModifiers(modifiers.filter(modifier => modifier._id !== id));
        } catch (error) {
            toast.error('Error deleting modifier. Please try again.');
            console.error('Error deleting modifier:', error);
        }
    };

    const handleEditClick = (modifier) => {
        setCurrentModifier(modifier);
        setModalOpen(true);
    };

    const handleEditSubmit = async (values) => {
        try {
            const response = await axios.put(`https://arrc-tech.onrender.com/api/modifiers/${currentModifier._id}`, values);
            toast.success('Modifier updated successfully');
            setModifiers(modifiers.map(modifier => 
                modifier._id === currentModifier._id ? response.data : modifier
            ));
            setModalOpen(false);
            setCurrentModifier(null);
        } catch (error) {
            toast.error('Error updating modifier. Please try again.');
            console.error('Error updating modifier:', error);
        }
    };

    const searchSchema = Yup.object().shape({
        searchTerm: Yup.string()
            .min(2, 'Search term must be at least 2 characters')
            .required('Search term is required'),
    });

    const editSchema = Yup.object().shape({
        title: Yup.string().required('Title is required'),
        price: Yup.number()
            .required('Price is required')
            .positive('Price must be positive'),
    });

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">Modifiers</h1>
                <Link to="/admin/addmodifiers" className="bg-green-500 text-white px-4 py-2 rounded">
                    Add New
                </Link>
            </div>

            <Formik
                initialValues={{ searchTerm: '' }}
                validationSchema={searchSchema}
                onSubmit={(values) => {
                    const filteredModifiers = modifiers.filter(modifier =>
                        modifier.title.toLowerCase().includes(values.searchTerm.toLowerCase())
                    );
                    setModifiers(filteredModifiers);
                }}
            >
                {({ isSubmitting, setFieldValue }) => (
                    <Form className="flex justify-between items-center mb-4">
                        <div>
                            <label className="block">
                                Show
                                <select className="border rounded ml-2" onChange={e => setFieldValue('showEntries', e.target.value)}>
                                    <option>50</option>
                                    <option>100</option>
                                    <option>150</option>
                                </select>
                                Entries
                            </label>
                        </div>
                        <div className="flex items-center">
                            <Field
                                type="text"
                                name="searchTerm"
                                placeholder="Search"
                                className="border p-2 rounded"
                            />
                            <ErrorMessage name="searchTerm" component="div" className="text-red-500 text-sm ml-2" />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-500 text-white px-4 py-2 rounded ml-4"
                        >
                            Search
                        </button>
                    </Form>
                )}
            </Formik>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 border-b text-left">#</th>
                            <th className="px-4 py-2 border-b text-left">Title</th>
                            <th className="px-4 py-2 border-b text-left">Price</th>
                            <th className="px-4 py-2 border-b text-left">Updated At</th>
                            <th className="px-4 py-2 border-b text-left">Updated By</th>
                            <th className="px-4 py-2 border-b text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {modifiers.map((modifier, index) => (
                            <tr key={modifier._id}>
                                <td className="px-4 py-2 border-b">{index + 1}</td>
                                <td className="px-4 py-2 border-b">{modifier.title}</td>
                                <td className="px-4 py-2 border-b">₹{modifier.price}</td>
                                <td className="px-4 py-2 border-b">{modifier.updatedAt}</td>
                                <td className="px-4 py-2 border-b">{modifier.updatedBy}</td>
                                <td className="px-4 py-2 border-b flex items-center">
                                    <button
                                        className="text-blue-500"
                                        onClick={() => handleEditClick(modifier)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="text-red-500 ml-2"
                                        onClick={() => handleDelete(modifier._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4">
                Showing {modifiers.length} entries
            </div>

            {modalOpen && currentModifier && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Modifier</h2>
                        <Formik
                            initialValues={{
                                title: currentModifier.title,
                                price: currentModifier.price,
                            }}
                            validationSchema={editSchema}
                            onSubmit={handleEditSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Title</label>
                                        <Field
                                            type="text"
                                            name="title"
                                            className="border border-gray-300 p-2 rounded w-full"
                                        />
                                        <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700">Price</label>
                                        <Field
                                            type="number"
                                            name="price"
                                            className="border border-gray-300 p-2 rounded w-full"
                                        />
                                        <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setModalOpen(false)}
                                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-blue-500 text-white px-4 py-2 rounded"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Modifiers;
