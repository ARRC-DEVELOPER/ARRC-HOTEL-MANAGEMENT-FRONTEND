import React, { useState, useEffect } from "react";
import {
  FaHamburger,
  FaTruck,
  FaMoneyBill,
  FaSyncAlt,
  FaUtensils,
  FaBars,
  FaCheckCircle,
  FaEdit,
} from "react-icons/fa";

const Navrow = () => {
  const [selectedTab, setSelectedTab] = useState("dineIn");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);

  // Fetch tables from API
  useEffect(() => {
    if (isTableModalOpen) {
      // Example API call to fetch tables (replace with actual API)
      fetch("https://arrc-tech.onrender.com/api/tables")
        .then((response) => response.json())
        .then((data) => setTables(data))
        .catch((error) => console.error("Error fetching tables:", error));
    }
  }, [isTableModalOpen]);

  console.log("Krushna dike", tables);

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleCustomerEditClick = () => {
    setIsCustomerModalOpen(true);
  };

  const handleTableSelectClick = () => {
    setIsTableModalOpen(true);
  };

  const handleGuestSelectClick = () => {
    setIsGuestModalOpen(true);
  };

  const handleGuestSelection = (guest) => {
    setSelectedGuest(guest);
    setIsGuestModalOpen(false);
  };

  const handleTableSelection = (table) => {
    setSelectedTable(table);
    setIsTableModalOpen(false);
  };

  const renderDynamicContent = () => {
    switch (selectedTab) {
      case "dineIn":
        return (
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <span># Dine In</span>
              <FaEdit className="cursor-pointer" />
              <span>Default Customer</span>
              <FaEdit
                className="cursor-pointer"
                onClick={handleCustomerEditClick}
              />
              <span>
                Select Table{" "}
                {selectedTable ? `(Table: ${selectedTable.tableName})` : ""}
              </span>
              <FaEdit
                className="cursor-pointer"
                onClick={handleTableSelectClick}
              />
              <span>
                Select Guest{" "}
                {selectedGuest !== null ? `(${selectedGuest})` : ""}
              </span>
              <FaEdit
                className="cursor-pointer"
                onClick={handleGuestSelectClick}
              />
            </div>
          </div>
        );
      case "pickUp":
        return (
          <div className="mt-4">
            <h2>Pick Up Orders</h2>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <span># Dine In</span>
                <FaEdit className="cursor-pointer" />
                <span>Default Customer</span>
                <FaEdit
                  className="cursor-pointer"
                  onClick={handleCustomerEditClick}
                />
                <span>
                  Select Table{" "}
                  {selectedTable ? `(Table: ${selectedTable.tableName})` : ""}
                </span>
                <FaEdit
                  className="cursor-pointer"
                  onClick={handleTableSelectClick}
                />
                <span>
                  Select Guest{" "}
                  {selectedGuest !== null ? `(${selectedGuest})` : ""}
                </span>
                <FaEdit
                  className="cursor-pointer"
                  onClick={handleGuestSelectClick}
                />
              </div>
            </div>{" "}
          </div>
        );
      case "delivery":
        return (
          <div className="mt-4">
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <span># Dine In</span>
                <FaEdit className="cursor-pointer" />
                <span>Default Customer</span>
                <FaEdit
                  className="cursor-pointer"
                  onClick={handleCustomerEditClick}
                />
                <span>
                  Select Table{" "}
                  {selectedTable ? `(Table: ${selectedTable.tableName})` : ""}
                </span>
                <FaEdit
                  className="cursor-pointer"
                  onClick={handleTableSelectClick}
                />
                <span>
                  Select Guest{" "}
                  {selectedGuest !== null ? `(${selectedGuest})` : ""}
                </span>
                <FaEdit
                  className="cursor-pointer"
                  onClick={handleGuestSelectClick}
                />
              </div>
            </div>
          </div>
        );
      case "orders":
        return (
          <div className="mt-4">
            <h2>All Orders</h2>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <span># Dine In</span>
                <FaEdit className="cursor-pointer" />
                <span>Default Customer</span>
                <FaEdit
                  className="cursor-pointer"
                  onClick={handleCustomerEditClick}
                />
                <span>
                  Select Table{" "}
                  {selectedTable ? `(Table: ${selectedTable.tableName})` : ""}
                </span>
                <FaEdit
                  className="cursor-pointer"
                  onClick={handleTableSelectClick}
                />
                <span>
                  Select Guest{" "}
                  {selectedGuest !== null ? `(${selectedGuest})` : ""}
                </span>
                <FaEdit
                  className="cursor-pointer"
                  onClick={handleGuestSelectClick}
                />
              </div>
            </div>{" "}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col p-2 bg-gray-100 dark:bg-gray-800">
      {/* Nav Items with Icons */}
      <div className="flex space-x-4 text-gray-700 dark:text-gray-300">
        <button
          className={`flex items-center ${
            selectedTab === "dineIn"
              ? "text-blue-600"
              : "hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => handleTabClick("dineIn")}
        >
          <FaHamburger className="mr-2" /> Dine In
        </button>
        <button
          className={`flex items-center ${
            selectedTab === "pickUp"
              ? "text-blue-600"
              : "hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => handleTabClick("pickUp")}
        >
          <FaTruck className="mr-2" /> Pick Up
        </button>
        <button
          className={`flex items-center ${
            selectedTab === "delivery"
              ? "text-blue-600"
              : "hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => handleTabClick("delivery")}
        >
          <FaMoneyBill className="mr-2" /> Delivery
        </button>
        <button
          className={`flex items-center ${
            selectedTab === "orders"
              ? "text-blue-600"
              : "hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => handleTabClick("orders")}
        >
          <FaBars className="mr-2" /> Orders
        </button>
        <button
          className="flex items-center hover:text-gray-900 dark:hover:text-white"
          onClick={() => handleTabClick("reset")}
        >
          <FaSyncAlt className="mr-2" /> Reset
        </button>
        <button
          className="flex items-center hover:text-gray-900 dark:hover:text-white"
          onClick={() => handleTabClick("reload")}
        >
          <FaUtensils className="mr-2" /> Reload
        </button>
        <button
          className="flex items-center hover:text-gray-900 dark:hover:text-white"
          onClick={() => handleTabClick("note")}
        >
          <FaMoneyBill className="mr-2" /> Note
        </button>
        <button
          className="flex items-center hover:text-gray-900 dark:hover:text-white"
          onClick={() => handleTabClick("split")}
        >
          <FaBars className="mr-2" /> Split
        </button>
        <button
          className="flex items-center hover:text-gray-900 dark:hover:text-white"
          onClick={() => handleTabClick("payment")}
        >
          <FaCheckCircle className="mr-2" /> Payment
        </button>
        <button
          className="flex items-center hover:text-gray-900 dark:hover:text-white"
          onClick={() => handleTabClick("submit")}
        >
          <FaBars className="mr-2" /> Submit
        </button>
      </div>

      {renderDynamicContent()}

      {/* Modal for Customer Edit */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg">
            <h2 className="text-lg font-bold mb-4">Customer</h2>
            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Search</label>
                <input
                  type="text"
                  placeholder="Search Customer"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Customer Name *</label>
                <input
                  type="text"
                  placeholder="Enter Customer Name"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="Enter Phone Number"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  placeholder="Enter Address"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setIsCustomerModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Table Selection */}
      {isTableModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg">
            <h2 className="text-lg font-bold mb-4">Select Table</h2>
            <ul>
              {tables.map((table) => (
                <li key={table._id} className="mb-2">
                  <button
                    className="px-4 py-2 w-full bg-gray-100 hover:bg-blue-200 text-left rounded"
                    onClick={() => handleTableSelection(table)}
                  >
                    {table.tableName}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsTableModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Guest Selection */}
      {isGuestModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg">
            <h2 className="text-lg font-bold mb-4">Select Guest</h2>
            <div className="grid grid-cols-3 gap-4">
              {[9, 8, 7, 6, 5, 4, 3, 2, 1, 0, "X"].map((guest) => (
                <button
                  key={guest}
                  className={`px-4 py-2 ${
                    selectedGuest === guest
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 hover:bg-blue-200"
                  } rounded`}
                  onClick={() => handleGuestSelection(guest)}
                >
                  {guest}
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsGuestModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setIsGuestModalOpen(false)}
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

export default Navrow;
