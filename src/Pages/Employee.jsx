import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  // Fetch employees from the database
  const fetchEmployees = async () => {
    try {
      const response = await axios.get("https://arrc-tech.onrender.com/api/employees");
      const data = response.data;
      if (Array.isArray(data)) {
        setEmployees(data);
      } else {
        console.error("Expected an array of employees but got:", data);
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle form submission to save employee data
  const formik = useFormik({
    initialValues: {
      department: "",
      designation: "",
      shift: "",
      name: "",
      joiningDate: "",
      leavingDate: "",
      email: "",
      phone: "",
      presentAddress: "",
      permanentAddress: "",
      emergencyContact: "",
      nidNumber: "",
      gender: "Male",
      religion: "",
      maritalStatus: "Single",
      dob: "",
      salaryType: "",
      salary: 0.0,
      status: "Active",
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      bankIdentifierCode: "",
      branchLocation: "",
      taxPayerId: "",
      image: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      salary: Yup.number().required("Salary is required"),
      // Add other validations as necessary
    }),
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
          formData.append(key, values[key]);
        });

        if (editEmployee) {
          // Edit Employee API call
          await axios.put(`https://arrc-tech.onrender.com/api/employees/${editEmployee._id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        } else {
          // Create Employee API call
          await axios.post("http://127.0.0.1:5000/api/employees", formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
        setModalOpen(false);
        fetchEmployees();
      } catch (error) {
        console.error("Error saving employee:", error);
      }
    },
  });

  // Open Modal to add a new employee
  const openModal = () => {
    setModalOpen(true);
    setEditEmployee(null); // Clear edit data
    formik.resetForm(); // Reset form fields
  };

  // Open Modal to edit an existing employee
  const handleEdit = (employee) => {
    setEditEmployee(employee);
    formik.setValues(employee);
    setModalOpen(true);
  };

  // Delete Employee
  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://arrc-tech.onrender.com/api/employees/${id}`);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className="p-6">
      {/* Breadcrumb */}
      <div className="flex justify-between mb-4">
        <div>Home &gt; Employees</div>
        <button
          onClick={openModal}
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Add New Employee
        </button>
      </div>

      {/* Employee Table */}
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2">Sr No</th>
            <th className="py-2">Image</th>
            <th className="py-2">Employee</th>
            <th className="py-2">Shift</th>
            <th className="py-2">Salary</th>
            <th className="py-2">Phone</th>
            <th className="py-2">Email</th>
            <th className="py-2">Address</th>
            <th className="py-2">Status</th>
            <th className="py-2">Updated At</th>
            <th className="py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(employees) && employees.length > 0 ? (
            employees.map((employee, index) => (
              <tr key={employee._id} className="text-center border-t">
                <td>{index + 1}</td>
                <td>
                  <img
                    src={employee.image}
                    alt={employee.name}
                    className="h-10 w-10 rounded-full"
                  />
                </td>
                <td>{employee.name}</td>
                <td>{employee.shift}</td>
                <td>₹{employee.salary}</td>
                <td>{employee.phone}</td>
                <td>{employee.email}</td>
                <td>{employee.presentAddress}</td>
                <td>{employee.status}</td>
                <td>{new Date(employee.updatedAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleEdit(employee)}
                    className="text-blue-500 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="text-center py-4">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4">
              {editEmployee ? "Edit Employee" : "Add New Employee"}
            </h2>
            <form onSubmit={formik.handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Department */}
                <div>
                  <label className="block text-gray-700">Department</label>
                  <select
                    name="department"
                    onChange={formik.handleChange}
                    value={formik.values.department}
                    className="border border-gray-300 p-2 w-full rounded"
                  >
                    <option value="">Select Department</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="sales">Sales</option>
                    {/* Add other departments as needed */}
                  </select>
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-gray-700">Designation</label>
                  <input
                    type="text"
                    name="designation"
                    onChange={formik.handleChange}
                    value={formik.values.designation}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Shift */}
                <div>
                  <label className="block text-gray-700">Shift</label>
                  <input
                    type="text"
                    name="shift"
                    onChange={formik.handleChange}
                    value={formik.values.shift}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                  {formik.touched.name && formik.errors.name ? (
                    <div className="text-red-500">{formik.errors.name}</div>
                  ) : null}
                </div>

                {/* Joining Date */}
                <div>
                  <label className="block text-gray-700">Joining Date</label>
                  <input
                    type="date"
                    name="joiningDate"
                    onChange={formik.handleChange}
                    value={formik.values.joiningDate}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Leaving Date */}
                <div>
                  <label className="block text-gray-700">Leaving Date</label>
                  <input
                    type="date"
                    name="leavingDate"
                    onChange={formik.handleChange}
                    value={formik.values.leavingDate}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500">{formik.errors.email}</div>
                  ) : null}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    onChange={formik.handleChange}
                    value={formik.values.phone}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                  {formik.touched.phone && formik.errors.phone ? (
                    <div className="text-red-500">{formik.errors.phone}</div>
                  ) : null}
                </div>

                {/* Present Address */}
                <div className="col-span-2 md:col-span-2 lg:col-span-4">
                  <label className="block text-gray-700">Present Address</label>
                  <textarea
                    name="presentAddress"
                    onChange={formik.handleChange}
                    value={formik.values.presentAddress}
                    className="border border-gray-300 p-2 w-full rounded"
                    rows="2"
                  />
                </div>

                {/* Permanent Address */}
                <div className="col-span-2 md:col-span-2 lg:col-span-4">
                  <label className="block text-gray-700">Permanent Address</label>
                  <textarea
                    name="permanentAddress"
                    onChange={formik.handleChange}
                    value={formik.values.permanentAddress}
                    className="border border-gray-300 p-2 w-full rounded"
                    rows="2"
                  />
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-gray-700">Emergency Contact</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    onChange={formik.handleChange}
                    value={formik.values.emergencyContact}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* NID Number */}
                <div>
                  <label className="block text-gray-700">NID Number</label>
                  <input
                    type="text"
                    name="nidNumber"
                    onChange={formik.handleChange}
                    value={formik.values.nidNumber}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-gray-700">Gender</label>
                  <select
                    name="gender"
                    onChange={formik.handleChange}
                    value={formik.values.gender}
                    className="border border-gray-300 p-2 w-full rounded"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Religion */}
                <div>
                  <label className="block text-gray-700">Religion</label>
                  <input
                    type="text"
                    name="religion"
                    onChange={formik.handleChange}
                    value={formik.values.religion}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Marital Status */}
                <div>
                  <label className="block text-gray-700">Marital Status</label>
                  <select
                    name="maritalStatus"
                    onChange={formik.handleChange}
                    value={formik.values.maritalStatus}
                    className="border border-gray-300 p-2 w-full rounded"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    onChange={formik.handleChange}
                    value={formik.values.dob}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Salary Type */}
                <div>
                  <label className="block text-gray-700">Salary Type</label>
                  <select
                    name="salaryType"
                    onChange={formik.handleChange}
                    value={formik.values.salaryType}
                    className="border border-gray-300 p-2 w-full rounded"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Hourly">Hourly</option>
                  </select>
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-gray-700">Salary</label>
                  <input
                    type="number"
                    name="salary"
                    onChange={formik.handleChange}
                    value={formik.values.salary}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-gray-700">Status</label>
                  <select
                    name="status"
                    onChange={formik.handleChange}
                    value={formik.values.status}
                    className="border border-gray-300 p-2 w-full rounded"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Account Holder Name */}
                <div>
                  <label className="block text-gray-700">Account Holder Name</label>
                  <input
                    type="text"
                    name="accountHolderName"
                    onChange={formik.handleChange}
                    value={formik.values.accountHolderName}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-gray-700">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    onChange={formik.handleChange}
                    value={formik.values.accountNumber}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Bank Name */}
                <div>
                  <label className="block text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    onChange={formik.handleChange}
                    value={formik.values.bankName}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Bank Identifier Code */}
                <div>
                  <label className="block text-gray-700">Bank Identifier Code</label>
                  <input
                    type="text"
                    name="bankIdentifierCode"
                    onChange={formik.handleChange}
                    value={formik.values.bankIdentifierCode}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Branch Location */}
                <div>
                  <label className="block text-gray-700">Branch Location</label>
                  <input
                    type="text"
                    name="branchLocation"
                    onChange={formik.handleChange}
                    value={formik.values.branchLocation}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Tax Payer ID */}
                <div>
                  <label className="block text-gray-700">Tax Payer ID</label>
                  <input
                    type="text"
                    name="taxPayerId"
                    onChange={formik.handleChange}
                    value={formik.values.taxPayerId}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>

                {/* Image Upload */}
                <div className="col-span-2 md:col-span-2 lg:col-span-4">
                  <label className="block text-gray-700">Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={(event) => {
                      formik.setFieldValue("image", event.currentTarget.files[0]);
                    }}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>
              </div>

              {/* Save and Cancel Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  {editEmployee ? "Update Employee" : "Add Employee"}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
