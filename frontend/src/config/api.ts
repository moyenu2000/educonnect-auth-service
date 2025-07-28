// Central API Configuration - Use environment variables
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}`;
  }
  return 'http://localhost';
};

const AUTH_URL = import.meta.env.VITE_AUTH_URL || `${getBaseUrl()}:8081`;
const ASSESSMENT_URL = import.meta.env.VITE_ASSESSMENT_URL || `${getBaseUrl()}:8083`;
const DISCUSSION_URL = import.meta.env.VITE_DISCUSSION_URL || `${getBaseUrl()}:8082`;

export const API_ENDPOINTS = {
  AUTH_SERVICE: `${AUTH_URL}/api/v1`,
  ASSESSMENT_SERVICE: `${ASSESSMENT_URL}/api/v1`,
  DISCUSSION_SERVICE: `${DISCUSSION_URL}/api/v1`,
} as const;

// Export base URL for components that need to display it
export const API_HOST = AUTH_URL;