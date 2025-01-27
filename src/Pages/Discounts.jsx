import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHome, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { server } from "../redux/store";
import { Switch } from "@chakra-ui/react";

const Discounts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [discounts, setDiscounts] = useState([]);
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchDiscounts();
  }, [page]);

  const fetchDiscounts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${server}/discounts/getDiscounts?page=${page}&limit=${pageSize}`
      );
      setDiscounts(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (values, { resetForm }) => {
    try {
      if (editingDiscount) {
        await axios.put(
          `${server}/discounts/updateDiscount/${editingDiscount._id}`,
          values
        );
        toast.success("Discount updated successfully", {
          position: "top-center",
        });
      } else {
        await axios.post(`${server}/discounts/createDiscount`, values);
        toast.success("Discount added successfully", {
          position: "top-center",
        });
      }
      fetchDiscounts();
      resetForm();
      setModalOpen(false);
      setEditingDiscount(null);
    } catch (error) {
      toast.error("Failed to save Discount", {
        position: "top-center",
      });
    }
  };

  const handleEdit = (discount) => {
    setEditingDiscount(discount);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/discounts/deleteDiscount/${id}`);
      toast.success("Discount deleted successfully", {
        position: "top-center",
      });
      fetchDiscounts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSwitchChange = async (id, checked) => {
    try {
      await axios.put(`${server}/discounts/updateDefault/${id}`, {
        isDefault: checked,
      });

      toast.success("Default value updated successfully", {
        position: "top-center",
      });

      fetchDiscounts();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update default status",
        { position: "top-center" }
      );
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    type: Yup.string()
      .oneOf(["Percentage", "Fixed"], "Invalid type")
      .required("Type is required"),
    value: Yup.number()
      .min(0, "Value must be positive")
      .required("Value is required"),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Discounts</h1>
        <div className="flex items-center space-x-2">
          <FaHome />
          <span>Home &gt; Discounts</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center space-x-2"
          onClick={() => setModalOpen(true)}
        >
          <FaPlus />
          <span>Add New</span>
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-md px-4 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Sr No</th>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Value</th>
              <th className="px-4 py-2 border">Default</th>
              <th className="px-4 py-2 border">Updated At</th>
              <th className="px-4 py-2 border">Updated By</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {discounts
              .filter((d) =>
                d.title.toLowerCase().includes(search.toLowerCase())
              )
              .map((discount, index) => (
                <tr key={discount._id} className="text-center">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{discount.title}</td>
                  <td className="px-4 py-2 border">
                    {discount.value.toFixed(2)} %
                  </td>
                  <td className="px-4 py-2 border">
                    <Switch
                      colorScheme="teal"
                      isChecked={discount.isDefault}
                      onChange={(e) =>
                        handleSwitchChange(discount._id, e.target.checked)
                      }
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(discount.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border">{discount.updatedBy}</td>
                  <td className="px-4 py-2 border">
                    <button
                      className="text-blue-500 mr-2"
                      onClick={() => handleEdit(discount)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDelete(discount._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div>
          <span>Show 10 Entries</span>
        </div>
        <div>
          <button className="px-3 py-1 bg-gray-200">Prev</button>
          <button className="px-3 py-1 bg-gray-200 ml-2">1</button>
          <button className="px-3 py-1 bg-gray-200 ml-2">Next</button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingDiscount ? "Edit Discount" : "Add Discount"}
            </h2>
            <Formik
              initialValues={{
                title: editingDiscount ? editingDiscount.title : "",
                type: editingDiscount ? editingDiscount.type : "Percentage",
                value: editingDiscount ? editingDiscount.value : 0.0,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSave}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Title *
                    </label>
                    <Field
                      type="text"
                      name="title"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Type *
                    </label>
                    <Field
                      as="select"
                      name="type"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="Percentage">Percentage</option>
                      <option value="Fixed">Fixed</option>
                    </Field>
                    <ErrorMessage
                      name="type"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="value"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Value *
                    </label>
                    <Field
                      type="number"
                      name="value"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                    <ErrorMessage
                      name="value"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="bg-gray-500 text-white px-4 py-2 rounded-md"
                      onClick={() => {
                        setModalOpen(false);
                        setEditingDiscount(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      disabled={isSubmitting}
                    >
                      Save
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <ToastContainer />
        </div>
      )}
    </div>
  );
};

export default Discounts;
