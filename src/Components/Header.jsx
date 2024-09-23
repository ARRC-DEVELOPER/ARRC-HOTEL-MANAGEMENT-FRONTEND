import { useState } from 'react';
import { FaEdit, FaPlus, FaMinus, FaTrash, FaCog } from 'react-icons/fa';

const Header = () => {
    const [selectedTab, setSelectedTab] = useState('dineIn');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleTabClick = (tab) => {
        setSelectedTab(tab);
        if (tab === 'orders') {
            setIsModalOpen(true);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between p-4 bg-gray-200">
                <div className="flex space-x-4">
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleTabClick('dineIn')}>
                        <span>Dine In</span>
                        <FaEdit className="cursor-pointer" />
                    </div>
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleTabClick('pickUp')}>
                        <span>Pick Up</span>
                        <FaEdit className="cursor-pointer" />
                    </div>
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleTabClick('delivery')}>
                        <span>Delivery</span>
                        <FaEdit className="cursor-pointer" />
                    </div>
                    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleTabClick('orders')}>
                        <span>Orders</span>
                        <FaEdit className="cursor-pointer" />
                    </div>
                </div>
            </div>
            
            {/* Render content based on selected tab */}
            <div className="p-4">
                {selectedTab === 'dineIn' && (
                    <div>
                        <div className="flex items-center space-x-2">
                            <span>Dine In</span>
                            <FaEdit className="cursor-pointer" />
                        
                            <span>Default Customer</span>
                            <FaEdit className="cursor-pointer" />
                        
                          
                            <span>Select Table</span>
                            <FaEdit className="cursor-pointer" />
                            <span>Select Waiter</span>
                            <FaEdit className="cursor-pointer" />
                        </div>
                    </div>
                )}
                {selectedTab === 'pickUp' && (
                    <div>
                        <div className="flex items-center space-x-2">
                            <span>Pick Up</span>
                            <FaEdit className="cursor-pointer" />
                            <span>Default Customer</span>
                            <FaEdit className="cursor-pointer" />
                            <span>Select Waiter</span>
                            <FaEdit className="cursor-pointer" />
                        </div>
                    </div>
                )}
                {selectedTab === 'delivery' && (
                    <div>
                        <div className="flex items-center space-x-2">
                            <span> # Delivery</span>
                            <FaEdit className="cursor-pointer" />
                            <span>Default Customer</span>
                            <FaEdit className="cursor-pointer" />
                            <span>Select Driver</span>
                            <FaEdit className="cursor-pointer" />
                    </div>
                    </div>
                )}
                {selectedTab === 'orders' && (
                    <div>
                        <button onClick={() => setIsModalOpen(true)}>Show Orders</button>
                    </div>
                )}
                
            </div>

            {/* Modal for Orders */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-lg font-bold">Orders</h2>
                        <div className="mt-4">
                            <div className="flex justify-between items-center p-2 border-b">
                                <span>Running Orders</span>
                            </div>
                            <div className="mt-2 p-2 border rounded">
                                <p>Order No. 198</p>
                                <p>9:32 pm</p>
                            </div>
                        </div>
                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
