import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://najot-edu.softwareengineer.uz/api/v1",
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 401 kelsa — login sahifasiga
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("_creds");
      localStorage.removeItem("username");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;