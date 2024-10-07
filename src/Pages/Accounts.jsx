import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { debounce } from "lodash";
import { server } from "../redux/store";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: "",
    number: "",
    balance: 0,
    note: "",
  });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, [page, perPage, search]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${server}/accounts/getAccounts`, {
        params: {
          page,
          perPage,
          search,
        },
      });

      setAccounts(response.data.accounts);
      setTotal(response.data.total);
    } catch (error) {
      toast.error("Error fetching accounts: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce((value) => {
    setSearch(value);
    setPage(1);
    fetchAccounts();
  }, 500);

  const handleAddNew = () => {
    setNewAccount({ name: "", number: "", balance: 0, note: "" });
    setSelectedAccount(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      let response;
      if (selectedAccount) {
        response = await axios.put(
          `${server}/accounts/updateAccount/${selectedAccount._id}`,
          newAccount
        );
        setAccounts(
          accounts.map((acc) =>
            acc._id === response.data._id ? response.data : acc
          )
        );
        toast.success("Account updated successfully");
      } else {
        response = await axios.post(
          `${server}/accounts/createAccount`,
          newAccount
        );
        setAccounts([...accounts, response.data]);
        toast.success("Account created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Error saving account: " + error.message);
    }
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setNewAccount(account);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await axios.delete(`${server}/accounts/deleteAccount/${id}`);
        setAccounts(accounts.filter((account) => account._id !== id));
        toast.success("Account deleted successfully");
      } catch (error) {
        toast.error("Error deleting account: " + error.message);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewAccount({ name: "", number: "", balance: 0, note: "" });
  };

  const filteredAccounts = accounts.filter((account) =>
    account.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="mb-4 flex items-center text-gray-600">
        <a href="/" className="text-blue-500 hover:underline">
          Home
        </a>{" "}
        &gt;
        <span className="ml-2 font-semibold text-gray-800">Accounts</span>
      </div>

      {/* Title and Add New Button */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Add New
        </button>
      </div>

      {/* Search and Entries Per Page */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <label htmlFor="search" className="text-gray-700">
            Search:
          </label>
          <input
            id="search"
            type="text"
            onChange={(e) => debouncedSearch(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
            placeholder="Search by name..."
          />
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Show</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-gray-700">Entries</span>
        </div>
      </div>

      {/* Accounts Table */}
      {loading ? (
        <div className="text-center text-gray-700">Loading...</div>
      ) : (
        <table className="w-full border-collapse border border-gray-300 bg-white shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">#</th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Account Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Account Number
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Credit
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Debit
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Balance
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Note
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Updated At
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Updated By
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account, index) => (
                <tr key={account._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">
                    {(page - 1) * perPage + index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {account.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {account.number}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ₹{account.credit?.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ₹{account.debit?.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    ₹{account.balance?.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {account.note}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {new Date(account.updatedAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {account.updatedBy}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(account)}
                      className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(account._id)}
                      className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10"
                  className="text-center border border-gray-300 px-4 py-2"
                >
                  No accounts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <button
            onClick={() => setPage(page > 1 ? page - 1 : 1)}
            disabled={page === 1}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Previous
          </button>
          <span className="mx-4 text-gray-700">
            Page {page} of {Math.ceil(total / perPage)}
          </span>
          <button
            onClick={() =>
              setPage(page < Math.ceil(total / perPage) ? page + 1 : page)
            }
            disabled={page >= Math.ceil(total / perPage)}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal for Add/Edit Account */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-md p-6 shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {selectedAccount ? "Edit Account" : "Add New Account"}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700">Account Name:</label>
              <input
                type="text"
                value={newAccount.name}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, name: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Account Number:</label>
              <input
                type="text"
                value={newAccount.number}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, number: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Balance:</label>
              <input
                type="number"
                value={newAccount.balance}
                onChange={(e) =>
                  setNewAccount({
                    ...newAccount,
                    balance: parseFloat(e.target.value),
                  })
                }
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Note:</label>
              <textarea
                value={newAccount.note}
                onChange={(e) =>
                  setNewAccount({ ...newAccount, note: e.target.value })
                }
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                rows="3"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleModalClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
