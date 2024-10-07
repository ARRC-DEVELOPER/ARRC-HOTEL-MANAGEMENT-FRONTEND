import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { server } from "../redux/store";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  useEffect(() => {
    fetchAccounts();
    fetchExpenses();
  }, [pagination]);

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

      setAccounts(response.data.accounts)
    } catch (error) {
      toast.error("Error fetching accounts: " + error.message);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePerPageChange = (perPage) => {
    setPagination({ page: 1, perPage });
  };

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Expenses</h2>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => openModal()}
        >
          Add New
        </button>
      </div>
      <div className="mb-4">
        <label className="mr-2">Account</label>
        <select
          className="mt-1 block w-1/2"
          name="account"
          onChange={(e) => {
            formik.setFieldValue("account", e.target.value);
            fetchExpenses();
          }}
        >
          <option value="">All</option>
          {Array.isArray(accounts) &&
            accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
        </select>
      </div>
      <div className="flex space-x-4 mb-4">
        <div>
          <label className="mr-2">From</label>
          <input
            type="date"
            className="mt-1 block w-full"
            name="from"
            onChange={(e) => formik.setFieldValue("from", e.target.value)}
          />
        </div>
        <div>
          <label className="mr-2">To</label>
          <input
            type="date"
            className="mt-1 block w-full"
            name="to"
            onChange={(e) => formik.setFieldValue("to", e.target.value)}
          />
        </div>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-6"
          onClick={fetchExpenses} // Add filtering logic based on date range
        >
          Filter
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <label className="mr-2">Show</label>
        <select
          className="mt-1 block"
          onChange={(e) => handlePerPageChange(parseInt(e.target.value))}
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
        <input
          type="text"
          className="block w-1/2 border rounded p-2"
          placeholder="Search"
          onChange={(e) => formik.setFieldValue("search", e.target.value)}
        />
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">#</th>
            <th className="py-2 px-4 border">Account</th>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Amount</th>
            <th className="py-2 px-4 border">Note</th>
            <th className="py-2 px-4 border">Updated At</th>
            <th className="py-2 px-4 border">Updated By</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <tr key={expense.id}>
                <td className="py-2 px-4 border">
                  {(pagination.page - 1) * pagination.perPage + index + 1}
                </td>
                <td className="py-2 px-4 border">{expense.accountNumber}</td>
                <td className="py-2 px-4 border">{expense.createdAt}</td>
                <td className="py-2 px-4 border">{expense.amount}</td>
                <td className="py-2 px-4 border">{expense.note}</td>
                <td className="py-2 px-4 border">{expense.updatedAt}</td>
                <td className="py-2 px-4 border">{expense.updatedBy}</td>
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
      <div className="mt-4 flex justify-between items-center">
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </button>
        <span>Page {pagination.page}</span>
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Expenses;
