import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';

// Set the root element for the modal (for accessibility)
Modal.setAppElement('#root');

const FoodItems = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState('');
  const [entries, setEntries] = useState(50);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFoodItem, setSelectedFoodItem] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://arrc-tech.onrender.com/api/foodItems');
      if (Array.isArray(response.data)) {
        setFoodItems(response.data);
      } else {
        console.error('Expected an array but got:', typeof response.data);
        setFoodItems([]);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await axios.delete(`https://arrc-tech.onrender.com/api/foodItems/${id}`);
        fetchFoodItems(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting food item:', error);
      }
    }
  };

  const handleEditClick = async (id) => {
    try {
      const response = await axios.get(`https://arrc-tech.onrender.com/api/foodItems/${id}`);
      setSelectedFoodItem(response.data);
      setFormData(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching food item:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Log the form data before sending
      console.log('Form data being sent:', formData);
  
      const response = await axios.put(`https://arrc-tech.onrender.com/api/foodItems/${selectedFoodItem._id}`, formData);
      
      // Log the server response
      console.log('Response from server:', response.data);
      
      // If successful, close the modal and refresh the food items list
      setModalVisible(false);
      fetchFoodItems(); // Refresh the list after updating
    } catch (error) {
      // Log the error response
      console.error('Error updating food item:', error.response?.data || error.message);
      alert(`Failed to update food item: ${error.response?.data?.message || error.message}`);
    }
  };
  

  return (
    <div className="p-4">
      {/* Breadcrumbs and Add New Button */}
      <div className="flex justify-between items-center mb-4">
        <div className="breadcrumbs">
          <ul className="flex space-x-2">
            <li>
              <Link to="/" className="text-blue-500">Home</Link>
            </li>
            <li>/</li>
            <li className="font-bold">Food Items</li>
          </ul>
        </div>
        <button
          onClick={() => navigate('/admin/addfoodItem')}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Add New
        </button>
      </div>

      {/* Entries and Search Input */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label htmlFor="entries" className="mr-2">Show</label>
          <select
            id="entries"
            value={entries}
            onChange={(e) => setEntries(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span className="ml-2">Entries</span>
        </div>

        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-2 py-1"
        />
      </div>

      {/* Loading and Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Image</th>
              <th className="p-2 text-left">Food Group</th>
              <th className="p-2 text-left">Item Name</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Updated At</th>
              <th className="p-2 text-left">Updated By</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {foodItems
              .filter((item) =>
                item.itemName.toLowerCase().includes(search.toLowerCase())
              )
              .slice(0, entries)
              .map((item, index) => (
                <tr key={item._id} className="border-b">
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">
                    <img
                      src={item.image}
                      alt={item.itemName}
                      className="h-10 w-10 object-cover"
                    />
                  </td>
                  <td className="p-2">{item.foodGroup}</td>
                  <td className="p-2">{item.itemName}</td>
                  <td className="p-2">₹{item.price}</td>
                  <td className="p-2">{item.updatedAt}</td>
                  <td className="p-2">{item.updatedBy}</td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => handleEditClick(item._id)}
                      className="text-blue-500"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {/* Modal for Editing Food Item */}
      <Modal
        isOpen={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        contentLabel="Edit Food Item"
        className="absolute inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-gray-800 bg-opacity-50"
        closeTimeoutMS={200}
      >
        <div className="bg-white p-6 rounded-md shadow-md w-1/3">
          <h2 className="text-xl font-bold mb-4">Edit Food Item</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label
                htmlFor="itemName"
                className="block text-sm font-medium text-gray-700"
              >
                Item Name
              </label>
              <input
                type="text"
                id="itemName"
                name="itemName"
                value={formData.itemName || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Image URL
              </label>
              <input
                type="text"
                id="image"
                name="image"
                value={formData.image || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Food Group */}
            <div className="mb-4">
              <label
                htmlFor="foodGroup"
                className="block text-sm font-medium text-gray-700"
              >
                Food Group
              </label>
              <input
                type="text"
                id="foodGroup"
                name="foodGroup"
                value={formData.foodGroup || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Ingredient Items */}
            <div className="mb-4">
              <label
                htmlFor="ingredientItems"
                className="block text-sm font-medium text-gray-700"
              >
                Ingredients
              </label>
              <textarea
                id="ingredientItems"
                name="ingredientItems"
                value={formData.ingredientItems || ''}
                onChange={handleFormChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Separate ingredients with commas"
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setModalVisible(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default FoodItems;
