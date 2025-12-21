import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUsers = () => API.get("/users");       // récupérer tous les users
export const createUser = (user) => API.post("/users", user); // ajouter un user
export const registerUser = (user) => API.post("/users/register", user); // register user
export const loginUser = (credentials) => API.post("/users/login", credentials); // login user
