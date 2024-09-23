import React, { useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FaHome, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Charges = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [charges, setCharges] = useState([]);
    const [editingCharge, setEditingCharge] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        fetchCharges();
    }, [page]);

    const fetchCharges = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/charges?page=${page}&limit=${pageSize}`);
            setCharges(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch charges");
        }
    };

    const handleSave = async (values, { resetForm }) => {
        try {
            if (editingCharge) {
                await axios.put(`http://127.0.0.1:5000/api/charges/${editingCharge._id}`, values);
                toast.success("Charge updated successfully");
            } else {
                await axios.post('http://127.0.0.1:5000/api/charges', values);
                toast.success("Charge added successfully");
            }
            fetchCharges();
            resetForm();
            setModalOpen(false);
            setEditingCharge(null);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to save charge");
        }
    };

    const handleEdit = (charge) => {
        setEditingCharge(charge);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/api/charges/${id}`);
            toast.success("Charge deleted successfully");
            fetchCharges();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to delete charge");
        }
    };

    const handleSwitchChange = async (id, checked) => {
        try {
            await axios.put(`http://127.0.0.1:5000/api/charges/${id}`, { isDefault: checked });
            fetchCharges();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to update default status");
        }
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        type: Yup.string().oneOf(['Percentage', 'Fixed'], 'Invalid type').required('Type is required'),
        value: Yup.number().min(0, 'Value must be positive').required('Value is required')
    });

    const columns = [
        {
            title: 'Sr No',
            key: 'srNo',
            render: (_, __, index) => index + 1 + (page - 1) * pageSize,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            render: (text, record) => (
                record.type === 'Percentage' ? `${text.toFixed(2)} %` : `$${text.toFixed(2)}`
            ),
        },
        {
            title: 'Default',
            dataIndex: 'isDefault',
            key: 'isDefault',
            render: (text, record) => (
                <input
                    type="checkbox"
                    checked={text}
                    onChange={(e) => handleSwitchChange(record._id, e.target.checked)}
                />
            ),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'Updated By',
            dataIndex: 'updatedBy',
            key: 'updatedBy',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(record)}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => handleDelete(record._id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
        },
    ];

    const filteredData = charges.filter(charge => charge.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-6">
            <ToastContainer />
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Charges</h1>
                <div className="flex items-center space-x-2">
                    <FaHome />
                    <span>Home &gt; Charges</span>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    <FaPlus />
                    <span>Add New</span>
                </button>
                <input
                    placeholder="Search..."
                    className="border border-gray-300 rounded-md px-2 py-1"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className="p-2 border-b">{col.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((charge, index) => (
                        <tr key={charge._id}>
                            {columns.map(col => (
                                <td key={col.key} className="p-2 border-b">
                                    {col.render ? col.render(charge[col.dataIndex], charge, index) : charge[col.dataIndex]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                    Previous
                </button>
                <span>Page {page}</span>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={charges.length < pageSize}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                    Next
                </button>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">{editingCharge ? 'Edit Charge' : 'Add Charge'}</h2>
                        <Formik
                            initialValues={{
                                title: editingCharge ? editingCharge.title : '',
                                type: editingCharge ? editingCharge.type : 'Percentage',
                                value: editingCharge ? editingCharge.value : 0.00
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
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1"
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
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1"
                                        >
                                            <option value="Percentage">Percentage</option>
                                            <option value="Fixed">Fixed</option>
                                        </Field>
                                        <ErrorMessage name="type" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                                            Value *
                                        </label>
                                        <Field
                                            type="number"
                                            name="value"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1"
                                        />
                                        <ErrorMessage name="value" component="div" className="text-red-500 text-sm" />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setModalOpen(false)}
                                            className="bg-gray-300 px-4 py-2 rounded-md"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                        >
                                            {isSubmitting ? 'Saving...' : 'Save'}
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

export default Charges;
