import React, { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import Dialog from "../components/Dialog";
import type { Book } from "../types/Books";
import BooksTable from "../components/tables/BooksTable";

import axios from "axios";
import toast from "react-hot-toast";
import {
  fetchAllBooks,
  addBookDetail,
  updateBookDetail,
  deleteBook,
  searchBookByTitle, // ✅ Import search service
} from "../services/bookService";
import BookForm from "../components/forms/BooksForm";

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTitle, setSearchTitle] = useState(""); // ✅ Search input

  const displayBooks = async () => {
    try {
      setIsLoading(true);
      const result = await fetchAllBooks();
      setBooks(result);
    } catch (error) {
      if (axios.isAxiosError(error)) toast.error(error.message);
      else toast.error("Books are not loaded!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    displayBooks();
  }, []);

  const handleSearch = async () => {
    if (!searchTitle.trim()) {
      displayBooks();
      return;
    }

    try {
      setIsLoading(true);
      const result = await searchBookByTitle(searchTitle.trim());
      setBooks(result ? [result] : []);
      if (!result) toast.error("No book found with that title");
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsAddDialogOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBook = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (bookData: Omit<Book, "_id">) => {
    try {
      if (selectedBook) {
        const updatedBook = await updateBookDetail(selectedBook._id!, bookData);
        setBooks((prevBooks) =>
          prevBooks.map((book) =>
            book._id === updatedBook._id ? updatedBook : book
          )
        );
        toast.success("Book updated successfully!");
        setIsEditDialogOpen(false);
      } else {
        const newBook = await addBookDetail(bookData);
        setBooks((prev) => [...prev, newBook]);
        toast.success("Book added successfully!");
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) toast.error(error.message);
      else toast.error("Something went wrong");
    } finally {
      setSelectedBook(null);
    }
  };

  const confirmDelete = async () => {
    if (selectedBook) {
      try {
        await deleteBook(selectedBook._id!);
        displayBooks();
      } catch (error) {
        if (axios.isAxiosError(error)) toast.error(error.message);
        else toast.error("Deleting Book Failed!");
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedBook(null);
      }
    }
  };

  const cancelDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedBook(null);
  };

  if (isLoading)
    return (
      <h1 className="text-center text-white text-xl font-semibold mt-10">
        Loading Books...
      </h1>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg">
            Books
          </h1>
          <button
            onClick={handleAddBook}
            className="flex items-center space-x-2 bg-white text-purple-900 px-4 py-2 rounded-lg hover:bg-purple-100 hover:text-purple-900 transition duration-150"
          >
            <MdAdd className="w-5 h-5" />
            <span>Add Book</span>
          </button>
        </div>

        {/* ✅ Search Bar */}
        <div className="flex mb-4 gap-2">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleSearch}
            className="bg-white text-purple-900 px-4 py-2 rounded-lg border hover:bg-purple-100"
          >
            Search
          </button>
        </div>

        {/* Table container */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <BooksTable
            books={books}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
          />
        </div>

        {/* Add Dialog */}
        <Dialog
          isOpen={isAddDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement;
            form?.requestSubmit();
          }}
          title="Add New Book"
        >
          <BookForm onSubmit={handleFormSubmit} />
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          isOpen={isEditDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement;
            form?.requestSubmit();
          }}
          title="Edit Book"
        >
          <BookForm book={selectedBook} onSubmit={handleFormSubmit} />
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          isOpen={isDeleteDialogOpen}
          onCancel={cancelDialog}
          onConfirm={confirmDelete}
          title="Delete Book"
        >
          <p className="text-gray-700">
            Are you sure you want to delete{" "}
            <strong className="text-purple-900">{selectedBook?.title}</strong>? This action cannot be undone.
          </p>
        </Dialog>
      </div>
    </div>
  );
};

export default BooksPage;
