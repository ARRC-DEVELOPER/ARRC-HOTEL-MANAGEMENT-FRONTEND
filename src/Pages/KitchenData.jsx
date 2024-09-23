import React, { useState } from 'react';
import { FaUtensils, FaTruck, FaRunning, FaThList, FaUser, FaClipboardList } from 'react-icons/fa';
import {Divider} from 'antd';
const KitchenData = () => {
  // State to manage the selected order type
  const [selectedOrderType, setSelectedOrderType] = useState('All');

  const orders = [
    {
      orderNumber: 199,
      orderType: 'Dine In',
      customerType: 'Default Customer',
      guest: 'Guest774450',
      tableNumber: 'T6',
      waiter: 'waiter',
      foodItems: [
        { name: 'Chicken Corn Soup', quantity: 1 },
        { name: 'Chicken Wonton Soup', quantity: 1 },
        { name: '2 Pcs Chicken With Egg Fried Rice', quantity: 1 },
        { name: 'aaaa', quantity: 1 }
      ]
    },
    {
      orderNumber: 199,
      orderType: 'Pick Up',
      customerType: 'Default Customer',
      guest: 'Guest1',
      tableNumber: 'T6',
      waiter: 'waiter',
      foodItems: [
        { name: 'Chicken Corn Soup', quantity: 1 },
        { name: 'Chicken Wonton Soup', quantity: 1 },
        { name: '2 Pcs Chicken With Egg Fried Rice', quantity: 1 },
        { name: 'Orange Juice', quantity: 1 },
        { name: 'Veg Cheese Pizza', quantity: 1 },
        { name: 'Cofee Extra Mayo Lemon', quantity: 1 }
      ]
    },
    {
      orderNumber: 2175,
      orderType: 'Pick Up',
      customerType: 'Default Customer',
      guest: 'Guest1',
      tableNumber: 'T6',
      waiter: 'waiter',
      foodItems: [{ name: 'Chicken Corn Soup', quantity: 1 },
        { name: 'Chicken Wonton Soup', quantity: 1 },
        { name: '2 Pcs Chicken With Egg Fried Rice', quantity: 1 },
        { name: 'Orange Juice', quantity: 1 },
        { name: 'Veg Cheese Pizza', quantity: 1 },
        { name: 'Cofee Extra Mayo Lemon', quantity: 1 }]
    },
    {
      orderNumber: 2175,
      orderType: 'delivery',
      customerType: 'Default Customer',
      guest: 'Guest1',
      tableNumber: 'T6',
      waiter: 'waiter',
      foodItems: [
        { name: 'Chicken Corn Soup', quantity: 1 },
        { name: 'Chicken Wonton Soup', quantity: 1 },
        { name: '2 Pcs Chicken With Egg Fried Rice', quantity: 1 },
        { name: 'Orange Juice', quantity: 1 },
        { name: 'Veg Cheese Pizza', quantity: 1 },
        { name: 'Cofee Extra Mayo Lemon', quantity: 1 }
      ]
    },
    {
      orderType: 'Delivery',
      orderNumber: 11,
      customerType: 'Regular',
      foodItems: [
        { name: 'Pine-Apple Pastry', quantity: 1 },
        { name: 'Oreo Pastry', quantity: 1 },
        { name: 'Coca Cola', quantity: 1 },
        { name: 'Oreo Pastry', quantity: 1 },
      ],
      note: '',
    },
    {
      orderType: 'Delivery',
      orderNumber: 10,
      customerType: 'Regular',
      foodItems: [
        { name: 'Chicken Wonton Soup', quantity: 1 },
        { name: '2 Pcs Chicken With Egg Fried Rice', quantity: 1 },
        { name: 'aaaa', quantity: 1 },
        { name: 'Chicken Wonton Soup', quantity: 1 },
      ],
      note: '',
    },
    {
      orderType: 'Delivery',
      orderNumber: 11,
      customerType: 'Regular',
      foodItems: [
        { name: 'Pine-Apple Pastry', quantity: 1 },
        { name: 'Oreo Pastry', quantity: 1 },
        { name: 'Coca Cola', quantity: 1 },
        { name: 'Oreo Pastry', quantity: 1 },
      ],
      note: '',
    },
    {
      orderType: 'Pick Up',
      orderNumber: 5,
      customerType: 'Regular',
      foodItems: [
        { name: 'Chicken Biryani', quantity: 3 },
        { name: 'Lamb Biryani', quantity: 1 },
        { name: 'Beef Biryani', quantity: 2, extra: 'Extra Onions' },
      ],
      note: '',
    },
    {
      orderType: 'Pick Up',
      orderNumber: 4,
      customerType: 'Regular',
      foodItems: [
        { name: 'Hot n Crispy Burger', quantity: 1 },
        { name: 'Cheese Burger', quantity: 1 },
        { name: 'Mini McRoyale', quantity: 1 },
        { name: 'Chicken Burger with Cheese', quantity: 1 },
        { name: 'Cofee', quantity: 1 },
      ],
      note: '',
    },
    {
      orderType: 'Pick Up',
      orderNumber: 4,
      customerType: 'Regular',
      foodItems: [
        { name: 'Hot n Crispy Burger', quantity: 1 },
        { name: 'Cheese Burger', quantity: 1 },
        { name: 'Mini McRoyale', quantity: 1 },
        { name: 'Chicken Burger with Cheese', quantity: 1 },
        { name: 'Cofee', quantity: 1 },
      ],
      note: '',
    },
  ];

  // Filter orders based on selected order type
  const filteredOrders = selectedOrderType === 'All'
    ? orders
    : orders.filter(order => order.orderType === selectedOrderType);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <div className="flex items-center p-4 bg-white shadow-md">
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedOrderType('All')}
            className={`flex items-center px-4 py-2 ${selectedOrderType === 'All' ? 'text-white bg-green-500' : 'bg-gray-100'} rounded`}
          >
            <FaThList className="mr-2" /> All
          </button>
          <button
            onClick={() => setSelectedOrderType('Dine In')}
            className={`flex items-center px-4 py-2 ${selectedOrderType === 'Dine In' ? 'text-white bg-green-500' : 'bg-gray-100'} rounded`}
          >
            <FaUtensils className="mr-2" /> Dine In
          </button>
          <button
            onClick={() => setSelectedOrderType('Pick Up')}
            className={`flex items-center px-4 py-2 ${selectedOrderType === 'Pick Up' ? 'text-white bg-green-500' : 'bg-gray-100'} rounded`}
          >
            <FaRunning className="mr-2" /> Pick Up
          </button>
          <button
            onClick={() => setSelectedOrderType('Delivery')}
            className={`flex items-center px-4 py-2 ${selectedOrderType === 'Delivery' ? 'text-white bg-green-500' : 'bg-gray-100'} rounded`}
          >
            <FaTruck className="mr-2" /> Delivery
          </button>
        </div>
      </div>
<Divider/>
      {/* Kitchen Cards */}
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-4">
        {filteredOrders.map((order, index) => (
          <div key={index} className="p-4 bg-white border rounded shadow-md">
            <div className="flex justify-between mb-2">
              <div>
                <span className="font-bold">#{order.orderNumber}</span> {order.orderType} <FaUser className="inline" /> {order.customerType}
              </div>
              <div>
                <FaClipboardList className="inline" /> {order.tableNumber || order.guest || order.waiter}
              </div>
            </div>
            <div className="mb-4">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="pb-2 text-gray-700">Food Item</th>
                    <th className="pb-2 text-gray-700">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {order.foodItems.length > 0 ? (
                    order.foodItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-1">{item.name}</td>
                        <td className="py-1">{item.quantity}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-1" colSpan="2">No food items</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="text-gray-600">
              <strong>Note:</strong> {''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitchenData;
