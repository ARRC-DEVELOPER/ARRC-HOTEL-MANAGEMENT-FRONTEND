import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { server } from "../redux/store";
import "react-toastify/dist/ReactToastify.css";

const AddPurchase = () => {
  const [cart, setCart] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${server}/suppliers/getSuppliers`);
        if (response.data) {
          setSuppliers(response.data);
        } else {
          toast.error("No suppliers data available.");
        }
      } catch (error) {
        toast.error("Failed to fetch suppliers.");
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get(
          `${server}/paymentmethods/getPaymentMethods`
        );
        if (response.data) {
          setPaymentMethods(response.data);
        } else {
          toast.error("No payment methods data available.");
        }
      } catch (error) {
        toast.error("Failed to fetch payment methods.");
      }
    };

    const fetchIngredients = async () => {
      try {
        const response = await axios.get(
          `${server}/ingredients/getAllIngredients`
        );
        if (response.data) {
          setIngredients(response.data);
        } else {
          toast.error("No ingredients data available.");
        }
      } catch (error) {
        toast.error("Failed to fetch ingredients.");
      }
    };

    fetchSuppliers();
    fetchPaymentMethods();
    fetchIngredients();
  }, []);

  const formik = useFormik({
    initialValues: {
      supplierId: "",
      paymentMethod: "",
      ingredientId: "",
      invoiceNo: "",
      purchaseDate: "",
      description: "",
      paidAmount: 0,
    },
    validationSchema: Yup.object({
      supplierId: Yup.string().required("Supplier is required"),
      invoiceNo: Yup.string()
        .required("Invoice number is required")
        .max(150, "Invoice number must be 150 characters or less"),
      paymentMethod: Yup.string()
        .required("Payment method is required")
        .max(150, "Payment method must be 150 characters or less"),
      purchaseDate: Yup.date().required("Purchase date is required"),
      description: Yup.string().max(
        500,
        "Description must be 500 characters or less"
      ),
      paidAmount: Yup.number()
        .required("Paid amount is required")
        .min(0, "Paid amount must be a positive number"),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post(`${server}/purchase/addPurchase`, {
          ...values,
          totalBill,
          dueAmount,
        });

        toast.success("Purchase submitted successfully!");
        navigate("/purchasehistory");
      } catch (error) {
        toast.error("Failed to submit the purchase.");
      }
    },
  });

  const addItemToCart = (item) => {
    setCart([...cart, item]);
    setTotalBill(totalBill + item.total);
    setDueAmount(totalBill + item.total - formik.values.paidAmount);
  };

  const handlePaidAmountChange = (e) => {
    const paidAmount = parseFloat(e.target.value) || 0;
    formik.setFieldValue("paidAmount", paidAmount);
    setDueAmount(totalBill - paidAmount);
  };

  const handleIngredientChange = (e) => {
    const selectedItem = ingredients.find(
      (item) => item._id === e.target.value
    );

    // Set ingredientId in Formik state
    formik.setFieldValue("ingredientId", e.target.value);

    if (selectedItem) {
      const newItem = {
        itemName: selectedItem.name,
        stock: selectedItem.stock,
        quantity: 1,
        price: selectedItem.price,
        total: selectedItem.price,
      };
      addItemToCart(newItem);
    }
  };

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Purchases", path: "/" },
    { label: "Add Purchase", path: "/addpurchase" },
  ];

  return (
    <>
      <div className="bg-gray-100 pl-20px">
        <h1 className="text-2xl font-semibold text-gray-800 mb-5">
          Add Purchase
        </h1>

        {/* Breadcrumb */}
        <div className="flex py-6 rounded-md" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 mx-5">
            {breadcrumbItems.map((item, index) => (
              <li key={index} className="inline-flex items-center">
                {index !== breadcrumbItems.length - 1 ? (
                  <Link
                    to={item.path}
                    className="text-gray-700 hover:text-gray-900 text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-500 text-sm font-medium">
                    {item.label}
                  </span>
                )}
                {index !== breadcrumbItems.length - 1 && (
                  <svg
                    className="w-4 h-4 mx-2 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="max-w-6xl mx-auto p-6 mt-5 bg-white shadow-md rounded-md">
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">
                  Supplier <span className="text-red-500">*</span>
                </label>
                <select
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  name="supplierId"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.supplierId}
                >
                  {suppliers.length > 0 ? (
                    suppliers
                      .filter((supplier) => supplier.supplierName)
                      .map((supplier) => (
                        <option key={supplier._id} value={supplier._id}>
                          {supplier.supplierName}
                        </option>
                      ))
                  ) : (
                    <option value="">No suppliers available</option>
                  )}
                </select>
                {formik.touched.supplierId && formik.errors.supplierId ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.supplierId}
                  </div>
                ) : null}
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">
                  Invoice No. <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  name="invoiceNo"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.invoiceNo}
                />
                {formik.touched.invoiceNo && formik.errors.invoiceNo ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.invoiceNo}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">
                  Payment Method <span className="text-red-500">*</span>
                </label>
                <div>
                  {paymentMethods.length > 0 ? (
                    <select
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      name="paymentMethod"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.paymentMethod}
                    >
                      <option value="">Choose Option</option>
                      {paymentMethods.map((method) => (
                        <option key={method._id} value={method._id}>
                          {method.title}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p>No payment methods available</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">
                  Purchase Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  name="purchaseDate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.purchaseDate}
                />
                {formik.touched.purchaseDate && formik.errors.purchaseDate ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.purchaseDate}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="form-group mt-6">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                name="description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
              />
              {formik.touched.description && formik.errors.description ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.description}
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">
                  Ingredient
                </label>
                <select
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  onChange={handleIngredientChange}
                >
                  <option value="">Choose Option</option>
                  {ingredients.length > 0 ? (
                    ingredients.map((ingredient) => (
                      <option key={ingredient._id} value={ingredient._id}>
                        {ingredient.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No ingredients available</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700">
                  Paid Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  name="paidAmount"
                  onChange={handlePaidAmountChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.paidAmount}
                />
                {formik.touched.paidAmount && formik.errors.paidAmount ? (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.paidAmount}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cart.length > 0 ? (
                    cart.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.itemName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₹{item.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₹{item.total}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No items in cart
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="mt-4">
                <div className="flex justify-between">
                  <span className="text-lg font-medium">
                    Total Bill: ₹{totalBill.toFixed(2)}
                  </span>
                  <span className="text-lg font-medium">
                    Due Amount: ₹{dueAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Purchase
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AddPurchase;
