import api from "./api.js";
// GET /careers, GET /careers/{jobSlug} — Section 9.8
export const getRequisitions = (params) => api.get("/careers/", { params });
export const getRequisitionBySlug = (slug) => api.get(`/careers/${slug}`);
