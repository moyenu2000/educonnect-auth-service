import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface HealthComponent {
  status: string;
  details?: Record<string, unknown>;
}

interface HealthStatus {
  status: string;
  components?: Record<string, HealthComponent>;
}

export const HealthCheck: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHealthStatus();
  }, []);

  const loadHealthStatus = async () => {
    setLoading(true);
    setError('');

    try {
      const healthData = await authService.healthCheck();
      setHealth(healthData);
    } catch {
      setError('Failed to load health status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'UP' ? 'text-green-600' : 'text-red-600';
  };

  const getStatusBg = (status: string) => {
    return status === 'UP' ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">System Health</h2>
        <button
          onClick={loadHealthStatus}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {health && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <h3 className="text-lg font-semibold mr-4">Overall Status:</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBg(health.status)} ${getStatusColor(health.status)}`}>
                {health.status}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-md font-semibold mb-4">Components</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {health.components && Object.entries(health.components).map(([name, component]: [string, HealthComponent]) => (
                <div key={name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium capitalize">{name}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBg(component.status)} ${getStatusColor(component.status)}`}>
                      {component.status}
                    </span>
                  </div>
                  
                  {component.details && (
                    <div className="text-sm text-gray-600 space-y-1">
                      {Object.entries(component.details).map(([key, value]: [string, unknown]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium">{key}:</span>
                          <span className="text-right">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && !health && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading health status...</p>
        </div>
      )}
    </div>
  );
};