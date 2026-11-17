import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import type { Reader } from '../../types/Reader';

interface ReadersTableProps {
  readers: Reader[];
  onEdit: (reader: Reader) => void;
  onDelete: (reader: Reader) => void;
}

const ReadersTable: React.FC<ReadersTableProps> = ({ readers, onEdit, onDelete }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px] md:min-w-full bg-white shadow-xl rounded-xl border border-gray-200">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-purple-800 to-purple-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider whitespace-nowrap">ID</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider whitespace-nowrap">Name</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider whitespace-nowrap">Email</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider whitespace-nowrap">Phone</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider whitespace-nowrap">Address</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider whitespace-nowrap">Active</th>
              <th className="px-4 py-3 text-left font-semibold uppercase tracking-wider whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {readers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-gray-500 font-medium">
                  No readers found
                </td>
              </tr>
            ) : (
              readers.map((reader) => (
                <tr key={reader._id} className="hover:bg-purple-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{reader._id}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{reader.name}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{reader.email}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{reader.phone}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{reader.address}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        reader.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {reader.isActive ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEdit(reader)}
                        className="p-1.5 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                        title="Edit"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(reader)}
                        className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
                        title="Delete"
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReadersTable;
