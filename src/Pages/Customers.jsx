import React, { useState, useEffect } from 'react';
import { FaHome, FaEdit, FaTrash, FaPlus } from 'react-icons/fa'; // Import FaPlus icon
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

Modal.setAppElement('#root'); // Set the root element for accessibility

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Change this to adjust items per page
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch customer data from the backend
  useEffect(() => {
    axios
      .get('https://arrc-tech.onrender.com/api/customers')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCustomers(response.data);
        } else {
          toast.error('Unexpected data format');
        }
      })
      .catch((error) => toast.error(`Failed to fetch customers: ${error.message}`));
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Handle delete customer
  const handleDelete = (id) => {
    axios
      .delete(`https://arrc-tech.onrender.com/api/customers/${id}`)
      .then(() => {
        setCustomers(customers.filter((customer) => customer._id !== id));
        toast.success('Customer deleted successfully');
      })
      .catch((error) => toast.error(`Failed to delete customer: ${error.message}`));
  };

  // Handle edit customer
  const handleEdit = (customer) => {
    setCurrentCustomer(customer);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
  };

  // Handle update customer
  const handleUpdate = () => {
    axios
      .put(`https://arrc-tech.onrender.com/api/customers/${currentCustomer._id}`, currentCustomer)
      .then(() => {
        setCustomers(
          customers.map((customer) =>
            customer._id === currentCustomer._id ? currentCustomer : customer
          )
        );
        toast.success('Customer updated successfully');
        closeModal();
      })
      .catch((error) => toast.error(`Failed to update customer: ${error.message}`));
  };

  // Pagination logic
  const indexOfLastCustomer = currentPage * itemsPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
  const currentCustomers = customers
    .filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstCustomer, indexOfLastCustomer);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center space-x-2 mb-6">
        <FaHome className="text-green-500" />
        <span className="text-sm text-gray-600">Home {'>'} Customers</span>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Customers List</h1>
        <button
          onClick={() => navigate('/admin/addcustomer')} // Navigate to AddCustomer page
          className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by customer name"
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border border-gray-300 rounded-md w-1/3"
      />

      {/* Customers Table */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Sr. No</th>
            <th className="py-2 px-4 border-b">Customer Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Updated At</th>
            <th className="py-2 px-4 border-b">Updated By</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map((customer, index) => (
            <tr key={customer._id} className="border-t border-gray-300">
              <td className="py-2 px-4">{indexOfFirstCustomer + index + 1}</td>
              <td className="py-2 px-4">{customer.name}</td>
              <td className="py-2 px-4">{customer.email}</td>
              <td className="py-2 px-4">{customer.phone}</td>
              <td className="py-2 px-4">{customer.address}</td>
              <td className="py-2 px-4">{new Date(customer.updatedAt).toLocaleString()}</td>
              <td className="py-2 px-4">{customer.updatedBy || 'N/A'}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleEdit(customer)}
                  className="text-blue-500 mr-4"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(customer._id)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(Math.ceil(customers.length / itemsPerPage)).keys()].map((number) => (
          <button
            key={number + 1}
            onClick={() => paginate(number + 1)}
            className={`px-4 py-2 rounded-md ${
              number + 1 === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-gray-300 text-gray-700'
            }`}
          >
            {number + 1}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Customer"
      >
        {currentCustomer && (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Edit Customer</h2>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={currentCustomer.name}
              onChange={(e) =>
                setCurrentCustomer({ ...currentCustomer, name: e.target.value })
              }
              className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            />
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={currentCustomer.email}
              onChange={(e) =>
                setCurrentCustomer({ ...currentCustomer, email: e.target.value })
              }
              className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            />
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              value={currentCustomer.phone}
              onChange={(e) =>
                setCurrentCustomer({ ...currentCustomer, phone: e.target.value })
              }
              className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            />
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={currentCustomer.address}
              onChange={(e) =>
                setCurrentCustomer({ ...currentCustomer, address: e.target.value })
              }
              className="mb-4 p-2 border border-gray-300 rounded-md w-full"
            />
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
            >
              Update
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        )}
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Customers;
