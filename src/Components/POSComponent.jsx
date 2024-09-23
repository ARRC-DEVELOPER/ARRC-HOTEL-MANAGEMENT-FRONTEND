import React, { useState } from 'react';
import Modal from 'react-modal'; // Import react-modal

// Make sure to set the app element for accessibility
Modal.setAppElement('#root');

const POSComponent = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOrdersModalOpen, setOrdersModalOpen] = useState(false);
  const [isNoteModalOpen, setNoteModalOpen] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const openOrdersModal = () => setOrdersModalOpen(true);
  const closeOrdersModal = () => setOrdersModalOpen(false);

  const openNoteModal = () => setNoteModalOpen(true);
  const closeNoteModal = () => setNoteModalOpen(false);

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleOptionClick('Dine In')}>Dine In</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleOptionClick('Pick Up')}>Pick Up</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => handleOptionClick('Delivery')}>Delivery</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={openOrdersModal}>Orders</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={openNoteModal}>Note</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setSelectedOption(null)}>Reset</button>
      </div>

      <div className="border p-4 rounded">
        {selectedOption === 'Dine In' && (
          <div>
            <h2 className="text-xl font-bold">Dine In</h2>
            <ItemWithIcon title="Default Customer" />
            <ItemWithIcon title="Guest" />
            <ItemWithIcon title="Select Table" />
            <ItemWithIcon title="Select Waiter" />
          </div>
        )}

        {selectedOption === 'Pick Up' && (
          <div>
            <h2 className="text-xl font-bold">Pick Up</h2>
            <ItemWithIcon title="Default Customer" />
            <ItemWithIcon title="Select Waiter" />
          </div>
        )}

        {selectedOption === 'Delivery' && (
          <div>
            <h2 className="text-xl font-bold">Delivery</h2>
            <ItemWithIcon title="Default Customer" />
            <ItemWithIcon title="Select Driver" />
          </div>
        )}

        {selectedOption === null && (
          <div>
            <h2 className="text-xl font-bold">Select Order Type</h2>
            <ItemWithIcon title="Default Customer" />
          </div>
        )}
      </div>

      <OrdersModal isOpen={isOrdersModalOpen} onClose={closeOrdersModal} />
      <NoteModal isOpen={isNoteModalOpen} onClose={closeNoteModal} />
    </div>
  );
};

const ItemWithIcon = ({ title }) => (
  <div className="flex items-center justify-between py-2">
    <span>{title}</span>
    <span className="bg-gray-200 p-1 rounded cursor-pointer">
      🖉 {/* Replace with your preferred edit icon */}
    </span>
  </div>
);

const OrdersModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75"
      contentLabel="Orders Modal"
    >
      <div className="bg-white rounded-lg shadow-lg w-3/4 p-6">
        <h2 className="text-2xl font-bold mb-4">Orders</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Add your orders cards here */}
          <OrderCard orderNo="198" time="9:32 pm" table="T21" guest="1" status="Cooked" amount="$55.19" type="Dine In" />
          <OrderCard orderNo="199" time="4:57 am" table="T6" guest="774450" status="Cooked" amount="$559.01" type="Dine In" />
          <OrderCard orderNo="200" time="4:58 am" status="Cooked" amount="$557.73" type="Delivery" />
          <OrderCard orderNo="201" time="5:03 am" status="Cooked" amount="$41.67" type="Delivery" />
          <OrderCard orderNo="202" time="6:23 pm" status="In Progress" amount="$621.02" type="Pick Up" />
          <OrderCard orderNo="203" time="6:25 am" status="In Progress" amount="$20.75" type="Pick Up" />
          <OrderCard orderNo="204" time="12:22 pm" status="Cooked" amount="$27.42" type="Pick Up" />
          <OrderCard orderNo="205" time="11:19 pm" status="Cooked" amount="$615.65" type="Delivery" />
          <OrderCard orderNo="206" time="2:53 pm" table="T20" guest="1" status="Cooked" amount="$35.14" type="Dine In" />
          <OrderCard orderNo="1173" time="8:54 pm" status="Cooked" amount="$18.6" type="Pick Up" />
          <OrderCard orderNo="1174" time="10:54 am" table="T6" guest="1" status="Cooked" amount="$5.16" type="Dine In" />
          <OrderCard orderNo="1175" time="8:55 pm" status="In Progress" amount="$21.94" type="Delivery" />
          <OrderCard orderNo="2173" time="6:33 pm" table="T15" guest="1" status="In Progress" amount="$7.78" type="Dine In" />
          <OrderCard orderNo="2174" time="8:57 am" status="In Progress" amount="$14.01" type="Delivery" />
          <OrderCard orderNo="2175" time="11:02 pm" table="T21" guest="1" status="Cooked" amount="$18.64" type="Dine In" />
          <OrderCard orderNo="2176" time="4:54 pm" status="In Progress" amount="$559.01" type="Pick Up" />
          <OrderCard orderNo="2178" time="10:29 pm" table="T6" guest="1" status="In Progress" amount="$55.19" type="Dine In" />
        </div>
        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
};

const OrderCard = ({ orderNo, time, table, guest, status, amount, type }) => (
  <div className="border p-4 rounded-lg shadow-sm">
    <h3 className="font-bold">Order No. {orderNo}</h3>
    <p>{time}</p>
    {table && <p>Table {table}</p>}
    {guest && <p>Guest {guest}</p>}
    <p>Status: {status}</p>
    <p className="font-bold">{amount}</p>
    <p>{type}</p>
  </div>
);

const NoteModal = ({ isOpen, onClose }) => {
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    // Handle note submission
    console.log('Note:', note);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center"
      overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75"
      contentLabel="Note Modal"
    >
      <div className="bg-white rounded-lg shadow-lg w-1/2 p-6">
        <h2 className="text-2xl font-bold mb-4">Enter Note</h2>
        <textarea
          className="w-full border p-2 rounded"
          rows="4"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Enter your note here..."
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button className="bg-gray-300 text-black px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </Modal>
  );
};

export default POSComponent;
