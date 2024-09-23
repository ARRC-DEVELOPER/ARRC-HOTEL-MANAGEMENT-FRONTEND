import React, { useState, useEffect } from 'react';
import axios from 'axios';

function User() {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [editUser, setEditUser] = useState(null);

  const roles = ['Admin', 'Staff', 'Delivery Man', 'Waiter'];
  const permissions = [
    'Dashboard', 'Sale', 'Purchase', 'Table', 'Food', 'Ingredients',
    'Accounting', 'People', 'Reports', 'HRM', 'Utilities', 'Settings', 'My Account'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const validateForm = (formData) => {
    const errors = {};
    if (!formData.username) errors.username = 'Username is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.role) errors.role = 'Role is required';
    if (formData.role !== 'Admin' && !formData.permissions.length) errors.permissions = 'At least one permission is required';
    return errors;
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://arrc-tech.onrender.com/api/users');
      console.log('Fetched users:', response.data);
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    if (role === 'Admin') {
      setSelectedPermissions(permissions);
    } else {
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
      mobile: e.target.mobile.value,
      role: selectedRole,
      permissions: selectedRole === 'Admin' ? permissions : selectedPermissions,
    };

    const errors = validateForm(formData);
    if (Object.keys(errors).length) {
      setFormErrors(errors);
    } else {
      try {
        if (editUser) {
          await axios.put(`https://arrc-tech.onrender.com/api/users/${editUser._id}`, formData);
        } else {
          await axios.post('https://arrc-tech.onrender.com/api/users', formData);
        }
        fetchUsers();
        setShowModal(false);
        setEditUser(null);
        setFormErrors({});
      } catch (error) {
        console.error('Error saving user:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setSelectedRole(user.role);
    setSelectedPermissions(user.permissions);
    setShowModal(true);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://arrc-tech.onrender.com/api/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-4">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="text-gray-700 hover:text-blue-600 inline-flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 00-.707.293l-8 8a1 1 0 001.414 1.414L3 10.414V18a1 1 0 001 1h12a1 1 0 001-1v-7.586l.293.293a1 1 0 001.414-1.414l-8-8A1 1 0 0010 2z" />
                </svg>
                Home
              </a>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7.293 14.707a1 1 0 011.414 0l3-3a1 1 0 010-1.414l-3-3a1 1 0 111.414-1.414l3 3a3 3 0 010 4.242l-3 3a1 1 0 01-1.414-1.414z" />
                </svg>
                <a href="/user" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                  User
                </a>
              </div>
            </li>
          </ol>
        </nav>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New
        </button>
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">{editUser ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Username *</label>
                <input type="text" name="username" defaultValue={editUser?.username || ''} className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${formErrors.username ? 'border-red-500' : 'focus:ring-blue-600'}`} />
                {formErrors.username && <p className="text-red-500 text-sm">{formErrors.username}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email *</label>
                <input type="email" name="email" defaultValue={editUser?.email || ''} className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${formErrors.email ? 'border-red-500' : 'focus:ring-blue-600'}`} />
                {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Mobile No</label>
                <input type="text" name="mobile" defaultValue={editUser?.mobile || ''} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input type="password" name="password" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">User Role *</label>
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${formErrors.role ? 'border-red-500' : 'focus:ring-blue-600'}`}
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                {formErrors.role && <p className="text-red-500 text-sm">{formErrors.role}</p>}
              </div>
              {selectedRole !== 'Admin' && (
                <div className="mb-4">
                  <label className="block text-gray-700">Permissions *</label>
                  <div className="flex flex-wrap gap-2">
                    {permissions.map((permission) => (
                      <label key={permission} className="inline-flex items-center">
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
                  {formErrors.permissions && <p className="text-red-500 text-sm">{formErrors.permissions}</p>}
                </div>
              )}
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                {editUser ? 'Save Changes' : 'Add User'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Username</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Role</th>
              <th className="px-4 py-2 border-b">Permissions</th> {/* New Permissions Column */}
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-4 py-2 border-b">{user.username}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.role}</td>
                <td className="px-4 py-2 border-b">{user.permissions.join(', ')}</td> {/* Display Permissions */}
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default User;
