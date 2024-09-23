import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { FaPrint, FaFilePdf, FaFileExcel, FaFileCsv } from 'react-icons/fa';

const StockAlertReport = () => {
  // Formik setup
  const formik = useFormik({
    initialValues: {
      fromDate: '09/02/2024',
      toDate: '09/02/2024',
    },
    validationSchema: Yup.object({
      fromDate: Yup.date().required('From date is required'),
      toDate: Yup.date().required('To date is required'),
    }),
    onSubmit: (values) => {
      // Handle filter logic here
      toast.success('Filter applied successfully');
    },
  });

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Stock Alert Report</h1>

      {/* Breadcrumbs */}
      <div className="mb-4">
        <nav className="text-sm text-gray-600">
          <a href="#" className="hover:underline">Home</a> &gt; <span>Stock Alert Report</span>
        </nav>
      </div>

      {/* Form and Filters */}
      <form onSubmit={formik.handleSubmit} className="mb-4">
        <div className="flex mb-4 space-x-4">
          <div className="flex flex-col w-1/4">
            <label htmlFor="fromDate" className="text-sm font-medium mb-1">From *</label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={formik.values.fromDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border rounded p-2 ${formik.errors.fromDate && formik.touched.fromDate ? 'border-red-500' : ''}`}
            />
            {formik.errors.fromDate && formik.touched.fromDate ? (
              <div className="text-red-500 text-sm">{formik.errors.fromDate}</div>
            ) : null}
          </div>

          <div className="flex flex-col w-1/4">
            <label htmlFor="toDate" className="text-sm font-medium mb-1">To *</label>
            <input
              type="date"
              id="toDate"
              name="toDate"
              value={formik.values.toDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border rounded p-2 ${formik.errors.toDate && formik.touched.toDate ? 'border-red-500' : ''}`}
            />
            {formik.errors.toDate && formik.touched.toDate ? (
              <div className="text-red-500 text-sm">{formik.errors.toDate}</div>
            ) : null}
          </div>

          <div className="ml-auto flex items-end">
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Filter
            </button>
          </div>
        </div>
      </form>

      {/* Export Icons */}
      <div className="flex space-x-4 mb-4">
        <button className="p-2 border rounded hover:bg-gray-100">
          <FaPrint className="text-gray-800" />
        </button>
        <button className="p-2 border rounded hover:bg-gray-100">
          <FaFilePdf className="text-red-600" />
        </button>
        <button className="p-2 border rounded hover:bg-gray-100">
          <FaFileExcel className="text-green-600" />
        </button>
        <button className="p-2 border rounded hover:bg-gray-100">
          <FaFileCsv className="text-blue-600" />
        </button>
      </div>

      {/* Stock Alert Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">Ingredient Item</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">Stock</th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">Alert Quantity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-2 px-4 text-sm text-gray-700">Chesse</td>
              <td className="py-2 px-4 text-sm text-gray-700">5.00</td>
              <td className="py-2 px-4 text-sm text-gray-700">1</td>
            </tr>
            <tr>
              <td className="py-2 px-4 text-sm text-gray-700">Mayonnaise</td>
              <td className="py-2 px-4 text-sm text-gray-700">-5.00</td>
              <td className="py-2 px-4 text-sm text-gray-700">0.00</td>
            </tr>
            <tr>
              <td className="py-2 px-4 text-sm text-gray-700">Algeriene</td>
              <td className="py-2 px-4 text-sm text-gray-700">-5.00</td>
              <td className="py-2 px-4 text-sm text-gray-700">0.00</td>
            </tr>
            <tr>
              <td className="py-2 px-4 text-sm text-gray-700">BUFFALLO MILK PIZZA</td>
              <td className="py-2 px-4 text-sm text-gray-700">0.00 GRAM</td>
              <td className="py-2 px-4 text-sm text-gray-700">10.00</td>
            </tr>
          </tbody>
        </table>
        <div className="text-center mt-4 text-gray-500">No Result Found</div>
      </div>
    </div>
  );
};

export default StockAlertReport;
