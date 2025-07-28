// Central API Configuration - Hardcoded VM IP
export const VM_IP = '35.188.75.223';

export const API_ENDPOINTS = {
  AUTH_SERVICE: `http://${VM_IP}:8081/api/v1`,
  ASSESSMENT_SERVICE: `http://${VM_IP}:8083/api/v1`,
  DISCUSSION_SERVICE: `http://${VM_IP}:8082/api/v1`,
} as const;

// Export VM IP for components that need to display it
export { VM_IP as API_HOST };