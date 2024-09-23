import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const CreatePermission = () => {
  const formik = useFormik({
    initialValues: {
      role: '',
      roleDescription: '',
      usersManagementView: false,
      usersManagementCreate: false,
      usersManagementEdit: false,
      // Add other permissions here
    },
    validationSchema: Yup.object({
      role: Yup.string().required('Role is required'),
      roleDescription: Yup.string().required('Role description is required'),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('/api/permissions', values);
        alert('Permission created successfully!');
      } catch (error) {
        console.error('There was an error creating the permission!', error);
      }
    },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h4 className="text-xl font-semibold mb-4">Create Permission</h4>
        <h6 className="text-gray-600 mb-6">Manage Create Permissions</h6>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="col-span-1">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <input
                id="role"
                name="role"
                type="text"
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  formik.errors.role && formik.touched.role ? 'border-red-500' : ''
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.role}
              />
              {formik.errors.role && formik.touched.role ? (
                <p className="text-red-500 text-sm">{formik.errors.role}</p>
              ) : null}
            </div>
            <div className="col-span-1">
              <label htmlFor="roleDescription" className="block text-sm font-medium text-gray-700">
                Role Description
              </label>
              <input
                id="roleDescription"
                name="roleDescription"
                type="text"
                className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  formik.errors.roleDescription && formik.touched.roleDescription ? 'border-red-500' : ''
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.roleDescription}
              />
              {formik.errors.roleDescription && formik.touched.roleDescription ? (
                <p className="text-red-500 text-sm">{formik.errors.roleDescription}</p>
              ) : null}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <input
                id="select-all"
                name="select-all"
                type="checkbox"
                className="mr-2"
                onChange={(e) => {
                  const checked = e.target.checked;
                  formik.setFieldValue('usersManagementView', checked);
                  formik.setFieldValue('usersManagementCreate', checked);
                  formik.setFieldValue('usersManagementEdit', checked);
                  // Set other permissions as needed
                }}
              />
              <label htmlFor="select-all" className="text-sm font-medium text-gray-700">
                Select All
              </label>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="usersManagementView"
                  name="usersManagementView"
                  type="checkbox"
                  className="mr-2"
                  checked={formik.values.usersManagementView}
                  onChange={formik.handleChange}
                />
                <label htmlFor="usersManagementView" className="text-sm font-medium text-gray-700">
                  View
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="usersManagementCreate"
                  name="usersManagementCreate"
                  type="checkbox"
                  className="mr-2"
                  checked={formik.values.usersManagementCreate}
                  onChange={formik.handleChange}
                />
                <label htmlFor="usersManagementCreate" className="text-sm font-medium text-gray-700">
                  Create
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="usersManagementEdit"
                  name="usersManagementEdit"
                  type="checkbox"
                  className="mr-2"
                  checked={formik.values.usersManagementEdit}
                  onChange={formik.handleChange}
                />
                <label htmlFor="usersManagementEdit" className="text-sm font-medium text-gray-700">
                  Edit
                </label>
              </div>
              {/* Add more permissions here */}
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Permission
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePermission;
