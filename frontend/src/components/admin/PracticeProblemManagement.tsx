import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { assessmentService } from "../../services/assessmentService";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Trash2,
  Settings,
} from "lucide-react";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

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

interface Subject {
  id: number;
  name: string;
}

interface Topic {
  id: number;
  name: string;
  description: string;
  subjectId: number;
  displayOrder: number;
  isActive: boolean;
  questionsCount: number;
}

interface EditProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    difficulty: string;
    points: number;
  }) => void;
  problem: PracticeProblem | null;
}

const EditProblemModal: React.FC<EditProblemModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  problem
}) => {
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [points, setPoints] = useState(10);

  useEffect(() => {
    if (problem) {
      setDifficulty(problem.difficulty);
      setPoints(problem.points);
    }
  }, [problem]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      difficulty,
      points
    });
  };

  if (!isOpen || !problem) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white rounded-lg border border-gray-300 shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Practice Problem</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium text-gray-600">
              Question: {problem.question?.text || `ID: ${problem.questionId}`}
            </p>
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
  const navigate = useNavigate();
  const [practiceProblems, setPracticeProblems] = useState<PracticeProblem[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [practiceProblemsLoading, setPracticeProblemsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem | null>(null);

  // Filters
  const [filters, setFilters] = useState({
    subjectId: "",
    topicId: "",
    difficulty: "",
    type: "",
    search: "",
  });

  // Debounced search to prevent excessive API calls
  const debouncedSearch = useDebounce(filters.search, 500);

  // Load subjects
  const loadSubjects = useCallback(async () => {
    try {
      const response = await assessmentService.getSubjects();
      const data = response.data?.data;
      if (data && data.content) {
        setSubjects(data.content);
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  }, []);

  // Load topics
  const loadTopics = useCallback(async () => {
    try {
      const response = await assessmentService.getTopics();
      const data = response.data?.data;
      if (data && data.content) {
        setAllTopics(data.content);
      }
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  }, []);

  // Load practice problems
  const loadPracticeProblems = useCallback(async () => {
    try {
      setPracticeProblemsLoading(true);
      
      const params: any = {
        page: currentPage,
        size: 20
      };

      if (filters.subjectId) params.subjectId = parseInt(filters.subjectId);
      if (filters.topicId) params.topicId = parseInt(filters.topicId);
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.type) params.type = filters.type;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const response = await assessmentService.getAllPracticeProblems(params);
      
      if (response.data?.success && response.data.data) {
        const data = response.data.data;
        setPracticeProblems(Array.isArray(data.content) ? data.content : []);
        setTotalElements(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
      } else {
        setPracticeProblems([]);
        setTotalElements(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error loading practice problems:', error);
      setPracticeProblems([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setPracticeProblemsLoading(false);
    }
  }, [currentPage, filters.subjectId, filters.topicId, filters.difficulty, filters.type, debouncedSearch]);

  // Filter topics when subject changes
  useEffect(() => {
    if (filters.subjectId) {
      const filteredTopics = allTopics.filter(
        (topic) => topic.subjectId === parseInt(filters.subjectId)
      );
      setTopics(filteredTopics);
    } else {
      setTopics([]);
    }
  }, [filters.subjectId, allTopics]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([loadSubjects(), loadTopics()]);
      setLoading(false);
    };
    loadInitialData();
  }, [loadSubjects, loadTopics]);

  // Load practice problems when filters change
  useEffect(() => {
    loadPracticeProblems();
  }, [loadPracticeProblems]);

  // Handle filter changes
  const handleSubjectChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      subjectId: value,
      topicId: "" // Reset topic when subject changes
    }));
    setCurrentPage(0);
  };

  const handleTopicChange = (value: string) => {
    setFilters(prev => ({ ...prev, topicId: value }));
    setCurrentPage(0);
  };

  const handleDifficultyChange = (value: string) => {
    setFilters(prev => ({ ...prev, difficulty: value }));
    setCurrentPage(0);
  };

  const handleTypeChange = (value: string) => {
    setFilters(prev => ({ ...prev, type: value }));
    setCurrentPage(0);
  };

  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setCurrentPage(0);
  };

  // Handle actions
  const handleViewQuestion = (problem: PracticeProblem) => {
    const questionId = problem.questionId || problem.question?.id;
    
    if (!questionId || questionId === undefined || isNaN(questionId)) {
      console.error('Invalid question ID:', questionId, 'Problem data:', problem);
      alert('Error: Cannot view question - invalid question ID');
      return;
    }
    
    const editPath = window.location.pathname.includes('/admin/') 
      ? `/admin/questions/create?edit=${questionId}&returnTo=practice-problems`
      : `/question-setter/questions/create?edit=${questionId}&returnTo=practice-problems`;
    
    navigate(editPath);
  };

  const handleDeleteProblem = async (problemId: number, questionText: string) => {
    const confirmMessage = `Are you sure you want to delete this practice problem?\n\n"${questionText.substring(0, 100)}${questionText.length > 100 ? '...' : ''}"`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await assessmentService.deletePracticeProblem(problemId);
      await loadPracticeProblems();
      alert('Practice problem deleted successfully');
    } catch (error) {
      console.error('Failed to delete practice problem:', error);
      alert('Failed to delete practice problem. Please try again.');
    }
  };

  const handleEditProblem = async (data: {
    difficulty: string;
    points: number;
  }) => {
    if (!selectedProblem) return;

    try {
      await assessmentService.updatePracticeProblem(selectedProblem.id, data);
      setShowEditModal(false);
      setSelectedProblem(null);
      await loadPracticeProblems();
      alert('Practice problem updated successfully');
    } catch (error) {
      console.error('Failed to update practice problem:', error);
      alert('Failed to update practice problem. Please try again.');
    }
  };

  // Helper functions
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toUpperCase()) {
      case "EASY":
        return "bg-green-100 text-green-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HARD":
        return "bg-orange-100 text-orange-800";
      case "EXPERT":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case "MCQ":
        return "bg-blue-100 text-blue-800";
      case "TRUE_FALSE":
        return "bg-purple-100 text-purple-800";
      case "FILL_BLANK":
        return "bg-indigo-100 text-indigo-800";
      case "NUMERIC":
        return "bg-teal-100 text-teal-800";
      case "ESSAY":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && practiceProblems.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters / controls / configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Practice Question Filters & Actions
            </CardTitle>
            <Button 
              variant="outline"
              onClick={() => {
                const currentPath = window.location.pathname.includes('/admin/') 
                  ? '/admin/questions/create'
                  : '/question-setter/questions/create';
                navigate(currentPath);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Topic</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.topicId}
                onChange={(e) => handleTopicChange(e.target.value)}
                disabled={!filters.subjectId}
              >
                <option value="">All Topics</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Difficulty</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.difficulty}
                onChange={(e) => handleDifficultyChange(e.target.value)}
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.type}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="">All Types</option>
                <option value="MCQ">Multiple Choice</option>
                <option value="TRUE_FALSE">True/False</option>
                <option value="FILL_BLANK">Fill in the Blank</option>
                <option value="NUMERIC">Numeric</option>
                <option value="ESSAY">Essay</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Search</label>
              <input
                key="search-input"
                type="text"
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="Search practice problems..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Practice Problems List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Practice Questions ({totalElements})</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setFilters({
                subjectId: '',
                topicId: '',
                difficulty: '',
                type: '',
                search: ''
              })}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {practiceProblemsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <span className="text-sm text-muted-foreground">
                  Loading practice problems...
                </span>
              </div>
            </div>
          ) : practiceProblems.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No practice problems found</h3>
              <p className="text-gray-500 mb-4">
                {filters.subjectId || filters.difficulty || filters.type || filters.search.trim()
                  ? 'Try adjusting your filters to see more problems.'
                  : 'No practice problems have been created yet. Add questions to get started!'}
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  const currentPath = window.location.pathname.includes('/admin/') 
                    ? '/admin/questions/create'
                    : '/question-setter/questions/create';
                  navigate(currentPath);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {practiceProblems.map((problem) => (
                <div
                  key={problem.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">
                            {problem.question?.text || `Question ID: ${problem.questionId}`}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getDifficultyColor(problem.difficulty)}>
                              {problem.difficulty}
                            </Badge>
                            <Badge className={getTypeColor(problem.question?.type || '')}>
                              {problem.question?.type?.replace("_", " ") || "Unknown Type"}
                            </Badge>
                            {problem.question?.subjectName && (
                              <Badge variant="outline">
                                {problem.question.subjectName}
                              </Badge>
                            )}
                            <Badge variant="outline">
                              {problem.points} pts
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewQuestion(problem)}
                            title="View/Edit Question"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedProblem(problem);
                              setShowEditModal(true);
                            }}
                            title="Edit Practice Problem Settings"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProblem(problem.id, problem.question?.text || `Question ${problem.questionId}`)}
                            title="Delete Practice Problem"
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
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
                Showing {currentPage * 20 + 1} to{" "}
                {Math.min((currentPage + 1) * 20, totalElements)} of{" "}
                {totalElements} practice problems
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Problem Modal */}
      <EditProblemModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProblem(null);
        }}
        onSubmit={handleEditProblem}
        problem={selectedProblem}
      />
    </div>
  );
};

export default PracticeProblemManagement;