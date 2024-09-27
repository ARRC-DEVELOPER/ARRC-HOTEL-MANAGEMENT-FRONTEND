import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import * as Yup from "yup";
import axios from "axios";
import { server } from "../redux/store";
import { FaArrowRight } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const Email = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMailSettings = async () => {
      try {
        const { data } = await axios.get(
          `${server}/mailSettings/getMailSettings`,
          {
            withCredentials: true,
          }
        );

        if (data.success && data.mailSettings) {
          formik.setValues({
            mailProtocol: data.mailSettings.mailProtocol || "",
            mailEncryption: data.mailSettings.mailEncryption || "",
            mailHost: data.mailSettings.mailHost || "",
            mailPort: data.mailSettings.mailPort || "",
            mailUsername: data.mailSettings.mailUsername || "",
            mailPassword: "", // because security reason hide this
          });
        }

        setIsLoading(false);
      } catch (error) {
        toast.error(error.message, { position: "top-center" });
      }
    };

    fetchMailSettings();
  }, []);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      mailProtocol: "",
      mailEncryption: "",
      mailHost: "",
      mailPort: "",
      mailUsername: "",
      mailPassword: "",
    },
    validationSchema: Yup.object({
      mailHost: Yup.string().required("Mail Host is required"),
      mailPort: Yup.number().required("Mail Port is required").integer(),
      mailUsername: Yup.string()
        .email("Invalid email address")
        .required("Mail Username is required"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${server}/mailSettings/updateMailSettings`,
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setLoading(false);
          toast.success("Email Settings updated successfully!", {
            position: "top-center",
          });
        }
      } catch (error) {
        toast.error(error.message, { position: "top-center" });
      }
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          <li>Email Configuration</li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Email Configuration</h1>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Mail Protocol */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="mailProtocol"
          >
            Mail Protocol *
          </label>
          <select
            id="mailProtocol"
            name="mailProtocol"
            value={formik.values.mailProtocol}
            onChange={formik.handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>SMTP</option>
            <option>IMAP</option>
          </select>
        </div>

        {/* Mail Encryption */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="mailEncryption"
          >
            Mail Encryption *
          </label>
          <select
            id="mailEncryption"
            name="mailEncryption"
            value={formik.values.mailEncryption}
            onChange={formik.handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>SSL</option>
            <option>TLS</option>
          </select>
        </div>

        {/* Mail Host */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="mailHost"
          >
            Mail Host *
          </label>
          <input
            type="text"
            id="mailHost"
            name="mailHost"
            value={formik.values.mailHost}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formik.touched.mailHost && formik.errors.mailHost ? (
            <p className="text-red-600 text-sm mt-1">
              {formik.errors.mailHost}
            </p>
          ) : null}
        </div>

        {/* Mail Port */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="mailPort"
          >
            Mail Port *
          </label>
          <input
            type="text"
            id="mailPort"
            name="mailPort"
            value={formik.values.mailPort}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formik.touched.mailPort && formik.errors.mailPort ? (
            <p className="text-red-600 text-sm mt-1">
              {formik.errors.mailPort}
            </p>
          ) : null}
        </div>

        {/* Mail Username */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="mailUsername"
          >
            Mail Username *
          </label>
          <input
            type="email"
            id="mailUsername"
            name="mailUsername"
            value={formik.values.mailUsername}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formik.touched.mailUsername && formik.errors.mailUsername ? (
            <p className="text-red-600 text-sm mt-1">
              {formik.errors.mailUsername}
            </p>
          ) : null}
        </div>

        {/* Mail Password */}
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="mailPassword"
          >
            Mail Password *
          </label>
          <input
            type="password"
            id="mailPassword"
            name="mailPassword"
            value={formik.values.mailPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {formik.touched.mailPassword && formik.errors.mailPassword ? (
            <p className="text-red-600 text-sm mt-1">
              {formik.errors.mailPassword}
            </p>
          ) : null}
        </div>

        {/* Save Changes Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? <ClipLoader size={24} color="#fff" /> : "Save Changes"}{" "}
            <FaArrowRight className="inline ml-2" />
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Email;
