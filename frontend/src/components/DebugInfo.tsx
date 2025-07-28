import React from 'react';
import { API_ENDPOINTS, API_HOST } from '../config/api';

// Debug component to show current API configuration
export const DebugInfo: React.FC = () => {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'N/A';
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'N/A';

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '10px', 
      right: '10px', 
      background: 'rgba(0,0,0,0.8)', 
      color: 'white', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div><strong>🔧 API Debug Info</strong></div>
      <div>Current URL: {currentUrl}</div>
      <div>Browser Hostname: {hostname}</div>
      <div>Configured API Host: {API_HOST}</div>
      <div>Auth API: {API_ENDPOINTS.AUTH_SERVICE}</div>
      <div>Discussion API: {API_ENDPOINTS.DISCUSSION_SERVICE}</div>
      <div>Assessment API: {API_ENDPOINTS.ASSESSMENT_SERVICE}</div>
    </div>
  );
};

export default DebugInfo;