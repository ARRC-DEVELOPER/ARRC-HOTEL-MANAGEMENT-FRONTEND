import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from 'react-icons/fa';

const ItemSaleReport = () => {
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
      <h1 className="text-2xl font-bold mb-4">Item Sale Report</h1>

      {/* Breadcrumbs */}
      <div className="mb-4">
        <nav className="text-sm text-gray-600">
          <a href="#" className="hover:underline">Home</a> &gt; <span>Item Sale Report</span>
        </nav>
      </div>

      {/* Form and Filters */}
      <form onSubmit={formik.handleSubmit} className="mb-4">
        <div className="flex mb-4 space-x-4">
          <div className="flex flex-col">
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

          <div className="flex flex-col">
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
      <div className="flex mb-4 space-x-2">
        <button className="p-2 border rounded bg-gray-200 hover:bg-gray-300">
          <FaPrint className="text-gray-600" />
        </button>
        <button className="p-2 border rounded bg-gray-200 hover:bg-gray-300">
          <FaFilePdf className="text-red-600" />
        </button>
        <button className="p-2 border rounded bg-gray-200 hover:bg-gray-300">
          <FaFileCsv className="text-blue-600" />
        </button>
        <button className="p-2 border rounded bg-gray-200 hover:bg-gray-300">
          <FaFileExcel className="text-green-600" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale Quantity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">No Result Found</td>
              <td className="px-6 py-4 whitespace-nowrap" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemSaleReport;
