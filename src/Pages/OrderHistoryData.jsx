import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const OrderHistoryData = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  const formik = useFormik({
    initialValues: {
      from: '',
      to: '',
      paymentStatus: 'All',
    },
    validationSchema: Yup.object({
      from: Yup.date().required('From date is required'),
      to: Yup.date().required('To date is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders', {
          params: values,
        });
        setOrders(response.data);
        setFilteredOrders(response.data);
        toast.success('Orders fetched successfully!');
      } catch (error) {
        toast.error('Failed to fetch orders.');
      }
    },
  });

  useEffect(() => {
    const results = orders.filter(order =>
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredOrders(orders);
    }
  }, [searchTerm, orders]);

  const indexOfLastOrder = currentPage * entriesPerPage;
  const indexOfFirstOrder = indexOfLastOrder - entriesPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Order History', path: '/order-history' },
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
      {/* Breadcrumb */}
      <nav className="flex py-2 sm:py-3" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 sm:space-x-3">
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="inline-flex items-center">
              {index !== breadcrumbItems.length - 1 ? (
                <Link to={item.path} className="text-gray-700 hover:text-gray-900 text-xs sm:text-sm font-medium">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-500 text-xs sm:text-sm font-medium">{item.label}</span>
              )}
              {index !== breadcrumbItems.length - 1 && (
                <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-gray-400" />
              )}
            </li>
          ))}
        </ol>
      </nav>

      <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Order History</h1>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="mb-6">
        <div className="flex flex-wrap -mx-3">
          <div className="w-full sm:w-1/3 px-3 mb-4 sm:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs sm:text-xs font-bold mb-2" htmlFor="from">
              From *
            </label>
            <input
              id="from"
              name="from"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.from}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-3 sm:py-3 sm:px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            />
            {formik.touched.from && formik.errors.from ? (
              <div className="text-red-500 text-xs italic">{formik.errors.from}</div>
            ) : null}
          </div>
          <div className="w-full sm:w-1/3 px-3 mb-4 sm:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs sm:text-xs font-bold mb-2" htmlFor="to">
              To *
            </label>
            <input
              id="to"
              name="to"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.to}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-3 sm:py-3 sm:px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            />
            {formik.touched.to && formik.errors.to ? (
              <div className="text-red-500 text-xs italic">{formik.errors.to}</div>
            ) : null}
          </div>
          <div className="w-full sm:w-1/3 px-3 mb-4 sm:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs sm:text-xs font-bold mb-2" htmlFor="paymentStatus">
              Payment Status
            </label>
            <select
              id="paymentStatus"
              name="paymentStatus"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.paymentStatus}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-2 px-3 sm:py-3 sm:px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Due">Due</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Filter
        </button>
      </form>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center">
          <span className="text-xs sm:text-sm">Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(parseInt(e.target.value))}
            className="mx-2 p-1 border rounded text-xs sm:text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-xs sm:text-sm">Entries</span>
        </div>
        <div className="mt-2 sm:mt-0">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-xs sm:text-sm">
          <thead>
            <tr>
              <th className="py-2 px-2 sm:px-4 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                #
              </th>
              <th className="py-2 px-2 sm:px-4 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="py-2 px-2 sm:px-4 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                Order Type
              </th>
              <th className="py-2 px-2 sm:px-4 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                Total
              </th>
              <th className="py-2 px-2 sm:px-4 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                Paid
              </th>
              <th className="py-2 px-2 sm:px-4 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                Due
              </th>
              <th className="py-2 px-2 sm:px-4 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                Created At
              </th>
              <th className="py-2 px-2 sm:px-4 bg-gray-100 text-left font-medium text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={order.id}>
                <td className="py-2 px-2 sm:px-4 border-b">{index + 1}</td>
                <td className="py-2 px-2 sm:px-4 border-b">{order.customer}</td>
                <td className="py-2 px-2 sm:px-4 border-b">{order.orderType}</td>
                <td className="py-2 px-2 sm:px-4 border-b">${order.total.toFixed(2)}</td>
                <td className="py-2 px-2 sm:px-4 border-b">${order.paid.toFixed(2)}</td>
                <td className="py-2 px-2 sm:px-4 border-b">${order.due.toFixed(2)}</td>
                <td className="py-2 px-2 sm:px-4 border-b">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-2 sm:px-4 border-b">
                  <button className="text-blue-500 hover:text-blue-700">
                    <FaArrowRight />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs sm:text-sm">
          Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} entries
        </span>
        <div className="flex">
          {Array.from({ length: Math.ceil(filteredOrders.length / entriesPerPage) }, (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`py-2 px-4 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default OrderHistoryData;
