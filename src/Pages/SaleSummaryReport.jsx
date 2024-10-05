import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import axios from "axios";
import { server } from "../redux/store";

const SaleSummaryReport = () => {
  const [saleSummary, setSaleSummary] = useState({});

  useEffect(() => {
    const fetchSalesSummary = async () => {
      try {
        const response = await axios.get(
          `${server}/salesSummary/todays-saleSummary`,
          {
            headers: {
              "Content-type": "application/json",
            },
            withCredentials: true,
          }
        );
        setSaleSummary(response.data.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchSalesSummary();
  }, []);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
    },
    validationSchema: Yup.object({
      fromDate: Yup.date().required("From date is required"),
      toDate: Yup.date().required("To date is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.get(
          `${server}/salesSummary/sales-summary`,
          {
            params: {
              from: values.fromDate,
              to: values.toDate,
            },
            headers: {
              "Content-type": "application/json",
            },
            withCredentials: true,
          }
        );

        setSaleSummary(response.data.data);

        toast.success("Sales summary updated!", {
          position: "top-center",
        });
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to update summary",
          {
            position: "top-center",
          }
        );
      }
    },
  });

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Sale Summary Report</h1>

      {/* Breadcrumbs */}
      <div className="mb-4">
        <nav className="text-sm text-gray-600">
          <a href="#" className="hover:underline">
            Home
          </a>{" "}
          &gt; <span>Sale Summary Report</span>
        </nav>
      </div>

      {/* Form and Filters */}
      <form onSubmit={formik.handleSubmit} className="mb-4">
        <div className="flex mb-4 space-x-4">
          <div className="flex flex-col">
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

          <div className="flex flex-col">
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

      {/* Summary */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">From:</span>
            <span>
              {formik.values.fromDate
                ? formik.values.fromDate
                : new Date(saleSummary.date).toLocaleDateString("en-CA")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">To:</span>
            <span>
              {formik.values.toDate
                ? formik.values.toDate
                : new Date(saleSummary.date).toLocaleDateString("en-CA")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Order Quantity:</span>
            <span>{saleSummary.orderQuantity}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Sub Total:</span>
            <span>₹{saleSummary.subTotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Charge:</span>
            <span>₹{saleSummary.charge}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Discount:</span>
            <span>{saleSummary.discount}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Amount Tax Excluded:</span>
            <span>
              ₹
              {saleSummary.totalExcludingTax &&
                saleSummary.totalExcludingTax.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Tax:</span>
            <span>{saleSummary.tax}%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total:</span>
            <span>₹{saleSummary.total}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Purchase:</span>
            <span>₹{saleSummary.purchase}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Expense:</span>
            <span>₹{saleSummary.expense}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleSummaryReport;
