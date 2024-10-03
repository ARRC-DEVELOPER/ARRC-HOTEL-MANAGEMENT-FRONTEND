import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { server } from "../redux/store";

const CustomerModal = ({ showModal, setShowModal, onSelectCustomer }) => {
  const [activeTab, setActiveTab] = useState("addCustomer");
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (showModal) {
      fetchAllCustomers();
    }
  }, [showModal]);

  const fetchAllCustomers = async () => {
    try {
      const response = await axios.get(`${server}/customers/getAllCustomers`);
      setSearchResults(response.data.customers);
    } catch (error) {
      setErrorMessage("Failed to fetch customers. Please try again.");
      console.error(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveCustomer = async () => {
    try {
      await axios.post(`${server}/customers/createCustomer`, customer, {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      });
      toast.success("Customer added successfully!", {
        position: "top-center",
      });
      setActiveTab("searchCustomer");
      fetchAllCustomers();
    } catch (error) {
      setErrorMessage("Failed to add customer. Please try again.");
      toast.error("Failed to add customer!", {
        position: "top-center",
      });
    }
  };

  const handleSearchCustomers = async () => {
    try {
      const response = await axios.get(
        `${server}/customers/getAllCustomers?search=${search}`,
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        }
      );
      setSearchResults(response.data.customers);
    } catch (error) {
      setErrorMessage("Failed to search customers. Please try again.");
      console.error(error.message);
    }
  };

  const handleSelectCustomer = (customer) => {
    onSelectCustomer(customer);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg w-1/2 p-5">
        <div className="flex justify-between border-b pb-2 mb-4">
          <h3 className="text-xl font-semibold">Customer</h3>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={() => setShowModal(false)}
          >
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-4">
          <button
            className={`py-2 px-4 ${
              activeTab === "addCustomer"
                ? "border-b-2 border-green-500 font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("addCustomer")}
          >
            Add Customer
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "searchCustomer"
                ? "border-b-2 border-green-500 font-semibold"
                : ""
            }`}
            onClick={() => setActiveTab("searchCustomer")}
          >
            Search
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "addCustomer" ? (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Customer Name *
              </label>
              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleInputChange}
                className="mt-1 p-2 border w-full rounded-md focus:ring focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleInputChange}
                className="mt-1 p-2 border w-full rounded-md focus:ring focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={customer.phone}
                onChange={handleInputChange}
                className="mt-1 p-2 border w-full rounded-md focus:ring focus:ring-green-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={customer.address}
                onChange={handleInputChange}
                className="mt-1 p-2 border w-full rounded-md focus:ring focus:ring-green-500"
              />
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-md"
              onClick={handleSaveCustomer}
            >
              Save
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center mb-4">
              <input
                type="text"
                placeholder="Search by name or phone number"
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 border w-full rounded-md focus:ring focus:ring-green-500"
              />
              <button
                className="ml-2 bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={handleSearchCustomers}
              >
                Search
              </button>
            </div>

            {/* Search Result */}
            {searchResults.length > 0 ? (
              searchResults.map((customer) => (
                <div
                  key={customer._id}
                  className="flex items-center p-4 bg-gray-100 rounded-md mb-2"
                >
                  <div className="flex-grow">
                    <p className="font-semibold">{customer.name}</p>
                    <p className="text-gray-600">{customer.phone}</p>
                  </div>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                    onClick={() => handleSelectCustomer(customer)}
                  >
                    Select
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No customers found.</p>
            )}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default CustomerModal;
