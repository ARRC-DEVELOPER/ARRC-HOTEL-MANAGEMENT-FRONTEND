import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { FaFilePdf, FaPrint, FaFileExcel, FaFileCsv } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { utils, writeFile } from "xlsx";
import Papa from "papaparse";
import axios from "axios";
import { server } from "../redux/store";
import moment from "moment";

const ExpenseReport = () => {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${server}/purchase/getAllExpenses`);
        setExpenses(response.data.data);
        calculateTotals(response.data.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const formik = useFormik({
    initialValues: {
      period: "Daily",
      fromDate: "2024-09-02",
      toDate: "2024-09-02",
    },
    validationSchema: Yup.object({
      fromDate: Yup.date().required("From date is required"),
      toDate: Yup.date().required("To date is required"),
    }),
    onSubmit: async (values) => {
      const formattedFromDate = moment(values.fromDate).format("DD-MM-YYYY");
      const formattedToDate = moment(values.toDate).format("DD-MM-YYYY");
      try {
        const response = await axios.get(`${server}/purchase/getAllExpenses`, {
          params: {
            period: values.period.toLowerCase(),
            from: formattedFromDate,
            to: formattedToDate,
          },
        });

        setExpenses(response.data.data);
        calculateTotals(response.data.data);

        toast.success("Expenses filtered successfully!", {
          position: "top-center",
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to filter expenses",
          { position: "top-center" }
        );
      }
    },
  });

  const calculateTotals = (expenseData) => {
    const totalAmount = expenseData.reduce(
      (sum, expense) => sum + expense.totalExpense,
      0
    );

    setTotal(totalAmount);
  };

  // Export functions
  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Expense Report", 14, 22);

    const headers = [["Total Amount ", "Period"]];
    const data = expenses.map((expense) => [
      `₹${expense.totalExpense}`,
      `₹${expense.period}`,
    ]);

    const content = {
      head: headers,
      body: data,
    };

    doc.autoTable(content);
    doc.save("expense_report.pdf");
    toast.success("Exported to PDF...");
  };

  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(expenses);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Report");
    writeFile(workbook, "sales_report.xlsx");
    toast.success("Exported to Excel");
  };

  const exportToCsv = () => {
    const csv = Papa.unparse(expenses);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported to CSV");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Expense Report</h1>

      {/* Breadcrumbs */}
      <div className="mb-4">
        <nav className="text-sm text-gray-600">
          <a href="#" className="hover:underline">
            Home
          </a>{" "}
          &gt; <span>Expense Report</span>
        </nav>
      </div>

      {/* Form and Filters */}
      <form onSubmit={formik.handleSubmit} className="mb-4">
        <div className="flex mb-4 space-x-4">
          <div className="flex flex-col w-1/4">
            <label htmlFor="period" className="text-sm font-medium mb-1">
              Period *
            </label>
            <select
              id="period"
              name="period"
              value={formik.values.period}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="border rounded p-2"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          <div className="flex flex-col w-1/4">
            <label htmlFor="fromDate" className="text-sm font-medium mb-1">
              From *
            </label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={formik.values.fromDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border rounded p-2 ${
                formik.errors.fromDate && formik.touched.fromDate
                  ? "border-red-500"
                  : ""
              }`}
            />
            {formik.errors.fromDate && formik.touched.fromDate ? (
              <div className="text-red-500 text-sm">
                {formik.errors.fromDate}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col w-1/4">
            <label htmlFor="toDate" className="text-sm font-medium mb-1">
              To *
            </label>
            <input
              type="date"
              id="toDate"
              name="toDate"
              value={formik.values.toDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`border rounded p-2 ${
                formik.errors.toDate && formik.touched.toDate
                  ? "border-red-500"
                  : ""
              }`}
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Total Amount</th>
              <th className="py-2 px-4 border-b">Period</th>
            </tr>
          </thead>
          <tbody>
            {expenses ? (
              expenses.map((expense) => (
                <tr>
                  <td className="py-2 px-4 border-b text-center">
                    ₹{expense.totalExpense}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {expense.period}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No expenses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <ToastContainer />
      </div>

      {/* Summary */}
      <div className="mt-4">
        <p className="font-bold">Overall Expense: ₹{total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ExpenseReport;
