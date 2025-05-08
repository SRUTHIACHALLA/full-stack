// src/config.js

const isProduction = process.env.NODE_ENV === 'production';

export const API_BASE_URL = isProduction
  ? 'https://multivendor-backend-ze40.onrender.com' 
  : 'http://localhost:5000'; 
