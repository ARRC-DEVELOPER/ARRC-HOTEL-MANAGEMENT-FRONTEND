import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

// Validation schema using Yup
const validationSchema = Yup.object({
  appName: Yup.string().required('App Name is required'),
  defaultCustomer: Yup.string().required('Default Customer is required'),
  saleAccount: Yup.string().required('Sale Account is required'),
  purchaseAccount: Yup.string().required('Purchase Account is required'),
  payrollAccount: Yup.string().required('Payroll Account is required'),
  copyright: Yup.string().required('Copyright is required'),
});

// Initial form values
const initialValues = {
  appName: '',
  defaultCustomer: '',
  saleAccount: '',
  purchaseAccount: '',
  payrollAccount: '',
  copyright: '© 2024 ARRC TECH',
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
  
  // console.log("settings: ",settings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/general-settings');
        setSettings(response.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();

    const fetchOptions = async () => {
      try {
        const [customersRes, saleAccountsRes, purchaseAccountsRes, payrollAccountsRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/customers/'),
          axios.get('http://127.0.0.1:5000/api/v1/salse/getAllSalesAccounts'),
          axios.get('http://127.0.0.1:5000/api/v1/purchaseAccount/getAllPurchaseAccounts'), 
          axios.get('http://127.0.0.1:5000/api/v1/payroll/getAllPayrollAccounts'),
        ]);

        setCustomers(Array.isArray(customersRes.data) ? customersRes.data : []);
        setSaleAccounts(Array.isArray(saleAccountsRes.data.allSalesAccounts) ? saleAccountsRes.data.allSalesAccounts : []);
        setPurchaseAccounts(Array.isArray(purchaseAccountsRes.data.allPurchaseAccounts) ? purchaseAccountsRes.data.allPurchaseAccounts : []);
        setPayrollAccounts(Array.isArray(payrollAccountsRes.data.allPayrollAccounts) ? payrollAccountsRes.data.allPayrollAccounts : []);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append('appName', values.appName);
    formData.append('defaultCustomer', values.defaultCustomer);
    formData.append('saleAccount', values.saleAccount);
    formData.append('purchaseAccount', values.purchaseAccount);
    formData.append('payrollAccount', values.payrollAccount);
    formData.append('copyright', values.copyright);
    formData.append('sendInvoiceEmail', values.sendInvoiceEmail);
    if (values.logo) formData.append('logo', values.logo);
    if (values.favicon) formData.append('favicon', values.favicon);
    if (values.preloader) formData.append('preloader', values.preloader);

    try {
      await axios.post('/api/general-settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Settings saved successfully!');
      // Notify parent component about the changes
      if (onSettingsSaved) onSettingsSaved();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
    setSubmitting(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <nav className="mb-6">
        <ol className="list-reset flex text-gray-600">
          <li><a href="/" className="text-blue-500 hover:underline">Home</a></li>
          <li><span className="mx-2">/</span></li>
          <li>General Settings</li>
        </ol>
      </nav>
      <h1 className="text-3xl font-semibold mb-6">General Settings</h1>
      <Formik
        initialValues={settings}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Form fields as before */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="appName" className="block text-sm font-medium text-gray-700">App Name *</label>
                <Field
                  type="text"
                  id="appName"
                  name="appName"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="defaultCustomer" className="block text-sm font-medium text-gray-700">Default Customer *</label>
                <Field as="select" id="defaultCustomer" name="defaultCustomer" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label htmlFor="saleAccount" className="block text-sm font-medium text-gray-700">Sale Account *</label>
                <Field as="select" id="saleAccount" name="saleAccount" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                  <option value="">Select an account</option>
                  {saleAccounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.accountName}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label htmlFor="purchaseAccount" className="block text-sm font-medium text-gray-700">Purchase Account *</label>
                <Field as="select" id="purchaseAccount" name="purchaseAccount" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                  <option value="">Select an account</option>
                  {purchaseAccounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.accountName}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label htmlFor="payrollAccount" className="block text-sm font-medium text-gray-700">Payroll Account *</label>
                <Field as="select" id="payrollAccount" name="payrollAccount" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                  <option value="">Select an account</option>
                  {payrollAccounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.accountName}
                    </option>
                  ))}
                </Field>
              </div>
              <div>
                <label htmlFor="copyright" className="block text-sm font-medium text-gray-700">Copyright *</label>
                <Field
                  type="text"
                  id="copyright"
                  name="copyright"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center mb-4">
              <Field type="checkbox" id="sendInvoiceEmail" name="sendInvoiceEmail" className="form-checkbox h-4 w-4 text-blue-600" />
              <label htmlFor="sendInvoiceEmail" className="ml-2 text-sm font-medium text-gray-700">Send Invoice Email</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700">Logo</label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={(event) => setFieldValue('logo', event.currentTarget.files[0])}
                  className="mt-1 block w-full text-sm text-gray-500"
                />
              </div>
              <div>
                <label htmlFor="favicon" className="block text-sm font-medium text-gray-700">Favicon</label>
                <input
                  type="file"
                  id="favicon"
                  name="favicon"
                  onChange={(event) => setFieldValue('favicon', event.currentTarget.files[0])}
                  className="mt-1 block w-full text-sm text-gray-500"
                />
              </div>
              <div>
                <label htmlFor="preloader" className="block text-sm font-medium text-gray-700">Preloader</label>
                <input
                  type="file"
                  id="preloader"
                  name="preloader"
                  onChange={(event) => setFieldValue('preloader', event.currentTarget.files[0])}
                  className="mt-1 block w-full text-sm text-gray-500"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Settings
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default General;
