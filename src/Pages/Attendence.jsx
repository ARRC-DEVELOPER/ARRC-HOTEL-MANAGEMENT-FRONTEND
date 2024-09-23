import React, { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';

const Attendance = () => {
  const [showModal, setShowModal] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      shift: '',
      date: '',
    },
    validationSchema: Yup.object({
      shift: Yup.string().required('Shift is required'),
      date: Yup.date().required('Date is required'),
    }),
    onSubmit: (values) => {
      toast.success('Attendance added successfully!');
      closeModal();
    },
  });

  return (
    <div className="p-6">
      <Toaster />

      {/* Title and Add Attendance Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <button
          onClick={openModal}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Attendance
        </button>
      </div>

      {/* Breadcrumbs */}
      <div className="mb-4">
        <nav className="text-sm text-gray-600">
          <a href="#" className="hover:underline">Home</a> &gt; <span>Attendance</span>
        </nav>
      </div>

      {/* Filter Options */}
      <div className="flex items-center mb-4 space-x-4">
        <div className="flex items-center">
          <label htmlFor="shiftFilter" className="mr-2 text-sm font-medium">Shift</label>
          <select id="shiftFilter" className="border rounded p-2">
            <option value="All">All</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Night">Night</option>
          </select>
        </div>
        <div className="flex items-center">
          <label htmlFor="dateFilter" className="mr-2 text-sm font-medium">Date *</label>
          <input
            type="date"
            id="dateFilter"
            className="border rounded p-2"
            defaultValue="2024-09-02"
          />
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="showEntries" className="text-sm">Show</label>
          <select id="showEntries" className="border rounded p-2">
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </select>
          <span className="text-sm">Entries</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaSearch />
          <input
            type="text"
            placeholder="Search"
            className="border rounded p-2"
          />
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">#</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">Employee</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">Shift</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">Date</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">Clock In</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">Clock Out</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">Status</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">Updated At</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">Updated By</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* Add rows dynamically here */}
            <tr>
              <td className="py-2 px-4 text-sm text-gray-700">1</td>
              <td className="py-2 px-4 text-sm text-gray-700">John Doe</td>
              <td className="py-2 px-4 text-sm text-gray-700">Morning</td>
              <td className="py-2 px-4 text-sm text-gray-700">09/02/2024</td>
              <td className="py-2 px-4 text-sm text-gray-700">08:00 AM</td>
              <td className="py-2 px-4 text-sm text-gray-700">04:00 PM</td>
              <td className="py-2 px-4 text-sm text-gray-700">Present</td>
              <td className="py-2 px-4 text-sm text-gray-700">09/02/2024</td>
              <td className="py-2 px-4 text-sm text-gray-700">Admin</td>
              <td className="py-2 px-4 text-sm text-gray-700">
                {/* Action buttons or links */}
              </td>
            </tr>
            {/* More rows as needed */}
          </tbody>
        </table>
        <div className="text-center text-sm mt-4">No Result Found</div>
      </div>

      {/* Add Attendance Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
            <h2 className="text-xl font-bold mb-4">Add Attendance</h2>
            <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <label htmlFor="shift" className="text-sm font-medium">Shift *</label>
                <select
                  id="shift"
                  name="shift"
                  className={`border rounded p-2 ${formik.errors.shift && formik.touched.shift ? 'border-red-500' : 'border-gray-300'}`}
                  value={formik.values.shift}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Choose Option</option>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
                {formik.errors.shift && formik.touched.shift && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.shift}</div>
                )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="date" className="text-sm font-medium">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className={`border rounded p-2 ${formik.errors.date && formik.touched.date ? 'border-red-500' : 'border-gray-300'}`}
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.date && formik.touched.date && (
                  <div className="text-red-500 text-sm mt-1">{formik.errors.date}</div>
                )}
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
