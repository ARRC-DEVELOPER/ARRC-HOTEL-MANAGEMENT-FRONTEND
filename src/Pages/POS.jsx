"use client";
import { server } from "../redux/store";
import React, { useEffect, useState } from "react";
import Navrow from "../Components/NavRow";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function POS() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [foodGroups, setFoodGroups] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [charge, setCharge] = useState(10);
  const [tax, setTax] = useState(19);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFoodGroups = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${server}/foodgroups/getFoodGroups`, {
          withCredentials: true,
        });
        setFoodGroups(data);

        if (data.length > 0) {
          setSelectedGroup(data[0]._id);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching company details:", error);
        setLoading(true);
      }
    };

    const fetchFoodItems = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${server}/foodItems/getAllFoodItems`);
        setFoodItems(data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching company details:", error);
        setLoading(true);
      }
    };

    fetchFoodGroups();
    fetchFoodItems();
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const { data } = await axios.get(`${server}/cart/getCart`, {
        withCredentials: true,
      });

      if (data.cartItems) {
        setSelectedItems(data.cartItems);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId);
    setSearchTerm("");
  };

  const handleItemSelect = async (item) => {
    try {
      await axios.post(
        `${server}/cart/addToCart/${item._id}`,
        {},
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        }
      );
      fetchCartItems();
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleRemoveItem = async (item) => {
    try {
      await axios.delete(`${server}/cart/deleteFromCart/${item.itemId}`, {
        headers: {
          "Content-type": "application/json",
        },
        withCredentials: true,
      });
      fetchCartItems();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  useEffect(() => {
    let subTotal = selectedItems.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );
    let calculatedDiscount = (discount / 100) * subTotal;
    let calculatedCharge = (charge / 100) * subTotal;
    let calculatedTax = (tax / 100) * subTotal;
    let total =
      subTotal + calculatedCharge + calculatedTax - calculatedDiscount;

    setSubTotal(subTotal);
    setTotal(total);
  }, [selectedItems, charge, discount, tax]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Panel */}
      <nav className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">POS System</h1>
      </nav>

      <div className="bg-gray-200 p-4">
        <h2 className="text-lg font-semibold">
          <Navrow
            selectedItems={selectedItems}
            subTotal={subTotal}
            discount={discount}
            charge={charge}
            tax={tax}
            total={total}
          />
        </h2>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Order Summary */}
        <div className="w-1/3 p-4 bg-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <table className="w-full text-left mb-4">
            <thead>
              <tr className="border-b">
                <th className="py-2">Food Item</th>
                <th className="py-2">Quantity</th>
                <th className="py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="py-2">{item.quantity}</td>
                  <td className="py-2">₹{item.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Buttons */}
          <div className="flex space-x-2 mb-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              +
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              -
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded">
              Modifiers
            </button>
          </div>

          {/* Price Summary */}
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-lg">
              {/* Sub Total */}
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-600">Sub Total</span>
                <span className="text-lg text-gray-800">₹{subTotal}</span>
              </div>

              {/* Discount */}
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-600">Discount</span>
                <div className="flex items-center">
                  <span className="text-lg text-gray-800">0%</span>
                  <FaEdit className="ml-2 text-gray-500 cursor-pointer" />
                </div>
              </div>

              {/* Charge */}
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-600">Charge</span>
                <div className="flex items-center">
                  <span className="text-lg text-gray-800">10%</span>
                  <FaEdit className="ml-2 text-gray-500 cursor-pointer" />
                </div>
              </div>

              {/* Tax */}
              <div className="flex flex-col items-center">
                <span className="font-bold text-gray-600">Tax</span>
                <div className="flex items-center">
                  <span className="text-lg text-gray-800">19%</span>
                  <FaEdit className="ml-2 text-gray-500 cursor-pointer" />
                </div>
              </div>

              {/* Total */}
              <div className="flex flex-col items-center col-span-2">
                <span className="font-bold text-gray-600">Total</span>
                <span className="text-lg text-gray-800">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Food Items */}
        <div className="w-2/3 p-4 bg-gray-100">
          {/* Top Navigation for Categories */}
          <div className="flex space-x-2 overflow-x-auto mb-4">
            {foodGroups.map((group) => (
              <div
                key={group._id}
                onClick={() => handleGroupChange(group._id)}
                className={`flex flex-col items-center p-2  rounded shadow-md w-24 h-24 overflow-hidden cursor-pointer ${
                  selectedGroup === group._id
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
              >
                <img
                  src={group.image || "https://via.placeholder.com/150"}
                  alt={group.groupName}
                  className="w-12 h-12 mb-2"
                />
                <span className="text-xs font-semibold text-center">
                  {group.groupName}
                </span>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by food name"
            className="w-full p-2 border rounded mb-4"
          />

          {/* Food Items */}
          <div className="grid grid-cols-3 gap-4">
            {foodItems.map((item) => (
              <div
                key={item._id}
                className="border p-2 rounded shadow-md bg-white cursor-pointer"
                onClick={() => handleItemSelect(item)}
              >
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-full h-24 rounded object-contain"
                />
                <div className="mt-2 text-center">
                  <p>{item.itemName}</p>
                  <span className="block font-bold text-green-600">
                    ₹{item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
