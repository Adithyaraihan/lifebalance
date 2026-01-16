// src/api/axiosInstance.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Sesuaikan dengan port backendmu
  withCredentials: true, // Wajib agar cookie refreshToken terkirim/diterima
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Tempel Access Token otomatis jika ada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Auto Refresh Token jika 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Panggil endpoint refresh token
        const res = await axios.get(
          "http://localhost:5000/api/auth/refresh-token",
          {
            withCredentials: true,
          }
        );

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Update header request yang gagal tadi dengan token baru
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Ulangi request awal menggunakan instance 'api'
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired. Redirecting to login...");
        localStorage.removeItem("accessToken");
        // Ganti dengan logic logout/redirect kamu, misal:
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
