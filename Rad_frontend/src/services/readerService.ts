import type { Reader } from "../types/Reader.ts";
import apiClient from "./apiClient.ts";

export const fetchAllReaders = async (): Promise<Reader[]> => {
    const response = await apiClient.get(`/readers`);
    return response.data;
};

export const deleteReader = async (_id: string): Promise<void> => {
    await apiClient.delete(`/readers/${_id}`);
};

export const addReaderDetail = async (
    readerData: Omit<Reader, "_id">
): Promise<Reader> => {
    const response = await apiClient.post(`/readers`, readerData);
    return response.data;
};

export const updateReaderDetail = async (
  _id: string,
  readerData: Omit<Reader, "_id">
): Promise<Reader> => {
  const response = await apiClient.put(`/readers/${_id}`, readerData);
  return response.data;
};

export const searchReaderByEmail = async (email: string): Promise<Reader> => {
  const response = await apiClient.get(`/readers/search/by-email`, {
    params: { email }
  });
  return response.data;
};

export const searchReaderByName = async (name: string): Promise<Reader[]> => {
  const response = await apiClient.get(`/readers/filter/by-name?name=${encodeURIComponent(name)}`);
  return response.data;
};


