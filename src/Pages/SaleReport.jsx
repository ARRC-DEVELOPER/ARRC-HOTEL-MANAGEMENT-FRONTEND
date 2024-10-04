import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../redux/store";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { FaFilePdf, FaPrint, FaFileExcel, FaFileCsv } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { utils, writeFile } from "xlsx";
import Papa from "papaparse";

const SaleReport = () => {
  const [sales, setSales] = useState([]);
  const [total, setTotal] = useState(0);
  const [due, setDue] = useState(0);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await axios.get(`${server}/order/getAllOrders`);
        setSales(response.data.orders);
        calculateTotals(response.data.orders);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    fetchSales();
  }, []);

  const formik = useFormik({
    initialValues: {
      period: "Daily",
      fromDate: "09/02/2024",
      toDate: "09/02/2024",
    },
    validationSchema: Yup.object({
      fromDate: Yup.date().required("From date is required"),
      toDate: Yup.date().required("To date is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.get(`${server}/order/filterSales`, {
          params: {
            period: values.period.toLowerCase(),
            from: values.fromDate,
            to: values.toDate,
          },
        });

        setSales(response.data.sales);
        calculateTotals(response.data.sales);

        toast.success("Sales filtered successfully!", {
          position: "top-center",
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to filter Sales",
          { position: "top-center" }
        );
      }
    },
  });

  const calculateTotals = (salesData) => {
    console.log(salesData);
    const totalAmount = salesData.reduce(
      (sum, sale) => sum + sale.totalPrice,
      0
    );
    const dueAmount = salesData.reduce(
      (sum, sale) =>
        sum + (sale.paymentStatus === "Unpaid" ? sale.totalPrice : 0),
      0
    );

    setTotal(totalAmount);
    setDue(dueAmount);
  };

  // Export functions
  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Sales Report", 14, 22);

    const headers = [
      ["Sub Total", "Total Amount", "Paid Amount", "Due Amount", "Period"],
    ];
    const data = sales.map((sale) => [
      `₹${sale.subTotal.toFixed(2)}`,
      `₹${sale.totalPrice.toFixed(2)}`,
      `₹${
        sale.paymentStatus === "Unpaid"
          ? "0"
          : parseFloat(sale.totalPrice).toFixed(2)
      }`,
      `₹${
        sale.paymentStatus === "Paid"
          ? "0"
          : parseFloat(sale.totalPrice).toFixed(2)
      }`,
      new Date(sale.createdAt).toLocaleDateString(),
    ]);

    const content = {
      head: headers,
      body: data,
    };

    doc.autoTable(content);
    doc.save("sales_report.pdf");
    toast.success("Exported to PDF");
  };

  const exportToExcel = () => {
    const worksheet = utils.json_to_sheet(sales);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Report");
    writeFile(workbook, "sales_report.xlsx");
    toast.success("Exported to Excel");
  };

  const exportToCsv = () => {
    const csv = Papa.unparse(sales);
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
      <h1 className="text-2xl font-bold mb-4">Sale Report</h1>

      {/* Breadcrumbs */}
      <div className="mb-4">
        <nav className="text-sm text-gray-600">
          <a href="#" className="hover:underline">
            Home
          </a>{" "}
          &gt; <span>Sale Report</span>
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
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sub Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tax
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Charge
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paid Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
            </tr>
          </thead>
          <tbody>
            {sales.length > 0 ? (
              sales.map((order) => (
                <tr key={order._id}>
                  <td className="py-2 px-2 sm:px-4 border-b text-center">
                    {order.subTotal}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border-b text-center">
                    {order.discount}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border-b text-center">
                    {order.tax}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border-b text-center">
                    {order.charge}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border-b text-center">
                    ₹{parseFloat(order.totalPrice).toFixed(2)}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border-b text-center">
                    ₹
                    {order.paymentStatus === "Unpaid"
                      ? "0"
                      : parseFloat(order.totalPrice).toFixed(2)}
                  </td>
                  <td className="py-2 px-2 sm:px-4 border-b text-center">
                    ₹
                    {order.paymentStatus === "Paid"
                      ? "0"
                      : parseFloat(order.totalPrice).toFixed(2)}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No sales found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <ToastContainer />
      </div>

      {/* Summary */}
      <div className="mt-4">
        <h2 className="text-lg font-bold">Totals:</h2>
        <p>Total Amount: ₹{total.toFixed(2)}</p>
        <p>Due Amount: ₹{due.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default SaleReport;
