import React, { useState } from 'react';
import { FaPrint, FaFilePdf, FaFileCsv, FaFileExcel } from 'react-icons/fa';
import { Breadcrumb, Button, Table } from 'antd'; // Example using Ant Design for breadcrumbs and buttons

const WorkPeriodReport = () => {
  const [fromDate, setFromDate] = useState('09/02/2024');
  const [toDate, setToDate] = useState('09/02/2024');

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Work Period Report</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      
      {/* Date Filters */}
      <div className="flex mb-4">
        <div className="flex flex-col mr-4">
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
          <Button type="primary" className="ml-4">Filter</Button>
        </div>
      </div>

      {/* Export Icons */}
      <div className="flex mb-4">
        <button className="p-2 border rounded bg-gray-200 mr-2">
          <FaPrint className="text-gray-600" />
        </button>
        <button className="p-2 border rounded bg-gray-200 mr-2">
          <FaFilePdf className="text-red-600" />
        </button>
        <button className="p-2 border rounded bg-gray-200 mr-2">
          <FaFileCsv className="text-blue-600" />
        </button>
        <button className="p-2 border rounded bg-gray-200">
          <FaFileExcel className="text-green-600" />
        </button>
      </div>

      {/* Table */}
      <Table
        dataSource={[]} // Add your data source here
        columns={[
          { title: 'Start By', dataIndex: 'startBy', key: 'startBy' },
          { title: 'Start At', dataIndex: 'startAt', key: 'startAt' },
          { title: 'End By', dataIndex: 'endBy', key: 'endBy' },
          { title: 'End At', dataIndex: 'endAt', key: 'endAt' },
          { title: 'Opening Balance', dataIndex: 'openingBalance', key: 'openingBalance' },
          { title: 'Closing Balance', dataIndex: 'closingBalance', key: 'closingBalance' },
        ]}
        pagination={false}
        locale={{ emptyText: 'No Result Found' }}
      />
      
      {/* Summary */}
      <div className="flex justify-between mt-4">
        <span>Total</span>
        <span>₹0 ₹0</span>
      </div>
    </div>
  );
};

export default WorkPeriodReport;
