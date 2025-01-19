// axiosInstance.js
import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 429) {
      const { config } = error;
      config._retryCount = config._retryCount || 0;

      if (config._retryCount < 5) {
        // Limit retries to 5
        config._retryCount += 1;
        const backoffDelay = Math.pow(2, config._retryCount) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        return instance.request(config);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
