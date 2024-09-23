import React from 'react';

const EmailTemplates = () => {
  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <nav className="text-sm font-medium text-gray-700 mb-6">
        <ol className="list-reset flex">
          <li><a href="#" className="text-blue-600 hover:text-blue-800">Home</a></li>
          <li><span className="mx-2"></span></li>
          <li>Email Templates</li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Email Templates</h1>

      {/* Pagination and Search */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="text-sm text-gray-700">
            Show
            <select className="ml-2 p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option>50</option>
              <option>100</option>
              <option>150</option>
            </select>
            Entries
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Subject
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Updated At
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Updated By
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border-b border-gray-200">1</td>
              <td className="px-4 py-2 border-b border-gray-200">Reset Password</td>
              <td className="px-4 py-2 border-b border-gray-200">Reset your gorestoa password</td>
              <td className="px-4 py-2 border-b border-gray-200">21/01/2024 02:53:52</td>
              <td className="px-4 py-2 border-b border-gray-200">@admin</td>
              <td className="px-4 py-2 border-b border-gray-200">
                <button className="text-blue-600 hover:text-blue-800">Edit</button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b border-gray-200">2</td>
              <td className="px-4 py-2 border-b border-gray-200">Payment Success</td>
              <td className="px-4 py-2 border-b border-gray-200">Your gorestoa payment successful</td>
              <td className="px-4 py-2 border-b border-gray-200">21/01/2024 02:53:52</td>
              <td className="px-4 py-2 border-b border-gray-200">@admin</td>
              <td className="px-4 py-2 border-b border-gray-200">
                <button className="text-blue-600 hover:text-blue-800">Edit</button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b border-gray-200">3</td>
              <td className="px-4 py-2 border-b border-gray-200">Reset Password Success</td>
              <td className="px-4 py-2 border-b border-gray-200">Your gorestoa password reset successfully</td>
              <td className="px-4 py-2 border-b border-gray-200">21/01/2024 02:53:52</td>
              <td className="px-4 py-2 border-b border-gray-200">@admin</td>
              <td className="px-4 py-2 border-b border-gray-200">
                <button className="text-blue-600 hover:text-blue-800">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="mt-4 text-sm text-gray-700">
        Showing 1 - 3 (3)
      </div>

      {/* Pagination Control */}
      <div className="mt-2 flex justify-center">
        <button className="px-3 py-1 mx-1 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300">
          1
        </button>
      </div>
    </div>
  );
};

export default EmailTemplates;
