import React, { useEffect, useState } from 'react';
import { FaPlus, FaMinus, FaTrash, FaCog } from 'react-icons/fa';
import axios from 'axios'; // for API calls

const FoodItemTable = () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch food items from the API
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        const response = await axios.get('/api/fooditems'); // API endpoint to fetch food items
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };
    fetchFoodItems();
  }, []);

  // Handle adding an item
  const handleAddItem = (item) => {
    setSelectedItems((prev) => [...prev, item]);
  };

  // Handle removing an item (reduce quantity or remove)
  const handleRemoveItem = (itemToRemove) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.name !== itemToRemove.name)
    );
  };

  // Handle deleting an item
  const handleDeleteItem = (itemToDelete) => {
    setSelectedItems((prev) =>
      prev.filter((item) => item.name !== itemToDelete.name)
    );
  };

  return (
    <div className="p-4 shadow-md ">
      <h2 className="text-lg font-bold mb-4">Food Item Table</h2>
      <table className="w-full h-auto border">
        <thead>
          <tr className="text-left border-b mr-2">
            <th className='text-md'>Food Item</th>
            <th className='text-md'>Quantity</th>
            <th className='text-md'>Price</th>
          </tr>
        </thead>
        <tbody>
          {selectedItems.length > 0 ? (
            selectedItems.map((item, index) => (
              <tr key={index} className="border-b">
                <td>{item.name}</td>
                <td>1</td> {/* Default quantity for demo */}
                <td>{item.price}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-2">No items selected</td>
            </tr>
          )}
        </tbody>
      </table>
      
      <div className="flex space-x-2 mt-4">
        <button className="bg-green-500 text-white p-2 rounded" onClick={() => handleAddItem(items[0])}>
          <FaPlus /> Add
        </button>
        <button className="bg-red-500 text-white p-2 rounded" onClick={() => handleRemoveItem(selectedItems[0])}>
          <FaMinus /> Remove
        </button>
        <button className="bg-gray-500 text-white p-2 rounded" onClick={() => handleDeleteItem(selectedItems[0])}>
          <FaTrash /> Delete
        </button>
        <button className="bg-gray-700 text-white p-2 rounded">
          <FaCog /> Modifiers
        </button>
      </div>

      {/* List available items */}
      <h2 className="text-lg font-bold mt-6 mb-2">Available Food Items</h2>
      <ul className="list-disc pl-5">
        {items.map((item, index) => (
          <li key={index} className="mb-1">
            {item.name} - ${item.price}
            <button className="ml-2 bg-green-500 text-white p-1 rounded" onClick={() => handleAddItem(item)}>
              <FaPlus /> Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodItemTable;
