import api from "./api.js";
// GET /trust — Trust, Compliance & Export Control content, Section 9.14
// Response: { id, export_control_posture, gated_content_policy,
//             data_privacy_practices, responsible_disclosure_email,
//             certifications? }  (404 until CMS content is set)
export const getTrustContent = () => api.get("/trust/");
