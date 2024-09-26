// src/components/Company.jsx
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaHome } from "react-icons/fa";
import axios from "axios";
import { server } from "../redux/store";
import { ClipLoader } from "react-spinners";

// Validation schema with Yup
const validationSchema = Yup.object({
  companyName: Yup.string().required("Company Name is required"),
  companyEmail: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  companyTaxNumber: Yup.string().required("Tax Number is required"),
  companyAddress: Yup.string().required("Address is required"),
});

const Company = () => {
  const [initialValues, setInitialValues] = useState({
    companyName: "",
    companyPhone: "",
    companyEmail: "",
    companyTaxNumber: "",
    companyAddress: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await axios.get(`${server}/company/getCompanyDetails`);
        const { company } = response.data;
        setInitialValues({
          companyName: company.companyName,
          companyPhone: company.companyPhone,
          companyEmail: company.companyEmail,
          companyTaxNumber: company.companyTaxNumber,
          companyAddress: company.companyAddress,
        });
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchCompany();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    console.log(values);
    try {
      const saved = await axios.post(
        `${server}/company/updateCompanyDetails`,
        values
      );

      if (saved) {
        toast.success("Setting Updated!", {
          position: "top-center",
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error("Faild To Update!", {
        position: "top-center",
      });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <FaHome className="text-gray-500 mr-2" />
        <span className="text-gray-700 text-lg">Home Company</span>
      </div>
      <h1 className="text-3xl font-bold mb-6">Company</h1>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </span>
              <Field
                type="text"
                id="companyName"
                name="companyName"
                className="block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-lg placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="companyName"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </label>

            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Company Phone Number *
              </span>
              <Field
                type="text"
                name="companyPhone"
                className="block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-lg placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="companyPhone"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </label>

            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Company Email *
              </span>
              <Field
                type="email"
                name="companyEmail"
                className="block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-lg placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="companyEmail"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </label>

            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Company Tax Number *
              </span>
              <Field
                type="text"
                name="companyTaxNumber"
                className="block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-lg placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="companyTaxNumber"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </label>

            <label className="block mb-6">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Company Address *
              </span>
              <Field
                as="textarea"
                rows="4"
                name="companyAddress"
                className="block w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-lg placeholder-gray-400 focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              />
              <ErrorMessage
                name="companyAddress"
                component="div"
                className="text-red-600 text-sm mt-1"
              />
            </label>

            <button
              type="submit"
              className="py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ease-in-out duration-150"
            >
              {loading ? <ClipLoader size={24} color="#fff" /> : "Save Changes"}{" "}
              <FaArrowRight className="inline ml-2" />
            </button>
          </Form>
        )}
      </Formik>
      <ToastContainer />
    </div>
  );
};

export default Company;
