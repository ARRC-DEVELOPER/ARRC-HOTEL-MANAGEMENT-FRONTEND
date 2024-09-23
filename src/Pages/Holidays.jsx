// src/components/Holidays.js
import React, { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root');

function Holidays() {
  const [holidays, setHolidays] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    note: ''
  });
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });

  useEffect(() => {
    fetchHolidays();
  }, [pagination.currentPage, search]);

  const fetchHolidays = async () => {
    try {
      const response = await axios.get('https://arrc-tech.onrender.com/api/holidays', {
        params: {
          page: pagination.currentPage,
          search
        }
      });
      setHolidays(response.data.holidays);
      setPagination({
        ...pagination,
        totalPages: response.data.totalPages
      });
    } catch (error) {
      console.error('Error fetching holidays', error);
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
      if (editingHoliday) {
        await axios.put(`https://arrc-tech.onrender.com/api/holidays/${editingHoliday._id}`, formData);
        setEditingHoliday(null);
      } else {
        await axios.post('https://arrc-tech.onrender.com/api/holidays', formData);
      }
      setFormData({
        fromDate: '',
        toDate: '',
        note: ''
      });
      setIsModalOpen(false);
      fetchHolidays();
    } catch (error) {
      console.error('Error adding or updating holiday', error);
    }
  };

  const handleEditClick = (holiday) => {
    setEditingHoliday(holiday);
    setFormData({
      fromDate: holiday.fromDate,
      toDate: holiday.toDate,
      note: holiday.note
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`https://arrc-tech.onrender.com/api/holidays/${deleteId}`);
      setDeleteId(null);
      setIsDeleteModalOpen(false);
      fetchHolidays();
    } catch (error) {
      console.error('Error deleting holiday', error);
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <span className="text-gray-600 flex items-center">
          <FaHome className="mr-2" />
          <span>Home &gt; Holidays</span>
        </span>
      </div>

      {/* Title and Add New Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Holidays</h1>
        <button
          onClick={() => setIsModalOpen(true)}
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

      {/* Holidays Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated By</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {holidays.length > 0 ? (
            holidays.map((holiday, index) => (
              <tr key={holiday._id}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">{holiday.fromDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{holiday.toDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{holiday.note}</td>
                <td className="px-6 py-4 whitespace-nowrap">{holiday.updatedAt}</td>
                <td className="px-6 py-4 whitespace-nowrap">{holiday.updatedBy}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditClick(holiday)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(holiday._id)}
                    className="text-red-600 hover:text-red-800 ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="px-6 py-4 text-center">No Result Found</td>
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

      {/* Modal for Adding or Editing Holiday */}
      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} className="max-w-lg mx-auto my-6 bg-white p-6 rounded">
        <h2 className="text-2xl font-bold mb-4">{editingHoliday ? 'Edit Holiday' : 'Add Holiday'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">From Date *</label>
            <input
              id="fromDate"
              name="fromDate"
              type="date"
              value={formData.fromDate}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">To Date *</label>
            <input
              id="toDate"
              name="toDate"
              type="date"
              value={formData.toDate}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            />
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
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded mr-2 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              {editingHoliday ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onRequestClose={() => setIsDeleteModalOpen(false)} className="max-w-lg mx-auto my-6 bg-white p-6 rounded">
        <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this holiday?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="bg-gray-300 text-gray-800 py-2 px-4 rounded mr-2 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteConfirm}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default Holidays;
