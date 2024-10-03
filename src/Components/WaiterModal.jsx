import React, { useEffect, useState } from "react";
import { server } from "../redux/store";
import axios from "axios";

const WaiterModal = ({ isOpen, onClose, onSelectWaiter }) => {
  const [waiters, setWaiters] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchAllWaiters();
    }
  }, [isOpen]);

  const fetchAllWaiters = async () => {
    try {
      const response = await axios.get(`${server}/users/getAllWaiters`, {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      });

      setWaiters(response.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSelectWaiter = (waiter) => {
    onSelectWaiter(waiter);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Select Waiter</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            x
          </button>
        </div>

        {/* Display waiters */}
        {waiters.length > 0 ? (
          <ul>
            {waiters.map((waiter, index) => (
              <li
                key={index}
                className="p-3 bg-gray-100 rounded mb-2 flex justify-between items-center hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelectWaiter(waiter)}
              >
                <div>
                  <p className="font-medium">{waiter.name}</p>
                  <p className="text-sm text-gray-500">@{waiter.username}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No waiters found.</p>
        )}
      </div>
    </div>
  );
};

export default WaiterModal;
