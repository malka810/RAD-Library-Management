import type { Book } from "../types/Books";
import apiClient from "./apiClient";

export const fetchAllBooks = async (): Promise<Book[]> => {
  const response = await apiClient.get(`/books`);
  console.log("Books API response data:", response.data);
  return response.data;
};


export const deleteBook = async (_id: string): Promise<void> => {
  await apiClient.delete(`/books/${_id}`);
};

export const addBookDetail = async (
  bookData: Omit<Book, "_id" | "isActive" | "createAt" | "updateAt">
): Promise<Book> => {
  const response = await apiClient.post(`/books`, bookData);
  return response.data;
};

export const updateBookDetail = async (
  _id: string,
  bookData: Omit<Book, "_id" | "isActive" | "createAt" | "updateAt">
): Promise<Book> => {
  const response = await apiClient.put(`/books/${_id}`, bookData);
  return response.data;
};

export const searchBookByTitle = async (title: string): Promise<Book | null> => {
  const response = await apiClient.get(`/books/search?title=${title}`);
  return response.data;
};
