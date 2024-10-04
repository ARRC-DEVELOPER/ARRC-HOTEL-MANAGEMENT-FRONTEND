import React, { useState } from 'react';
import Modal from 'react-modal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';

Modal.setAppElement('#root'); // This is to avoid accessibility issues

const Language = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formik setup for the modal form
  const formik = useFormik({
    initialValues: {
      culture: '',
      jsonFile: null,
    },
    validationSchema: Yup.object({
      culture: Yup.string().required('Culture is required'),
      jsonFile: Yup.mixed().required('JSON File is required'),
    }),
    onSubmit: (values) => {
      // Simulate a successful submission
      toast.success('Language added successfully!');
      console.log('Form Data:', values);
      setIsModalOpen(false); // Close the modal on success
    },
  });

  return (
    <div className="p-6">
      {/* Toaster */}
      <Toaster position="top-right" />

      {/* Breadcrumbs */}
      <nav className="text-sm font-medium text-gray-700 mb-6">
        <ol className="list-reset flex">
          <li><a href="#" className="text-blue-600 hover:text-blue-800">Home</a></li>
          <li><span className="mx-2"></span></li>
          <li>Language</li>
        </ol>
      </nav>

      {/* Title and Add New Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Language</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add New
        </button>
      </div>

      {/* Modal for Adding Language */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Add Language Modal"
        className="p-6 bg-white rounded-md shadow-lg max-w-md mx-auto mt-12"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      >
        <h2 className="text-xl font-semibold mb-4">Add Language</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Culture Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="culture">
              Culture *
            </label>
            <select
              id="culture"
              name="culture"
              value={formik.values.culture}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="" label="Choose Option" />
              <option value="Marathi">Marathi</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Japanese">Japanese</option>
              <option value="Tamil">Tamil</option>
            </select>
            {formik.touched.culture && formik.errors.culture ? (
              <p className="text-red-600 text-sm mt-1">{formik.errors.culture}</p>
            ) : null}
          </div>

          {/* JSON File Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="jsonFile">
              JSON File *
            </label>
            <input
              type="file"
              id="jsonFile"
              name="jsonFile"
              onChange={(event) => formik.setFieldValue('jsonFile', event.currentTarget.files[0])}
              className="mt-1 block w-full text-sm text-gray-700"
            />
            {formik.touched.jsonFile && formik.errors.jsonFile ? (
              <p className="text-red-600 text-sm mt-1">{formik.errors.jsonFile}</p>
            ) : null}
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-gray-600 bg-gray-200 text-sm font-medium rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </Modal>

      {/* Pagination and Search */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="text-sm text-gray-700">
            Show
            <select className="ml-2 p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option>50</option>
              <option>100</option>
              <option>150</option>
            </select>
            Entries
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Language
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Culture
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows */}
            <tr>
              <td className="px-4 py-2 border-b border-gray-200">English</td>
              <td className="px-4 py-2 border-b border-gray-200">English (Australia)</td>
              <td className="px-4 py-2 border-b border-gray-200">
                <button className="text-blue-600 hover:text-blue-800">Edit</button>
                <button className="ml-4 text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b border-gray-200">Marathi</td>
              <td className="px-4 py-2 border-b border-gray-200">Marathi (India)</td>
              <td className="px-4 py-2 border-b border-gray-200">
                <button className="text-blue-600 hover:text-blue-800">Edit</button>
                <button className="ml-4 text-red-600 hover:text-red-800">Delete</button>
              </td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Language;


// DELETED