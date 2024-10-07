import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../redux/store";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  FaChartLine,
  FaShoppingCart,
  FaMoneyBill,
  FaBox,
} from "react-icons/fa";

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [saleSummary, setSaleSummary] = useState({});

  useEffect(() => {
    const fetchSalesSummary = async () => {
      try {
        const response = await axios.get(
          `${server}/salesSummary/todays-saleSummary`,
          {
            headers: {
              "Content-type": "application/json",
            },
            withCredentials: true,
          }
        );
        setSaleSummary(response.data.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchSalesSummary();
  }, []);

  // Chart data and options
  const lineChartData = {
    labels: [
      "Aug 2023",
      "Sep 2023",
      "Oct 2023",
      "Nov 2023",
      "Dec 2023",
      "Jan 2024",
      "Feb 2024",
      "Mar 2024",
      "Apr 2024",
      "May 2024",
      "Jun 2024",
      "Jul 2024",
    ],
    datasets: [
      {
        label: "Sales",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, saleSummary.overAllSales],
        fill: true,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        tension: 0.4,
      },
      {
        label: "Purchases",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, saleSummary.overAllPurchases],
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, saleSummary.overAllExpenses],
        fill: true,
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        tension: 0.4,
      },
      {
        label: "Discounts",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, saleSummary.discount],
        fill: true,
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.4,
      },
      {
        label: "Taxes",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, saleSummary.tax],
        fill: true,
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: [
      "Aug 2023",
      "Sep 2023",
      "Oct 2023",
      "Nov 2023",
      "Dec 2023",
      "Jan 2024",
      "Feb 2024",
      "Mar 2024",
      "Apr 2024",
      "May 2024",
      "Jun 2024",
      "Jul 2024",
    ],
    datasets: [
      {
        label: "Sales",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, saleSummary.total],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Taxes",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, saleSummary.tax],
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
      {
        label: "Discounts",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, saleSummary.discount],
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Dine In", "Pick Up", "Delivery"],
    datasets: [
      {
        data: [
          saleSummary?.orderTypeSummary?.DineIn || 0,
          saleSummary?.orderTypeSummary?.Pickup || 0,
          saleSummary?.orderTypeSummary?.Delivery || 0,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Sale by Order Type (This Month)",
      },
    },
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <p className="text-2xl">{saleSummary.overAllOrders}</p>
            <p className="text-sm text-gray-500">All Time</p>
          </div>
          <div className="w-16 h-16 rounded-full shadow-lg bg-green-100 flex items-center justify-center">
            <FaBox className="text-green-500 text-3xl" />
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Total Sales</h2>
            <p className="text-2xl">
              ₹
              {saleSummary.overAllSales
                ? saleSummary.overAllSales.toFixed(2)
                : saleSummary.overAllSales}
            </p>
            <p className="text-sm text-gray-500">All Time</p>
          </div>
          <div className="w-16 h-16 rounded-full shadow-lg bg-blue-100 flex items-center justify-center">
            <FaChartLine className="text-blue-500 text-3xl" />
          </div>
        </div>

        {/* Total Purchases */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Total Purchases</h2>
            <p className="text-2xl">
              ₹
              {saleSummary.overAllPurchases
                ? saleSummary.overAllPurchases.toFixed(2)
                : saleSummary.overAllPurchases}
            </p>
            <p className="text-sm text-gray-500">All Time</p>
          </div>
          <div className="w-16 h-16 rounded-full shadow-lg bg-green-100 flex items-center justify-center">
            <FaShoppingCart className="text-green-500 text-3xl" />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Total Expenses</h2>
            <p className="text-2xl">
              ₹
              {saleSummary.overAllExpenses
                ? saleSummary.overAllExpenses.toFixed(2)
                : saleSummary.overAllExpenses}
            </p>
            <p className="text-sm text-gray-500">All Time</p>
          </div>
          <div className="w-16 h-16 rounded-full shadow-lg bg-red-100 flex items-center justify-center">
            <FaMoneyBill className="text-red-500 text-3xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Line Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <Line data={lineChartData} />
        </div>

        {/* Today Report */}
        <div className="bg-white shadow rounded-lg p-6 mb-5">
          <h3 className="text-xl font-bold mb-4">Today Report</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm text-gray-500">Sales</h4>
              <p className="text-xl font-bold">₹{saleSummary.total}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Orders</h4>
              <p className="text-xl font-bold">{saleSummary.orderQuantity}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Purchases</h4>
              <p className="text-xl font-bold">₹{saleSummary.purchase}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Expenses</h4>
              <p className="text-xl font-bold">₹{saleSummary.expense}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Customer Due</h4>
              <p className="text-xl font-bold">₹{saleSummary.customerDue && saleSummary.customerDue.toFixed(2)}</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-500">Supplier Due</h4>
              <p className="text-xl font-bold">₹{saleSummary.supplierDue && saleSummary.supplierDue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-10">
        {/* Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Bar data={barChartData} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
