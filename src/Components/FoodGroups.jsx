import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodGroups = ({ onItemSelect }) => {
  const [foodGroups, setFoodGroups] = useState([]); // State for food groups
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all food groups on mount
  useEffect(() => {
    const fetchFoodGroups = async () => {
      try {
        const response = await axios.get('/api/food-groups'); // Replace with your API endpoint
        setFoodGroups(response.data);
      } catch (err) {
        setError('Failed to fetch food groups');
      }
    };

    fetchFoodGroups();
  }, []);

  // Fetch food items when a group is selected
  const fetchFoodItems = async (groupId) => {
    setLoading(true);
    setError(null); // Clear previous error
    try {
      const response = await axios.get(`/api/food-groups/${groupId}`); // Fetch items based on group id
      setFoodItems(response.data);
    } catch (err) {
      setError('Failed to fetch food items');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId);
    setSearchTerm(''); // Clear search term when changing group
    fetchFoodItems(groupId); // Fetch food items for the selected group
  };

  const getFilteredFoodItems = () => {
    return foodItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="p-6 shadow-md">
      <h1 className="text-2xl font-bold mb-4">Food Groups</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Render food groups dynamically */}
        {foodGroups.length > 0 ? (
          foodGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => handleGroupChange(group.id)}
              className="flex-1"
            >
              <img
                src={group.image ? `/path/to/images/${group.image}` : '/path/to/default-image.jpg'}
                alt={group.name}
                className="w-25 h-25 object-cover rounded shadow-md"
              />
              <p className="text-md font-bold">{group.name}</p>
            </button>
          ))
        ) : (
          <p>No food groups available</p>
        )}
      </div>

      <input
        type="text"
        placeholder="Search by food name"
        className="w-full p-2 border rounded mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Loading and error handling */}
      {loading ? (
        <p>Loading food items...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getFilteredFoodItems().length > 0 ? (
            getFilteredFoodItems().map((item, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden shadow-lg">
                {item.image ? (
                  <img
                    src={`/path/to/images/${item.image}`}
                    alt={item.name}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500"
                    onClick={() => onItemSelect(item)}
                  >
                    No Image
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full bg-opacity-75 bg-black text-white p-2 text-center">
                  <div className="text-lg font-bold">{item.name}</div>
                  <div className="text-md">{item.price}</div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center">No items available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FoodGroups;
