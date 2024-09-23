import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const EditModal = ({ ingredient, onClose, onSave }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Item name is required'),
    price: Yup.number()
      .typeError('Price must be a number')
      .required('Price is required')
      .positive('Price must be greater than zero'),
    quantity: Yup.number()
      .typeError('Quantity must be a number')
      .required('Quantity is required')
      .integer('Quantity must be an integer')
      .min(1, 'Quantity must be at least 1'),
    alertQuantity: Yup.number()
      .typeError('Alert Quantity must be a number')
      .integer('Alert Quantity must be an integer')
      .min(1, 'Alert Quantity must be at least 1'),
  });

  const handleSubmit = (values) => {
    console.log(values);
    onSave(values);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Edit Ingredient</h2>
        <Formik
          initialValues={{
            name: ingredient.name || '',
            price: ingredient.price || '',
            quantity: ingredient.quantity || '',
            alertQuantity: ingredient.alertQuantity || '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="form-group">
                <label htmlFor="name">Item Name</label>
                <Field type="text" name="name" className="form-control" />
                <ErrorMessage name="name" component="div" className="text-red-500" />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price</label>
                <Field type="text" name="price" className="form-control" />
                <ErrorMessage name="price" component="div" className="text-red-500" />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity</label>
                <Field type="text" name="quantity" className="form-control" />
                <ErrorMessage name="quantity" component="div" className="text-red-500" />
              </div>

              <div className="form-group">
                <label htmlFor="alertQuantity">Alert Quantity</label>
                <Field type="text" name="alertQuantity" className="form-control" />
                <ErrorMessage name="alertQuantity" component="div" className="text-red-500" />
              </div>

              <div className="form-group flex justify-between">
                <button type="button" onClick={onClose} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded">
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditModal;
