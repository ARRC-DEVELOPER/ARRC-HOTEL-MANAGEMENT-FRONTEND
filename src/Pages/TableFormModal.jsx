// src/components/TableFormModal.js

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const TableFormModal = ({ onClose }) => {
  const formik = useFormik({
    initialValues: {
      tableName: '',
      image: null,
      reserved: false,
    },
    validationSchema: Yup.object({
      tableName: Yup.string().required('Table Name is required'),
    }),
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
      onClose();
    },
  });

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add Table</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Table Name *</label>
            <input
              type="text"
              name="tableName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.tableName}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            {formik.touched.tableName && formik.errors.tableName ? (
              <div className="text-red-600">{formik.errors.tableName}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <input
              type="file"
              name="image"
              onChange={(event) => {
                formik.setFieldValue('image', event.currentTarget.files[0]);
              }}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
            {formik.touched.image && formik.errors.image ? (
              <div className="text-red-600">{formik.errors.image}</div>
            ) : null}
          </div>
          <div className="mb-4 flex items-center">
            <label className="block text-gray-700 mr-4">Reserved</label>
            <input
              type="checkbox"
              name="reserved"
              onChange={formik.handleChange}
              checked={formik.values.reserved}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TableFormModal;
