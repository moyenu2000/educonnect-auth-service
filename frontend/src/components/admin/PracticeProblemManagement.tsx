import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Plus, Filter, AlertCircle, CheckCircle, Settings, BookOpen } from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';
import Pagination from '../ui/pagination';

interface PracticeProblem {
  id: number;
  questionId: number;
  subjectId: number;
  topicId?: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  points: number;
  hintText?: string;
  hints: string[];
  solutionSteps?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
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

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    questionId: number;
    difficulty: string;
    points: number;
    subjectId?: number;
    topicId?: number;
    hintText?: string;
    hints?: string[];
    solutionSteps?: string;
  }) => void;
  subjects: Array<{ id: number; name: string }>;
  topics: Array<{ id: number; name: string; subjectId: number }>;
}

interface EditProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    difficulty: string;
    points: number;
    isActive: boolean;
  }) => void;
  problem: PracticeProblem | null;
  subjects: Array<{ id: number; name: string }>;
  topics: Array<{ id: number; name: string; subjectId: number }>;
}

interface Filters {
  subjectId: string;
  difficulty: string;
  status: string;
}

const AddQuestionModal: React.FC<AddQuestionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  subjects, 
  topics 
}) => {
  const [questionId, setQuestionId] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [points, setPoints] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionId) return;
    
    onSubmit({
      questionId: parseInt(questionId),
      difficulty,
      points
    });

    // Reset form
    setQuestionId('');
    setDifficulty('MEDIUM');
    setPoints(10);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Question to Practice Problems</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question ID
            </label>
            <input
              type="number"
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter the ID of the question to add"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Subject and topic will be taken from the question
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Override
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
              <option value="EXPERT">Expert</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Override the question's original difficulty if needed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Points awarded for solving this practice problem
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add to Practice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const EditProblemModal: React.FC<EditProblemModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  problem,
  subjects, 
  topics 
}) => {
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [points, setPoints] = useState(10);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (problem) {
      setDifficulty(problem.difficulty);
      setPoints(problem.points);
      setIsActive(problem.isActive);
    }
  }, [problem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      difficulty,
      points,
      isActive
    });
  };

  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Practice Problem</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium text-gray-600">Question: {problem.question?.text || `ID: ${problem.questionId || problem.question?.id}`}</p>
            <p className="text-xs text-gray-500 mt-1">
              {problem.question?.subjectName || 'Subject not available'} 
              {problem.question?.topicName && ` • ${problem.question.topicName}`}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Subject and topic cannot be changed (inherited from question)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
              <option value="EXPERT">Expert</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Override the question's original difficulty
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Points awarded for solving this practice problem
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active (visible to students)
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Update Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PracticeProblemManagement: React.FC = () => {
  const [practiceProblems, setPracticeProblems] = useState<PracticeProblem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<PracticeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>([]);
  const [topics, setTopics] = useState<Array<{ id: number; name: string; subjectId: number }>>([]);
  
  const [filters, setFilters] = useState<Filters>({
    subjectId: '',
    difficulty: '',
    status: ''
  });

  const [stats, setStats] = useState({
    active: 0,
    inactive: 0,
    total: 0
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem | null>(null);

  useEffect(() => {
    loadPracticeProblems();
    loadSubjects();
    loadTopics();
  }, [currentPage, pageSize]);

  useEffect(() => {
    applyFilters();
  }, [practiceProblems, filters]);

  const loadPracticeProblems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await assessmentService.getAllPracticeProblems({
        page: currentPage,
        size: pageSize
      });
      console.log('Practice problems API response:', response);
      
      if (response.data && response.data.data) {
        const paginatedData = response.data.data;
        const problemsData = paginatedData.content || [];
        
        setPracticeProblems(problemsData);
        setTotalElements(paginatedData.totalElements || 0);
        setTotalPages(paginatedData.totalPages || 0);
        
        calculateStats(problemsData);
      } else {
        console.warn('Unexpected response structure:', response.data);
        setPracticeProblems([]);
        setTotalElements(0);
        setTotalPages(0);
        calculateStats([]);
      }
    } catch (err: any) {
      console.error('Error loading practice problems:', err);
      
      if (err.response?.status === 404) {
        setError('Practice problems API endpoint not found. Please ensure the assessment service is running.');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. You do not have permission to view practice problems.');
      } else {
        setError('Failed to load practice problems. Please check the assessment service and try again.');
      }
      
      setPracticeProblems([]);
      setTotalElements(0);
      setTotalPages(0);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSubjects = async () => {
    try {
      const response = await assessmentService.getSubjects();
      console.log('Subjects API response:', response);
      
      let subjectsData = [];
      if (response.data) {
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
      setSubjects([]);
    }
  };

  const loadTopics = async () => {
    try {
      const response = await assessmentService.getTopics();
      console.log('Topics API response:', response);
      
      let topicsData = [];
      if (response.data) {
        if (Array.isArray(response.data)) {
          topicsData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          topicsData = response.data.data;
        } else if (response.data.content && Array.isArray(response.data.content)) {
          topicsData = response.data.content;
        } else {
          console.warn('Unexpected topics response structure:', response.data);
          topicsData = [];
        }
      }
      
      console.log('Processed topics data:', topicsData);
      setTopics(topicsData);
    } catch (err) {
      console.error('Error loading topics:', err);
      setTopics([]);
    }
  };

  const calculateStats = (problems: PracticeProblem[]) => {
    if (!Array.isArray(problems)) {
      console.warn('calculateStats received non-array data:', problems);
      setStats({ active: 0, inactive: 0, total: 0 });
      return;
    }

    const activeProblems = problems.filter(p => p.isActive);
    const inactiveProblems = problems.filter(p => !p.isActive);
    
    setStats({
      active: activeProblems.length,
      inactive: inactiveProblems.length,
      total: problems.length
    });
  };

  const applyFilters = () => {
    if (!Array.isArray(practiceProblems)) {
      console.warn('applyFilters: practiceProblems is not an array:', practiceProblems);
      setFilteredProblems([]);
      return;
    }

    let filtered = [...practiceProblems];

    // Subject filter
    if (filters.subjectId) {
      const subjectIdToFilter = parseInt(filters.subjectId);
      filtered = filtered.filter(p => p.subjectId === subjectIdToFilter);
    }

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(p => p.difficulty === filters.difficulty);
    }

    // Status filter
    if (filters.status) {
      if (filters.status === 'active') {
        filtered = filtered.filter(p => p.isActive);
      } else if (filters.status === 'inactive') {
        filtered = filtered.filter(p => !p.isActive);
      }
    }

    // Sort by creation date (most recent first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredProblems(filtered);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handleAddQuestion = async (data: {
    questionId: number;
    difficulty: string;
    points: number;
    subjectId?: number;
    topicId?: number;
    hintText?: string;
    hints?: string[];
    solutionSteps?: string;
  }) => {
    try {
      await assessmentService.addQuestionToPractice(data);
      setShowAddModal(false);
      loadPracticeProblems(); // Reload the list
      alert('Question added to practice problems successfully!');
    } catch (err: any) {
      console.error('Error adding question to practice:', err);
      alert('Failed to add question to practice problems. Please try again.');
    }
  };

  const handleEditProblem = async (data: {
    difficulty: string;
    points: number;
    isActive: boolean;
  }) => {
    if (!selectedProblem) return;

    try {
      await assessmentService.updatePracticeProblem(selectedProblem.id, data);
      setShowEditModal(false);
      setSelectedProblem(null);
      loadPracticeProblems(); // Reload the list
      alert('Practice problem updated successfully!');
    } catch (err: any) {
      console.error('Error updating practice problem:', err);
      alert('Failed to update practice problem. Please try again.');
    }
  };

  const handleDeleteProblem = async (problemId: number) => {
    if (!confirm('Are you sure you want to delete this practice problem?')) {
      return;
    }

    try {
      await assessmentService.deletePracticeProblem(problemId);
      
      const updatedProblems = practiceProblems.filter(p => p.id !== problemId);
      setPracticeProblems(updatedProblems);
      calculateStats(updatedProblems);
      
      alert('Practice problem deleted successfully!');
    } catch (err: any) {
      console.error('Error deleting practice problem:', err);
      alert('Failed to delete practice problem. Please try again.');
    }
  };

  const handleViewQuestion = (problem: PracticeProblem) => {
    // Get question ID from either the direct questionId field or the nested question object
    const questionId = problem.questionId || problem.question?.id;
    
    console.log('handleViewQuestion called with:', {
      problemId: problem.id,
      questionId: problem.questionId,
      nestedQuestionId: problem.question?.id,
      finalQuestionId: questionId
    });
    
    if (!questionId || questionId === undefined || isNaN(questionId)) {
      console.error('Invalid question ID:', questionId, 'Problem data:', problem);
      alert('Error: Cannot view question - invalid question ID');
      return;
    }
    
    const editPath = '/admin/questions/create?edit=' + questionId + '&returnTo=practice-problems';
    console.log('Navigating to:', editPath);
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

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600' : 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading practice problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="mr-3 text-indigo-600" />
                Practice Problem Management
              </h1>
              <p className="mt-2 text-gray-600">
                Manage practice problems - add questions, edit settings, and control visibility
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center"
            >
              <Plus className="mr-2" size={16} />
              Add Question
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">Active Problems</p>
                  <p className="text-2xl font-bold text-green-900">{stats.active}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-gray-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-800">Inactive Problems</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-indigo-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-indigo-800">Total Problems</p>
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
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  subjectId: '',
                  difficulty: '',
                  status: ''
                })}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Problems List */}
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
                      loadPracticeProblems();
                      loadSubjects();
                      loadTopics();
                    }}
                    className="mt-2 text-sm text-red-600 underline hover:text-red-800"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {!Array.isArray(filteredProblems) || filteredProblems.length === 0 ? (
            <div className="p-8 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No practice problems found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {!Array.isArray(filteredProblems) 
                  ? 'Unable to load practice problems. Please check your connection and try again.'
                  : filters.subjectId || filters.difficulty || filters.status
                  ? 'Try adjusting your filters to see more problems.'
                  : 'No practice problems have been created yet. Click "Add Question" to get started.'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
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
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProblems.map((problem) => (
                      <tr key={problem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-md truncate">
                            {problem.question?.text || `Question ID: ${problem.questionId}`}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {problem.question?.type ? `Type: ${problem.question.type}` : 'Question details not loaded'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {problem.question?.subjectName || 
                             (subjects.find(s => s.id === problem.subjectId)?.name || `Subject ID: ${problem.subjectId}`)}
                          </div>
                          {problem.question?.topicName && (
                            <div className="text-xs text-gray-500">
                              {problem.question.topicName}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {problem.points} pts
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${getStatusColor(problem.isActive)}`}>
                            {problem.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewQuestion(problem)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                              title="View Question"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProblem(problem);
                                setShowEditModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="Edit Problem"
                            >
                              <Settings size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProblem(problem.id)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="Delete Problem"
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

        {/* Modals */}
        <AddQuestionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddQuestion}
          subjects={subjects}
          topics={topics}
        />

        <EditProblemModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProblem(null);
          }}
          onSubmit={handleEditProblem}
          problem={selectedProblem}
          subjects={subjects}
          topics={topics}
        />
      </div>
    </div>
  );
};

export default PracticeProblemManagement;