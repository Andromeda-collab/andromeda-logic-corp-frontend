import axios from "axios";

// Base API client — talks to FastAPI backend (Section 11.5 API & Data Layer).
// Base URL comes from VITE_API_BASE_URL (see .env); falls back to local dev.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 20000,
});

// Normalise errors so UI code can always read `err.message` for a
// human-readable string, regardless of transport / HTTP / validation failure.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong. Please try again.";

    if (error.response) {
      const { status, data } = error.response;
      if (data && typeof data.detail === "string") {
        message = data.detail;
      } else if (Array.isArray(data?.detail) && data.detail.length) {
        // FastAPI / Pydantic validation error payload.
        message = data.detail
          .map((d) => `${(d.loc || []).slice(1).join(".")}: ${d.msg}`)
          .join("; ");
      } else if (status === 404) {
        message = "Not found.";
      } else {
        message = `Request failed (${status}).`;
      }
    } else if (error.code === "ECONNABORTED") {
      message = "The request timed out. Please try again.";
    } else if (error.request) {
      message =
        "Could not reach the server. Make sure the backend API is running.";
    }

    error.uiMessage = message;
    return Promise.reject(error);
  }
);

export default api;
