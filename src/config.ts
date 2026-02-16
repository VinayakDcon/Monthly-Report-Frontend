const PROD_URL = import.meta.env.VITE_BACKEND_URL || "";
export const API_BASE = import.meta.env.DEV ? "/api" : PROD_URL;
export const AUTH_BASE = import.meta.env.DEV ? "" : PROD_URL;
