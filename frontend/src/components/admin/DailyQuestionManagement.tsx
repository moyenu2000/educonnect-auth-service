import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Calendar, Filter, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';

interface DailyQuestion {
  id: number;
  questionId: number;
  date: string;
  subjectId: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  points: number;
  createdAt: string;
  question?: {
    id: number;
    text: string;
    type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'NUMERIC' | 'ESSAY';
    subjectName: string;
    topicName?: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
    options: Array<{
      id: number;
      text: string;
    }>;
    correctAnswerOptionId?: number;
    correctAnswerText?: string;
    explanation?: string;
    points: number;
    tags: string[];
    attachments: string[];
    isActive: boolean;
    createdBy: number;
    createdAt: string;
    updatedAt: string;
  };
}

interface Filters {
  dateFilter: 'today' | 'previous' | 'future' | 'all';
  subjectId: string;
  difficulty: string;
  dateRange: {
    start: string;
    end: string;
  };
}

const DailyQuestionManagement: React.FC = () => {
  const [dailyQuestions, setDailyQuestions] = useState<DailyQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<DailyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>([]);
  
  const [filters, setFilters] = useState<Filters>({
    dateFilter: 'all',
    subjectId: '',
    difficulty: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const [stats, setStats] = useState({
    today: 0,
    previous: 0,
    future: 0,
    total: 0
  });

  useEffect(() => {
    loadDailyQuestions();
    loadSubjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [dailyQuestions, filters]);

  const loadDailyQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await assessmentService.getDailyQuestions();
      console.log('Daily questions API response:', response);
      
      // Handle different response structures
      let questionsData = [];
      if (response.data) {
        // Try different possible structures
        if (Array.isArray(response.data)) {
          questionsData = response.data;
        } else if (response.data.data && response.data.data.questions && Array.isArray(response.data.data.questions)) {
          // This matches the actual API response structure
          questionsData = response.data.data.questions;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          questionsData = response.data.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          questionsData = response.data.content;
        } else if (response.data.questions && Array.isArray(response.data.questions)) {
          questionsData = response.data.questions;
        } else {
          console.warn('Unexpected response structure:', response.data);
          questionsData = [];
        }
      }
      
      console.log('Processed questions data:', questionsData);
      setDailyQuestions(questionsData);
      calculateStats(questionsData);
    } catch (err: any) {
      console.error('Error loading daily questions:', err);
      
      // Handle specific error cases
      if (err.response?.status === 404) {
        setError('Daily questions API endpoint not found. Please ensure the assessment service is running.');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view daily questions.');
      } else {
        setError('Failed to load daily questions. Please check the assessment service and try again.');
      }
      
      // Set empty array as fallback
      setDailyQuestions([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await assessmentService.getSubjects();
      console.log('Subjects API response:', response);
      
      // Handle different response structures
      let subjectsData = [];
      if (response.data) {
        // Try different possible structures
        if (Array.isArray(response.data)) {
          subjectsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          subjectsData = response.data.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          subjectsData = response.data.content;
        } else if (response.data.subjects && Array.isArray(response.data.subjects)) {
          subjectsData = response.data.subjects;
        } else {
          console.warn('Unexpected subjects response structure:', response.data);
          subjectsData = [];
        }
      }
      
      console.log('Processed subjects data:', subjectsData);
      setSubjects(subjectsData);
    } catch (err) {
      console.error('Error loading subjects:', err);
      setSubjects([]); // Set empty array as fallback
    }
  };

  const calculateStats = (questions: DailyQuestion[]) => {
    // Ensure questions is an array
    if (!Array.isArray(questions)) {
      console.warn('calculateStats received non-array data:', questions);
      setStats({ today: 0, previous: 0, future: 0, total: 0 });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const todayQuestions = questions.filter(q => q.date === today);
    const previousQuestions = questions.filter(q => q.date < today);
    const futureQuestions = questions.filter(q => q.date > today);
    
    setStats({
      today: todayQuestions.length,
      previous: previousQuestions.length,
      future: futureQuestions.length,
      total: questions.length
    });
  };

  const applyFilters = () => {
    // Ensure dailyQuestions is an array
    if (!Array.isArray(dailyQuestions)) {
      console.warn('applyFilters: dailyQuestions is not an array:', dailyQuestions);
      setFilteredQuestions([]);
      return;
    }

    let filtered = [...dailyQuestions];
    const today = new Date().toISOString().split('T')[0];

    // Date filter
    switch (filters.dateFilter) {
      case 'today':
        filtered = filtered.filter(q => q.date === today);
        break;
      case 'previous':
        filtered = filtered.filter(q => q.date < today);
        break;
      case 'future':
        filtered = filtered.filter(q => q.date > today);
        break;
      case 'all':
      default:
        // No date filtering
        break;
    }

    // Subject filter
    if (filters.subjectId) {
      const subjectIdToFilter = parseInt(filters.subjectId);
      filtered = filtered.filter(q => q.subjectId === subjectIdToFilter);
    }

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    // Date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(q => 
        q.date >= filters.dateRange.start && q.date <= filters.dateRange.end
      );
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredQuestions(filtered);
  };

  const handleRemoveFromDaily = async (dailyQuestionId: number) => {
    if (!confirm('Are you sure you want to remove this question from daily questions?')) {
      return;
    }

    try {
      await assessmentService.removeDailyQuestion(dailyQuestionId);

      // Remove from local state
      const updatedQuestions = dailyQuestions.filter(q => q.id !== dailyQuestionId);
      setDailyQuestions(updatedQuestions);
      
      // Recalculate stats
      calculateStats(updatedQuestions);
      
      // Show success message
      alert('Question removed from daily questions successfully!');
    } catch (err: any) {
      console.error('Error removing daily question:', err);
      alert('Failed to remove question from daily questions. Please try again.');
    }
  };

  const handleViewQuestion = (dailyQuestion: DailyQuestion) => {
    const editPath = '/admin/questions/create?edit=' + dailyQuestion.questionId + '&returnTo=daily-questions';
    window.location.href = editPath;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HARD': return 'text-orange-600 bg-orange-100';
      case 'EXPERT': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDateStatus = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (date === today) return { status: 'today', icon: CheckCircle, color: 'text-green-600' };
    if (date < today) return { status: 'previous', icon: CheckCircle, color: 'text-gray-600' };
    return { status: 'future', icon: Clock, color: 'text-blue-600' };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateString === today.toISOString().split('T')[0]) return 'Today';
    if (dateString === yesterday.toISOString().split('T')[0]) return 'Yesterday';
    if (dateString === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading daily questions...</p>
        </div>
      </div>
    );
  }

  // Debug information (remove in production)
  console.log('Debug Info:', {
    dailyQuestions: dailyQuestions,
    dailyQuestionsType: Array.isArray(dailyQuestions) ? 'array' : typeof dailyQuestions,
    subjects: subjects,
    subjectsType: Array.isArray(subjects) ? 'array' : typeof subjects,
    filteredQuestions: filteredQuestions,
    filteredQuestionsType: Array.isArray(filteredQuestions) ? 'array' : typeof filteredQuestions
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Calendar className="mr-3 text-indigo-600" />
                Daily Question Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage daily questions across all dates - view, preview, and remove questions
              </p>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Today's Questions</p>
                  <p className="text-2xl font-bold text-green-900">{stats.today}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-gray-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">Previous Questions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.previous}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-800">Future Questions</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.future}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-indigo-800">Total Questions</p>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Filter
              </label>
              <select
                value={filters.dateFilter}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  dateFilter: e.target.value as Filters['dateFilter']
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Questions</option>
                <option value="today">Today's Questions</option>
                <option value="previous">Previous Questions</option>
                <option value="future">Future Questions</option>
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <select
                value={filters.subjectId}
                onChange={(e) => setFilters(prev => ({ ...prev, subjectId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Subjects</option>
                {Array.isArray(subjects) && subjects.map(subject => (
                  <option key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  dateFilter: 'all',
                  subjectId: '',
                  difficulty: '',
                  dateRange: { start: '', end: '' }
                })}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Questions List */}
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
                      loadDailyQuestions();
                      loadSubjects();
                    }}
                    className="mt-2 text-sm text-red-600 underline hover:text-red-800"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {!Array.isArray(filteredQuestions) || filteredQuestions.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No daily questions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {!Array.isArray(filteredQuestions) 
                  ? 'Unable to load daily questions. Please check your connection and try again.'
                  : filters.dateFilter !== 'all' || filters.subjectId || filters.difficulty
                  ? 'Try adjusting your filters to see more questions.'
                  : 'No daily questions have been created yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Question
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQuestions.map((dailyQuestion) => {
                    const dateStatus = getDateStatus(dailyQuestion.date);
                    const StatusIcon = dateStatus.icon;
                    
                    return (
                      <tr key={dailyQuestion.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <StatusIcon className={`h-4 w-4 mr-2 ${dateStatus.color}`} />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {formatDate(dailyQuestion.date)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {dailyQuestion.date}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-md truncate">
                            {dailyQuestion.question?.text || `Question ID: ${dailyQuestion.questionId}`}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {dailyQuestion.question?.type ? `Type: ${dailyQuestion.question.type}` : 'Question details not loaded'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {dailyQuestion.question?.subjectName || 
                             (subjects.find(s => s.id === dailyQuestion.subjectId)?.name || `Subject ID: ${dailyQuestion.subjectId}`)}
                          </div>
                          {dailyQuestion.question?.topicName && (
                            <div className="text-xs text-gray-500">
                              {dailyQuestion.question.topicName}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(dailyQuestion.difficulty)}`}>
                            {dailyQuestion.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {dailyQuestion.points} pts
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewQuestion(dailyQuestion)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                              title="View Question"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => handleRemoveFromDaily(dailyQuestion.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Remove from Daily Questions"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DailyQuestionManagement;