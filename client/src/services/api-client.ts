import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string || "http://localhost:8000/api/",
});

export default axiosInstance;
