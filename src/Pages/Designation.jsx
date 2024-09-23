import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button, Input, Table, Pagination } from 'antd';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Designation = () => {
    const [designations, setDesignations] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        fetchDesignations();
    }, [page, search, pageSize]);

    const fetchDesignations = async () => {
        try {
            const response = await axios.get('https://arrc-tech.onrender.com/api/designations', {
                params: {
                    page,
                    limit: pageSize,
                    search
                }
            });
            setDesignations(response.data.designations || []);
            setTotalItems(response.data.totalItems || 0);
        } catch (error) {
            toast.error('Error fetching designations');
            console.error('Error fetching designations:', error);
        }
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            updatedBy: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            updatedBy: Yup.string().required('Updated By is required'),
        }),
        onSubmit: async (values) => {
            try {
                if (editId) {
                    // Update existing designation
                    await axios.put(`https://arrc-tech.onrender.com/api/designations/${editId}`, values);
                    toast.success('Designation updated successfully');
                } else {
                    // Create new designation
                    await axios.post('https://arrc-tech.onrender.com/api/designations', values);
                    toast.success('Designation created successfully');
                }
                fetchDesignations();
                handleCloseModal();
            } catch (error) {
                toast.error('Error saving designation');
                console.error('Error saving designation:', error.response || error.message);
            }
        },
    });

    const handleOpenModal = (designation = {}) => {
        setModalTitle(designation._id ? 'Edit Designation' : 'Add New Designation');
        setEditId(designation._id || null);
        formik.setValues({
            title: designation.title || '',
            updatedBy: designation.updatedBy || '',
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        formik.resetForm();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://arrc-tech.onrender.com/api/designations/${id}`);
            fetchDesignations();
            toast.success('Designation deleted successfully');
        } catch (error) {
            toast.error('Error deleting designation');
            console.error('Error deleting designation:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePaginationChange = (page, pageSize) => {
        setPage(page);
        setPageSize(pageSize);
    };

    const columns = [
        {
            title: 'Sr No',
            render: (_, __, index) => index + 1 + (page - 1) * pageSize,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text) => new Date(text).toLocaleString(),
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
                <>
                    <Button
                        icon={<FaEdit />}
                        onClick={() => handleOpenModal(record)}
                        className="text-blue-500 hover:text-blue-700"
                    />
                    <Button
                        icon={<FaTrash />}
                        onClick={() => handleDelete(record._id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                    />
                </>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Button type="link" href="/">Home</Button>
                    <span className="mx-2">/</span>
                    <span>Designations</span>
                </div>
                <Button type="primary" onClick={() => handleOpenModal()}>Add New</Button>
            </div>

            <Input
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
                className="mb-4"
            />

            <Table
                dataSource={designations}
                columns={columns}
                rowKey="_id"
                pagination={false}
            />

            <Pagination
                current={page}
                pageSize={pageSize}
                total={totalItems}
                onChange={handlePaginationChange}
                showSizeChanger
                pageSizeOptions={[10, 20, 50]}
                className="mt-4"
            />

            <Modal
                title={modalTitle}
                open={isModalOpen}
                onOk={formik.handleSubmit}
                onCancel={handleCloseModal}
                okText="Save"
                cancelText="Cancel"
            >
                <form onSubmit={formik.handleSubmit}>
                    <Input
                        placeholder="Title"
                        name="title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="mb-4"
                    />
                    {formik.touched.title && formik.errors.title ? (
                        <div className="text-red-500">{formik.errors.title}</div>
                    ) : null}
                    <Input
                        placeholder="Updated By"
                        name="updatedBy"
                        value={formik.values.updatedBy}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.updatedBy && formik.errors.updatedBy ? (
                        <div className="text-red-500">{formik.errors.updatedBy}</div>
                    ) : null}
                </form>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default Designation;
