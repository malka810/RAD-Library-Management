import React, { useEffect, useState } from "react";
import type { Lending, LendingFormData } from "../types/Lending";
import type { Reader } from "../types/Reader";
import type { Book } from "../types/Books";

import LendingsTable from "../components/tables/LendingsTable";
import LendingForm from "../components/forms/LendingsForm";

import {
  fetchAllLendings,
  addLendingDetail,
  updateLendingDetail,
  deleteLending,
  fetchLendingsByEmail,
  fetchLendingsByBookTitle, // ✅ added
} from "../services/lendingService";
import { sendDueDateReminder } from "../services/mailService";

const LendingsPage: React.FC = () => {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [lendings, setLendings] = useState<Lending[]>([]);
  const [filteredLendings, setFilteredLendings] = useState<Lending[]>([]);

  const [loading, setLoading] = useState(true);
  const [editingLending, setEditingLending] = useState<Lending | null>(null);

  const [filterEmail, setFilterEmail] = useState("");
  const [filterTitle, setFilterTitle] = useState(""); // ✅ new
  const [isFiltering, setIsFiltering] = useState(false);
  const [isFilteringTitle, setIsFilteringTitle] = useState(false); // ✅ new

  const getIdFromField = (field: string | { _id: string }): string =>
    typeof field === "string" ? field : field._id;

  const getReaderName = (readerId: string | { _id: string; name: string }) => {
    if (typeof readerId === "string") {
      return readers.find((r) => r._id === readerId)?.name || "Unknown";
    } else if (readerId && typeof readerId === "object") {
      return readerId.name || "Unknown";
    }
    return "Unknown";
  };

  const getBookTitle = (bookId: string | { _id: string; title: string }) => {
    if (typeof bookId === "string") {
      return books.find((b) => b._id === bookId)?.title || "Unknown";
    } else if (bookId && typeof bookId === "object") {
      return bookId.title || "Unknown";
    }
    return "Unknown";
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("http://localhost:3000/api/readers").then((res) => res.json()),
      fetch("http://localhost:3000/api/books").then((res) => res.json()),
      fetchAllLendings(),
    ])
      .then(([readersData, booksData, lendingsData]) => {
        setReaders(readersData);
        setBooks(booksData);
        setLendings(lendingsData);
        setFilteredLendings(lendingsData);
      })
      .catch((err) => {
        alert("Failed to fetch data");
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddLending = async (data: LendingFormData) => {
    try {
      const newLending = await addLendingDetail(data);
      setLendings((prev) => [...prev, newLending]);
      setFilteredLendings((prev) => [...prev, newLending]);
      alert("✅ Lending added successfully");
    } catch (error) {
      alert("❌ Failed to add lending");
      console.error(error);
    }
  };

  const handleFilterClick = async () => {
    if (!filterEmail.trim()) {
      setFilteredLendings(lendings);
      return;
    }
    try {
      setIsFiltering(true);
      const filtered = await fetchLendingsByEmail(filterEmail.trim());
      setFilteredLendings(filtered);
    } catch (error) {
      alert("❌ Failed to fetch lendings by email");
      console.error(error);
    } finally {
      setIsFiltering(false);
    }
  };

  const handleFilterByTitle = async () => {
    if (!filterTitle.trim()) {
      setFilteredLendings(lendings);
      return;
    }
    try {
      setIsFilteringTitle(true);
      const results = await fetchLendingsByBookTitle(filterTitle.trim());
      setFilteredLendings(results);
    } catch (error) {
      alert("❌ Failed to fetch lendings by book title");
      console.error(error);
    } finally {
      setIsFilteringTitle(false);
    }
  };

  const handleEditLending = (lending: Lending) => {
    setEditingLending(lending);
  };

  const handleUpdateLending = async (data: LendingFormData) => {
    if (!editingLending) return;
    try {
      const updated = await updateLendingDetail(editingLending._id, data);
      setLendings((prev) =>
        prev.map((l) => (l._id === updated._id ? updated : l))
      );
      setFilteredLendings((prev) =>
        prev.map((l) => (l._id === updated._id ? updated : l))
      );
      setEditingLending(null);
      alert("✅ Lending updated successfully");
    } catch (error) {
      alert("❌ Failed to update lending");
      console.error(error);
    }
  };

  const handleDeleteLending = async (lending: Lending) => {
    if (!window.confirm("Are you sure you want to delete this lending?")) return;
    try {
      await deleteLending(lending._id);
      setLendings((prev) => prev.filter((l) => l._id !== lending._id));
      setFilteredLendings((prev) => prev.filter((l) => l._id !== lending._id));
      alert("🗑️ Lending deleted successfully");
    } catch (error) {
      alert("❌ Failed to delete lending");
      console.error(error);
    }
  };

  const handleSendReminder = async (lending: Lending) => {
    try {
      await sendDueDateReminder(getIdFromField(lending.readerId), lending._id);
      alert("📧 Reminder email sent successfully!");
    } catch (error) {
      alert("❌ Failed to send reminder email");
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 text-lg text-gray-600">
        ⏳ Loading lending data...
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-start min-h-screen px-6 py-10 bg-gradient-to-br from-white via-purple-50 to-purple-100">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-10 tracking-tight text-center">
        📚 Lendings Management
      </h1>

      {/* Email filter */}
      <div className="mb-4 flex w-full max-w-4xl">
        <input
          type="email"
          placeholder="Enter reader email to filter"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleFilterClick}
          disabled={isFiltering}
          className={`px-6 py-2 rounded-r-lg text-white font-semibold ${
            isFiltering
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-700 hover:bg-purple-800"
          }`}
        >
          {isFiltering ? "Filtering..." : "Filter by Email"}
        </button>
      </div>

      {/* ✅ Book Title Filter */}
      <div className="mb-10 flex w-full max-w-4xl">
        <input
          type="text"
          placeholder="Enter book title to filter"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
          className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          onClick={handleFilterByTitle}
          disabled={isFilteringTitle}
          className={`px-6 py-2 rounded-r-lg text-white font-semibold ${
            isFilteringTitle
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isFilteringTitle ? "Filtering..." : "Filter by Title"}
        </button>
      </div>

      <div className="w-full max-w-4xl rounded-2xl shadow-lg p-8 mb-12 min-h-[420px] flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-100 to-white">
        <LendingForm
          onSubmit={editingLending ? handleUpdateLending : handleAddLending}
          readers={readers}
          books={books}
          initialData={
            editingLending
              ? {
                  readerId: getIdFromField(editingLending.readerId),
                  bookId: getIdFromField(editingLending.bookId),
                  barrowedDate: editingLending.barrowedDate?.slice(0, 10) || "",
                  dueDate: editingLending.dueDate?.slice(0, 10) || "",
                  returnDate: editingLending.returnDate?.slice(0, 10) || "",
                  status: editingLending.status,
                }
              : undefined
          }
          onCancel={() => setEditingLending(null)}
        />
      </div>

      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl p-8">
        <LendingsTable
          lendings={filteredLendings}
          onEdit={handleEditLending}
          onDelete={handleDeleteLending}
          onSendReminder={handleSendReminder}
          getReaderName={getReaderName}
          getBookTitle={getBookTitle}
        />
      </div>
    </div>
  );
};

export default LendingsPage;
