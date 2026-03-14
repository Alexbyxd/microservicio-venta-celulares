import axios from "axios";
import { envs } from "./config/envs";

export const apiClient = axios.create({
  baseURL: envs.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  },
);
