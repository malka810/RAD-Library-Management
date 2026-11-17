import React, { useState, useEffect } from "react";
import type {LendingFormData } from "../../types/Lending";
import type { Reader } from "../../types/Reader";
import type { Book } from "../../types/Books";

interface Props {
  onSubmit: (data: LendingFormData) => void;
  readers: Reader[];
  books: Book[];
  initialData?: LendingFormData; // for editing
  onCancel?: () => void;
}

const LendingForm: React.FC<Props> = ({ onSubmit, readers, books, initialData, onCancel }) => {
  const initialFormData: LendingFormData = initialData ?? {
    readerId: "",
    bookId: "",
    barrowedDate: "",
    dueDate: "",
    returnDate: "",
    status: "borrowed",
  };

  const [formData, setFormData] = useState<LendingFormData>(initialFormData);

  useEffect(() => {
    if (initialData) setFormData(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      // Clear form only on Add, not on Edit
      setFormData({
        readerId: "",
        bookId: "",
        barrowedDate: "",
        dueDate: "",
        returnDate: "",
        status: "borrowed",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded bg-white max-w-md">
      <select name="readerId" value={formData.readerId} onChange={handleChange} required className="w-full border rounded p-2">
        <option value="">Select Reader</option>
        {readers.map((reader) => (
          <option key={reader._id} value={reader._id}>
            {reader.name}
          </option>
        ))}
      </select>

      <select name="bookId" value={formData.bookId} onChange={handleChange} required className="w-full border rounded p-2">
        <option value="">Select Book</option>
        {books.map((book) => (
          <option key={book._id} value={book._id}>
            {book.title}
          </option>
        ))}
      </select>

      <input
        type="date"
        name="barrowedDate"
        value={formData.barrowedDate}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
      <input
        type="date"
        name="dueDate"
        value={formData.dueDate}
        onChange={handleChange}
        required
        className="w-full border rounded p-2"
      />
      <input
        type="date"
        name="returnDate"
        value={formData.returnDate}
        onChange={handleChange}
        className="w-full border rounded p-2"
      />

      <select name="status" value={formData.status} onChange={handleChange} className="w-full border rounded p-2">
        <option value="borrowed">Borrowed</option>
        <option value="returned">Returned</option>
      </select>

      <div className="flex space-x-4">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {initialData ? "Update" : "Add"}
        </button>
        {initialData && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default LendingForm;
