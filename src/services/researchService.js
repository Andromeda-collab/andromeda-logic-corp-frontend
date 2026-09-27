import api from "./api.js";
// Research & Innovation — Section 9.5
// GET /research -> { id, overview, partnership_program? }  (404 until CMS set)
export const getResearchContent = () => api.get("/research/");
// POST /research/access-request (public visitor form)
// payload: { name, institution, email, research_area?, message? }
export const submitResearchAccessRequest = (payload) =>
  api.post("/research/access-request", payload);
