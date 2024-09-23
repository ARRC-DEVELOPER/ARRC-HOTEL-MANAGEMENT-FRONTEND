// src/components/Suppliers.js

import React, { useState, useEffect } from 'react';
import { FaHome, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState(null);
  const navigate = useNavigate();

  // Fetch supplier data from the backend
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('https://arrc-tech.onrender.com/api/suppliers');
        setSuppliers(response.data);
      } catch (error) {
        toast.error(`Failed to fetch suppliers: ${error.message}`);
      }
    };

    fetchSuppliers();
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle delete supplier
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://arrc-tech.onrender.com/api/suppliers/${id}`);
      setSuppliers(suppliers.filter((supplier) => supplier._id !== id));
      toast.success('Supplier deleted successfully');
    } catch (error) {
      toast.error(`Failed to delete supplier: ${error.message}`);
    }
  };

  // Handle edit supplier
  const handleEdit = (supplier) => {
    setCurrentSupplier(supplier);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSupplier(null);
  };

  // Handle update supplier
  const handleUpdate = async () => {
    try {
      await axios.put(`https://arrc-tech.onrender.com/api/suppliers/${currentSupplier._id}`, currentSupplier);
      setSuppliers(
        suppliers.map((supplier) =>
          supplier._id === currentSupplier._id ? currentSupplier : supplier
        )
      );
      toast.success('Supplier updated successfully');
      closeModal();
    } catch (error) {
      toast.error(`Failed to update supplier: ${error.message}`);
    }
  };

  // Pagination logic
  const indexOfLastSupplier = currentPage * itemsPerPage;
  const indexOfFirstSupplier = indexOfLastSupplier - itemsPerPage;
  const currentSuppliers = suppliers
    .filter((supplier) =>
      supplier.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstSupplier, indexOfLastSupplier);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <FaHome className="text-green-500" />
        <span className="text-sm text-gray-600">Home {'>'} Suppliers</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Suppliers List</h1>
        <button
          onClick={() => navigate('/admin/addsupplier')}
          className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Supplier
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by supplier name"
        value={searchTerm}
        onChange={handleSearch}
        className="p-2 border border-gray-300 rounded-md w-full mb-6"
      />

      {/* Suppliers Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-600">Supplier Name</th>
            <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-600">Email</th>
            <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-600">Phone Number</th>
            <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-600">Address</th>
            <th className="border-b px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentSuppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td className="border-b px-6 py-4">{supplier.supplierName}</td>
              <td className="border-b px-6 py-4">{supplier.email}</td>
              <td className="border-b px-6 py-4">{supplier.phoneNumber}</td>
              <td className="border-b px-6 py-4">{supplier.address}</td>
              <td className="border-b px-6 py-4">
                <button
                  onClick={() => handleEdit(supplier)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(supplier._id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {Math.ceil(suppliers.length / itemsPerPage)}
        </span>
        <button
          onClick={() => paginate(currentPage + 1)}
          className="bg-gray-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={currentPage === Math.ceil(suppliers.length / itemsPerPage)}
        >
          Next
        </button>
      </div>

      {/* Update Supplier Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-50"
      >
        <h2 className="text-xl font-semibold mb-4">Update Supplier</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Supplier Name</label>
          <input
            type="text"
            value={currentSupplier?.supplierName || ''}
            onChange={(e) =>
              setCurrentSupplier({ ...currentSupplier, supplierName: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={currentSupplier?.email || ''}
            onChange={(e) =>
              setCurrentSupplier({ ...currentSupplier, email: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="text"
            value={currentSupplier?.phoneNumber || ''}
            onChange={(e) =>
              setCurrentSupplier({ ...currentSupplier, phoneNumber: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            value={currentSupplier?.address || ''}
            onChange={(e) =>
              setCurrentSupplier({ ...currentSupplier, address: e.target.value })
            }
            className="p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Save Changes
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Suppliers;
