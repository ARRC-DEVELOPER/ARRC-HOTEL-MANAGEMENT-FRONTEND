import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Modal, Button, Input, Table, Pagination } from 'antd';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Departments = () => {
    const [departments, setDepartments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalData, setModalData] = useState({ title: '', updatedBy: '' });
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        fetchDepartments();
    }, [page, search, pageSize]);

    const fetchDepartments = async () => {
        try {
            const response = await axios.get('https://arrc-tech.onrender.com/api/departments', {
                params: {
                    page,
                    limit: pageSize,
                    search
                }
            });
            setDepartments(response.data.departments || []);
            setTotalItems(response.data.totalItems || 0);
        } catch (error) {
            console.error('Error fetching departments:', error);
            toast.error('Failed to fetch departments.');
        }
    };

    const handleOpenModal = (department = {}) => {
        setModalData({ 
            title: department.title || '', 
            updatedBy: department.updatedBy || '' // Ensure updatedBy is set
        });
        setModalTitle(department._id ? 'Edit Department' : 'Add New Department');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalData({ title: '', updatedBy: '' });
    };

    const handleSave = async () => {
        try {
            if (modalData.title === '' || modalData.updatedBy === '') {
                toast.warn('Title and Updated By are required.');
                return;
            }

            if (modalData._id) {
                // Update existing department
                await axios.put(`https://arrc-tech.onrender.com/api/departments/${modalData._id}`, modalData);
                toast.success('Department updated successfully.');
            } else {
                // Create new department
                await axios.post('https://arrc-tech.onrender.com/api/departments', modalData);
                toast.success('Department created successfully.');
            }
            fetchDepartments();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving department:', error);
            toast.error('Failed to save department.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://arrc-tech.onrender.com/api/departments/${id}`);
            fetchDepartments();
            toast.success('Department deleted successfully.');
        } catch (error) {
            console.error('Error deleting department:', error);
            toast.error('Failed to delete department.');
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
            title: '#',
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
            <ToastContainer />
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Button type="link" href="/">Home</Button>
                    <span className="mx-2">/</span>
                    <span>Departments</span>
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
                dataSource={departments}
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
                visible={isModalOpen}
                onOk={handleSave}
                onCancel={handleCloseModal}
            >
                <Input
                    placeholder="Title"
                    value={modalData.title || ''}
                    onChange={(e) => setModalData({ ...modalData, title: e.target.value })}
                    className="mb-4"
                />
                <Input
                    placeholder="Updated By"
                    value={modalData.updatedBy || ''}
                    onChange={(e) => setModalData({ ...modalData, updatedBy: e.target.value })}
                />
            </Modal>
        </div>
    );
};

export default Departments;
