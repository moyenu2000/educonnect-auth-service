import React, { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import type { User, UsersPageResponse } from '../services/authService';

type TabType = 'enabled' | 'disabled';

export const AdminUserManagement: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('enabled');
  
  // Calculate pagination for filtered data
  const USERS_PER_PAGE = 10;
  const totalElements = filteredUsers.length;
  const totalPages = Math.ceil(totalElements / USERS_PER_PAGE);
  const startIndex = currentPage * USERS_PER_PAGE;
  const endIndex = startIndex + USERS_PER_PAGE;
  const currentPageUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    loadAllUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [allUsers, activeTab]);

  const loadAllUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Load all users by making multiple API calls if needed
      let allUsersData: User[] = [];
      let currentApiPage = 0;
      let hasMorePages = true;
      
      while (hasMorePages) {
        const response: UsersPageResponse = await authService.getAllUsers(currentApiPage, 50); // Use larger page size
        const users = response.content || [];
        allUsersData = [...allUsersData, ...users];
        
        hasMorePages = !response.last && users.length > 0;
        currentApiPage++;
      }
      
      setAllUsers(allUsersData);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users. Please check your permissions and network connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  const filterUsers = useCallback(() => {
    const filtered = allUsers.filter(user => {
      return activeTab === 'enabled' ? user.enabled : !user.enabled;
    });
    setFilteredUsers(filtered);
    setCurrentPage(0); // Reset to first page when filter changes
  }, [allUsers, activeTab]);

  const handleRoleChange = async (userId: number, newRole: string) => {
    setError('');
    setSuccess('');

    try {
      const result = await authService.updateUserRole(userId, newRole);
      if (result.success) {
        setSuccess(`User role updated to ${newRole}`);
        await loadAllUsers();
      } else {
        setError(result.message);
      }
    } catch {
      setError('Failed to update user role');
    }
  };

  const handleStatusToggle = async (userId: number, currentEnabled: boolean) => {
    setError('');
    setSuccess('');

    try {
      const result = await authService.updateUserStatus(userId, !currentEnabled);
      if (result.success) {
        setSuccess(`User ${!currentEnabled ? 'enabled' : 'disabled'} successfully`);
        await loadAllUsers();
      } else {
        setError(result.message);
      }
    } catch {
      setError('Failed to update user status');
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // filterUsers will be called automatically via useEffect and will reset currentPage
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'QUESTION_SETTER':
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => handleTabChange('enabled')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'enabled'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Enabled Users
            </button>
            <button
              onClick={() => handleTabChange('disabled')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'disabled'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Disabled Users
            </button>
          </nav>
        </div>

        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {activeTab === 'enabled' ? 'Enabled' : 'Disabled'} Users ({totalElements})
            </h3>
            <button
              onClick={loadAllUsers}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {loading && currentPageUsers.length === 0 ? (
          <div className="p-6 text-center">Loading users...</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPageUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.username} • {user.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.verified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded-md px-2 py-1"
                        >
                          <option value="STUDENT">Student</option>
                          <option value="QUESTION_SETTER">Question Setter</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                        
                        <button
                          onClick={() => handleStatusToggle(user.id, user.enabled)}
                          className={`text-xs px-2 py-1 rounded ${
                            user.enabled
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {user.enabled ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, totalElements)} of {totalElements} users
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <span className="px-3 py-1 text-sm text-gray-700">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="p-6 text-center text-gray-500">
            No users found
          </div>
        )}
      </div>
    </div>
  );
};