import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

export const TwoFactorSetup: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [qrData, setQrData] = useState<{ secret: string; qrCodeUrl: string; manualEntryKey: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [disablePassword, setDisablePassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDisableForm, setShowDisableForm] = useState(false);

  const handleEnable2FA = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authService.enable2FA();
      setQrData(result);
    } catch {
      setError('Failed to enable 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authService.confirm2FA(verificationCode);
      if (result.success) {
        setSuccess(result.message);
        setQrData(null);
        setVerificationCode('');
        
        if (user) {
          updateUser({ ...user, twoFactorEnabled: true });
        }
      } else {
        setError(result.message);
      }
    } catch {
      setError('Failed to confirm 2FA setup. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await authService.disable2FA(disablePassword);
      if (result.success) {
        setSuccess(result.message);
        setShowDisableForm(false);
        setDisablePassword('');
        
        if (user) {
          updateUser({ ...user, twoFactorEnabled: false });
        }
      } else {
        setError(result.message);
      }
    } catch {
      setError('Failed to disable 2FA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Two-Factor Authentication</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Current Status</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            user.twoFactorEnabled 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        {!user.twoFactorEnabled ? (
          <div className="space-y-6">
            <div>
              <p className="text-gray-600 mb-4">
                Two-factor authentication adds an extra layer of security to your account. 
                You'll need to enter a code from your authenticator app when logging in.
              </p>
              
              {!qrData ? (
                <button
                  onClick={handleEnable2FA}
                  disabled={loading}
                  className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
                </button>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Step 1: Scan QR Code</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):
                    </p>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <img 
                        src={qrData.qrCodeUrl} 
                        alt="2FA QR Code" 
                        className="mx-auto"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Or enter manually:</h4>
                    <code className="block p-2 bg-gray-100 rounded text-sm break-all">
                      {qrData.manualEntryKey}
                    </code>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Step 2: Verify Setup</h4>
                    <form onSubmit={handleConfirm2FA} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Enter 6-digit code from your app
                        </label>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          maxLength={6}
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {loading ? 'Verifying...' : 'Complete Setup'}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">
              Two-factor authentication is currently enabled on your account.
            </p>
            
            {!showDisableForm ? (
              <button
                onClick={() => setShowDisableForm(true)}
                className="flex justify-center py-2 px-4 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Disable Two-Factor Authentication
              </button>
            ) : (
              <form onSubmit={handleDisable2FA} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Enter your password to disable 2FA
                  </label>
                  <input
                    type="password"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {loading ? 'Disabling...' : 'Disable 2FA'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setShowDisableForm(false);
                      setDisablePassword('');
                    }}
                    className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {error && <div className="mt-4 text-red-600 text-sm">{error}</div>}
        {success && <div className="mt-4 text-green-600 text-sm">{success}</div>}
      </div>
    </div>
  );
};