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

// 401 kelsa yoki internet umuman ishlamasa (offline/network error) — login sahifasiga
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isNetworkError = !error.response || error.code === "ERR_NETWORK" || error.message === "Network Error" || !window.navigator.onLine;
    const token = localStorage.getItem("token") || "";
    const isMock = token.startsWith("mock-");

    if (!isMock && (error.response?.status === 401 || isNetworkError)) {
      localStorage.removeItem("token");
      localStorage.removeItem("_creds");
      localStorage.removeItem("username");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;