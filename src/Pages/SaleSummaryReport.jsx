import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

const SaleSummaryReport = () => {
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
      <h1 className="text-2xl font-bold mb-4">Sale Summary Report</h1>

      {/* Breadcrumbs */}
      <div className="mb-4">
        <nav className="text-sm text-gray-600">
          <a href="#" className="hover:underline">Home</a> &gt; <span>Sale Summary Report</span>
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

      {/* Summary */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">From:</span>
            <span>2024-09-02</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">To:</span>
            <span>2024-09-02</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Order Quantity:</span>
            <span>0</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Sub Total:</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Charge:</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Discount:</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount Tax Excluded:</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tax:</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total:</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Purchase:</span>
            <span>0.00</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Expense:</span>
            <span>0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleSummaryReport;
