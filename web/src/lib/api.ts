import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("access_token");
    }
    return Promise.reject(error);
  },
);

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  ratings: Rating[];
  averageRating: number;
  _count: {
    ratings: number;
  };
}

export interface Rating {
  rating: number;
  review?: string;
  user: {
    id: string;
    name: string;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface CreateRecipeData {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  difficulty?: string;
  imageUrl?: string;
}

export interface RateRecipeData {
  rating: number;
  review?: string;
}

export const authAPI = {
  register: (data: RegisterData) => api.post("/auth/register", data),
  login: (data: LoginData) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/me"),
};

export const recipesAPI = {
  getAll: (search?: string) =>
    api.get(`/recipes${search ? `?search=${search}` : ""}`),
  getOne: (id: string) => api.get(`/recipes/${id}`),
  getUserRecipes: () => api.get("/recipes/user/me"),
  create: (data: CreateRecipeData) => api.post("/recipes", data),
  update: (id: string, data: Partial<CreateRecipeData>) =>
    api.patch(`/recipes/${id}`, data),
  delete: (id: string) => api.delete(`/recipes/${id}`),
  rate: (id: string, data: RateRecipeData) =>
    api.post(`/recipes/${id}/rate`, data),
};

export default api;
