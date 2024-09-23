import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHome, FaArrowRight, FaPlus, FaSave, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Deposits = () => {
  const [accounts, setAccounts] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newDeposit, setNewDeposit] = useState({
    account: '',
    depositDate: '',
    amount: '',
    note: ''
  });
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    account: 'All',
  });
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchDeposits();
  }, [filters, search, pagination.page]);

  const fetchAccounts = async () => {
    try {
      const response = await axios.get('https://arrc-tech.onrender.com/api/accounts');
      setAccounts(response.data.accounts);
    } catch (error) {
      toast.error('Error fetching accounts: ' + error.message);
    }
  };

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://arrc-tech.onrender.com/api/deposits', {
        params: { ...filters, search, ...pagination }
      });
      setDeposits(response.data.deposits);
      setPagination(prev => ({ ...prev, totalCount: response.data.totalCount }));
    } catch (error) {
      toast.error('Error fetching deposits: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newDeposit.account || !newDeposit.depositDate || !newDeposit.amount) {
      toast.error('Please fill all required fields.');
      return;
    }
    
    try {
      const depositResponse = await axios.post('https://arrc-tech.onrender.com/api/deposits', newDeposit);
      setDeposits([...deposits, depositResponse.data]);

      // Update account balance
      const account = accounts.find(acc => acc._id === newDeposit.account);
      if (account) {
        const updatedBalance = account.balance + parseFloat(newDeposit.amount);
        const updatedCredit = account.credit + parseFloat(newDeposit.amount);
        await axios.put(`https://arrc-tech.onrender.com/api/accounts/${newDeposit.account}`, { 
          balance: updatedBalance,
          credit: updatedCredit 
        });
        fetchAccounts();
      }

      toast.success('Deposit created successfully');
      setShowModal(false);
      setNewDeposit({ account: '', depositDate: '', amount: '', note: '' });
    } catch (error) {
      toast.error('Error creating deposit: ' + error.message);
    }
  };

  const handleEdit = async (id, updatedData) => {
    try {
      const response = await axios.put(`https://arrc-tech.onrender.com/api/deposits/${id}`, updatedData);
      setDeposits(deposits.map(deposit => (deposit._id === id ? response.data : deposit)));
      toast.success('Deposit updated successfully');
    } catch (error) {
      toast.error('Error updating deposit: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://arrc-tech.onrender.com/api/deposits/${id}`);
      setDeposits(deposits.filter(deposit => deposit._id !== id));
      toast.success('Deposit deleted successfully');
    } catch (error) {
      toast.error('Error deleting deposit: ' + error.message);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchDeposits();
  };

  const handlePagination = (direction) => {
    setPagination(prev => ({
      ...prev,
      page: direction === 'next' ? prev.page + 1 : Math.max(1, prev.page - 1)
    }));
  };

  return (
    <div className="p-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 flex items-center text-gray-600">
        <FaHome className="mr-2" />
        <FaArrowRight className="mr-2" />
        <span className="font-semibold">Deposits</span>
      </div>

      {/* Title and Add New Button */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Deposits</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add New
        </button>
      </div>

      {/* Filter Form */}
      <div className="mb-4">
        <form onSubmit={handleFilterSubmit} className="flex flex-col space-y-4">
          <div className="flex space-x-4">
            <div>
              <label htmlFor="fromDate" className="block mb-1">From *</label>
              <input
                id="fromDate"
                name="fromDate"
                type="date"
                value={filters.fromDate}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="toDate" className="block mb-1">To *</label>
              <input
                id="toDate"
                name="toDate"
                type="date"
                value={filters.toDate}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="account" className="block mb-1">Account</label>
              <select
                id="account"
                name="account"
                value={filters.account}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="All">All</option>
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>{account.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Search Field */}
      <div className="mb-4 flex items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="border border-gray-300 rounded px-3 py-2 w-full"
        />
      </div>

      {/* Deposits Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Account</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Amount</th>
            <th className="border border-gray-300 px-4 py-2">Note</th>
            <th className="border border-gray-300 px-4 py-2">Updated At</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-4">Loading...</td>
            </tr>
          ) : deposits.length > 0 ? (
            deposits.map((deposit, index) => (
              <tr key={deposit._id}>
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{accounts.find(acc => acc._id === deposit.account)?.name || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(deposit.depositDate).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">${deposit.amount}</td>
                <td className="border border-gray-300 px-4 py-2">{deposit.note}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(deposit.updatedAt).toLocaleDateString()}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => handleEdit(deposit._id, { ...deposit })}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(deposit._id)}
                    className="text-red-500 hover:underline"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-4">No deposits found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePagination('prev')}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          disabled={pagination.page === 1}
        >
          Previous
        </button>
        <span>Page {pagination.page} of {Math.ceil(pagination.totalCount / pagination.pageSize)}</span>
        <button
          onClick={() => handlePagination('next')}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          disabled={pagination.page * pagination.pageSize >= pagination.totalCount}
        >
          Next
        </button>
      </div>

      {/* Modal for Adding New Deposit */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add New Deposit</h2>
            <div className="mb-4">
              <label htmlFor="account" className="block mb-1">Account *</label>
              <select
                id="account"
                name="account"
                value={newDeposit.account}
                onChange={(e) => setNewDeposit({ ...newDeposit, account: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              >
                <option value="">Select Account</option>
                {accounts.map((account) => (
                  <option key={account._id} value={account._id}>{account.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="depositDate" className="block mb-1">Date *</label>
              <input
                id="depositDate"
                name="depositDate"
                type="date"
                value={newDeposit.depositDate}
                onChange={(e) => setNewDeposit({ ...newDeposit, depositDate: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="amount" className="block mb-1">Amount *</label>
              <input
                id="amount"
                name="amount"
                type="number"
                value={newDeposit.amount}
                onChange={(e) => setNewDeposit({ ...newDeposit, amount: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="note" className="block mb-1">Note</label>
              <textarea
                id="note"
                name="note"
                value={newDeposit.note}
                onChange={(e) => setNewDeposit({ ...newDeposit, note: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 w-full"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                <FaSave className="mr-2" /> Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded ml-2 hover:bg-red-600"
              >
                <FaTimes className="mr-2" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deposits;