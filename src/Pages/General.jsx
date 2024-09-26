import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { server } from "../redux/store";
import { ToastContainer, toast } from "react-toastify";

// Validation schema using Yup
const validationSchema = Yup.object({
  appName: Yup.string().required("App Name is required"),
  defaultCustomer: Yup.string().required("Default Customer is required"),
  saleAccount: Yup.string().required("Sale Account is required"),
  purchaseAccount: Yup.string().required("Purchase Account is required"),
  payrollAccount: Yup.string().required("Payroll Account is required"),
  copyright: Yup.string().required("Copyright is required"),
});

// Initial form values (this will be updated by API data)
const initialValues = {
  appName: "",
  defaultCustomer: "",
  saleAccount: "",
  purchaseAccount: "",
  payrollAccount: "",
  copyright: "© 2024 ARRC TECH",
  sendInvoiceEmail: false,
  logo: null,
  favicon: null,
  preloader: null,
};

const General = ({ onSettingsSaved }) => {
  const [customers, setCustomers] = useState([]);
  const [saleAccounts, setSaleAccounts] = useState([]);
  const [purchaseAccounts, setPurchaseAccounts] = useState([]);
  const [payrollAccounts, setPayrollAccounts] = useState([]);
  const [settings, setSettings] = useState(initialValues);
  const [logoPreview, setLogoPreview] = useState(null);
  const [faviconPreview, setFaviconPreview] = useState(null);
  const [preloaderPreview, setPreloaderPreview] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `${server}/settings/getGeneralSettings`
        );
        const fetchedSettings = response.data.settings;

        setSettings({
          ...fetchedSettings,
          sendInvoiceEmail: fetchedSettings.sendInvoiceEmail || false, // In case it's null or undefined
        });

        // Set image previews
        setLogoPreview(fetchedSettings.logo);
        setFaviconPreview(fetchedSettings.favicon);
        setPreloaderPreview(fetchedSettings.preloader);
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();

    const fetchOptions = async () => {
      try {
        const [
          customersRes,
          saleAccountsRes,
          purchaseAccountsRes,
          payrollAccountsRes,
        ] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/customers/"),
          axios.get("http://127.0.0.1:5000/api/v1/salse/getAllSalesAccounts"),
          axios.get(
            "http://127.0.0.1:5000/api/v1/purchaseAccount/getAllPurchaseAccounts"
          ),
          axios.get(
            "http://127.0.0.1:5000/api/v1/payroll/getAllPayrollAccounts"
          ),
        ]);

        setCustomers(Array.isArray(customersRes.data) ? customersRes.data : []);
        setSaleAccounts(
          Array.isArray(saleAccountsRes.data.allSalesAccounts)
            ? saleAccountsRes.data.allSalesAccounts
            : []
        );
        setPurchaseAccounts(
          Array.isArray(purchaseAccountsRes.data.allPurchaseAccounts)
            ? purchaseAccountsRes.data.allPurchaseAccounts
            : []
        );
        setPayrollAccounts(
          Array.isArray(payrollAccountsRes.data.allPayrollAccounts)
            ? payrollAccountsRes.data.allPayrollAccounts
            : []
        );
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("appName", values.appName);
    formData.append("defaultCustomer", values.defaultCustomer);
    formData.append("saleAccount", values.saleAccount);
    formData.append("purchaseAccount", values.purchaseAccount);
    formData.append("payrollAccount", values.payrollAccount);
    formData.append("copyright", values.copyright);
    formData.append("sendInvoiceEmail", values.sendInvoiceEmail);
    if (values.logo) formData.append("logo", values.logo);
    if (values.favicon) formData.append("favicon", values.favicon);
    if (values.preloader) formData.append("preloader", values.preloader);

    try {
      const saved = await axios.post(`${server}/settings/updateGeneralSettings`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if(saved) {
        toast.success("Setting Updated!", {
          position: "top-center",
        });
      }

      // Notify parent component about the changes
      if (onSettingsSaved) onSettingsSaved();
    } catch (error) {
      toast.error("Faild To Update!", {
        position: "top-center",
      });
      console.error("Error saving settings:", error);
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <nav className="mb-6">
        <ol className="list-reset flex text-gray-600">
          <li>
            <a href="/" className="text-blue-500 hover:underline">
              Home
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>General Settings</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-semibold mb-6">General Settings</h1>
      <Formik
        enableReinitialize
        initialValues={settings}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="appName"
                  className="block text-sm font-medium text-gray-700"
                >
                  App Name *
                </label>
                <Field
                  type="text"
                  id="appName"
                  name="appName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="defaultCustomer"
                  className="block text-sm font-medium text-gray-700"
                >
                  Default Customer *
                </label>
                <Field
                  as="select"
                  id="defaultCustomer"
                  name="defaultCustomer"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label
                  htmlFor="saleAccount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sale Account *
                </label>
                <Field
                  as="select"
                  id="saleAccount"
                  name="saleAccount"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select an account</option>
                  {saleAccounts.map((account) => (
                    <option key={account._id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label
                  htmlFor="purchaseAccount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Purchase Account *
                </label>
                <Field
                  as="select"
                  id="purchaseAccount"
                  name="purchaseAccount"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select an account</option>
                  {purchaseAccounts.map((account) => (
                    <option key={account._id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label
                  htmlFor="payrollAccount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Payroll Account *
                </label>
                <Field
                  as="select"
                  id="payrollAccount"
                  name="payrollAccount"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">Select an account</option>
                  {payrollAccounts.map((account) => (
                    <option key={account._id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label
                  htmlFor="copyright"
                  className="block text-sm font-medium text-gray-700"
                >
                  Copyright *
                </label>
                <Field
                  type="text"
                  id="copyright"
                  name="copyright"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center mb-4">
              <Field
                type="checkbox"
                id="sendInvoiceEmail"
                name="sendInvoiceEmail"
                className="form-checkbox h-4 w-4 text-blue-600"
              />
              <label
                htmlFor="sendInvoiceEmail"
                className="ml-2 text-sm font-medium text-gray-700"
              >
                Send Invoice Email
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Logo
                </label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue("logo", event.currentTarget.files[0]);
                    setLogoPreview(
                      URL.createObjectURL(event.currentTarget.files[0])
                    );
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
                {logoPreview && (
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="mt-2 h-20"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Favicon
                </label>
                <input
                  type="file"
                  id="favicon"
                  name="favicon"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue("favicon", event.currentTarget.files[0]);
                    setFaviconPreview(
                      URL.createObjectURL(event.currentTarget.files[0])
                    );
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
                {faviconPreview && (
                  <img
                    src={faviconPreview}
                    alt="Favicon Preview"
                    className="mt-2 h-20"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preloader
                </label>
                <input
                  type="file"
                  id="preloader"
                  name="preloader"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue("preloader", event.currentTarget.files[0]);
                    setPreloaderPreview(
                      URL.createObjectURL(event.currentTarget.files[0])
                    );
                  }}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
                {preloaderPreview && (
                  <img
                    src={preloaderPreview}
                    alt="Preloader Preview"
                    className="mt-2 h-20"
                  />
                )}
              </div>
            </div>
            <div className="text-right">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm"
              >
                {isSubmitting ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <ToastContainer />
    </div>
  );
};

export default General;
