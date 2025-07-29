import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Calendar, Clock, Users, Trophy, Filter } from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';
import { useToast } from '../../hooks/useToast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  search: string;
}

const ContestManagement: React.FC = () => {
  const { showToast } = useToast();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [contestsLoading, setContestsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  const [filters, setFilters] = useState<Filters>({
    status: '',
    type: '',
    search: ''
  });

  const pageSize = 20;

  useEffect(() => {
    loadContests();
  }, [currentPage, filters]);

  const loadContests = async (page: number = currentPage) => {
    try {
      setContestsLoading(true);
      
      const params = {
        page,
        size: pageSize,
        status: filters.status || undefined,
        type: filters.type || undefined,
        search: filters.search || undefined
      };

      // Remove undefined values
      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await assessmentService.getContests(params);
      console.log('Contests response:', response);
      
      let data;
      if (response.data && response.data.data) {
        data = response.data.data;
      } else if (response.data) {
        data = response.data;
      }

      if (data) {
        const contestsList = data.content || data.contests || data || [];
        setContests(contestsList);
        setTotalPages(data.totalPages || Math.ceil((data.totalElements || contestsList.length) / pageSize));
        setTotalElements(data.totalElements || contestsList.length);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Error loading contests:', err);
      showToast('Failed to load contests. Please try again.', 'error');
    } finally {
      setLoading(false);
      setContestsLoading(false);
    }
  };

  const handleCreateContest = () => {
    const path = window.location.pathname;
    if (path.includes('/question-setter/')) {
      window.location.href = '/question-setter/contests/create';
    } else {
      window.location.href = '/admin/contests/create';
    }
  };

  const handleEditContest = (contestId: number) => {
    const path = window.location.pathname;
    if (path.includes('/question-setter/')) {
      window.location.href = `/question-setter/contests/edit/${contestId}`;
    } else {
      window.location.href = `/admin/contests/edit/${contestId}`;
    }
  };

  const handleDeleteContest = async (contestId: number, contestTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${contestTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await assessmentService.deleteContest(contestId);
      showToast('Contest deleted successfully', 'success');
      loadContests();
    } catch (err) {
      console.error('Error deleting contest:', err);
      showToast('Failed to delete contest. Please try again.', 'error');
    }
  };

  const handleFilterChange = (field: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UPCOMING': return 'bg-blue-100 text-blue-800';
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'RUNNING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'FINISHED': return 'bg-purple-100 text-purple-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SPEED': return 'bg-orange-100 text-orange-800';
      case 'ACCURACY': return 'bg-green-100 text-green-800';
      case 'MIXED': return 'bg-purple-100 text-purple-800';
      case 'CODING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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

  if (loading && contests.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Contest Filters & Actions
            </CardTitle>
            <Button onClick={handleCreateContest} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Contest
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
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
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="SPEED">Speed Contest</option>
                <option value="ACCURACY">Accuracy Contest</option>
                <option value="MIXED">Mixed Contest</option>
                <option value="CODING">Coding Contest</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Search</label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="Search contests..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contest List Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Contest List ({totalElements})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contestsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <span className="text-sm text-muted-foreground">
                  Loading contests...
                </span>
              </div>
            </div>
          ) : contests.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No contests found</p>
              {!filters.status && !filters.type && !filters.search && (
                <Button onClick={handleCreateContest} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Create your first contest
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {contests.map((contest) => (
                <div
                  key={contest.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-sm mb-2">{contest.title}</h3>
                          {contest.description && (
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {contest.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(contest.status)}>
                              {contest.status}
                            </Badge>
                            <Badge className={getTypeColor(contest.type)}>
                              {contest.type}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Start: {formatDateTime(contest.startTime)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Duration: {formatDuration(contest.duration)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {contest.participants} participants
                              </span>
                              <span>
                                {contest.problemIds?.length || 0} problems
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditContest(contest.id)}
                            title="Edit Contest"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContest(contest.id, contest.title)}
                            title="Delete Contest"
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                            disabled={['ACTIVE', 'RUNNING'].includes(contest.status)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {currentPage * pageSize + 1} to{" "}
                {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
                {totalElements} contests
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={handlePreviousPage}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages - 1}
                  onClick={handleNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContestManagement;