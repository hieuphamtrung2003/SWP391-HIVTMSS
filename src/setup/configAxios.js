import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:3000",
});

axiosClient.interceptors.request.use(async (config) => {
  const access_token = localStorage.getItem("access_token");

  // Check if the token is still in localStorage after page reload
  console.log("check token", access_token);

  if (access_token) {
    config.headers.Authorization = `Bearer ${access_token}`;
    console.log("check header", config.headers);
  }

  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// Store token in localStorage for persistence across refreshes
export const setAccessToken = (token) => {
  localStorage.setItem("access_token", token);
};

export default axiosClient;
