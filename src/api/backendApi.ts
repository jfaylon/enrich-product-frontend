import axios from "axios";
import { BaseAttributeDefinition } from "@/interfaces";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export const fetchProducts = (params: any) =>
  axios.get(`${API_URL}/products`, { params });

export const fetchAttributes = () => axios.get(`${API_URL}/attributes`);

export const uploadCSV = (file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  return axios.post(`${API_URL}/products`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const addAttribute = (attr: BaseAttributeDefinition) =>
  axios.post(`${API_URL}/attributes`, attr);

export const deleteAttribute = (id: string) =>
  axios.delete(`${API_URL}/attributes/${id}`);

export const enrichProducts = (productIds: string[]) =>
  axios.post(`${API_URL}/products/enrich`, { productIds });

export const deleteProducts = (productIds: string[]) =>
  axios.delete(`${API_URL}/products/`, {
    data: { productIds },
  });
