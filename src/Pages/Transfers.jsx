import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaHome, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Transfers = ({ onTransferUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [transfers, setTransfers] = useState([]);
  const [filteredTransfers, setFilteredTransfers] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [accountOptions, setAccountOptions] = useState([]);
  const [editingTransfer, setEditingTransfer] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchAccounts();
    fetchTransfers();
  }, [page, perPage]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('https://arrc-tech.onrender.com/api/accounts');
      setAccountOptions(response.data.accounts);
    } catch (error) {
      toast.error('Error fetching accounts: ' + error.message);
    }
  };

  const fetchTransfers = async () => {
    try {
      const response = await axios.get('https://arrc-tech.onrender.com/api/transfers', {
        params: {
          page,
          perPage
        }
      });
      setTransfers(response.data.transfers || []);
      setFilteredTransfers(response.data.transfers || []);
      setTotal(response.data.total || 0);
    } catch (error) {
      toast.error('Error fetching transfers: ' + error.message);
    }
  };

  const validationSchema = Yup.object().shape({
    fromAccount: Yup.string().required('From Account is required'),
    toAccount: Yup.string().required('To Account is required'),
    transferDate: Yup.date().required('Transfer Date is required'),
    amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
    note: Yup.string().required('Note is required')
  });

  const handleAddTransfer = async (values) => {
    try {
      await axios.post('https://arrc-tech.onrender.com/api/transfers', values);
      toast.success('Transfer added successfully');
      setShowModal(false);
      fetchTransfers(); // Refresh the transfers list
      onTransferUpdated(); // Notify parent component to refresh account balances
    } catch (error) {
      toast.error('Error adding transfer: ' + error.message);
    }
  };

  const handleEditTransfer = async (values) => {
    try {
      await axios.put(`https://arrc-tech.onrender.com/api/transfers/${editingTransfer.id}`, values);
      toast.success('Transfer updated successfully');
      setShowModal(false);
      fetchTransfers(); // Refresh the transfers list
      onTransferUpdated(); // Notify parent component to refresh account balances
    } catch (error) {
      toast.error('Error updating transfer: ' + error.message);
    }
  };

  const handleDeleteTransfer = async (id) => {
    try {
      await axios.delete(`https://arrc-tech.onrender.com/api/transfers/${id}`);
      toast.success('Transfer deleted successfully');
      fetchTransfers(); // Refresh the transfers list
      onTransferUpdated(); // Notify parent component to refresh account balances
    } catch (error) {
      toast.error('Error deleting transfer: ' + error.message);
    }
  };

  const handleFilter = () => {
    if (fromDate && toDate) {
      const filtered = transfers.filter(transfer => {
        const transferDate = new Date(transfer.transferDate);
        return transferDate >= fromDate && transferDate <= toDate;
      });
      setFilteredTransfers(filtered);
    } else {
      setFilteredTransfers(transfers); // Show all if dates are not selected
    }
  };

  const handleModalOpen = () => {
    setEditingTransfer(null);
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 flex items-center text-gray-600">
        <FaHome className="text-gray-500" />
        <span className="ml-2 text-gray-500">Transfers</span>
      </div>

      {/* Title and Add New Button */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Transfers</h1>
        <button
          onClick={handleModalOpen}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Add New
        </button>
      </div>

      {/* Filter Section */}
      <div className="mb-4 flex space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="fromDate" className="text-gray-700">From Date:</label>
          <DatePicker
            id="fromDate"
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="toDate" className="text-gray-700">To Date:</label>
          <DatePicker
            id="toDate"
            selected={toDate}
            onChange={(date) => setToDate(date)}
            className="border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
        <button
          onClick={handleFilter}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          Filter
        </button>
      </div>

      {/* Transfers Table */}
      <table className="w-full border-collapse border border-gray-300 bg-white shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">#</th>
            <th className="border border-gray-300 px-4 py-2 text-left">From Account</th>
            <th className="border border-gray-300 px-4 py-2 text-left">To Account</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Transfer Date</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Note</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransfers.length > 0 ? (
            filteredTransfers.map((transfer, index) => (
              <tr key={transfer.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{(page - 1) * perPage + index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{transfer.fromAccount}</td>
                <td className="border border-gray-300 px-4 py-2">{transfer.toAccount}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(transfer.transferDate).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">₹{transfer.amount.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{transfer.note}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => {
                      setEditingTransfer(transfer);
                      setShowModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTransfer(transfer.id)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border border-gray-300 px-4 py-2 text-center">No transfers found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-gray-600">
          Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, total)} of {total} transfers
        </span>
        <div className="flex items-center">
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
          >
            Previous
          </button>
          <button
            onClick={() => setPage(page < Math.ceil(total / perPage) ? page + 1 : page)}
            disabled={page === Math.ceil(total / perPage)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Add/Edit Transfer */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{editingTransfer ? 'Edit Transfer' : 'Add Transfer'}</h2>
            <Formik
              initialValues={{
                fromAccount: editingTransfer ? editingTransfer.fromAccount : '',
                toAccount: editingTransfer ? editingTransfer.toAccount : '',
                transferDate: editingTransfer ? new Date(editingTransfer.transferDate) : new Date(),
                amount: editingTransfer ? editingTransfer.amount : '',
                note: editingTransfer ? editingTransfer.note : ''
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                if (editingTransfer) {
                  handleEditTransfer(values);
                } else {
                  handleAddTransfer(values);
                }
                setSubmitting(false);
              }}
            >
              {({ values, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="fromAccount" className="block text-gray-700">From Account</label>
                    <Field
                      as="select"
                      id="fromAccount"
                      name="fromAccount"
                      className="block w-full border border-gray-300 rounded-md px-3 py-2"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.fromAccount}
                    >
                      <option value="" label="Select account" />
                      {accountOptions.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="fromAccount" component="div" className="text-red-600" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="toAccount" className="block text-gray-700">To Account</label>
                    <Field
                      as="select"
                      id="toAccount"
                      name="toAccount"
                      className="block w-full border border-gray-300 rounded-md px-3 py-2"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.toAccount}
                    >
                      <option value="" label="Select account" />
                      {accountOptions.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="toAccount" component="div" className="text-red-600" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="transferDate" className="block text-gray-700">Transfer Date</label>
                    <DatePicker
                      id="transferDate"
                      selected={values.transferDate}
                      onChange={date => setFieldValue('transferDate', date)}
                      className="border border-gray-300 rounded-md px-3 py-2"
                    />
                    <ErrorMessage name="transferDate" component="div" className="text-red-600" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="amount" className="block text-gray-700">Amount</label>
                    <Field
                      type="number"
                      id="amount"
                      name="amount"
                      className="block w-full border border-gray-300 rounded-md px-3 py-2"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.amount}
                    />
                    <ErrorMessage name="amount" component="div" className="text-red-600" />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="note" className="block text-gray-700">Note</label>
                    <Field
                      as="textarea"
                      id="note"
                      name="note"
                      className="block w-full border border-gray-300 rounded-md px-3 py-2"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.note}
                    />
                    <ErrorMessage name="note" component="div" className="text-red-600" />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      {editingTransfer ? 'Save Changes' : 'Add Transfer'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfers;