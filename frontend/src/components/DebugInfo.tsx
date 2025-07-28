import React from 'react';

// Debug component to show current API configuration
export const DebugInfo: React.FC = () => {
  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'localhost';
      }
      return hostname;
    }
    return import.meta.env.VITE_VM_IP || '35.188.75.223';
  };

  const apiHost = getApiBaseUrl();
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
      <div>Hostname: {hostname}</div>
      <div>API Host: {apiHost}</div>
      <div>Auth API: http://{apiHost}:8081/api/v1</div>
      <div>Discussion API: http://{apiHost}:8082/api/v1</div>
      <div>Assessment API: http://{apiHost}:8083/api/v1</div>
      <div>Env VITE_VM_IP: {import.meta.env.VITE_VM_IP || 'not set'}</div>
    </div>
  );
};

export default DebugInfo;