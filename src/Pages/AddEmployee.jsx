import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";

const AddEmployee = ({ navigate }) => {
  const initialValues = {
    name: "",
    department: "",
    designation: "",
    shift: "",
    joiningDate: "",
    leavingDate: "",
    email: "",
    phone: "",
    presentAddress: "",
    permanentAddress: "",
    emergencyContact: "",
    nidNumber: "",
    gender: "",
    religion: "",
    maritalStatus: "",
    dob: "",
    salaryType: "",
    salary: "",
    status: "",
    image: null,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    department: Yup.string().required("Required"),
    designation: Yup.string().required("Required"),
    shift: Yup.string().required("Required"),
    joiningDate: Yup.date().required("Required"),
    email: Yup.string().email("Invalid email format").required("Required"),
    phone: Yup.string().required("Required"),
    presentAddress: Yup.string().required("Required"),
    nidNumber: Yup.string().required("Required"),
    salary: Yup.number().required("Required"),
    status: Yup.string().required("Required"),
  });

  const onSubmit = (values) => {
    // Form data submission
    axios.post('http://127.0.0.1:5000/api/employees', values)
      .then(response => {
        toast.success("Employee added successfully");
        navigate("/admin/employee");
      })
      .catch(error => {
        toast.error("Failed to add employee");
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Add Employee</h1>
      <div className="flex justify-between items-center my-4">
        <div className="text-gray-600">Home &gt; Employees &gt; Add Employee</div>
      </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="bg-white p-6 shadow-md rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Name *</label>
                <Field name="name" className="w-full p-2 border rounded" />
                <ErrorMessage name="name" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Department *</label>
                <Field name="department" as="select" className="w-full p-2 border rounded">
                  <option value="">Select Department</option>
                  <option value="kitchen">Kitchen</option>
                  <option value="food">Food</option>
                </Field>
                <ErrorMessage name="department" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Designation *</label>
                <Field name="designation" className="w-full p-2 border rounded" />
                <ErrorMessage name="designation" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Shift *</label>
                <Field name="shift" className="w-full p-2 border rounded" />
                <ErrorMessage name="shift" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Joining Date *</label>
                <Field name="joiningDate" type="date" className="w-full p-2 border rounded" />
                <ErrorMessage name="joiningDate" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Leaving Date</label>
                <Field name="leavingDate" type="date" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label>Email *</label>
                <Field name="email" type="email" className="w-full p-2 border rounded" />
                <ErrorMessage name="email" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Phone *</label>
                <Field name="phone" className="w-full p-2 border rounded" />
                <ErrorMessage name="phone" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Present Address *</label>
                <Field name="presentAddress" className="w-full p-2 border rounded" />
                <ErrorMessage name="presentAddress" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Permanent Address *</label>
                <Field name="permanentAddress" className="w-full p-2 border rounded" />
                <ErrorMessage name="permanentAddress" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Emergency Contact *</label>
                <Field name="emergencyContact" className="w-full p-2 border rounded" />
                <ErrorMessage name="emergencyContact" component="div" className="text-red-600" />
              </div>
              <div>
                <label>NID Number *</label>
                <Field name="nidNumber" className="w-full p-2 border rounded" />
                <ErrorMessage name="nidNumber" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Gender *</label>
                <Field name="gender" as="select" className="w-full p-2 border rounded">
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Field>
                <ErrorMessage name="gender" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Religion</label>
                <Field name="religion" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label>Marital Status *</label>
                <Field name="maritalStatus" as="select" className="w-full p-2 border rounded">
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </Field>
                <ErrorMessage name="maritalStatus" component="div" className="text-red-600" />
              </div>
              <div>
                <label>DOB *</label>
                <Field name="dob" type="date" className="w-full p-2 border rounded" />
                <ErrorMessage name="dob" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Salary Type *</label>
                <Field name="salaryType" as="select" className="w-full p-2 border rounded">
                  <option value="">Select Salary Type</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Monthly">Monthly</option>
                </Field>
                <ErrorMessage name="salaryType" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Salary *</label>
                <div className="relative">
                  <span className="absolute left-0 top-0 bottom-0 pl-2 pt-2">₹</span>
                  <Field name="salary" type="number" className="w-full p-2 pl-8 border rounded" />
                </div>
                <ErrorMessage name="salary" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Status *</label>
                <Field name="status" as="select" className="w-full p-2 border rounded">
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Field>
                <ErrorMessage name="status" component="div" className="text-red-600" />
              </div>
              <div>
                <label>Image</label>
                <input
                  name="image"
                  type="file"
                  onChange={(event) => setFieldValue("image", event.currentTarget.files[0])}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mr-2">
                Save
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/employee")}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddEmployee;
