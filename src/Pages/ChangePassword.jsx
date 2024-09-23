import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaHome } from 'react-icons/fa';

const ChangePassword = () => {
    const validationSchema = Yup.object({
        oldPassword: Yup.string().required('Old Password is required'),
        newPassword: Yup.string()
            .min(6, 'New Password must be at least 6 characters')
            .required('New Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm Password is required')
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await axios.post('http://127.0.0.1:5000/api/change-password', values);
            toast.success('Password changed successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to change password');
        }
        setSubmitting(false);
    };

    return (
        <div className="p-6">
            <ToastContainer />
            <div className="flex items-center mb-6 space-x-2">
                <FaHome />
                <span>Home &gt; Change Password</span>
            </div>

            <h1 className="text-2xl font-semibold mb-6">Change Password</h1>

            <Formik
                initialValues={{
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="bg-white p-6 rounded-md shadow-md">
                        <div className="mb-4">
                            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700">
                                Old Password *
                            </label>
                            <Field
                                type="password"
                                name="oldPassword"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1"
                            />
                            <ErrorMessage name="oldPassword" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                New Password *
                            </label>
                            <Field
                                type="password"
                                name="newPassword"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1"
                            />
                            <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password *
                            </label>
                            <Field
                                type="password"
                                name="confirmPassword"
                                className="mt-1 block w-full border border-gray-300 rounded-md px-2 py-1"
                            />
                            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                type="reset"
                                className="bg-gray-300 px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            >
                                {isSubmitting ? 'Changing...' : 'Change Password'}
                            </button>
                           
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ChangePassword;
