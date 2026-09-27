import api from "./api.js";
// GET /newsroom, GET /newsroom/{slug} — Section 9.7
export const getPressItems = (params) => api.get("/newsroom/", { params });
export const getPressItemBySlug = (slug) => api.get(`/newsroom/${slug}`);
