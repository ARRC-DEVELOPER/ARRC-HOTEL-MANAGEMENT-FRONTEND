import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { server } from "../redux/store"

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);

  useEffect(() => {
    fetchAccounts();
    fetchExpenses();
  }, [currentPage]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`${server}/expenses/getExpenses`);
      setExpenses(response.data.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Faild To fetch expenses!", {
        position: "top-center",
      });
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${server}/accounts/getAccounts`);

      setAccounts(response.data.accounts);
    } catch (error) {
      toast.error("Error fetching accounts: " + error.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      from: "",
      to: "",
      account: "",
    },
    validationSchema: Yup.object({
      from: Yup.date().required("From date is required"),
      to: Yup.date().required("To date is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.get(
          `${server}/expenses/getExpenses?fromDate=${values.from}&toDate=${values.to}&accountId=${values.account}`
        );
        setExpenses(response.data.expenses);
        toast.success("Expenses fetched successfully!");
      } catch (error) {
        toast.error("Failed to fetch expenses.");
      }
    },
  });

  // Pagination logic
  const indexOfLastExpense = currentPage * entriesPerPage;
  const indexOfFirstExpense = indexOfLastExpense - entriesPerPage;
  const currentExpenses = expenses.slice(
    indexOfFirstExpense,
    indexOfLastExpense
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
        Expenses
      </h1>

      {/* Filter Form */}
      <form onSubmit={formik.handleSubmit} className="mb-6">
        <div className="flex flex-wrap -mx-3 items-end">
          <div className="w-full sm:w-1/4 px-3 mb-4 sm:mb-0">
            <label className="block text-xs font-bold mb-2" htmlFor="from">
              From *
            </label>
            <input
              id="from"
              name="from"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.from}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-3"
            />
            {formik.touched.from && formik.errors.from ? (
              <div className="text-red-500 text-xs">{formik.errors.from}</div>
            ) : null}
          </div>

          <div className="w-full sm:w-1/4 px-3 mb-4 sm:mb-0">
            <label className="block text-xs font-bold mb-2" htmlFor="to">
              To *
            </label>
            <input
              id="to"
              name="to"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.to}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-3"
            />
            {formik.touched.to && formik.errors.to ? (
              <div className="text-red-500 text-xs">{formik.errors.to}</div>
            ) : null}
          </div>

          <div className="w-full sm:w-1/4 px-3 mb-4 sm:mb-0">
            <label className="block text-xs font-bold mb-2" htmlFor="account">
              Account
            </label>
            <select
              id="account"
              name="account"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.account}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-3"
            >
              <option value="">All</option>
              {Array.isArray(accounts) &&
                accounts.map((account) => (
                  <option key={account._id} value={account._id}>
                    {account.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="w-full sm:w-1/4 px-3 mb-4 sm:mb-0 flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded"
            >
              Filter
            </button>
          </div>
        </div>
      </form>

      {/* Entries per page and Search */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center">
          <span className="text-xs sm:text-sm">Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
            className="mx-2 p-1 border rounded text-xs sm:text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-xs sm:text-sm">Entries</span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="py-2 px-2 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                #
              </th>
              <th className="py-2 px-2 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                Account
              </th>
              <th className="py-2 px-2 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="py-2 px-2 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-2 px-2 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                Updated By
              </th>
              <th className="py-2 px-2 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {currentExpenses.map((expense, index) => (
              <tr key={expense._id}>
                <td className="py-2 px-2 border-b">{index + 1}</td>
                <td className="py-2 px-2 border-b">{expense.accountNumber}</td>
                <td className="py-2 px-2 border-b">
                  {new Date(expense.createdAt).toLocaleDateString()}
                </td>
                <td className="py-2 px-2 border-b">₹{expense.amount}</td>
                <td className="py-2 px-2 border-b">{expense.updatedBy}</td>
                <td className="py-2 px-2 border-b">{expense.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs sm:text-sm">
          Showing {indexOfFirstExpense + 1} to{" "}
          {Math.min(indexOfLastExpense, expenses.length)} of {expenses.length}{" "}
          entries
        </span>
        <div className="flex">
          {Array.from(
            { length: Math.ceil(expenses.length / entriesPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`py-2 px-4 border rounded ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-blue-500"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Expenses;
