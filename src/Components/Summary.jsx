import React, { useState, useEffect } from 'react';
import { FaEdit } from "react-icons/fa";
import axios from 'axios';

const Summary = () => {
    const [subTotal, setSubTotal] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [charge, setCharge] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    // Fetch discount from the API
    const fetchDiscount = async () => {
        try {
            const response = await axios.get('https://arrc-tech.onrender.com/api/discount'); // Replace with your API endpoint for discount
            setDiscount(response.data.discount);
        } catch (error) {
            console.error('Error fetching discount:', error);
        }
    };

    // Fetch charge from the API
    const fetchCharge = async () => {
        try {
            const response = await axios.get('https://arrc-tech.onrender.com/api/charges'); // Replace with your API endpoint for charge
            setCharge(response.data.charge);
        } catch (error) {
            console.error('Error fetching charge:', error);
        }
    };

    // Fetch tax from the API
    const fetchTax = async () => {
        try {
            const response = await axios.get('https://arrc-tech.onrender.com/api/tax'); // Replace with your API endpoint for tax
            setTax(response.data.tax);
        } catch (error) {
            console.error('Error fetching tax:', error);
        }
    };

    // Fetch charges, taxes, and discounts on component mount
    useEffect(() => {
        fetchDiscount();
        fetchCharge();
        fetchTax();
    }, []);

    // Recalculate total whenever subTotal, discount, charge, or tax change
    useEffect(() => {
        const calculateTotal = () => {
            const calculatedTotal = subTotal - (subTotal * (discount / 100)) + (subTotal * (charge / 100)) + (subTotal * (tax / 100));
            setTotal(calculatedTotal);
        };

        calculateTotal();
    }, [subTotal, discount, charge, tax]);

    return (
        <div className="p-4 bg-white shadow-md mt-4">
            <div className="grid grid-cols-2 gap-4">
                <div>Sub Total: ${subTotal.toFixed(2)}</div>
                <div className="flex items-center">
                    Discount: {discount}%
                    <FaEdit className="cursor-pointer ml-2" />
                </div>
                <div className="flex items-center">
                    Charge: {charge}%
                    <FaEdit className="cursor-pointer ml-2" />
                </div>
                <div className="flex items-center">
                    Tax: {tax}%
                    <FaEdit className="cursor-pointer ml-2" />
                </div>
                <div>Total: ${total.toFixed(2)}</div>
            </div>
        </div>
    );
};

export default Summary;
