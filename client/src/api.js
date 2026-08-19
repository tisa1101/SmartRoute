// Centralized API base URL
// In production (Vercel), VITE_API_URL points to the Render backend.
// In local development, falls back to localhost:8000.
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default API_BASE;
