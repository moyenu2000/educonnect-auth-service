// Environment-specific configuration
// This file determines which API endpoints to use based on environment

// Production/VM IP - DO NOT CHANGE THIS
const PRODUCTION_VM_IP = '35.188.75.223';

// Development IP
const DEVELOPMENT_IP = 'localhost';

// Determine which IP to use
// You can change this single line to switch environments
const USE_PRODUCTION = true; // Set to false for local development

export const VM_IP = USE_PRODUCTION ? PRODUCTION_VM_IP : DEVELOPMENT_IP;

export const API_ENDPOINTS = {
  AUTH_SERVICE: `http://${VM_IP}:8081/api/v1`,
  ASSESSMENT_SERVICE: `http://${VM_IP}:8083/api/v1`,
  DISCUSSION_SERVICE: `http://${VM_IP}:8082/api/v1`,
} as const;

// Export VM IP for components that need to display it
export { VM_IP as API_HOST };