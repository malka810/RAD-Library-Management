import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaRegEnvelope } from "react-icons/fa";
import type { Lending } from "../../types/Lending";

interface Props {
  lendings: Lending[];
  onEdit: (lending: Lending) => void;
  onDelete: (lending: Lending) => void;
  getReaderName: (id: string | { _id: string; name: string }) => string;
  getBookTitle: (id: string | { _id: string; title: string }) => string;
  onSendReminder: (lending: Lending) => void;
}

const OverdueTable: React.FC<Props> = ({
  lendings,
  onEdit,
  onDelete,
  getReaderName,
  getBookTitle,
  onSendReminder,
}) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-purple-100 to-purple-200">
          <tr>
            {["Reader", "Book", "Borrowed", "Due", "Returned", "Status", "Actions"].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-xs font-bold text-purple-900 uppercase tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100 text-sm">
          {lendings.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center px-6 py-6 text-gray-500 italic">
                No overdue lendings found.
              </td>
            </tr>
          ) : (
            lendings.map((lending) => (
              <tr key={lending._id} className="hover:bg-purple-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800">
                  {getReaderName(lending.readerId)}
                </td>
                <td className="px-6 py-4 text-gray-700">{getBookTitle(lending.bookId)}</td>
                <td className="px-6 py-4 text-gray-600">{lending.barrowedDate?.slice(0, 10)}</td>
                <td className="px-6 py-4 text-gray-600">{lending.dueDate?.slice(0, 10)}</td>
                <td className="px-6 py-4 text-gray-600">
                  {lending.returnDate ? lending.returnDate.slice(0, 10) : "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      lending.status === "returned"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {lending.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => onEdit(lending)}
                      className="p-1 rounded hover:bg-purple-100 text-purple-600 transition"
                      title="Edit"
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(lending)}
                      className="p-1 rounded hover:bg-red-100 text-red-600 transition"
                      title="Delete"
                    >
                      <MdDelete className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onSendReminder(lending)}
                      className="p-1 rounded hover:bg-green-100 text-green-600 transition"
                      title="Send Reminder Email"
                    >
                      <FaRegEnvelope className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OverdueTable;
