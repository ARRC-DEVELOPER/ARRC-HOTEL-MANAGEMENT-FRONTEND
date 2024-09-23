// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { FaHome, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

// const Table = () => {
//   const [tables, setTables] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editTable, setEditTable] = useState(null);

//   // Fetch the list of tables when the component is mounted
//   useEffect(() => {
//     fetchTables();
//   }, []);

//   const fetchTables = async () => {
//     try {
//       const response = await api.get('http://127.0.0.1:5000/api/tables/tables');
//       setTables(response.data);
//     } catch (error) {
//       console.error('Error fetching tables:', error);
//     }
//   };

//   // Function to delete a table by ID
//   const deleteTable = async (id) => {
//     try {
//       await api.delete(`http://127.0.0.1:5000/api/tables/${id}`);
//       fetchTables(); // Refresh the table list after deletion
//     } catch (error) {
//       console.error('Error deleting table:', error);
//     }
//   };

//   // Formik setup for handling form submissions
//   const formik = useFormik({
//     initialValues: {
//       tableName: '',
//       image: null,
//       reserved: false,
//     },
//     validationSchema: Yup.object({
//       tableName: Yup.string().required('Table Name is required'),
//       image: Yup.mixed().required('Image is required'),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       try {
//         const formData = new FormData();
//         formData.append('tableName', values.tableName);
//         formData.append('image', values.image);
//         formData.append('reserved', values.reserved);

//         if (editTable) {
//           // Update existing table
//           await api.put(`http://127.0.0.1:5000/api/tables/${editTable._id}`, formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           });
//         } else {
//           // Create new table
//           await api.post('/tables', formData, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           });
//         }

//         fetchTables();
//         resetForm();
//         setShowModal(false);
//         setEditTable(null);
//       } catch (error) {
//         console.error('Error saving table:', error.response ? error.response.data : error.message);
//       }
//     },
//   });

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <div className="text-xl font-bold flex items-center">
//           <FaHome className="mr-2" />
//           Home &gt; Tables
//         </div>
//         <button
//           onClick={() => {
//             setEditTable(null);
//             setShowModal(true);
//           }}
//           className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 flex items-center"
//         >
//           <FaPlus className="mr-2" /> Add New
//         </button>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {tables.map((table) => (
//           <div
//             key={table._id}
//             className="border rounded-lg p-4 bg-white shadow-sm relative"
//           >
//             <img
//               src={`http://127.0.0.1:8080/uploads/${table.image}`}
//               alt={table.tableName}
//               className="w-full h-32 object-cover rounded"
//             />
//             <div className="mt-2">
//               <h3 className="text-lg font-semibold">{table.tableName}</h3>
//               <div className="flex mt-2">
//                 <button
//                   onClick={() => {
//                     setEditTable(table);
//                     setShowModal(true);
//                   }}
//                   className="text-green-500 hover:text-green-700 mr-2"
//                 >
//                   <FaEdit />
//                 </button>
//                 <button
//                   onClick={() => deleteTable(table._id)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   <FaTrash />
//                 </button>
//               </div>
//             </div>
//             <div className="absolute top-0 right-0 m-2">
//               {table.reserved && (
//                 <span className="bg-yellow-500 text-white px-2 py-1 rounded">
//                   Reserved
//                 </span>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-bold mb-4">{editTable ? 'Edit Table' : 'Add Table'}</h2>
//             <form onSubmit={formik.handleSubmit}>
//               <div className="mb-4">
//                 <label className="block text-sm font-bold mb-2">Table Name *</label>
//                 <input
//                   type="text"
//                   name="tableName"
//                   onChange={formik.handleChange}
//                   onBlur={formik.handleBlur}
//                   value={formik.values.tableName}
//                   className="border rounded w-full py-2 px-3"
//                 />
//                 {formik.touched.tableName && formik.errors.tableName ? (
//                   <div className="text-red-500 text-sm mt-1">{formik.errors.tableName}</div>
//                 ) : null}
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-bold mb-2">Image *</label>
//                 <input
//                   type="file"
//                   name="image"
//                   onChange={(event) =>
//                     formik.setFieldValue('image', event.currentTarget.files[0])
//                   }
//                   className="border rounded w-full py-2 px-3"
//                 />
//                 {formik.touched.image && formik.errors.image ? (
//                   <div className="text-red-500 text-sm mt-1">{formik.errors.image}</div>
//                 ) : null}
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-bold mb-2">Reserved</label>
//                 <input
//                   type="checkbox"
//                   name="reserved"
//                   onChange={formik.handleChange}
//                   checked={formik.values.reserved}
//                   className="mr-2 leading-tight"
//                 />
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//                 >
//                   {editTable ? 'Update' : 'Save'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Table;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FaHome, FaSave, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

// Set Modal root element
Modal.setAppElement('#root');

const API_URL = 'https://arrc-tech.onrender.com/api/tables';

const Table = () => {
  const [tables, setTables] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableName, setTableName] = useState('');
  const [image, setImage] = useState(null);
  const [reserved, setReserved] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await axios.get('https://arrc-tech.onrender.com/api/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    }
  };

  const handleAddNewClick = () => {
    setTableName('');
    setImage(null);
    setReserved(false);
    setSelectedTable(null);
    setEditMode(false);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const formData = new FormData();
    formData.append('tableName', tableName);
    formData.append('reserved', reserved);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (editMode) {
        // Update existing table
        await axios.put(`${'https://arrc-tech.onrender.com/api/tables'}/${selectedTable._id}`, formData);
      } else {
        // Create new table
        await axios.post('https://arrc-tech.onrender.com/api/tables', formData);
      }
      fetchTables();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save table:', error);
    }
  };

  const handleEdit = (table) => {
    setTableName(table.tableName);
    setReserved(table.reserved);
    setSelectedTable(table);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${'https://arrc-tech.onrender.com/api/tables'}/${id}`);
      fetchTables();
    } catch (error) {
      console.error('Failed to delete table:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Breadcrumbs */}
      <div className="flex items-center justify-between bg-gray-200 p-4 rounded mb-6">
        <div className="flex items-center">
          <FaHome className="text-gray-600 mr-2" />
          <span className="text-gray-600">Home</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 font-semibold">Table</span>
        </div>
        <button
          onClick={handleAddNewClick}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add New
        </button>
      </div>

      {/* Table List */}
      <div className="grid grid-cols-4 gap-4">
        {tables.map((table) => (
          <div key={table._id} className="bg-white p-4 border rounded shadow">
            <h3 className="text-lg font-semibold">{table.tableName}</h3>
            {table.image && (
              <img
                src={table.image}
                alt={table.tableName}
                className="mt-2 h-29 object-cover"
              />
            )}
            <p className="mt-2">
              {table.reserved ? 'Reserved' : 'Available'}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleEdit(table)}
                className="px-4 py-2 bg-yellow-500 text-white rounded flex items-center mr-2"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
              <button
                onClick={() => handleDelete(table._id)}
                className="px-4 py-2 bg-red-600 text-white rounded flex items-center"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white p-6 rounded shadow-lg max-w-lg mx-auto relative"
      >
        <h2 className="text-xl font-bold mb-4">
          {editMode ? 'Edit Table' : 'Add Table'}
        </h2>
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Table Name</label>
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mt-4">
          <label className="block text-gray-700 mb-2">Image</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full"
          />
        </div>
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={reserved}
              onChange={(e) => setReserved(e.target.checked)}
              className="mr-2"
            />
            Reserved
          </label>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded flex items-center"
          >
            <FaSave className="mr-2" /> Save
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Table;
