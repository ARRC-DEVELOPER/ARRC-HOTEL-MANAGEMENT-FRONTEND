import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../redux/store";
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FaArrowRight } from "react-icons/fa";

const System = () => {
  const [formData, setFormData] = useState({
    defaultRegion: "",
    defaultLanguage: "",
    timezone: "",
    currencyName: "",
    currencySymbol: "",
    currencyPosition: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `${server}/systemSettings/getSystemSettings`
        );

        const { settings } = response.data;

        setFormData({
          defaultRegion: settings.defaultRegion,
          defaultLanguage: settings.defaultLanguage,
          timezone: settings.timezone,
          currencyName: settings.currencyName,
          currencySymbol: settings.currencySymbol,
          currencyPosition: settings.currencyPosition,
        });
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const saved = await axios.post(
        `${server}/systemSettings/updateSystemSettings`,
        formData
      );

      if (saved) {
        toast.success("Setting Updated!", {
          position: "top-center",
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error("Faild To Update!", {
        position: "top-center",
      });
      console.error("Error saving settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <nav className="text-sm font-medium text-gray-700 mb-6">
        <ol className="list-reset flex">
          <li>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Home
            </a>
          </li>
          <li>
            <span className="mx-2"></span>
          </li>
          <li>System</li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">System</h1>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="defaultRegion"
          >
            Default Region *
          </label>
          <select
            id="defaultRegion"
            value={formData.defaultRegion}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>English (Australia)</option>
            <option>Hindi (India)</option>
            <option>Marathi (India)</option>
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="defaultLanguage"
          >
            Default Language *
          </label>
          <select
            id="defaultLanguage"
            value={formData.defaultLanguage}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>English (Australia)</option>
            <option>Hindi (India)</option>
            <option>Marathi (India)</option>
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="timezone"
          >
            Timezone *
          </label>
          <select
            id="timezone"
            value={formData.timezone}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>(UTC+10:00) Canberra, Melbourne, Sydney</option>
            <option>(UTC+10:00) Kalkatta, India, Sydney</option>
            <option>(UTC+10:00) Benglore, Melbourne, Sydney</option>
            {/* Add more options if needed */}
          </select>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="currencyName"
          >
            Currency Name *
          </label>
          <input
            type="text"
            id="currencyName"
            value={formData.currencyName}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="currencySymbol"
          >
            Currency Symbol *
          </label>
          <input
            type="text"
            id="currencySymbol"
            value={formData.currencySymbol}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="currencyPosition"
          >
            Currency Position *
          </label>
          <select
            id="currencyPosition"
            value={formData.currencyPosition}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option>[Symbol][Amount1]</option>
            <option>[Symbol][Amount2]</option>
            <option>[Symbol][Amount3]</option>
            {/* Add more options if needed */}
          </select>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? <ClipLoader size={24} color="#fff" /> : "Save Changes"}{" "}
            <FaArrowRight className="inline ml-2" />
          </button>
        </div>
      </form>

      <ToastContainer />
    </div>
  );
};

export default System;
