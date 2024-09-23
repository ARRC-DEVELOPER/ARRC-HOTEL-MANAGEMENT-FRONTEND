import React from 'react';

const System = () => {
  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <nav className="text-sm font-medium text-gray-700 mb-6">
        <ol className="list-reset flex">
          <li><a href="#" className="text-blue-600 hover:text-blue-800">Home</a></li>
          <li><span className="mx-2"></span></li>
          <li>System</li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">System</h1>

      {/* Form */}
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="defaultRegion">
            Default Region *
          </label>
          <select
            id="defaultRegion"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>English (Australia)</option>
            {/* Add more options if needed */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="defaultLanguage">
            Default Language *
          </label>
          <select
            id="defaultLanguage"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>English (Australia)</option>
            {/* Add more options if needed */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="timezone">
            Timezone *
          </label>
          <select
            id="timezone"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>(UTC+10:00) Canberra, Melbourne, Sydney</option>
            {/* Add more options if needed */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="currencyName">
            Currency Name *
          </label>
          <input
            type="text"
            id="currencyName"
            defaultValue="AUD"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="currencySymbol">
            Currency Symbol *
          </label>
          <input
            type="text"
            id="currencySymbol"
            defaultValue="₹"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="currencyPosition">
            Currency Position *
          </label>
          <select
            id="currencyPosition"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>[Symbol][Amount]</option>
            {/* Add more options if needed */}
          </select>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default System;
