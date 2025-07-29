import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { assessmentService } from "../../services/assessmentService";
import {
  Plus,
  Eye,
  Trash2,
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


const DailyQuestionManagement: React.FC = () => {
  const [dailyQuestions, setDailyQuestions] = useState<DailyQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<DailyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>([]);
  const [topics, setTopics] = useState<Array<{ id: number; name: string; subjectId: number }>>([]);
  const [allTopics, setAllTopics] = useState<Array<{ id: number; name: string; subjectId: number }>>([]);
  
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
      
      const response = await assessmentService.getAllDailyQuestions(
        startDateStr, 
        endDate, 
        currentPage, 
        pageSize
      );
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
  }, [currentPage, pageSize]);



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

  const applyFilters = useCallback(() => {
    // Ensure dailyQuestions is an array
    if (!Array.isArray(dailyQuestions)) {
      console.warn('applyFilters: dailyQuestions is not an array:', dailyQuestions);
      setFilteredQuestions([]);
      return;
    }

    let filtered = [...dailyQuestions];

    // Date filter - filter by specific selected date
    if (filters.selectedDate) {
      filtered = filtered.filter(q => q.date === filters.selectedDate);
    }

    // Subject filter
    if (filters.subjectId) {
      filtered = filtered.filter(q => q.subjectId === parseInt(filters.subjectId));
    }

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(q => {
        const subjectName = subjects.find(s => s.id === q.subjectId)?.name || '';
        return q.text?.toLowerCase().includes(searchLower) ||
               subjectName.toLowerCase().includes(searchLower);
      });
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredQuestions(filtered);
  }, [dailyQuestions, filters, subjects]);

  useEffect(() => {
    loadDailyQuestions();
    loadSubjects();
    loadTopics();
  }, [loadDailyQuestions, currentPage, pageSize]);

  useEffect(() => {
    // Only apply client-side filters if we're not using server-side pagination
    // For pagination, filtering should be handled on the server side
    applyFilters();
  }, [applyFilters]);

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
      alert('Question removed from daily questions successfully!');
    } catch (err) {
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
              onClick={() => window.location.href = '/admin/daily-questions/create'}
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
                onChange={(e) => setFilters(prev => ({ ...prev, subjectId: e.target.value, topicId: '' }))}
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
                onChange={(e) => setFilters(prev => ({ ...prev, topicId: e.target.value }))}
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
                onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
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
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
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
                onChange={(e) => setFilters(prev => ({ ...prev, selectedDate: e.target.value }))}
                placeholder="Select date"
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
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
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
              <Button variant="outline" size="sm" onClick={() => setFilters({
                subjectId: '',
                topicId: '',
                difficulty: '',
                type: '',
                search: '',
                selectedDate: ''
              })}>
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
          ) : filteredQuestions.length === 0 ? (
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
                onClick={() => window.location.href = '/admin/daily-questions/create'}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Daily Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((dailyQuestion) => (
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
                            <Badge className="bg-blue-100 text-blue-800">
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
                            title="View Question"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFromDaily(dailyQuestion.id)}
                            title="Remove from Daily Questions"
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
    </div>
  );
};

export default DailyQuestionManagement;