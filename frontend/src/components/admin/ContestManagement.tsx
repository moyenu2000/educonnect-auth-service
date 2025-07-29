import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Calendar, Clock, Users, Trophy, Filter, AlertCircle, CheckCircle } from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';
import { useToast } from '../../hooks/useToast';
import Pagination from '../ui/pagination';

interface Contest {
  id: number;
  title: string;
  description?: string;
  type: 'SPEED' | 'ACCURACY' | 'MIXED' | 'CODING';
  startTime: string;
  endTime: string;
  duration: number;
  problemIds: number[];
  prizes: string[];
  rules?: string;
  participants: number;
  status: 'UPCOMING' | 'ACTIVE' | 'RUNNING' | 'COMPLETED' | 'FINISHED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

interface Filters {
  status: string;
  type: string;
  dateRange: {
    start: string;
    end: string;
  };
}

const ContestManagement: React.FC = () => {
  const { showToast } = useToast();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    status: '',
    type: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const [stats, setStats] = useState({
    upcoming: 0,
    active: 0,
    completed: 0,
    total: 0
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    loadContests();
  }, [currentPage, pageSize, filters.status, filters.type]);

  const loadContests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await assessmentService.getAllContests(
        currentPage, 
        pageSize,
        filters.status || undefined,
        filters.type || undefined
      );
      
      console.log('Contests API response:', response);
      
      if (response.data && response.data.data) {
        const paginatedData = response.data.data;
        const contestsData = paginatedData.content || [];
        
        setContests(contestsData);
        setTotalElements(paginatedData.totalElements || 0);
        setTotalPages(paginatedData.totalPages || 0);
        
        calculateStats(contestsData);
      } else {
        console.warn('Unexpected response structure:', response.data);
        setContests([]);
        setTotalElements(0);
        setTotalPages(0);
        calculateStats([]);
      }
    } catch (err: any) {
      console.error('Error loading contests:', err);
      
      if (err.response?.status === 404) {
        setError('Contest API endpoint not found. Please ensure the assessment service is running.');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view contests.');
      } else {
        setError('Failed to load contests. Please check the assessment service and try again.');
      }
      
      setContests([]);
      setTotalElements(0);
      setTotalPages(0);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (contestsList: Contest[]) => {
    if (!Array.isArray(contestsList)) {
      setStats({ upcoming: 0, active: 0, completed: 0, total: 0 });
      return;
    }

    const upcoming = contestsList.filter(c => c.status === 'UPCOMING').length;
    const active = contestsList.filter(c => ['ACTIVE', 'RUNNING'].includes(c.status)).length;
    const completed = contestsList.filter(c => ['COMPLETED', 'FINISHED'].includes(c.status)).length;
    
    setStats({
      upcoming,
      active,
      completed,
      total: contestsList.length
    });
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handleCreateContest = () => {
    // Detect user type from current path
    const path = window.location.pathname;
    if (path.includes('/question-setter/')) {
      window.location.href = '/question-setter/contests/create';
    } else {
      window.location.href = '/admin/contests/create';
    }
  };

  const handleEditContest = (contestId: number) => {
    // Detect user type from current path
    const path = window.location.pathname;
    if (path.includes('/question-setter/')) {
      window.location.href = `/question-setter/contests/edit/${contestId}`;
    } else {
      window.location.href = `/admin/contests/edit/${contestId}`;
    }
  };

  const handleDeleteContest = async (contestId: number, contestTitle: string) => {
    if (!confirm(`Are you sure you want to delete the contest "${contestTitle}"?`)) {
      return;
    }

    try {
      await assessmentService.deleteContest(contestId);
      
      const updatedContests = contests.filter(c => c.id !== contestId);
      setContests(updatedContests);
      calculateStats(updatedContests);
      
      showToast('Contest deleted successfully!', 'success');
    } catch (err: any) {
      console.error('Error deleting contest:', err);
      showToast('Failed to delete contest. Please try again.', 'error');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'text-blue-600 bg-blue-100';
      case 'ACTIVE':
      case 'RUNNING': return 'text-green-600 bg-green-100';
      case 'COMPLETED':
      case 'FINISHED': return 'text-gray-600 bg-gray-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SPEED': return 'text-orange-600 bg-orange-100';
      case 'ACCURACY': return 'text-green-600 bg-green-100';
      case 'MIXED': return 'text-purple-600 bg-purple-100';
      case 'CODING': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Trophy className="mr-3 text-indigo-600" />
                Contest Management
              </h1>
              <p className="mt-2 text-gray-600">
                Create, manage, and monitor programming contests
              </p>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={handleCreateContest}
                className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors flex items-center font-medium shadow-lg border-2 border-indigo-600"
                style={{ minWidth: '180px' }}
              >
                <Plus className="mr-2" size={20} />
                Create Contest
              </button>
            </div>
          </div>
          
          {/* Alternative button for mobile/debugging */}
          <div className="mt-4 lg:hidden">
            <button
              onClick={handleCreateContest}
              className="w-full bg-green-600 text-white px-6 py-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center font-medium text-lg"
            >
              <Plus className="mr-2" size={24} />
              Create New Contest
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.upcoming}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Active</p>
                  <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <Trophy className="h-8 w-8 text-gray-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-indigo-800">Total Contests</p>
                  <p className="text-2xl font-bold text-indigo-900">{stats.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Filter className="mr-2" size={20} />
            Filters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="UPCOMING">Upcoming</option>
                <option value="ACTIVE">Active</option>
                <option value="RUNNING">Running</option>
                <option value="COMPLETED">Completed</option>
                <option value="FINISHED">Finished</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Types</option>
                <option value="SPEED">Speed</option>
                <option value="ACCURACY">Accuracy</option>
                <option value="MIXED">Mixed</option>
                <option value="CODING">Coding</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  status: '',
                  type: '',
                  dateRange: { start: '', end: '' }
                })}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Contests List */}
        <div className="bg-white rounded-lg shadow-sm">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                  <button 
                    onClick={() => {
                      setError(null);
                      loadContests();
                    }}
                    className="mt-2 text-sm text-red-600 underline hover:text-red-800"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {!Array.isArray(contests) || contests.length === 0 ? (
            <div className="p-8 text-center">
              <Trophy className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No contests found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {!Array.isArray(contests) 
                  ? 'Unable to load contests. Please check your connection and try again.'
                  : filters.status || filters.type
                  ? 'Try adjusting your filters to see more contests.'
                  : 'No contests have been created yet.'}
              </p>
              {Array.isArray(contests) && contests.length === 0 && !filters.status && !filters.type && (
                <button
                  onClick={handleCreateContest}
                  className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Create your first contest
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Schedule
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participants
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contests.map((contest) => (
                      <tr key={contest.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {contest.title}
                            </div>
                            {contest.description && (
                              <div className="text-sm text-gray-500 max-w-md truncate">
                                {contest.description}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 mt-1">
                              {contest.problemIds?.length || 0} problems
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(contest.type)}`}>
                            {contest.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Calendar className="mr-1" size={14} />
                              {formatDateTime(contest.startTime)}
                            </div>
                            <div className="flex items-center text-gray-500 mt-1">
                              <Clock className="mr-1" size={14} />
                              {formatDateTime(contest.endTime)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDuration(contest.duration)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Users className="mr-1" size={16} />
                            {contest.participants}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contest.status)}`}>
                            {contest.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditContest(contest.id)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                              title="Edit Contest"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteContest(contest.id, contest.title)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Delete Contest"
                              disabled={['ACTIVE', 'RUNNING'].includes(contest.status)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {!loading && totalElements > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalElements}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  loading={loading}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContestManagement;