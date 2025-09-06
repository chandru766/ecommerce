import axios from "axios";

// ✅ Create Axios instance with base URL
const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// ✅ Add JWT token to every request (if available in localStorage)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================
// 🔹 Public Endpoints
// ==========================

// Register a new user
export const registerUser = (user) => API.post("/register", user);

// Login user
export const loginUser = (user) => API.post("/login", user);

// Get logged-in user's profile
export const getUserProfile = () => API.get("/profile");

// Update user profile
export const updateUserProfile = (data) => API.put("/profile", data);

// Change password
export const changePassword = (oldPassword, newPassword) =>
  API.put(
    `/profile/password?oldPassword=${encodeURIComponent(
      oldPassword
    )}&newPassword=${encodeURIComponent(newPassword)}`
  );

// ==========================
// 🔹 Admin Endpoints
// ==========================

// Get all users
export const getUsers = () => API.get("/admin/users");

// Get all products (admin view)
export const getAdminProducts = () => API.get("/admin/product");

// Create product (with image upload)
export const createProduct = (formData) =>
  API.post("/admin/product", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Update product by ID (with image upload)
export const updateProduct = (id, formData) =>
  API.put(`/admin/product/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Delete product by ID
export const deleteProduct = (id) => API.delete(`/admin/product/${id}`);

// ==========================
// ✅ Export API instance
// ==========================
export default API;
