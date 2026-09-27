import api from "./api.js";
// GET /investors — Investors & Partners single-record content, Section 9.12
// Response: { id, company_snapshot, partner_program, disclosures? }
//           (404 until CMS content is set)
export const getInvestorsContent = () => api.get("/investors/");
