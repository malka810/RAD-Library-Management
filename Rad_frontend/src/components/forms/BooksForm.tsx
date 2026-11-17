import React, { useEffect, useState } from "react";
import type { Book } from "../../types/Books";

interface BookFormProps {
  book?: Book | null;
  onSubmit: (bookData: Omit<Book, "_id" | "isActive" | "createAt" | "updateAt">) => void;
}

interface FormErrors {
  title?: string;
  author?: string;
  description?: string;
  publishYear?: string;
  totalCopies?: string;
  copiesAvailable?: string;
}

const BookForm = ({ book, onSubmit }: BookFormProps) => {
  const [formData, setFormData] = useState<Omit<Book, "_id" | "isActive" | "createAt" | "updateAt">>({
    title: "",
    author: "",
    description: "",
    publishYear: new Date().getFullYear(),
    totalCopies: 0,
    copiesAvailable: 0,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description,
        publishYear: book.publishYear,
        totalCopies: book.totalCopies,
        copiesAvailable: book.copiesAvailable,
      });
    } else {
      setFormData({
        title: "",
        author: "",
        description: "",
        publishYear: new Date().getFullYear(),
        totalCopies: 0,
        copiesAvailable: 0,
      });
    }
    setErrors({});
  }, [book]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    if (!formData.author.trim()) {
      newErrors.author = "Author is required";
    } else if (formData.author.trim().length < 2) {
      newErrors.author = "Author must be at least 2 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 5) {
      newErrors.description = "Description must be at least 5 characters";
    }

    if (!formData.publishYear || formData.publishYear <= 0) {
      newErrors.publishYear = "Publish year must be a positive number";
    }

    if (formData.totalCopies == null || formData.totalCopies < 0) {
      newErrors.totalCopies = "Total copies must be zero or more";
    }

    if (formData.copiesAvailable == null || formData.copiesAvailable < 0) {
      newErrors.copiesAvailable = "Copies available must be zero or more";
    } else if (formData.copiesAvailable > formData.totalCopies) {
      newErrors.copiesAvailable = "Copies available cannot exceed total copies";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // For number inputs convert to number
    const newValue =
      name === "publishYear" ||
      name === "totalCopies" ||
      name === "copiesAvailable"
        ? Number(value)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.title ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter book title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="author"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Author
        </label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.author ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter author name"
        />
        {errors.author && (
          <p className="mt-1 text-sm text-red-600">{errors.author}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.description ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter book description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="publishYear"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Publish Year
        </label>
        <input
          type="number"
          id="publishYear"
          name="publishYear"
          value={formData.publishYear}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.publishYear ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter publish year"
          min={0}
        />
        {errors.publishYear && (
          <p className="mt-1 text-sm text-red-600">{errors.publishYear}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="totalCopies"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Total Copies
        </label>
        <input
          type="number"
          id="totalCopies"
          name="totalCopies"
          value={formData.totalCopies}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.totalCopies ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter total copies"
          min={0}
        />
        {errors.totalCopies && (
          <p className="mt-1 text-sm text-red-600">{errors.totalCopies}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="copiesAvailable"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Copies Available
        </label>
        <input
          type="number"
          id="copiesAvailable"
          name="copiesAvailable"
          value={formData.copiesAvailable}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.copiesAvailable ? "border-red-300" : "border-gray-300"
          }`}
          placeholder="Enter copies available"
          min={0}
        />
        {errors.copiesAvailable && (
          <p className="mt-1 text-sm text-red-600">{errors.copiesAvailable}</p>
        )}
      </div>
    </form>
  );
};

export default BookForm;
