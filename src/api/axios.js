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
    
    // Skip redirecting to login if the request was to a local development server (localhost / 127.0.0.1)
    const isLocalRequest = !!(error.config?.url && (error.config.url.includes("localhost") || error.config.url.includes("127.0.0.1")));

    if (!isMock && !isLocalRequest && (error.response?.status === 401 || isNetworkError)) {
      localStorage.removeItem("token");
      localStorage.removeItem("_creds");
      localStorage.removeItem("username");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;