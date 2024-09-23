import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterCash = () => {
    // const handleEndWorkPeriod = () => {
    //     // Show error message using toastify
    //     toast.error("You can't end work before settled order", {
    //         position: toast.POSITION.TOP_RIGHT,
    //         autoClose: 5000,
    //         hideProgressBar: false,
    //         closeOnClick: true,
    //         pauseOnHover: true,
    //         draggable: true,
    //     });
    // };

    return (
        <div className="p-4 bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Work Period</h2>
                <div className="space-y-4 mb-4">
                    <div className="flex justify-between">
                        <span className="font-semibold">Start At:</span>
                        <span>18/7/2024 7:17:01 pm</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Start By:</span>
                        <span>@admin</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Opening Balance:</span>
                        <span className="text-green-500">$1.00</span>
                    </div>
                </div>
                <button 
                    // onClick={handleEndWorkPeriod} 
                    className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    End Work Period
                </button>
            </div>
            {/* <ToastContainer /> */}
        </div>
    );
};

export default RegisterCash;
