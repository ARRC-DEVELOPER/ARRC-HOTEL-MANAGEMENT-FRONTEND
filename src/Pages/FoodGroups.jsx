import React, { useState, useEffect } from "react";
import { FaHome, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const API_URL = "https://arrc-tech.onrender.com/api";

const FoodGroups = () => {
  const [foodGroups, setFoodGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchFoodGroups = async () => {
    try {
      const response = await axios.get(`${API_URL}/foodgroups/`);
      setFoodGroups(response.data);
    } catch (error) {
      console.error("Error fetching food groups", error);
      toast.error("Failed to fetch food groups");
    }
  };

  useEffect(() => {
    fetchFoodGroups();
  }, []);

  const formik = useFormik({
    initialValues: {
      groupName: editData ? editData.groupName : "",
      status: editData ? editData.status : "Active",
      image: null,
    },
    enableReinitialize: true, // Allow reinitialization with editData
    validationSchema: Yup.object({
      groupName: Yup.string().required("Group Name is required"),
      status: Yup.string().required("Status is required"),
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("groupName", values.groupName);
        formData.append("status", values.status);
        if (values.image) {
          formData.append("image", values.image);
        } else if (editData && editData.image) {
          formData.append("image", editData.image); // Retain existing image if no new image is provided
        }

        if (editData) {
          await axios.put(`${API_URL}/foodgroups/${editData._id}`, formData);
          toast.success("Food Group updated successfully");
        } else {
          await axios.post(`${API_URL}/foodgroups/`, formData);
          toast.success("Food Group added successfully");
        }

        fetchFoodGroups();
        setIsModalOpen(false);
        formik.resetForm();
      } catch (error) {
        toast.error("Failed to save food group");
        console.error("Submit Error:", error.response ? error.response.data : error.message);
      }
    },
  });

  const handleEdit = (data) => {
    console.log("Editing Food Group:", data); // Debugging
    setEditData(data);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food group?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/foodgroups/${id}`);
      toast.success("Food Group deleted successfully");
      fetchFoodGroups();
    } catch (error) {
      toast.error("Failed to delete food group");
      console.error("Delete Error:", error.response ? error.response.data : error.message);
    }
  };

  const filteredFoodGroups = foodGroups.filter((group) =>
    group.groupName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <FaHome className="mr-2" />
          <span>Home</span>
          <span className="mx-2">/</span>
          <span className="font-semibold">Food Groups</span>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
        >
          <FaPlus className="mr-2" /> Add New
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              {editData ? "Edit Food Group" : "Add Food Group"}
            </h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">
                  Group Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="groupName"
                  className="w-full px-3 py-2 border rounded"
                  value={formik.values.groupName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.groupName && formik.errors.groupName ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.groupName}
                  </div>
                ) : null}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  className="w-full px-3 py-2 border rounded"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {formik.touched.status && formik.errors.status ? (
                  <div className="text-red-500 text-sm">
                    {formik.errors.status}
                  </div>
                ) : null}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Image</label>
                <input
                  type="file"
                  name="image"
                  className="w-full"
                  onChange={(event) =>
                    formik.setFieldValue("image", event.currentTarget.files[0])
                  }
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pagination and Search */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label>Show </label>
          <select className="border rounded px-3 py-1">
            <option value="50">50</option>
            {/* Add other options as needed */}
          </select>
          <span> Entries</span>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="border rounded px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">#</th>
            <th className="py-2 px-4">Image</th>
            <th className="py-2 px-4">Group Name</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Updated At</th>
            <th className="py-2 px-4">Updated By</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredFoodGroups.map((group, index) => (
            <tr key={group._id} className="border-t">
              <td className="py-2 px-4">{index + 1}</td>
              <td className="py-2 px-4">
                {group.image && typeof group.image === 'string' ? (
                  <img
                    src={group.image}
                    alt="Food Group"
                    className="w-10 h-10 rounded"
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td className="py-2 px-4">{group.groupName}</td>
              <td className="py-2 px-4">{group.status}</td>
              <td className="py-2 px-4">{new Date(group.updatedAt).toLocaleString()}</td>
              <td className="py-2 px-4">{group.updatedBy}</td>
              <td className="py-2 px-4 flex space-x-2">
                <FaEdit
                  className="text-blue-500 cursor-pointer"
                  onClick={() => handleEdit(group)}
                />
                <FaTrash
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(group._id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FoodGroups;
