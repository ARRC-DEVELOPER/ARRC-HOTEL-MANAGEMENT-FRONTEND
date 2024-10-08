import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { server } from "../redux/store";
import { FaFilePdf, FaPrint, FaFileExcel, FaFileCsv } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { utils, writeFile } from "xlsx";
import Papa from "papaparse";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);

  useEffect(() => {
    fetchAccounts();
    fetchTransactions();
  }, [currentPage]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${server}/other/getTransactions`);
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions!", {
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
          `${server}/other/getTransactions?fromDate=${values.from}&toDate=${values.to}&accountId=${values.account}`
        );
        setTransactions(response.data.transactions);
        toast.success("Transactions fetched successfully!");
      } catch (error) {
        toast.error("Failed to fetch transactions.");
      }
    },
  });

  // Export functions
  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Transaction Report", 14, 22);

    const headers = [["Account", "Type", "Amount", "Description"]];
    const data = transactions.map((transaction) => [
      `${transaction.accountNumber}`,
      `${transaction.type}`,
      `${transaction.amount.toFixed(2)}`,
      `${transaction.description}`,
    ]);

    const content = {
      head: headers,
      body: data,
    };

    doc.autoTable(content);
    doc.save("transaction_report.pdf");
    toast.success("Exported to PDF");
  };

  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(transactions);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Report");
    writeFile(workbook, "transaction_report.xlsx");
    toast.success("Exported to Excel");
  };

  const exportToCsv = () => {
    const csv = Papa.unparse(transactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "transaction_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported to CSV");
  };

  const handlePrint = () => {
    window.print();
  };

  // Pagination logic
  const indexOfLastTransaction = currentPage * entriesPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - entriesPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6">
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

      {/* Export Icons */}
      <div className="flex space-x-4 mb-4 justify-end">
        <button
          onClick={exportToPdf}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <FaFilePdf className="text-red-600" />
        </button>
        <button
          onClick={handlePrint}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <FaPrint className="text-gray-800" />
        </button>
        <button
          onClick={exportToExcel}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <FaFileExcel className="text-green-600" />
        </button>
        <button
          onClick={exportToCsv}
          className="p-2 border rounded hover:bg-gray-100"
        >
          <FaFileCsv className="text-blue-600" />
        </button>
      </div>

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
              {currentTransactions.length > 0 ? (
                currentTransactions.map((transaction, index) => (
                  <tr key={transaction._id}>
                    <td className="py-2 px-4 border">{index + 1}</td>
                    <td className="py-2 px-4 border">
                      {transaction.accountNumber}
                    </td>
                    <td className="py-2 px-4 border">{transaction.type}</td>
                    <td className="py-2 px-4 border">{transaction.amount}</td>
                    <td className="py-2 px-4 border">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs sm:text-sm">
          Showing {indexOfFirstTransaction + 1} to{" "}
          {Math.min(indexOfLastTransaction, transactions.length)} of{" "}
          {transactions.length} entries
        </span>
        <div className="flex">
          {Array.from(
            { length: Math.ceil(transactions.length / entriesPerPage) },
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

export default Transactions;
