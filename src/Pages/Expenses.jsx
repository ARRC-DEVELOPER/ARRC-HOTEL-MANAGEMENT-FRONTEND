import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Expenses = () => {
  const [accounts, setAccounts] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, perPage: 10 });

  useEffect(() => {
    fetchAccounts();
    fetchExpenses();
  }, [pagination]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get("https://arrc-tech.onrender.com/api/accounts");
      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/expenses?page=${pagination.page}&perPage=${pagination.perPage}`);
      setExpenses(response.data.expenses || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/api/expenses/${id}`);
      toast.success("Expense deleted successfully");
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense");
    }
  };

  const formik = useFormik({
    initialValues: {
      account: "",
      date: "",
      amount: "",
      note: "",
    },
    validationSchema: Yup.object({
      account: Yup.string().required("Account is required"),
      date: Yup.date().required("Date is required"),
      amount: Yup.number().required("Amount is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (selectedExpense) {
          // Update existing expense
          await axios.put(`http://127.0.0.1:5000/api/expenses/${selectedExpense.id}`, values);
          toast.success("Expense updated successfully");
        } else {
          // Create new expense
          await axios.post("http://127.0.0.1:5000/api/expenses", values);
          toast.success("Expense created successfully");
        }
        fetchExpenses();
        setIsModalOpen(false);
        formik.resetForm();
      } catch (error) {
        console.error("Error saving expense:", error);
        toast.error("Failed to save expense");
      }
    },
  });

  const openModal = (expense = null) => {
    setSelectedExpense(expense);
    if (expense) {
      formik.setValues({
        account: expense.account,
        date: expense.date,
        amount: expense.amount,
        note: expense.note,
      });
    } else {
      formik.resetForm();
    }
    setIsModalOpen(true);
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
            fetchExpenses(); // Add filtering logic based on selected account
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
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense, index) => (
              <tr key={expense.id}>
                <td className="py-2 px-4 border">{(pagination.page - 1) * pagination.perPage + index + 1}</td>
                <td className="py-2 px-4 border">{expense.account}</td>
                <td className="py-2 px-4 border">{expense.date}</td>
                <td className="py-2 px-4 border">{expense.amount}</td>
                <td className="py-2 px-4 border">{expense.note}</td>
                <td className="py-2 px-4 border">{expense.updatedAt}</td>
                <td className="py-2 px-4 border">{expense.updatedBy}</td>
                <td className="py-2 px-4 border">
                  <FaEdit
                    className="text-blue-500 cursor-pointer"
                    onClick={() => openModal(expense)}
                  />
                  <FaTrash
                    className="text-red-500 cursor-pointer ml-2"
                    onClick={() => handleDelete(expense.id)}
                  />
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
      <div className="mt-4 flex justify-between items-center">
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Previous
        </button>
        <span>
          Page {pagination.page}
        </span>
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h3 className="text-lg font-semibold mb-4">{selectedExpense ? "Edit Expense" : "Add Expense"}</h3>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="account">Account</label>
                <select
                  id="account"
                  name="account"
                  value={formik.values.account}
                  onChange={formik.handleChange}
                  className="block w-full border rounded p-2"
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
                {formik.touched.account && formik.errors.account ? (
                  <div className="text-red-600 text-sm">{formik.errors.account}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="date">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formik.values.date}
                  onChange={formik.handleChange}
                  className="block w-full border rounded p-2"
                />
                {formik.touched.date && formik.errors.date ? (
                  <div className="text-red-600 text-sm">{formik.errors.date}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="amount">Amount</label>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  className="block w-full border rounded p-2"
                />
                {formik.touched.amount && formik.errors.amount ? (
                  <div className="text-red-600 text-sm">{formik.errors.amount}</div>
                ) : null}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="note">Note</label>
                <textarea
                  id="note"
                  name="note"
                  value={formik.values.note}
                  onChange={formik.handleChange}
                  className="block w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  {selectedExpense ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
