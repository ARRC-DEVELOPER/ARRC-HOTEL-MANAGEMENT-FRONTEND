import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';

const Email = () => {
  // Formik setup
  const formik = useFormik({
    initialValues: {
      mailProtocol: 'SMTP',
      mailEncryption: 'SSL',
      mailHost: '',
      mailPort: '',
      mailUsername: '',
      mailPassword: '',
    },
    validationSchema: Yup.object({
      mailHost: Yup.string().required('Mail Host is required'),
      mailPort: Yup.number().required('Mail Port is required').integer(),
      mailUsername: Yup.string().email('Invalid email address').required('Mail Username is required'),
      mailPassword: Yup.string().required('Mail Password is required'),
    }),
    onSubmit: (values) => {
      // Simulate a successful submission
      toast.success('Configuration saved successfully!');
      console.log('Form Data:', values);
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
          <li>Email Configuration</li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Email Configuration</h1>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Mail Protocol */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="mailProtocol">
            Mail Protocol *
          </label>
          <select
            id="mailProtocol"
            name="mailProtocol"
            value={formik.values.mailProtocol}
            onChange={formik.handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>SMTP</option>
            <option>IMAP</option>
          </select>
        </div>

        {/* Mail Encryption */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="mailEncryption">
            Mail Encryption *
          </label>
          <select
            id="mailEncryption"
            name="mailEncryption"
            value={formik.values.mailEncryption}
            onChange={formik.handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>SSL</option>
            <option>TLS</option>
          </select>
        </div>

        {/* Mail Host */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="mailHost">
            Mail Host *
          </label>
          <input
            type="text"
            id="mailHost"
            name="mailHost"
            value={formik.values.mailHost}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formik.touched.mailHost && formik.errors.mailHost ? (
            <p className="text-red-600 text-sm mt-1">{formik.errors.mailHost}</p>
          ) : null}
        </div>

        {/* Mail Port */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="mailPort">
            Mail Port *
          </label>
          <input
            type="text"
            id="mailPort"
            name="mailPort"
            value={formik.values.mailPort}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formik.touched.mailPort && formik.errors.mailPort ? (
            <p className="text-red-600 text-sm mt-1">{formik.errors.mailPort}</p>
          ) : null}
        </div>

        {/* Mail Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="mailUsername">
            Mail Username *
          </label>
          <input
            type="email"
            id="mailUsername"
            name="mailUsername"
            value={formik.values.mailUsername}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formik.touched.mailUsername && formik.errors.mailUsername ? (
            <p className="text-red-600 text-sm mt-1">{formik.errors.mailUsername}</p>
          ) : null}
        </div>

        {/* Mail Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="mailPassword">
            Mail Password *
          </label>
          <input
            type="password"
            id="mailPassword"
            name="mailPassword"
            value={formik.values.mailPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formik.touched.mailPassword && formik.errors.mailPassword ? (
            <p className="text-red-600 text-sm mt-1">{formik.errors.mailPassword}</p>
          ) : null}
        </div>

        {/* Save Changes Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default Email;
