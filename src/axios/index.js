
import axios from "axios";

// Create an Axios instance
const instance = axios.create({
  baseURL: "", // Replace with your API base URL
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Modify the request config (headers, authentication, etc.) here
    return config;
  },
  (error) => {
    // Handle request errors here
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    // Handle successful responses here
    return response;
  },
  (error) => {
    // Handle response errors here
    return Promise.reject(error);
  }
);

export default instance;