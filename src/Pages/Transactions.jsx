import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import { server } from "../redux/store";
import axios from "axios";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  useEffect(() => {
    fetchTransactions();
  }, [pagination]);

  console.log(transactions);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${server}/other/getTransactions`);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Faild To Update!", {
        position: "top-center",
      });
    }
  };

  // Validation schema for the form
  const validationSchema = Yup.object().shape({
    account: Yup.string().required("Account is required"),
    from: Yup.date().required("From date is required"),
    to: Yup.date().required("To date is required"),
  });

  // Handle form submission
  const handleSubmit = (values) => {
    // Display success notification
    toast.success("Form submitted successfully!");
    console.log(values);
  };

  return (
    <div className="p-6">
      <Toaster />

      {/* Breadcrumbs */}
      <nav className="text-sm font-medium text-gray-700 mb-6">
        <ol className="list-reset flex">
          <li>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Home
            </a>
          </li>
          <li>
            <span className="mx-2"></span>
          </li>
          <li>Transactions</li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Transactions</h1>

      {/* Form */}
      <Formik
        initialValues={{ account: "", from: "", to: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Account Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account *
                </label>
                <Field
                  name="account"
                  as="select"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Choose Option</option>
                  <option value="Account1">Account 1</option>
                  <option value="Account2">Account 2</option>
                </Field>
                {errors.account && touched.account ? (
                  <div className="text-red-500 text-sm">{errors.account}</div>
                ) : null}
              </div>

              {/* From Date Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  From *
                </label>
                <Field
                  name="from"
                  type="date"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.from && touched.from ? (
                  <div className="text-red-500 text-sm">{errors.from}</div>
                ) : null}
              </div>

              {/* To Date Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  To *
                </label>
                <Field
                  name="to"
                  type="date"
                  className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.to && touched.to ? (
                  <div className="text-red-500 text-sm">{errors.to}</div>
                ) : null}
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>

      {/* Icons */}
      <div className="flex space-x-4 mt-8">
        <button className="text-gray-700 hover:text-blue-600">
          <i className="fas fa-file-excel"></i> Excel
        </button>
        <button className="text-gray-700 hover:text-blue-600">
          <i className="fas fa-file-pdf"></i> PDF
        </button>
        <button className="text-gray-700 hover:text-blue-600">
          <i className="fas fa-print"></i> Print
        </button>
        <button className="text-gray-700 hover:text-blue-600">
          <i className="fas fa-file-csv"></i> CSV
        </button>
      </div>

      {/* Table */}
      <div className="mt-8">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                  #
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                  Account
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                  Type
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                  Balance
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={transaction._id}>
                    <td className="py-2 px-4 border">
                      {(pagination.page - 1) * pagination.perPage + index + 1}
                    </td>
                    <td className="py-2 px-4 border">
                      {transaction.accountNumber}
                    </td>
                    <td className="py-2 px-4 border">{transaction.type}</td>
                    <td className="py-2 px-4 border">{transaction.amount}</td>
                    <td className="py-2 px-4 border">{transaction.date}</td>
                    <td className="py-2 px-4 border">
                      {transaction.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-2 px-4 border text-center">
                    No Results Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
