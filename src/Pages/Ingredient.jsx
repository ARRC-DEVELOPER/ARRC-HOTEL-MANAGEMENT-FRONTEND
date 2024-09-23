import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

export default function Ingredient() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await axios.get('https://arrc-tech.onrender.com/api/ingredients');
      setIngredients(response.data);
    } catch (error) {
      toast.error('Error fetching ingredients: ' + error.message);
    }
  };

  const handleAddNew = () => {
    navigate('/admin/addingredient');
  };

  const handleEdit = (ingredient) => {
    setSelectedIngredient(ingredient);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ingredient?')) {
      try {
        await axios.delete(`https://arrc-tech.onrender.com/api/ingredients/${id}`);
        setIngredients((prevIngredients) =>
          prevIngredients.filter((ingredient) => ingredient._id !== id)
        );
        toast.success('Ingredient deleted successfully');
      } catch (error) {
        console.error('Error deleting ingredient:', error);
        toast.error('Error deleting ingredient: ' + error.message);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedIngredient(null);
  };

  const handleModalSave = async (updatedIngredient) => {
    try {
      await axios.put(`https://arrc-tech.onrender.com/api/ingredients/${updatedIngredient._id}`, updatedIngredient);
      setIngredients((prevIngredients) =>
        prevIngredients.map((ingredient) =>
          ingredient._id === updatedIngredient._id ? updatedIngredient : ingredient
        )
      );
      toast.success('Ingredient updated successfully');
      handleModalClose();
    } catch (error) {
      toast.error('Error updating ingredient: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ingredients</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add New
        </button>
      </div>

      <div className="mb-4">
        <nav className="text-gray-600">
          <a href="/" className="hover:underline">Home</a> &gt;
          <span className="font-semibold">Ingredients</span>
        </nav>
      </div>

      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <label htmlFor="search" className="mr-2">Search:</label>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
            placeholder="Search..."
          />
        </div>

        <div>
          <span className="mr-2">Show</span>
          <select className="border border-gray-300 rounded px-2 py-1">
            <option>50</option>
            <option>100</option>
            <option>150</option>
          </select>
          <span className="ml-2">Entries</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Sr No</th>
              <th className="border border-gray-300 px-4 py-2">Item Name</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Alert Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Updated At</th>
              <th className="border border-gray-300 px-4 py-2">Updated By</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {ingredients
              .filter((ingredient) =>
                ingredient.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((ingredient, index) => (
                <tr key={ingredient._id}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{ingredient.name}</td>
                  <td className="border border-gray-300 px-4 py-2">₹{ingredient.price?.toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{ingredient.quantity}</td>
                  <td className="border border-gray-300 px-4 py-2">{ingredient.alertQuantity}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(ingredient.updatedAt).toLocaleString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{ingredient.updatedBy}</td>
                  <td className="border border-gray-300 px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => handleEdit(ingredient)}
                      className="text-blue-500 hover:underline"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(ingredient._id)}
                      className="text-red-500 hover:underline"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedIngredient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Ingredient</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">Name:</label>
                <input
                  type="text"
                  value={selectedIngredient.name || ''}
                  onChange={(e) =>
                    setSelectedIngredient({ ...selectedIngredient, name: e.target.value })
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Description:</label>
                <input
                  type="text"
                  value={selectedIngredient.description || ''}
                  onChange={(e) =>
                    setSelectedIngredient({ ...selectedIngredient, description: e.target.value })
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Price:</label>
                <input
                  type="number"
                  value={selectedIngredient.price || ''}
                  onChange={(e) =>
                    setSelectedIngredient({ ...selectedIngredient, price: parseFloat(e.target.value) })
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Quantity:</label>
                <input
                  type="number"
                  value={selectedIngredient.quantity || ''}
                  onChange={(e) =>
                    setSelectedIngredient({ ...selectedIngredient, quantity: parseInt(e.target.value) })
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Alert Quantity:</label>
                <input
                  type="number"
                  value={selectedIngredient.alertQuantity || ''}
                  onChange={(e) =>
                    setSelectedIngredient({ ...selectedIngredient, alertQuantity: parseInt(e.target.value) })
                  }
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleModalClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleModalSave(selectedIngredient)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" />
    </div>
  );
}