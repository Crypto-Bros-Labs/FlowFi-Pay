import axios from "axios";

const baseURL = import.meta.env.VITE_API_TEST_URL;

// Instancia con autenticación
const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la retornamos
    return response;
  },
  (error) => {
    // Si hay un error 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Limpiar todo el localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("tokenrefresh");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user-storage");
      localStorage.removeItem("token-local-service");

      // Opcional: redirigir al login
      window.location.href = "/login";
      // O si usas React Router, podrías usar:
      // window.location.reload();
    }

    // Rechazar la promesa para que el error se propague
    return Promise.reject(error);
  },
);

const axiosWithAuthInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosWithAuthInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosWithAuthInstance.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la retornamos
    return response;
  },
  (error) => {
    // Para esta instancia, NO redirigir en 401
    // Solo rechazar la promesa para que el error se propague
    return Promise.reject(error);
  },
);

// Para multipart/form-data (imágenes, archivos, etc.)
const axiosFormDataInstance = axios.create({
  baseURL,
});

axiosFormDataInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

axiosFormDataInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenrefresh");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user-storage");
      localStorage.removeItem("token-local-service");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Instancia pública
const publicAxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Solo named exports
export {
  axiosInstance,
  publicAxiosInstance,
  axiosWithAuthInstance,
  axiosFormDataInstance,
};
