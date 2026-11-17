import React, { useEffect, useState } from "react";
import { MdAdd, MdSearch, MdClear } from "react-icons/md";
import Dialog from "../components/Dialog";
import type { Reader } from "../types/Reader";
import ReadersTable from "../components/tables/ReadersTable";
import ReaderForm from "../components/forms/ReaderForm";
import axios from "axios";
import toast from "react-hot-toast";
import {
  fetchAllReaders,
  addReaderDetail,
  updateReaderDetail,
  deleteReader,
  searchReaderByEmail,
  searchReaderByName,
} from "../services/readerService";

const ReadersPage: React.FC = () => {
  const [readers, setReaders] = useState<Reader[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedReader, setSelectedReader] = useState<Reader | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const displayReaders = async () => {
    try {
      setIsLoading(true);
      const result = await fetchAllReaders();
      setReaders(result);
    } catch (error) {
      if (axios.isAxiosError(error)) toast.error(error.message);
      else toast.error("Readers are not loaded!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    displayReaders();
  }, []);

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      toast.error("Please enter an email to search");
      return;
    }
    try {
      setIsSearching(true);
      setIsLoading(true);
      const foundReader = await searchReaderByEmail(searchEmail.trim());
      setReaders([foundReader]);
      // Removed: no dialog open on email search
      // setSelectedReader(foundReader);
      // setIsEditDialogOpen(true);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        toast.error("Reader not found");
      } else {
        toast.error("Search failed");
      }
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleNameSearch = async () => {
    if (!searchName.trim()) {
      toast.error("Please enter a name to search");
      return;
    }
    try {
      setIsSearching(true);
      setIsLoading(true);
      const foundReaders = await searchReaderByName(searchName.trim());
      setReaders(foundReaders);

      if (foundReaders.length === 1) {
        setSelectedReader(foundReaders[0]);
        setIsEditDialogOpen(true);
      } else if (foundReaders.length === 0) {
        toast.error("No readers found with that name");
      }
    } catch (error) {
      toast.error("Search by name failed");
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const resetSearch = () => {
    setSearchEmail("");
    setSearchName("");
    displayReaders();
  };

  const handleAddReader = () => {
    setSelectedReader(null);
    setIsAddDialogOpen(true);
  };

  const handleEditReader = (reader: Reader) => {
    setSelectedReader(reader);
    setIsEditDialogOpen(true);
  };

  const handleDeleteReader = (reader: Reader) => {
    setSelectedReader(reader);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (readerData: Omit<Reader, "_id">) => {
    try {
      if (selectedReader) {
        const updatedReader = await updateReaderDetail(selectedReader._id, readerData);
        setReaders((prev) =>
          prev.map((r) => (r._id === selectedReader._id ? updatedReader : r))
        );
        setIsEditDialogOpen(false);
      } else {
        const newReader = await addReaderDetail(readerData);
        setReaders((prev) => [...prev, newReader]);
        setIsAddDialogOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) toast.error(error.message);
      else toast.error("Something went wrong");
    } finally {
      setSelectedReader(null);
    }
  };

  const confirmDelete = async () => {
    if (!selectedReader) return;
    try {
      await deleteReader(selectedReader._id);
      toast.success(`Deleted reader: ${selectedReader.name}`);
      await displayReaders();
    } catch (error) {
      if (axios.isAxiosError(error)) toast.error(error.message);
      else toast.error("Deleting Reader Failed!");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedReader(null);
    }
  };

  const cancelDialog = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedReader(null);
  };

  if (isLoading) return <h1>Loading Readers...</h1>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Readers</h1>
          <button
            onClick={handleAddReader}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-150"
          >
            <MdAdd className="w-5 h-5" />
            <span>Add Reader</span>
          </button>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <input
            type="email"
            placeholder="Search by email"
            className="flex-grow border border-gray-300 rounded-md px-3 py-2"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="flex items-center space-x-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            <MdSearch />
            <span>Search Email</span>
          </button>

          <input
            type="text"
            placeholder="Search by name"
            className="flex-grow border border-gray-300 rounded-md px-3 py-2"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleNameSearch(); }}
          />
          <button
            onClick={handleNameSearch}
            disabled={isSearching}
            className="flex items-center space-x-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            <MdSearch />
            <span>Filter Name</span>
          </button>

          <button
            onClick={resetSearch}
            disabled={isSearching}
            className="flex items-center space-x-1 bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition disabled:opacity-50"
          >
            <MdClear />
            <span>Reset</span>
          </button>
        </div>

        <ReadersTable
          readers={readers}
          onEdit={handleEditReader}
          onDelete={handleDeleteReader}
        />

        <Dialog
          isOpen={isAddDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement | null;
            form?.requestSubmit();
          }}
          title="Add New Reader"
        >
          <ReaderForm onSubmit={handleFormSubmit} />
        </Dialog>

        <Dialog
          isOpen={isEditDialogOpen}
          onCancel={cancelDialog}
          onConfirm={() => {
            const form = document.querySelector("form") as HTMLFormElement | null;
            form?.requestSubmit();
          }}
          title="Edit Reader"
        >
          <ReaderForm reader={selectedReader} onSubmit={handleFormSubmit} />
        </Dialog>

        <Dialog
          isOpen={isDeleteDialogOpen}
          onCancel={cancelDialog}
          onConfirm={confirmDelete}
          title="Delete Reader"
        >
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{selectedReader?.name}</strong>? This action
            cannot be undone.
          </p>
        </Dialog>
      </div>
    </div>
  );
};

export default ReadersPage;
