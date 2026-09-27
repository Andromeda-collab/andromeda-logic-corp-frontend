import api from "./api.js";
// GET /about — About Us single-record content, Section 9.9
// Response: { id, mission_statement, vision_statement, leadership?,
//             heritage_timeline?, locations? }  (404 until CMS content is set)
export const getAboutContent = () => api.get("/about/");
