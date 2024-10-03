import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { FaEdit, FaTrash, FaPlus, FaHome } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { server } from "../redux/store";

Modal.setAppElement("#root");

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [editForm, setEditForm] = useState({
    supplierId: "",
    invoiceNo: "",
    totalBill: 0,
    paidAmount: 0,
    dueAmount: 0,
    purchaseDate: "",
    updatedBy: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${server}/purchase/getAllPurchases`);
        setPurchases(response.data.purchases);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${server}/suppliers/getSuppliers`);
        if (response.data) {
          setSuppliers(response.data);
        } else {
          toast.error("No suppliers data available.");
        }
      } catch (error) {
        toast.error("Failed to fetch suppliers.");
      }
    };

    fetchPurchases();
    fetchSuppliers();
  }, []);

  const filteredPurchases = purchases.filter((purchase) => {
    const supplierMatch =
      selectedSupplier === "" || purchase.supplierId === selectedSupplier;
    const dateMatch = selectedDate
      ? new Date(purchase.purchaseDate).toDateString() ===
        new Date(selectedDate).toDateString()
      : true;
    const searchTermMatch = searchTerm
      ? purchase.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return supplierMatch && dateMatch && searchTermMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPurchases = filteredPurchases.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalItems = filteredPurchases.length;
  const pageNumbers = Array.from(
    { length: Math.ceil(totalItems / itemsPerPage) },
    (_, i) => i + 1
  );

  const handleEdit = (purchase) => {
    setEditForm({
      supplierId: purchase.supplierId,
      invoiceNo: purchase.invoiceNo,
      totalBill: purchase.totalBill,
      paidAmount: purchase.paidAmount,
      dueAmount: purchase.dueAmount,
      purchaseDate: new Date(purchase.purchaseDate).toISOString().split("T")[0],
      updatedBy: purchase.updatedBy,
    });
    setEditingPurchase(purchase._id);
    setIsModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${server}/purchase/updatePurchase/${editingPurchase}`,
        editForm
      );
      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) =>
          purchase._id === editingPurchase
            ? { ...purchase, ...editForm }
            : purchase
        )
      );
      setIsModalOpen(false);
      setEditingPurchase(null);
    } catch (error) {
      console.error("Error updating purchase:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setEditingPurchase(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/purchase/deletePurchase/${id}`);
      setPurchases((prevPurchases) =>
        prevPurchases.filter((purchase) => purchase._id !== id)
      );
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  const handleAddNew = () => {
    navigate("/addpurchase");
  };

  let index = 1;

  return (
    <div className="bg-white shadow-md p-5">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <nav className="flex text-sm text-gray-600">
          <FaHome />
          <Link to="/" className="text-blue-600 hover:underline">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/purchasehistory" className="text-blue-600 hover:underline">
            Purchase History
          </Link>
        </nav>
      </div>

      <h1 className="text-md font-bold text-gray-800 mb-5 flex items-center justify-between">
        Purchase History
        <button
          onClick={handleAddNew}
          className="px-2 py-2 text-md bg-blue-600 text-white rounded-md flex items-center hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" /> Add New Purchase
        </button>
      </h1>

      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <input
          type="text"
          className="block w-full md:w-1/3 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search by Invoice No."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="block w-full md:w-1/3 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={selectedSupplier}
          onChange={(e) => setSelectedSupplier(e.target.value)}
        >
          <option value={""}>All Suppliers</option>
          {suppliers.length > 0 ? (
            suppliers
              .filter((supplier) => supplier.supplierName)
              .map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.supplierName}
                </option>
              ))
          ) : (
            <option value="">No suppliers available</option>
          )}
        </select>
        <input
          type="date"
          className="block w-full md:w-1/3 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                Supplier ID
              </th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                Invoice No
              </th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                Total Bill
              </th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                Paid Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                Due Amount
              </th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                Purchase Date
              </th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                Updated By
              </th>
              <th className="py-2 px-4 border-b border-gray-300 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPurchases.length > 0 ? (
              currentPurchases.map((purchase) =>
                editingPurchase === purchase._id ? (
                  <tr key={purchase._id}>
                    <td className="py-2 px-4 border-b border-gray-300">
                      <input
                        type="text"
                        name="supplierId"
                        value={editForm.supplierId}
                        onChange={handleEditChange}
                        className="w-full py-1 px-2 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      <input
                        type="text"
                        name="invoiceNo"
                        value={editForm.invoiceNo}
                        onChange={handleEditChange}
                        className="w-full py-1 px-2 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      <input
                        type="text"
                        name="totalBill"
                        value={editForm.totalBill}
                        onChange={handleEditChange}
                        className="w-full py-1 px-2 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      <input
                        type="text"
                        name="paidAmount"
                        value={editForm.paidAmount}
                        onChange={handleEditChange}
                        className="w-full py-1 px-2 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      <input
                        type="text"
                        name="dueAmount"
                        value={editForm.dueAmount}
                        onChange={handleEditChange}
                        className="w-full py-1 px-2 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      <input
                        type="date"
                        name="purchaseDate"
                        value={editForm.purchaseDate}
                        onChange={handleEditChange}
                        className="w-full py-1 px-2 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      <input
                        type="text"
                        name="updatedBy"
                        value={editForm.updatedBy}
                        onChange={handleEditChange}
                        className="w-full py-1 px-2 border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300 flex space-x-2">
                      <button
                        onClick={handleEditSubmit}
                        className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={purchase._id}>
                    <td className="py-2 px-4 border-b border-gray-300">
                      {index++}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      {purchase.invoiceNo}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      {purchase.totalBill}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      {purchase.paidAmount}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      {purchase.dueAmount}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      {new Date(purchase.purchaseDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      {purchase.updatedBy}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      <button
                        onClick={() => handleEdit(purchase)}
                        className="text-blue-600 hover:underline"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(purchase._id)}
                        className="ml-2 text-red-600 hover:underline"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No purchases found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="inline-flex">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`${
                currentPage === number
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600"
              } hover:bg-blue-700 px-3 py-1 rounded-md mx-1`}
            >
              {number}
            </button>
          ))}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCancelEdit}
        className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Edit Purchase
        </h2>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Invoice No
            </label>
            <input
              type="text"
              name="invoiceNo"
              value={editForm.invoiceNo}
              onChange={handleEditChange}
              className="w-full py-1 px-2 border border-gray-300 rounded-md"
              placeholder="Enter Invoice No"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total Bill
            </label>
            <input
              type="text"
              name="totalBill"
              value={editForm.totalBill}
              onChange={handleEditChange}
              className="w-full py-1 px-2 border mt-1 border-gray-300 rounded-md"
              placeholder="Enter Total Bill"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Paid Amount
            </label>
            <input
              type="text"
              name="paidAmount"
              value={editForm.paidAmount}
              onChange={handleEditChange}
              className="w-full py-1 px-2 border mt-1 border-gray-300 rounded-md"
              placeholder="Enter Paid Amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Amount
            </label>
            <input
              type="text"
              name="dueAmount"
              value={editForm.dueAmount}
              onChange={handleEditChange}
              className="w-full py-1 px-2 border mt-1 border-gray-300 rounded-md"
              placeholder="Enter Due Amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Purchase Date
            </label>
            <input
              type="date"
              name="purchaseDate"
              value={editForm.purchaseDate}
              onChange={handleEditChange}
              className="w-full py-1 px-2 border mt-1 border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PurchaseHistory;
