import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHome, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const TaxRates = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [taxRates, setTaxRates] = useState([]);
    const [editingRate, setEditingRate] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchTaxRates();
    }, []);

    const fetchTaxRates = async () => {
        try {
            const response = await axios.get('https://arrc-tech.onrender.com/api/taxrates');
            setTaxRates(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch tax rates");
        }
    };

    const handleSave = async (values, { resetForm }) => {
        try {
            if (editingRate) {
                await axios.put(`https://arrc-tech.onrender.com/api/taxrates/${editingRate._id}`, values);
                toast.success("Tax rate updated successfully");
            } else {
                await axios.post('https://arrc-tech.onrender.com/api/taxrates', values);
                toast.success("Tax rate added successfully");
            }
            fetchTaxRates();
            resetForm();
            setModalOpen(false);
            setEditingRate(null);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to save tax rate");
        }
    };

    const handleEdit = (rate) => {
        setEditingRate(rate);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://arrc-tech.onrender.com/api/taxrates/${id}`);
            toast.success("Tax rate deleted successfully");
            fetchTaxRates();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete tax rate");
        }
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        type: Yup.string().oneOf(['Percentage', 'Fixed'], 'Invalid type').required('Type is required'),
        value: Yup.number().min(0, 'Value must be positive').required('Value is required')
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Tax Rates</h1>
                <div className="flex items-center space-x-2">
                    <FaHome />
                    <span>Home &gt; Tax Rates</span>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                    onClick={() => setModalOpen(true)}
                >
                    <FaPlus />
                    <span>Add New</span>
                </button>
                <input
                    type="text"
                    placeholder="Search..."
                    className="border border-gray-300 rounded-md px-4 py-2"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Sr No</th>
                            <th className="px-4 py-2 border">Title</th>
                            <th className="px-4 py-2 border">Value</th>
                            <th className="px-4 py-2 border">Default</th>
                            <th className="px-4 py-2 border">Updated At</th>
                            <th className="px-4 py-2 border">Updated By</th>
                            <th className="px-4 py-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taxRates.filter(rate => rate.title.toLowerCase().includes(search.toLowerCase())).map((rate, index) => (
                            <tr key={rate._id} className="text-center">
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-4 py-2 border">{rate.title}</td>
                                <td className="px-4 py-2 border">
                                    {rate.type === 'Percentage' ? `${rate.value.toFixed(2)} %` : `$${rate.value.toFixed(2)}`}
                                </td>
                                <td className="px-4 py-2 border">
                                    <input
                                        type="checkbox"
                                        checked={rate.isDefault}
                                        className="form-checkbox"
                                        readOnly
                                    />
                                </td>
                                <td className="px-4 py-2 border">{new Date(rate.updatedAt).toLocaleDateString()}</td>
                                <td className="px-4 py-2 border">{rate.updatedBy}</td>
                                <td className="px-4 py-2 border">
                                    <button className="text-blue-500 mr-2" onClick={() => handleEdit(rate)}>
                                        <FaEdit />
                                    </button>
                                    <button className="text-red-500" onClick={() => handleDelete(rate._id)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <div>
                    <span>Show 10 Entries</span>
                </div>
                <div>
                    <button className="px-3 py-1 bg-gray-200">Prev</button>
                    <button className="px-3 py-1 bg-gray-200 ml-2">1</button>
                    <button className="px-3 py-1 bg-gray-200 ml-2">Next</button>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">{editingRate ? 'Edit Tax Rate' : 'Add Tax Rate'}</h2>
                        <Formik
                            initialValues={{
                                title: editingRate ? editingRate.title : '',
                                type: editingRate ? editingRate.type : 'Percentage',
                                value: editingRate ? editingRate.value : 0.00
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSave}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <div className="mb-4">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                            Title *
                                        </label>
                                        <Field
                                            type="text"
                                            name="title"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                        />
                                        <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                            Type *
                                        </label>
                                        <Field
                                            as="select"
                                            name="type"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="Percentage">Percentage</option>
                                            <option value="Fixed">Fixed</option>
                                        </Field>
                                        <ErrorMessage name="type" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                                            Value {values.type === 'Percentage' && '(%)'} *
                                        </label>
                                        <Field
                                            type="number"
                                            name="value"
                                            step="0.01"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                                        />
                                        <ErrorMessage name="value" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => {
                                                setModalOpen(false);
                                                setEditingRate(null);
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                            disabled={isSubmitting}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default TaxRates;
