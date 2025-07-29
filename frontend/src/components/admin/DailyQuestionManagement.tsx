import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "../../hooks/useToast";
import { assessmentService } from "../../services/assessmentService";
import {
  Plus,
  Eye,
  Trash2,
  Settings,
} from "lucide-react";

interface DailyQuestion {
  id: number;
  questionId: number;
  date: string;
  text: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'NUMERIC' | 'ESSAY';
  subjectId: number;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  points: number;
  bonusPoints?: number;
  options: Array<{
    id: number;
    text: string;
    optionOrder: number;
  }>;
  createdAt?: string;
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
  subjectId: string;
  topicId: string;
  difficulty: string;
  type: string;
  search: string;
  selectedDate: string;
}

interface EditDailyQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    difficulty: string;
    points: number;
    bonusPoints?: number;
  }) => void;
  dailyQuestion: DailyQuestion | null;
}

const EditDailyQuestionModal: React.FC<EditDailyQuestionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  dailyQuestion
}) => {
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [points, setPoints] = useState(10);
  const [bonusPoints, setBonusPoints] = useState(0);

  useEffect(() => {
    if (dailyQuestion) {
      setDifficulty(dailyQuestion.difficulty);
      setPoints(dailyQuestion.points);
      setBonusPoints(dailyQuestion.bonusPoints || 0);
    }
  }, [dailyQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      difficulty,
      points,
      bonusPoints: bonusPoints > 0 ? bonusPoints : undefined
    });
  };

  if (!isOpen || !dailyQuestion) return null;

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white rounded-lg border border-gray-300 shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Edit Daily Question</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium text-gray-600">
              Question: {dailyQuestion.text || `ID: ${dailyQuestion.questionId}`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Date: {dailyQuestion.date}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Question content and date cannot be changed
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
              Points awarded for correctly answering this daily question
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bonus Points (Optional)
            </label>
            <input
              type="number"
              min="0"
              max="50"
              value={bonusPoints}
              onChange={(e) => setBonusPoints(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Additional bonus points for special daily questions
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
              Update Daily Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DailyQuestionManagement: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [dailyQuestions, setDailyQuestions] = useState<DailyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>([]);
  const [topics, setTopics] = useState<Array<{ id: number; name: string; subjectId: number }>>([]);
  const [allTopics, setAllTopics] = useState<Array<{ id: number; name: string; subjectId: number }>>([]);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDailyQuestion, setSelectedDailyQuestion] = useState<DailyQuestion | null>(null);
  
  const [filters, setFilters] = useState<Filters>({
    subjectId: '',
    topicId: '',
    difficulty: '',
    type: '',
    search: '',
    selectedDate: ''
  });


  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);


  const loadDailyQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Calculate date range for better filtering (last 365 days by default)
      const endDate = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' });
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      const startDateStr = startDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Dhaka' });
      
      const response = await assessmentService.getAllDailyQuestions({
        startDate: startDateStr,
        endDate: endDate,
        page: currentPage,
        size: pageSize,
        ...(filters.subjectId && { subjectId: parseInt(filters.subjectId) }),
        ...(filters.topicId && { topicId: parseInt(filters.topicId) }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.type && { type: filters.type }),
        ...(filters.selectedDate && { selectedDate: filters.selectedDate }),
        ...(filters.search && { search: filters.search })
      });
      console.log('Paginated daily questions API response:', response);
      
      if (response.data && response.data.data) {
        const paginatedData = response.data.data;
        const questionsData = paginatedData.content || [];
        
        console.log('Setting daily questions data:', questionsData);
        setDailyQuestions(questionsData);
        setTotalElements(paginatedData.totalElements || 0);
        setTotalPages(paginatedData.totalPages || 0);
      } else {
        console.warn('Unexpected response structure:', response.data);
        setDailyQuestions([]);
        setTotalElements(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.error('Error loading daily questions:', err);
      setError('Failed to load daily questions. Please try again.');
      
      // Set empty array as fallback
      setDailyQuestions([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, filters.subjectId, filters.topicId, filters.difficulty, filters.type, filters.selectedDate, filters.search]);



  const loadSubjects = async () => {
    try {
      const response = await assessmentService.getSubjects();
      const data = response.data?.data;
      if (data && data.content) {
        setSubjects(data.content);
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const loadTopics = async () => {
    try {
      const response = await assessmentService.getTopics();
      const data = response.data?.data;
      if (data && data.content) {
        setAllTopics(data.content);
      }
    } catch (error) {
      console.error('Failed to load topics:', error);
    }
  };

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

  useEffect(() => {
    loadDailyQuestions();
    loadSubjects();
    loadTopics();
  }, [loadDailyQuestions, currentPage, pageSize]);

  // Optimized pagination handlers
  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => prev - 1);
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const handleRemoveFromDaily = async (dailyQuestionId: number) => {
    if (!confirm('Are you sure you want to remove this question from daily questions?')) {
      return;
    }

    try {
      await assessmentService.removeDailyQuestion(dailyQuestionId);

      // Remove from local state
      const updatedQuestions = dailyQuestions.filter(q => q.id !== dailyQuestionId);
      setDailyQuestions(updatedQuestions);
      
      // Show success message
      showToast('Question removed from daily questions successfully!', 'success');
    } catch (err) {
      console.error('Error removing daily question:', err);
      showToast('Failed to remove question from daily questions. Please try again.', 'error');
    }
  };

  const handleViewQuestion = (dailyQuestion: DailyQuestion) => {
    const editPath = window.location.pathname.includes('/admin/') 
      ? `/admin/questions/create?edit=${dailyQuestion.questionId}`
      : `/question-setter/questions/create?edit=${dailyQuestion.questionId}`;
    navigate(editPath);
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

  const handleEditDailyQuestion = async (data: {
    difficulty: string;
    points: number;
    bonusPoints?: number;
  }) => {
    if (!selectedDailyQuestion) return;
    
    try {
      // Get all current daily questions for the date
      const currentDailyQuestions = dailyQuestions.filter(dq => dq.date === selectedDailyQuestion.date);
      
      // Prepare question configurations with the updated data for the selected question
      const questionConfigurations = currentDailyQuestions.map(dq => ({
        questionId: dq.questionId,
        difficulty: dq.id === selectedDailyQuestion.id ? data.difficulty : dq.difficulty,
        points: dq.id === selectedDailyQuestion.id ? data.points : dq.points,
        ...(dq.id === selectedDailyQuestion.id && data.bonusPoints && { bonusPoints: data.bonusPoints })
      }));

      const questionIds = currentDailyQuestions.map(dq => dq.questionId);

      // Use the same API method as the daily config page
      await assessmentService.setDailyQuestions({
        date: selectedDailyQuestion.date,
        questionIds: questionIds,
        subjectDistribution: {
          questionConfigurations
        }
      });

      setShowEditModal(false);
      setSelectedDailyQuestion(null);
      await loadDailyQuestions();
      showToast('Daily question updated successfully', 'success');
    } catch (err) {
      console.error('Error updating daily question:', err);
      showToast('Failed to update daily question. Please try again.', 'error');
    }
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



  return (
    <div className="space-y-6">
      {/* Filters / controls / configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Daily Question Filters & Actions
            </CardTitle>
            <Button 
              variant="outline"
              onClick={() => {
                const currentPath = window.location.pathname.includes('/admin/') 
                  ? '/admin/questions/daily-config'
                  : '/question-setter/questions/daily-config';
                navigate(currentPath);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Daily Question
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* First row of filters */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.subjectId}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, subjectId: e.target.value, topicId: '' }));
                  setCurrentPage(0);
                }}
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
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, topicId: e.target.value }));
                  setCurrentPage(0);
                }}
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
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, difficulty: e.target.value }));
                  setCurrentPage(0);
                }}
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
          </div>
          
          
          {/* Second row of filters */}
          <div className="grid gap-4 md:grid-cols-3 mt-4">
            <div>
              <label className="text-sm font-medium">Type</label>
              <select
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.type}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, type: e.target.value }));
                  setCurrentPage(0);
                }}
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
              <label className="text-sm font-medium">Date</label>
              <input
                type="date"
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.selectedDate}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, selectedDate: e.target.value }));
                  setCurrentPage(0);
                }}
                placeholder="mm/dd/yyyy"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Search</label>
              <input
                key="search-input"
                type="text"
                className="w-full mt-1 p-2 border rounded-md"
                placeholder="Search questions..."
                value={filters.search}
                onChange={(e) => {
                  setFilters(prev => ({ ...prev, search: e.target.value }));
                  setCurrentPage(0);
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daily Questions ({totalElements})</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                setFilters({
                  subjectId: '',
                  topicId: '',
                  difficulty: '',
                  type: '',
                  search: '',
                  selectedDate: ''
                });
                setCurrentPage(0);
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <span className="text-sm text-muted-foreground">
                  Loading daily questions...
                </span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading daily questions</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button 
                variant="outline"
                onClick={() => {
                  setError(null);
                  loadDailyQuestions();
                }}
              >
                Try Again
              </Button>
            </div>
          ) : dailyQuestions.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No daily questions found</h3>
              <p className="text-gray-500 mb-4">
                {Object.values(filters).some(filter => filter !== '') 
                  ? 'Try adjusting your filters or clear all filters to see more results.'
                  : 'There are no daily questions configured yet. Create some to get started!'
                }
              </p>
              <Button 
                variant="outline"
                onClick={() => {
                  const currentPath = window.location.pathname.includes('/admin/') 
                    ? '/admin/questions/daily-config'
                    : '/question-setter/questions/daily-config';
                  navigate(currentPath);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Daily Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {dailyQuestions.map((dailyQuestion) => (
                <div
                  key={dailyQuestion.id}
                  className="border rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{dailyQuestion.text || `Question ID: ${dailyQuestion.questionId}`}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getDifficultyColor(dailyQuestion.difficulty)}>
                              {dailyQuestion.difficulty}
                            </Badge>
                            <Badge className={getTypeColor(dailyQuestion.type)}>
                              {dailyQuestion.type?.replace("_", " ") || "Unknown Type"}
                            </Badge>
                            {(() => {
                              const subjectName = subjects.find(s => s.id === dailyQuestion.subjectId)?.name;
                              return subjectName ? (
                                <Badge variant="outline">
                                  {subjectName}
                                </Badge>
                              ) : null;
                            })()}
                            <Badge variant="outline">
                              {dailyQuestion.date}
                            </Badge>
                            <Badge variant="outline">
                              {dailyQuestion.points} pts
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewQuestion(dailyQuestion)}
                            title="Edit Question (opens question editor)"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDailyQuestion(dailyQuestion);
                              setShowEditModal(true);
                            }}
                            title="Edit Daily Question Settings"
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFromDaily(dailyQuestion.id)}
                            title="Remove from Daily Questions (question will remain in question bank)"
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
                {totalElements} daily questions
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

      {/* Edit Daily Question Modal */}
      <EditDailyQuestionModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDailyQuestion(null);
        }}
        onSubmit={handleEditDailyQuestion}
        dailyQuestion={selectedDailyQuestion}
      />
    </div>
  );
};

export default DailyQuestionManagement;