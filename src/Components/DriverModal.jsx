import React, { useEffect, useState } from "react";
import { server } from "../redux/store";
import axios from "axios";

const DriverModal = ({ isOpen, onClose, onSelectDriver }) => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchAllDrivers();
    }
  }, [isOpen]);

  const fetchAllDrivers = async () => {
    try {
      const response = await axios.get(`${server}/users/getAllDrivers`, {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      });

      setDrivers(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSelectDriver = (driver) => {
    onSelectDriver(driver);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select Driver</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            x
          </button>
        </div>

        {/* Display waiters */}
        {drivers.length > 0 ? (
          <ul>
            {drivers.map((driver, index) => (
              <li
                key={index}
                className="p-3 bg-gray-100 rounded mb-2 flex justify-between items-center hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelectDriver(driver)}
              >
                <div>
                  <p className="font-medium">{driver.name}</p>
                  <p className="text-sm text-gray-500">@{driver.username}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No drivers found.</p>
        )}
      </div>
    </div>
  );
};

export default DriverModal;
