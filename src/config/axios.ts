import axios, { AxiosError } from "axios";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth";

export const instance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60 * 1000,
});


export const instanceWithCredential = axios.create({
  withCredentials: true,
    baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60 * 1000,
});

instanceWithCredential.interceptors.request.use(
  async (request) => {
    const session: Session | null = await getSession();

    if (session && session.accessToken) {
      request.headers.Authorization = `Bearer ${session.accessToken}`;
    }

    return request;
  },
  (error) => Promise.reject(error),
);

instanceWithCredential.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;


      // Redirect ke login
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      window.location.href = "/unauthorized";
      return Promise.reject(error);
    }

    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  },
);



