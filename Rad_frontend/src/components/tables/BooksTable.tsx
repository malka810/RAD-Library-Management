import React from "react";
import { MdEdit, MdDelete } from "react-icons/md";
import type { Book } from "../../types/Books";

interface BooksTableProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

const BooksTable: React.FC<BooksTableProps> = ({ books, onEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
      <table className="min-w-full divide-y divide-purple-200">
        <thead className="bg-purple-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
              Author
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
              Publish Year
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
              Total Copies
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
              Copies Available
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
              Active
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-purple-200">
          {books.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="px-6 py-4 text-center text-purple-500"
              >
                No books found
              </td>
            </tr>
          ) : (
            books.map((book) => (
              <tr
                key={book._id}
                className="hover:bg-purple-50 transition-colors duration-200"
              >
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-purple-900 max-w-[150px] overflow-x-auto">
                  {book._id}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-900">
                  {book.title}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-900">
                  {book.author}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-900">
                  {book.publishYear}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-900">
                  {book.totalCopies}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-900">
                  {book.copiesAvailable}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-900">
                  {book.isActive ? "Yes" : "No"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(book)}
                      className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-100 transition duration-150"
                      aria-label="Edit Book"
                    >
                      <MdEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(book)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-100 transition duration-150"
                      aria-label="Delete Book"
                    >
                      <MdDelete className="w-5 h-5" />
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

export default BooksTable;
