import React, { useState, useEffect } from "react";
import { FaHome, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [adminExists, setAdminExists] = useState(false);

  useEffect(() => {
    axios.get("/api/users")
      .then((response) => {
        const userData = Array.isArray(response.data) ? response.data : [];
        setUsers(userData);
        setAdminExists(userData.some((user) => user.role === "Admin"));
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      mobileNo: "",
      password: "",
      role: "",
      permissions: [],
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      mobileNo: Yup.string().required("Mobile No is required"),
      password: Yup.string().required("Password is required"),
      role: Yup.string().required("User Role is required"),
      permissions: Yup.array().min(1, "At least one permission is required"),
    }),
    onSubmit: (values) => {
      axios.post("/api/users", values)
        .then((response) => {
          setUsers([...users, response.data]);
          setShowModal(false);
        })
        .catch((error) => {
          console.error("There was an error creating the user!", error);
        });
    },
  });

  const handleRoleChange = (e) => {
    const role = e.target.value;
    formik.setFieldValue("role", role);

    switch(role) {
      case "Admin":
        formik.setFieldValue("permissions", [
          "Dashboard", "Sale", "Purchase", "Table", "Food", "Ingradients",
          "Accounting", "People", "Reports", "HRM", "Utilities", "Settings", "My Account"
        ]);
        break;
      case "Staff":
        formik.setFieldValue("permissions", [
          "Dashboard", "Sale", "Food", "Table"
        ]);
        break;
      case "Waiter":
        formik.setFieldValue("permissions", [
          "Food", "Table", "Sale"
        ]);
        break;
      case "Delivery Man":
        formik.setFieldValue("permissions", [
          "Food", "Table", "Sale"
        ]);
        break;
      default:
        formik.setFieldValue("permissions", []);
    }
  };

  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    const { permissions } = formik.values;
    if (checked) {
      formik.setFieldValue("permissions", [...permissions, value]);
    } else {
      formik.setFieldValue(
        "permissions",
        permissions.filter((permission) => permission !== value)
      );
    }
  };

  const deleteUser = (id) => {
    axios.delete(`/api/users/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the user!", error);
      });
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
          <span>User</span>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          onClick={() => setShowModal(true)}
        >
          <FaPlus className="inline mr-2" /> Add New
        </button>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-8 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Username *</label>
                <input
                  type="text"
                  name="username"
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                />
                {formik.errors.username && formik.touched.username && (
                  <div className="text-red-500">{formik.errors.username}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.errors.email && formik.touched.email && (
                  <div className="text-red-500">{formik.errors.email}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Mobile No *</label>
                <input
                  type="text"
                  name="mobileNo"
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  value={formik.values.mobileNo}
                />
                {formik.errors.mobileNo && formik.touched.mobileNo && (
                  <div className="text-red-500">{formik.errors.mobileNo}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Password *</label>
                <input
                  type="password"
                  name="password"
                  className="w-full p-2 border rounded"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                {formik.errors.password && formik.touched.password && (
                  <div className="text-red-500">{formik.errors.password}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Role *</label>
                <select
                  name="role"
                  className="w-full p-2 border rounded"
                  onChange={(e) => {
                    handleRoleChange(e);
                    formik.handleChange(e);
                  }}
                  value={formik.values.role}
                >
                  <option value="">Select a role</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                  <option value="Waiter">Waiter</option>
                  <option value="Delivery Man">Delivery Man</option>
                </select>
                {formik.errors.role && formik.touched.role && (
                  <div className="text-red-500">{formik.errors.role}</div>
                )}
              </div>

              {formik.values.role === "Admin" && (
                <div className="mb-4">
                  <label className="block text-gray-700">Permissions</label>
                  <div className="flex flex-wrap">
                    {[
                      "Dashboard", "Sale", "Purchase", "Table", "Food", "Ingradients",
                      "Accounting", "People", "Reports", "HRM", "Utilities", "Settings", "My Account"
                    ].map((permission) => (
                      <div key={permission} className="mr-4">
                        <input
                          type="checkbox"
                          name="permissions"
                          value={permission}
                          onChange={handlePermissionChange}
                          checked={formik.values.permissions.includes(permission)}
                        />
                        <label className="ml-2">{permission}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(formik.values.role === "Staff" || formik.values.role === "Waiter" || formik.values.role === "Delivery Man") && (
                <div className="mb-4">
                  <label className="block text-gray-700">Permissions</label>
                  <div className="flex flex-wrap">
                    {[
                      "Dashboard", "Sale", "Food", "Table"
                    ].map((permission) => (
                      <div key={permission} className="mr-4">
                        <input
                          type="checkbox"
                          name="permissions"
                          value={permission}
                          onChange={handlePermissionChange}
                          checked={formik.values.permissions.includes(permission)}
                        />
                        <label className="ml-2">{permission}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow"
                >
                  Add User
                </button>
              </div>
            </form>
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setShowModal(false)}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      )}

      {/* Users List */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Users List</h2>
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="text-blue-500"
                    onClick={() => console.log("Edit user", user.id)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500 ml-2"
                    onClick={() => deleteUser(user.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddUser;
