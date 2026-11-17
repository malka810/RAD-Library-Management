import type { Lending } from "../types/Lending";
import apiClient from "./apiClient"; // axios instance with baseURL set, e.g., axios.create({ baseURL: "http://localhost:3000/api" })
import axios from "axios";

export const fetchAllLendings = async (): Promise<Lending[]> => {
  const response = await apiClient.get(`/lendings`);
  return response.data;
};

export const deleteLending = async (_id: string): Promise<void> => {
  await apiClient.delete(`/lendings/${_id}`);
};

export const addLendingDetail = async (
  lendingData: Omit<Lending, "_id">
): Promise<Lending> => {
  const dataToSend = {
    ...lendingData,
    barrowedDate: new Date(lendingData.barrowedDate),
    dueDate: new Date(lendingData.dueDate),
    returnDate: lendingData.returnDate ? new Date(lendingData.returnDate) : null,
  };
  const response = await apiClient.post(`/lendings`, dataToSend);
  return response.data;
};

export const updateLendingDetail = async (
  _id: string,
  lendingData: Omit<Lending, "_id">
): Promise<Lending> => {
  const dataToSend = {
    ...lendingData,
    barrowedDate: new Date(lendingData.barrowedDate),
    dueDate: new Date(lendingData.dueDate),
    returnDate: lendingData.returnDate ? new Date(lendingData.returnDate) : null,
  };
  const response = await apiClient.put(`/lendings/${_id}`, dataToSend);
  return response.data;
};

export interface PopulatedLending {
  _id: string;
  readerId: {
    _id: string;     
    name: string;
    email: string;
  };
  bookId: {
    _id: string;     
    title: string;
    author: string;
  };
  barrowedDate: string;
  dueDate: string;
  returnDate?: string;
  status: "borrowed" | "returned" | "overdue";
  createAt?: string;
  updateAt?: string;
}

export const fetchOverdueLendings = async (): Promise<PopulatedLending[]> => {
  const response = await axios.get("http://localhost:3000/api/lendings/overdue");
  return response.data;
};


export const fetchLendingsByEmail = async (email: string): Promise<Lending[]> => {
  const response = await apiClient.get(`/lendings/by-email`, {
    params: { email },
  });
  return response.data;
};

export const fetchLendingsByBookTitle = async (title: string): Promise<Lending[]> => {
  const response = await apiClient.get(`/lendings/by-book`, {
    params: { title },
  });
  return response.data;
};
