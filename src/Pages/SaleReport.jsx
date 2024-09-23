import React, { useState } from 'react';
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from 'react-icons/fa';

const SaleReport = () => {
  const [period, setPeriod] = useState('Daily');
  const [fromDate, setFromDate] = useState('09/02/2024');
  const [toDate, setToDate] = useState('09/02/2024');

  return (
    <div className="p-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-4">Sale Report</h1>

      {/* Breadcrumbs */}
      <div className="mb-4">
        <nav className="text-sm text-gray-600">
          <a href="#" className="hover:underline">Home</a> &gt; <span>Sale Report</span>
        </nav>
      </div>
      
      {/* Filters */}
      <div className="flex mb-4 space-x-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Period *</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded p-2"
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">From *</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">To *</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded p-2"
          />
        </div>
        <div className="ml-auto flex items-end">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Filter
          </button>
        </div>
      </div>

      {/* Export Icons */}
      <div className="flex mb-4 space-x-2">
        <button className="p-2 border rounded bg-gray-200 hover:bg-gray-300">
          <FaPrint className="text-gray-600" />
        </button>
        <button className="p-2 border rounded bg-gray-200 hover:bg-gray-300">
          <FaFilePdf className="text-red-600" />
        </button>
        <button className="p-2 border rounded bg-gray-200 hover:bg-gray-300">
          <FaFileCsv className="text-blue-600" />
        </button>
        <button className="p-2 border rounded bg-gray-200 hover:bg-gray-300">
          <FaFileExcel className="text-green-600" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Charge</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap">No Result Found</td>
              <td className="px-6 py-4 whitespace-nowrap" colSpan="7" />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="flex justify-between mt-4">
        <span className="font-bold">Total</span>
        <span>₹0 ₹0</span>
      </div>
    </div>
  );
};

export default SaleReport;
