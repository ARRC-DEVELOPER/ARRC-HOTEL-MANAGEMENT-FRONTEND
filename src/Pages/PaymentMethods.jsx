import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaHome, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const PaymentMethod = ({ onPaymentMethodsFetched }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [editingMethod, setEditingMethod] = useState(null);

    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                const response = await axios.get('https://arrc-tech.onrender.com/api/paymentmethods');
                setPaymentMethods(response.data);
                if (onPaymentMethodsFetched) {
                    onPaymentMethodsFetched(response.data);
                  }
                } 
            catch (error) {
                console.error(error);
                toast.error("Failed to fetch payment methods");
            }
        };
    
        fetchPaymentMethods();
    }, [onPaymentMethodsFetched]);

    const fetchPaymentMethods = async () => {
        try {
            const response = await axios.get('https://arrc-tech.onrender.com/api/paymentmethods');
            setPaymentMethods(response.data);
            if (onPaymentMethodsFetched) {
                onPaymentMethodsFetched(response.data);
              }
            } 
        catch (error) {
            console.error(error);
            toast.error("Failed to fetch payment methods");
        }
    };

    const handleSave = async (values, { resetForm }) => {
        try {
            if (editingMethod) {
                await axios.put(`https://arrc-tech.onrender.com/api/paymentmethods/${editingMethod._id}`, values, {
                    headers: { 'Content-Type': 'application/json' }
                });
                toast.success("Payment method updated successfully");
            } else {
                await axios.post('https://arrc-tech.onrender.com/api/paymentmethods', values, {
                    headers: { 'Content-Type': 'application/json' }
                });
                toast.success("Payment method added successfully");
            }
            fetchPaymentMethods();
            resetForm();
            setModalOpen(false);
            setEditingMethod(null);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to save payment method");
        }
    };

    const handleEdit = (method) => {
        setEditingMethod(method);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://arrc-tech.onrender.com/api/paymentmethods/${id}`);
            toast.success("Payment method deleted successfully");
            fetchPaymentMethods();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete payment method");
        }
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required')
    });

    return (
        <div className="p-6">
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Payment Methods</h1>
                <div className="flex items-center space-x-2">
                    <FaHome />
                    <span>Home &gt; Payment Methods</span>
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
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">Sr No</th>
                            <th className="px-4 py-2 border">Title</th>
                            <th className="px-4 py-2 border">Updated At</th>
                            <th className="px-4 py-2 border">Updated By</th>
                            <th className="px-4 py-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentMethods.map((method, index) => (
                            <tr key={method._id} className="text-center">
                                <td className="px-4 py-2 border">{index + 1}</td>
                                <td className="px-4 py-2 border">{method.title}</td>
                                <td className="px-4 py-2 border">{new Date(method.updatedAt).toLocaleDateString()}</td>
                                <td className="px-4 py-2 border">{method.updatedBy}</td>
                                <td className="px-4 py-2 border">
                                    <button className="text-blue-500 mr-2" onClick={() => handleEdit(method)}>
                                        <FaEdit />
                                    </button>
                                    <button className="text-red-500" onClick={() => handleDelete(method._id)}>
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
                        <h2 className="text-xl font-semibold mb-4">{editingMethod ? 'Edit Payment Method' : 'Add Payment Method'}</h2>
                        <Formik
                            initialValues={{
                                title: editingMethod ? editingMethod.title : '',
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
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => {
                                                setModalOpen(false);
                                                setEditingMethod(null);
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
        </div>
    );
};

export default PaymentMethod;
