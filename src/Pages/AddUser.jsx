import React, { useState, useEffect } from "react";
import { FaHome, FaArrowRight } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { server } from "../redux/store";

const AddUser = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const roles = ["admin", "staff", "deliveryMan", "waiter"];
  const permissions = [
    "Dashboard",
    "Sale",
    "Purchase",
    "Table",
    "Food",
    "Ingredients",
    "Accounting",
    "People",
    "Reports",
    "HRM",
    "Utilities",
    "Settings",
    "My Account",
  ];

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.role) errors.role = "Role is required";
    if (formData.role !== "Admin" && !formData.permissions.length)
      errors.permissions = "At least one permission is required";
    return errors;
  };

  // Updated handleRoleChange function
  const handleRoleChange = (role) => {
    setSelectedRole(role);

    switch (role) {
      case "admin":
        setSelectedPermissions([
          "Dashboard",
          "Sale",
          "Purchase",
          "Table",
          "Food",
          "Ingredients",
          "Accounting",
          "People",
          "Reports",
          "HRM",
          "Utilities",
          "Settings",
          "My Account",
        ]);
        break;
      case "staff":
        setSelectedPermissions(["Dashboard", "Sale", "Food", "Table"]);
        break;
      case "waiter":
      case "deliveryMan":
        setSelectedPermissions(["Food", "Table", "Sale"]);
        break;
      default:
        setSelectedPermissions([]);
    }
  };

  const handlePermissionChange = (permission) => {
    setSelectedPermissions((prevPermissions) =>
      prevPermissions.includes(permission)
        ? prevPermissions.filter((perm) => perm !== permission)
        : [...prevPermissions, permission]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      username: e.target.username.value,
      email: e.target.email.value,
      password: e.target.password.value,
      mobile: e.target.mobile.value,
      role: selectedRole,
      permissions: selectedRole === "Admin" ? permissions : selectedPermissions,
    };

    const errors = validateForm(formData);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
    } else {
      setLoading(true);
      try {
        console.log(formData);
        await axios.post(`${server}/users/createUser`, formData);

        e.target.reset();
        setSelectedRole("");
        setSelectedPermissions([]);
        setFormErrors({});
      } catch (error) {
        setLoading(false);
        toast.error("User Not Saved!", {
          position: "top-center",
        });
        console.error("Error saving user:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4">
      {/* Breadcrumbs */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User</h1>
        <div className="flex items-center">
          <FaHome className="mr-2 text-blue-500" />
          <span className="text-gray-500">Home</span>
          <span className="mx-2 text-gray-500"></span>
          <span>Add New User</span>
        </div>
      </div>

      <div className="mt-6">
        <div>
          <div className="bg-white rounded-lg p-6 w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Add New User</h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Username *</label>
                <input
                  type="text"
                  name="username"
                  defaultValue={editUser?.username || ""}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    formErrors.username
                      ? "border-red-500"
                      : "focus:ring-blue-600"
                  }`}
                />
                {formErrors.username && (
                  <p className="text-red-500 text-sm">{formErrors.username}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editUser?.email || ""}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    formErrors.email ? "border-red-500" : "focus:ring-blue-600"
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm">{formErrors.email}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Mobile No</label>
                <input
                  type="text"
                  name="mobile"
                  defaultValue={editUser?.mobile || ""}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">User Role *</label>
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    formErrors.role ? "border-red-500" : "focus:ring-blue-600"
                  }`}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {formErrors.role && (
                  <p className="text-red-500 text-sm">{formErrors.role}</p>
                )}
              </div>
              {selectedRole !== "Admin" && (
                <div className="mb-4">
                  <label className="block text-gray-700">Permissions *</label>
                  <div className="flex flex-wrap gap-2">
                    {permissions.map((permission) => (
                      <label
                        key={permission}
                        className="inline-flex items-center"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission)}
                          onChange={() => handlePermissionChange(permission)}
                          className="form-checkbox"
                        />
                        <span className="ml-2">{permission}</span>
                      </label>
                    ))}
                  </div>
                  {formErrors.permissions && (
                    <p className="text-red-500 text-sm">
                      {formErrors.permissions}
                    </p>
                  )}
                </div>
              )}
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? <ClipLoader size={24} color="#fff" /> : "Add User"}{" "}
                <FaArrowRight className="inline ml-2" />
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddUser;
