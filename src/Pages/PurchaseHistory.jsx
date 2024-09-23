import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FaEdit, FaTrash, FaPlus,FaHome } from 'react-icons/fa';
import { useNavigate ,Link} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

Modal.setAppElement('#root');

const PurchaseHistory = () => {
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [editForm, setEditForm] = useState({
    supplierId: '',
    invoiceNo: '',
    totalBill: '',
    paidAmount: '',
    dueAmount: '',
    purchaseDate: '',
    updatedBy: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get('https://arrc-tech.onrender.com/api/invoices/');
        setPurchases(response.data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
      }
    };

    fetchPurchases();
  }, []);

  const filteredPurchases = purchases.filter((purchase) => {
    const supplierMatch = selectedSupplier === '' || purchase.supplierId === selectedSupplier;
    const dateMatch = selectedDate ? new Date(purchase.purchaseDate).toDateString() === new Date(selectedDate).toDateString() : true;
    const searchTermMatch = searchTerm ? purchase.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return supplierMatch && dateMatch && searchTermMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPurchases = filteredPurchases.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = filteredPurchases.length;
  const pageNumbers = Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => i + 1);

  const handleEdit = (purchase) => {
    setEditForm({
      supplierId: purchase.supplierId,
      invoiceNo: purchase.invoiceNo,
      totalBill: purchase.totalBill,
      paidAmount: purchase.paidAmount,
      dueAmount: purchase.dueAmount,
      purchaseDate: purchase.purchaseDate,
      updatedBy: purchase.updatedBy
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
      await axios.put(`https://arrc-tech.onrender.com/api/invoices/${editingPurchase}`, editForm);
      setPurchases((prevPurchases) =>
        prevPurchases.map((purchase) =>
          purchase._id === editingPurchase ? { ...purchase, ...editForm } : purchase
        )
      );
      setIsModalOpen(false);
      setEditingPurchase(null);
    } catch (error) {
      console.error('Error updating purchase:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setEditingPurchase(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://arrc-tech.onrender.com/api/invoices/${id}`);
      setPurchases((prevPurchases) => prevPurchases.filter((purchase) => purchase._id !== id));
    } catch (error) {
      console.error('Error deleting purchase:', error);
    }
  };

  const handleAddNew = () => {
    navigate('/admin/addpurchase');
  };

  return (
    <div className="bg-white shadow-md p-5">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <nav className="flex text-sm text-gray-600">
          <FontAwesomeIcon icon={FaHome}/>
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/purchasehistory" className="text-blue-600 hover:underline">Purchase History</Link>
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
          <option value="">All Suppliers</option>
          <option value="1">TEST Supplier</option>
          <option value="2">Satish Shinde</option>
        </select>
        <input
          type="date"
          className="block w-full md:w-1/3 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {selectedSupplier || searchTerm || selectedDate ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Supplier ID</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Invoice No</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Total Bill</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Paid Amount</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Due Amount</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Purchase Date</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Updated By</th>
                <th className="py-2 px-4 border-b border-gray-300 text-left">Actions</th>
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
                      <td className="py-2 px-4 border-b border-gray-300">{purchase.supplierId}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{purchase.invoiceNo}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{purchase.totalBill}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{purchase.paidAmount}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{purchase.dueAmount}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b border-gray-300">{purchase.updatedBy}</td>
                      <td className="py-2 px-4 border-b border-gray-300 flex space-x-2">
                        <button
                          onClick={() => handleEdit(purchase)}
                          className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(purchase._id)}
                          className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan="8" className="py-2 px-4 border-b border-gray-300 text-center">No data found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <div className="text-gray-600">
              Showing {indexOfFirstItem + 1} to {indexOfLastItem} of {totalItems} entries
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors"
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-3 py-1 rounded-md ${number === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} hover:bg-gray-300 transition-colors`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageNumbers.length))}
                className="px-3 py-1 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition-colors"
                disabled={currentPage === pageNumbers.length}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No filter applied.</p>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCancelEdit}
        className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      >
        <div className="bg-white p-5 rounded-md w-full max-w-lg mx-4">
          <h2 className="text-lg font-bold mb-4">Edit Purchase</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Supplier ID</label>
              <input
                type="text"
                name="supplierId"
                value={editForm.supplierId}
                onChange={handleEditChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Invoice No</label>
              <input
                type="text"
                name="invoiceNo"
                value={editForm.invoiceNo}
                onChange={handleEditChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Total Bill</label>
              <input
                type="text"
                name="totalBill"
                value={editForm.totalBill}
                onChange={handleEditChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
              <input
                type="text"
                name="paidAmount"
                value={editForm.paidAmount}
                onChange={handleEditChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Due Amount</label>
              <input
                type="text"
                name="dueAmount"
                value={editForm.dueAmount}
                onChange={handleEditChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
              <input
                type="date"
                name="purchaseDate"
                value={editForm.purchaseDate}
                onChange={handleEditChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Updated By</label>
              <input
                type="text"
                name="updatedBy"
                value={editForm.updatedBy}
                onChange={handleEditChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default PurchaseHistory;
