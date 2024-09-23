// src/components/LeaveRequest.js
import React, { useState, useEffect } from 'react';
import { FaHome, FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

function LeaveRequest() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    employee: '',
    startDate: '',
    endDate: '',
    leaveType: '',
    status: '',
    note: '',
    updatedBy: '' // Added updatedBy field
  });
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });

  useEffect(() => {
    fetchLeaveRequests();
  }, [pagination.currentPage, search]);

  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get('https://arrc-tech.onrender.com/api/leaverequest', {
        params: {
          page: pagination.currentPage,
          search
        }
      });
      setLeaveRequests(response.data.leaveRequests);
      setPagination({
        ...pagination,
        totalPages: response.data.totalPages
      });
    } catch (error) {
      console.error('Error fetching leave requests', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`https://arrc-tech.onrender.com/api/leaverequest/${selectedRequest._id}`, formData);
      } else {
        await axios.post('https://arrc-tech.onrender.com/api/leaverequest', formData);
      }
      setFormData({
        employee: '',
        startDate: '',
        endDate: '',
        leaveType: '',
        status: '',
        note: '',
        updatedBy: '' // Reset updatedBy field
      });
      setIsModalOpen(false);
      setIsEditMode(false);
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error saving leave request', error);
    }
  };

  const handleEdit = (request) => {
    setSelectedRequest(request);
    setFormData({
      employee: request.employee,
      startDate: request.startDate.slice(0, 10),
      endDate: request.endDate.slice(0, 10),
      leaveType: request.leaveType,
      status: request.status,
      note: request.note || '',
      updatedBy: request.updatedBy || '' // Set updatedBy field
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://arrc-tech.onrender.com/api/leaverequest/${id}`);
      fetchLeaveRequests();
    } catch (error) {
      console.error('Error deleting leave request', error);
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <span className="text-gray-600 flex items-center">
          <FaHome className="mr-2" />
          <span>Home &gt; Leave Request</span>
        </span>
      </div>

      {/* Title and Add New Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leave Requests</h1>
        <button
          onClick={() => {
            setFormData({
              employee: '',
              startDate: '',
              endDate: '',
              leaveType: '',
              status: '',
              note: '',
              updatedBy: '' // Reset updatedBy field
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add New
        </button>
      </div>

      {/* Search Field */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          className="border p-2 rounded w-1/3"
        />
      </div>

      {/* Leave Requests Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Days</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated By</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {leaveRequests.length > 0 ? (
            leaveRequests.map((request, index) => (
              <tr key={request._id}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.employee}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(request.startDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(request.endDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{Math.ceil((new Date(request.endDate) - new Date(request.startDate)) / (1000 * 60 * 60 * 24))}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(request.updatedAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{request.updatedBy}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleEdit(request)} className="text-blue-600 hover:text-blue-800 mr-2">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(request._id)} className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="px-6 py-4 text-center">No Result Found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-600">
          Show {pagination.currentPage} of {pagination.totalPages} entries
        </div>
        <div>
          <button
            onClick={() => setPagination({ ...pagination, currentPage: Math.max(pagination.currentPage - 1, 1) })}
            className="bg-gray-300 text-gray-800 py-1 px-3 rounded mr-2 hover:bg-gray-400"
          >
            Prev
          </button>
          <button
            onClick={() => setPagination({ ...pagination, currentPage: Math.min(pagination.currentPage + 1, pagination.totalPages) })}
            className="bg-gray-300 text-gray-800 py-1 px-3 rounded hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Adding/Editing Leave Request */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="max-w-lg mx-auto my-6 bg-white p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Leave Request' : 'Add Leave Request'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="employee" className="block text-sm font-medium text-gray-700">Employee *</label>
            <input
              id="employee"
              name="employee"
              type="text"
              value={formData.employee}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date *</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={formData.startDate}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date *</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={formData.endDate}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="leaveType" className="block text-sm font-medium text-gray-700">Leave Type *</label>
            <select
              id="leaveType"
              name="leaveType"
              value={formData.leaveType}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Choose Option</option>
              <option value="sick">Sick</option>
              <option value="personal">Personal</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">Choose Option</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note</label>
            <textarea
              id="note"
              name="note"
              value={formData.note}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="updatedBy" className="block text-sm font-medium text-gray-700">Updated By *</label>
            <input
              id="updatedBy"
              name="updatedBy"
              type="text"
              value={formData.updatedBy}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default LeaveRequest;
