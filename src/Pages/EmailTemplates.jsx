import React, { useEffect, useState } from "react";
import { server } from "../redux/store";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState({
    subject: "",
    body: "",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalTemplates, setTotalTemplates] = useState(0);

  // Fetch templates with pagination
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          `${server}/email-templates/getEmailTemplates?page=${page}&limit=${pageSize}`,
          {
            withCredentials: true,
          }
        );
        setTemplates(response.data.emailTemplates);
        setTotalTemplates(response.data.totalCount);
      } catch (error) {
        console.error("Error fetching email templates:", error);
      }
    };

    fetchTemplates();
  }, [page, pageSize]);

  const handleEditClick = (template) => {
    setCurrentTemplate(template);
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(totalTemplates / pageSize);

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <nav className="text-sm font-medium text-gray-700 mb-6">
        <ol className="list-reset flex">
          <li>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Home
            </a>
          </li>
          <li>
            <span className="mx-2"></span>
          </li>
          <li>Email Templates</li>
        </ol>
      </nav>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Email Templates</h1>

      {/* Pagination and Search */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="text-sm text-gray-700">
            Show
            <select
              className="ml-2 p-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={150}>150</option>
            </select>
            Entries
          </label>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                #
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Subject
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Updated At
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Updated By
              </th>
              <th className="px-4 py-2 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {templates &&
              templates.map((template, index) => (
                <tr key={template._id}>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {index + 1 + (page - 1) * pageSize}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {template.name}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {template.subject}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {template.updatedAt}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    {template.updatedBy}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-200">
                    <button
                      onClick={() => handleEditClick(template)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="mt-4 text-sm text-gray-700">
        Showing {Math.min((page - 1) * pageSize + 1, totalTemplates)} -{" "}
        {Math.min(page * pageSize, totalTemplates)} of {totalTemplates} entries
      </div>

      {/* Pagination Controls */}
      <div className="mt-2 flex justify-center">
        {[...Array(totalPages).keys()].map((pageNum) => (
          <button
            key={pageNum}
            className={`px-3 py-1 mx-1 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 ${
              page === pageNum + 1 ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => handlePageChange(pageNum + 1)}
          >
            {pageNum + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      <EditEmailTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={currentTemplate}
        setTemplate={setCurrentTemplate}
      />
    </div>
  );
};

const EditEmailTemplateModal = ({ isOpen, onClose, template, setTemplate }) => {
  const handleBodyChange = (content) => {
    setTemplate((prev) => ({
      ...prev,
      body: content,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Email Template</h2>

        <p className="text-sm text-green-500 mb-2">Parameters you can use:</p>
        <p className="text-sm text-gray-600 mb-4">
          {`{Button}, {Username}, {CompanyName}, {CompanyEmail}, {CompanyPhone}, {CompanyAddress}`}
        </p>

        {/* Form */}
        <form>
          {/* Subject */}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="subject"
            >
              Subject *
            </label>
            <input
              id="subject"
              type="text"
              value={template.subject}
              onChange={(e) =>
                setTemplate((prev) => ({
                  ...prev,
                  subject: e.target.value,
                }))
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="template"
            >
              Template
            </label>
            <ReactQuill
              id="template"
              theme="snow"
              value={template.body}
              onChange={handleBodyChange}
              className="mt-1 block w-full h-52 p-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end mt-10">
            <button
              type="button"
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none"
              onClick={() => onClose()}
            >
              Update
            </button>
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none"
              onClick={() => onClose()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailTemplates;
