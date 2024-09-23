import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaHome, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

const OfficeShift = () => {
  const [shifts, setShifts] = useState([]); // Initial state as an empty array
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentShift, setCurrentShift] = useState(null);

  const formik = useFormik({
    initialValues: {
      title: '',
      startAt: '',
      endAt: ''
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      startAt: Yup.string().required('Start time is required'),
      endAt: Yup.string().required('End time is required')
    }),
    onSubmit: async (values) => {
      try {
        if (editMode) {
          await axios.put(`https://arrc-tech.onrender.com/api/shifts/${currentShift._id}`, values);
          toast.success('Shift updated successfully');
        } else {
          await axios.post('https://arrc-tech.onrender.com/api/shifts', values);
          toast.success('Shift created successfully');
        }
        setIsModalOpen(false);
        formik.resetForm();
        fetchShifts();
        setEditMode(false);
      } catch (error) {
        toast.error(editMode ? 'Failed to update shift' : 'Failed to create shift');
        console.error(error);
      }
    }
  });

  // Function to fetch shifts
  const fetchShifts = async () => {
    try {
      const response = await axios.get('https://arrc-tech.onrender.com/api/shifts');
      if (Array.isArray(response.data)) {
        setShifts(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setShifts([]);
      }
    } catch (error) {
      console.error('Error fetching shifts:', error);
      setShifts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleEdit = (shift) => {
    setCurrentShift(shift);
    formik.setValues({
      title: shift.title,
      startAt: shift.startAt,
      endAt: shift.endAt
    });
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (shiftId) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      try {
        await axios.delete(`https://arrc-tech.onrender.com/api/shifts/${shiftId}`);
        toast.success('Shift deleted successfully');
        fetchShifts();
      } catch (error) {
        toast.error('Failed to delete shift');
        console.error(error);
      }
    }
  };

  return (
    <div className="p-6">
      <Toaster />
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaHome className="text-blue-500" />
          <span className="text-xl font-semibold">Home</span>
          <span className="text-gray-500">/</span>
          <span className="text-xl font-semibold">Office Shift</span>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
          onClick={() => {
            setIsModalOpen(true);
            setEditMode(false);
            formik.resetForm();
          }}
        >
          <FaPlus className="mr-2" />
          Add New
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-xl font-semibold mb-4">
              {editMode ? 'Edit Shift' : 'Add Shift'}
            </h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700">Title *</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                  className={`w-full p-2 border ${formik.touched.title && formik.errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div className="text-red-500">{formik.errors.title}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="startAt" className="block text-gray-700">Start At *</label>
                <input
                  id="startAt"
                  name="startAt"
                  type="time"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.startAt}
                  className={`w-full p-2 border ${formik.touched.startAt && formik.errors.startAt ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {formik.touched.startAt && formik.errors.startAt ? (
                  <div className="text-red-500">{formik.errors.startAt}</div>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="endAt" className="block text-gray-700">End At *</label>
                <input
                  id="endAt"
                  name="endAt"
                  type="time"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.endAt}
                  className={`w-full p-2 border ${formik.touched.endAt && formik.errors.endAt ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                />
                {formik.touched.endAt && formik.errors.endAt ? (
                  <div className="text-red-500">{formik.errors.endAt}</div>
                ) : null}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-white px-4 py-2 rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                  {editMode ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">#</th>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Start At</th>
            <th className="py-2 px-4 border-b">End At</th>
            <th className="py-2 px-4 border-b">Updated At</th>
            <th className="py-2 px-4 border-b">Updated By</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(shifts) ? (
            shifts.map((shift, index) => (
              <tr key={shift._id}>
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b text-center">{shift.title}</td>
                <td className="py-2 px-4 border-b text-center">{shift.startAt}</td>
                <td className="py-2 px-4 border-b text-center">{shift.endAt}</td>
                <td className="py-2 px-4 border-b text-center">{new Date(shift.updatedAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b text-center">{shift.updatedBy}</td>
                <td className="py-2 px-4 border-b text-center flex justify-center space-x-2">
                  <button
                    className="text-blue-500"
                    onClick={() => handleEdit(shift)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => handleDelete(shift._id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="py-4 text-center">No shifts available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OfficeShift;
