import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { server } from "../redux/store";
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

import CustomerModal from "./CustomerModal";
import WaiterModal from "./WaiterModal";
import DriverModal from "./DriverModal";
import { useNavigate } from "react-router-dom";

const Navrow = ({ selectedItems, subTotal, discount, charge, tax, total }) => {
  const [selectedTab, setSelectedTab] = useState("DineIn");
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isWaiterModalOpen, setIsWaiterModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [tables, setTables] = useState([]);

  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedWaiter, setSelectedWaiter] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const navigate = useNavigate();

  const orderDetails = {
    orderType: selectedTab,
    customer: selectedCustomer && selectedCustomer._id,
    items: selectedItems ? selectedItems : [],
    subTotal: subTotal,
    totalPrice: total,
    tax: tax,
    discount: discount,
    charge: charge,
    dineInDetails: {
      guest: selectedGuest,
      table: selectedTable && selectedTable._id,
      waiter: selectedWaiter && selectedWaiter._id,
    },
    deliveryDetails: {
      driver: selectedDriver && selectedDriver._id,
    },
    pickupDetails: {
      waiter: selectedWaiter && selectedWaiter._id,
    },
  };

  console.log(orderDetails);

  // Callback function to handle selected customer
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsCustomerModalOpen(false);
  };

  // Fetch tables from API
  useEffect(() => {
    if (isTableModalOpen) {
      fetch("https://arrc-tech.onrender.com/api/tables")
        .then((response) => response.json())
        .then((data) => setTables(data))
        .catch((error) => console.error("Error fetching tables:", error));
    }
  }, [isTableModalOpen]);

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

  const handleWaiterSelectClick = () => {
    setIsWaiterModalOpen(true);
  };

  const handleDriverSelectClick = () => {
    setIsDriverModalOpen(true);
  };

  const handleGuestSelection = (guest) => {
    setSelectedGuest(guest);
    setIsGuestModalOpen(false);
  };

  const handleTableSelection = (table) => {
    setSelectedTable(table);
    setIsTableModalOpen(false);
  };

  const handleWaiterSelection = (waiter) => {
    setSelectedWaiter(waiter);
    setIsWaiterModalOpen(false);
  };

  const handleDriverSelection = (driver) => {
    setSelectedDriver(driver);
    setIsDriverModalOpen(false);
  };

  const handleSubmitOrder = async () => {
    try {
      await axios.post(`${server}/order/createOrder`, orderDetails, {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      });

      navigate("/orderhistory");

      toast.success("Order created successfully!", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to created order!", {
        position: "top-center",
      });
    }
  };

  const renderDynamicContent = () => {
    switch (selectedTab) {
      case "DineIn":
        return (
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <span># Dine In</span>

              <span>
                Select Customer (
                {selectedCustomer ? `${selectedCustomer.name}` : ""})
              </span>
              <FaEdit
                className="cursor-pointer"
                onClick={handleCustomerEditClick}
              />

              <span>
                Select Table
                {selectedTable ? `(Table: ${selectedTable.tableName})` : ""}
              </span>
              <FaEdit
                className="cursor-pointer"
                onClick={handleTableSelectClick}
              />

              <span>
                Select Guest
                {selectedGuest !== null ? `(${selectedGuest})` : ""}
              </span>
              <FaEdit
                className="cursor-pointer"
                onClick={handleGuestSelectClick}
              />

              <span>
                Select Waiter (
                {selectedWaiter ? `${selectedWaiter.username}` : ""})
              </span>
              <FaEdit
                className="cursor-pointer"
                onClick={handleWaiterSelectClick}
              />
            </div>
          </div>
        );
      case "Pickup":
        return (
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <span># Pick Up</span>

              <span>
                Select Customer (
                {selectedCustomer ? `${selectedCustomer.name}` : ""})
              </span>
              <FaEdit
                className="cursor-pointer"
                onClick={handleCustomerEditClick}
              />

              <span>
                Select Waiter (
                {selectedWaiter ? `${selectedWaiter.username}` : ""})
              </span>
              <FaEdit
                className="cursor-pointer"
                onClick={handleWaiterSelectClick}
              />
            </div>
          </div>
        );
      case "Delivery":
        return (
          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <span># Delivery</span>

              <span>
                Select Customer (
                {selectedCustomer ? `${selectedCustomer.name}` : ""})
              </span>
              <FaEdit
                className="cursor-pointer"
                onClick={handleCustomerEditClick}
              />

              <span>
                Select Driver (
                {selectedDriver ? `${selectedDriver.username}` : ""})
              </span>
              <FaEdit
                className="cursor-pointer"
                onClick={handleDriverSelectClick}
              />
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
          onClick={() => handleTabClick("DineIn")}
        >
          <FaHamburger className="mr-2" /> Dine In
        </button>
        <button
          className={`flex items-center ${
            selectedTab === "pickUp"
              ? "text-blue-600"
              : "hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => handleTabClick("Pickup")}
        >
          <FaTruck className="mr-2" /> Pick Up
        </button>
        <button
          className={`flex items-center ${
            selectedTab === "delivery"
              ? "text-blue-600"
              : "hover:text-gray-900 dark:hover:text-white"
          }`}
          onClick={() => handleTabClick("Delivery")}
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
          onClick={handleSubmitOrder}
        >
          <FaBars className="mr-2" /> Submit
        </button>
      </div>

      {renderDynamicContent()}

      {/* Modal for Customer Edit */}
      <CustomerModal
        showModal={isCustomerModalOpen}
        setShowModal={setIsCustomerModalOpen}
        onSelectCustomer={handleSelectCustomer}
      />

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

      {/* Modal for waiter selection */}
      <WaiterModal
        isOpen={isWaiterModalOpen}
        onClose={() => setIsWaiterModalOpen(false)}
        onSelectWaiter={handleWaiterSelection}
      />

      {/* Modal for driver selection */}
      <DriverModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        onSelectDriver={handleDriverSelection}
      />
    </div>
  );
};

export default Navrow;
