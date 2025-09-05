import axios from "axios";
import { persistor } from "../store/store.js";
import authService from "./auth.js";
import store from "../store/store.js";

const instance = axios.create({
  baseURL: "https://chat-app-backend-bnbt.onrender.com/api/v1",
  headers: {
    "X-Client-Version": "1.0.0",
    "X-Platform": "web",
  },
  withCredentials: true,
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data.message;
    const originalRequest = error?.config;

    if (status === 401 && (message?.toLowerCase() === "access token expired" || message?.toLowerCase() === "no access token found")) {
      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshResponse = await instance.post(
            "/users/refresh-access-token",
            {},
            { withCredentials: true }
          );

          return instance(originalRequest); // Retry original request
        } catch (refreshError) {
          console.warn("🔁 Token refresh failed:", refreshError);

          try {
            await authService.clearCookies();
          } catch (error) {
            console.warn("Failed to clear cookies:", err);
          }
          store.dispatch({ type: "RESET_STORE" });
          persistor.purge();
          return Promise.reject(refreshError); // Propagate refresh error
        }
      }
    }

    // Handle 401 due to invalid/expired refresh token
    if (status === 401 && message?.toLowerCase().includes("refresh token")) {
      try {
        await authService.clearCookies();
      } catch (error) {
        console.warn("Failed to clear cookies:", err);
      }
      console.log("Redirecting to login due to invalid/expired refresh token");
      store.dispatch({ type: "RESET_STORE" });
      persistor.purge();
      return Promise.reject(error); // Propagate original error
    }

    return Promise.reject(error);
  }
);
export default instance;
