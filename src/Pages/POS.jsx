"use client";

import React, { useState, useEffect } from "react";
import { FaMinus, FaTrash } from "react-icons/fa";
import Navrow from "../Components/NavRow";
export default function POS() {
  const [selectedItems, setSelectedItems] = useState([]);
  const [foodGroups, setFoodGroups] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [charge, setCharge] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [groupsRes] = await Promise.all([
          fetch("https://arrc-tech.onrender.com/api/foodgroups").then((res) =>
            res.json()
          ),
          // fetch("https://arrc-tech.onrender.com/api/charges").then((res) =>
          //   res.json()
          // ),
          // fetch("https://arrc-tech.onrender.com/api/taxes").then((res) =>
          //   res.json()
          // ),
          // fetch("https://arrc-tech.onrender.com/api/discounts").then((res) =>
          //   res.json()
          // ),
          // fetch("https://arrc-tech.onrender.com/api/foodItems").then((res) =>
          //   res.json()
          // ),
        ]);

        setFoodGroups(groupsRes);
        // setCharge(chargesRes.charge || 0);
        // setTax(taxesRes.tax || 0);
        // setDiscount(discountsRes.discount || 0);
        // setFoodItems(itemsRes);

        if (groupsRes.length > 0) {
          setSelectedGroup(groupsRes[0].id);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const newSubTotal = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubTotal(newSubTotal);

    const newTotal =
      newSubTotal -
      newSubTotal * (discount / 100) +
      newSubTotal * (charge / 100) +
      newSubTotal * (tax / 100);
    setTotal(newTotal);
  }, [selectedItems, discount, charge, tax]);

  const handleItemSelect = (item) => {
    const existingItem = selectedItems.find((i) => i.id === item.id);
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (item) => {
    const updatedItems = selectedItems
      .map((i) =>
        i.id === item.id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i
      )
      .filter((i) => i.quantity > 0);
    setSelectedItems(updatedItems);
  };

  const handleDeleteItem = (item) => {
    setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
  };

  const handleGroupChange = (groupId) => {
    setSelectedGroup(groupId);
    setSearchTerm("");
  };

  const getFilteredFoodItems = () => {
    return foodItems.filter(
      (item) =>
        item.groupId === selectedGroup &&
        item.name &&
        typeof item.name === "string" &&
        item.name.toLowerCase().includes((searchTerm || "").toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold">POS System</h1>
      </nav>

      <div className="bg-gray-200 p-4">
        <h2 className="text-lg font-semibold">
          <Navrow />
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-1">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b">
                  <th className="text-left">Item</th>
                  <th className="text-left">Qty</th>
                  <th className="text-left">Price</th>
                  <th className="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="text-red-500 mr-2"
                      >
                        <FaMinus />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="text-red-500"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="grid grid-cols-2 gap-2">
              <div>Subtotal:</div>
              <div className="text-right">${subTotal.toFixed(2)}</div>
              <div>Discount ({discount}%):</div>
              <div className="text-right">
                -${((subTotal * discount) / 100).toFixed(2)}
              </div>
              <div>Charge ({charge}%):</div>
              <div className="text-right">
                ${((subTotal * charge) / 100).toFixed(2)}
              </div>
              <div>Tax ({tax}%):</div>
              <div className="text-right">
                ${((subTotal * tax) / 100).toFixed(2)}
              </div>
              <div className="font-bold">Total:</div>
              <div className="text-right font-bold">${total.toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="col-span-2">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Food Groups</h2>
            <div className="flex space-x-4 mb-4 overflow-x-auto">
              {foodGroups.map((group) => (
                <div
                  key={group._id}
                  onClick={() => handleGroupChange(group._id)}
                  className={`p-2 rounded cursor-pointer ${
                    selectedGroup === group._id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  <img
                    src={group.image || "https://via.placeholder.com/150"}
                    alt={group.groupName}
                    className="w-16 h-15 object-cover rounded"
                  />
                  <p>{group.groupName}</p>
                </div>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search items..."
              className="w-full p-2 border rounded mb-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="grid grid-cols-3 gap-4">
              {getFilteredFoodItems().map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-100 p-4 rounded cursor-pointer hover:bg-gray-200"
                  onClick={() => handleItemSelect(item)}
                >
                  <h3 className="font-bold">{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
