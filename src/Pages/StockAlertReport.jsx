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

const StockAlertReport = () => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchIngedients = async () => {
      try {
        const response = await axios.get(
          `${server}/ingredients/getAllIngredients`
        );
        setIngredients(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchIngedients();
  }, []);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      fromDate: "09/02/2024",
      toDate: "09/02/2024",
    },
    validationSchema: Yup.object({
      fromDate: Yup.date().required("From date is required"),
      toDate: Yup.date().required("To date is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.get(
          `${server}/ingredients/getAllIngredients`,
          {
            params: {
              from: values.fromDate,
              to: values.toDate,
            },
          }
        );

        setIngredients(response.data);
        toast.success("Stock filtered successfully!", {
          position: "top-center",
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to filter stock", {
          position: "top-center",
        });
      }
    },
  });

  // Export functions
  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Expense Report", 14, 22);

    const headers = [["Ingredient Item ", "Stock", "Alert Quantity"]];
    const data = ingredients.map((ingredient) => [
      `${ingredient.name}`,
      `${ingredient.quantity}`,
      `${ingredient.alertQuantity}`,
    ]);

    const content = {
      head: headers,
      body: data,
    };

    doc.autoTable(content);
    doc.save("stock_report.pdf");
    toast.success("Exported to PDF...");
  };

  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(ingredients);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Report");
    writeFile(workbook, "sales_report.xlsx");
    toast.success("Exported to Excel");
  };

  const exportToCsv = () => {
    const csv = Papa.unparse(ingredients);
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
      <h1 className="text-2xl font-bold mb-4">Stock Alert Report</h1>

      {/* Breadcrumbs */}
      <div className="mb-4">
        <nav className="text-sm text-gray-600">
          <a href="#" className="hover:underline">
            Home
          </a>{" "}
          &gt; <span>Stock Alert Report</span>
        </nav>
      </div>

      {/* Form and Filters */}
      <form onSubmit={formik.handleSubmit} className="mb-4">
        <div className="flex mb-4 space-x-4">
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

      {/* Stock Alert Table */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">
                Ingredient Item
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">
                Stock
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-900">
                Alert Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            {ingredients ? (
              ingredients.map((ingredient) => (
                <tr>
                  <td className="py-2 px-4 border-b">{ingredient.name}</td>
                  <td className="py-2 px-4 border-b">
                    {ingredient.quantity} {ingredient.unit}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {ingredient.alertQuantity}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No stocks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <ToastContainer />
      </div>
    </div>
  );
};

export default StockAlertReport;
