import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { assessmentService } from "@/services/assessmentService";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { getTodayDateString } from "@/lib/utils";
import {
  Plus,
  Eye,
  Check,
  X,
  Trash2,
  BarChart3,
  Clock,
  Users,
  Target,
  TrendingUp,
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

interface QuestionOption {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  type: string;
  difficulty: string;
  subjectId: number;
  subjectName?: string;
  topicId?: number;
  topicName?: string;
  options?: QuestionOption[];
  correctAnswerOptionId?: number;
  correctAnswerText?: string;
  explanation?: string;
  createdAt: string;
  updatedAt: string;
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

const QuestionManagement: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

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

  // Action states
  const [showActionPanel, setShowActionPanel] = useState(false);
  const [actionType, setActionType] = useState<
    "daily" | "practice" | "contest" | null
  >(null);
  const [actionDate, setActionDate] = useState(getTodayDateString());

  // Analytics states
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  const loadQuestions = useCallback(async () => {
    try {
      // Only show questions loading for filter changes, not initial load
      if (questions.length > 0) {
        setQuestionsLoading(true);
      } else {
        setLoading(true);
      }

      const params = {
        page: currentPage,
        size: 20,
        ...(filters.subjectId && { subjectId: parseInt(filters.subjectId) }),
        ...(filters.topicId && { topicId: parseInt(filters.topicId) }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.type && { type: filters.type }),
        ...(debouncedSearch && { search: debouncedSearch }),
      };

      const response = await assessmentService.getQuestions(params);
      console.log("API Response:", response); // Debug log
      const data = response.data?.data;

      if (data) {
        console.log("Response data:", data); // Debug log
        setQuestions(data.questions || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else {
        console.log("No data in response"); // Debug log
      }
    } catch (error) {
      console.error("Failed to load questions:", error);
      showToast(
        "Failed to load questions. Please check authentication and try again.",
        'error'
      );
    } finally {
      setLoading(false);
      setQuestionsLoading(false);
    }
  }, [
    currentPage,
    filters.subjectId,
    filters.topicId,
    filters.difficulty,
    filters.type,
    debouncedSearch,
    questions.length,
  ]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // Reset page and load questions when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [
    filters.subjectId,
    filters.topicId,
    filters.difficulty,
    filters.type,
    debouncedSearch,
  ]);

  // Optimized filter handlers to prevent unnecessary re-renders
  const handleSubjectChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, subjectId: value, topicId: "" })); // Reset topic when subject changes
  }, []);

  const handleTopicChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, topicId: value }));
  }, []);

  const handleDifficultyChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, difficulty: value }));
  }, []);

  const handleTypeChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, type: value }));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, search: value }));
  }, []);

  // Optimized pagination handlers
  const handlePreviousPage = useCallback(() => {
    setCurrentPage((prev) => prev - 1);
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  useEffect(() => {
    loadSubjects();
    loadTopics();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await assessmentService.getSubjects();
      const data = response.data?.data;
      if (data && data.content) {
        setSubjects(data.content);
      }
    } catch (error) {
      console.error("Failed to load subjects:", error);
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
      console.error("Failed to load topics:", error);
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

  const handleEditQuestion = (questionId: number) => {
    const editPath = window.location.pathname.includes("/admin/")
      ? `/admin/questions/create?edit=${questionId}`
      : `/question-setter/questions/create?edit=${questionId}`;
    navigate(editPath);
  };

  const handleViewAnalytics = async (questionId: number) => {
    setAnalyticsLoading(true);
    try {
      const response = await assessmentService.getQuestionAnalytics(questionId);
      const apiResponse = response.data;
      
      if (apiResponse.success && apiResponse.data) {
        setAnalyticsData(apiResponse.data);
      } else {
        showToast("Failed to load analytics data", 'error');
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
      showToast("Failed to load analytics data", 'error');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleDeleteQuestion = async (
    questionId: number,
    questionText: string
  ) => {
    // Show confirmation dialog
    const truncatedText =
      questionText.length > 100
        ? questionText.substring(0, 100) + "..."
        : questionText;
    const confirmMessage = `Are you sure you want to delete this question?\n\n"${truncatedText}"`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await assessmentService.deleteQuestion(questionId);

      // Remove from selected questions if it was selected
      setSelectedQuestions((prev) => prev.filter((id) => id !== questionId));

      // Reload questions to reflect the change
      await loadQuestions();

      showToast("Question deleted successfully", 'success');
    } catch (error) {
      console.error("Failed to delete question:", error);
      showToast("Failed to delete question. Please try again.", 'error');
    }
  };

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSelectAll = () => {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(questions.map((q) => q.id));
    }
  };


  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) {
      showToast("Please select questions first", 'warning');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedQuestions.length} selected question(s)?\n\nThis action cannot be undone.`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      // Delete questions one by one
      const deletePromises = selectedQuestions.map((questionId) =>
        assessmentService.deleteQuestion(questionId)
      );

      await Promise.all(deletePromises);

      // Clear selected questions
      setSelectedQuestions([]);

      // Reload questions to reflect the changes
      await loadQuestions();

      showToast(`${selectedQuestions.length} question(s) deleted successfully`, 'success');
    } catch (error) {
      console.error("Failed to delete questions:", error);
      showToast("Failed to delete some questions. Please try again.", 'error');
    }
  };

  const executeAction = async () => {
    if (!actionType || selectedQuestions.length === 0) return;

    try {
      let response;
      let message = "";

      switch (actionType) {
        case "practice":
          response = await assessmentService.addQuestionsToPractice(
            selectedQuestions
          );
          message = "Questions added to practice problems successfully";
          break;

        case "contest":
          // For contest creation, we'll redirect to contest creation page with selected questions
          localStorage.setItem(
            "selectedQuestions",
            JSON.stringify(selectedQuestions)
          );
          window.location.href = "/question-setter/create-contest";
          return;

        default:
          return;
      }

      if (response.data?.success) {
        showToast(message, 'success');
        setSelectedQuestions([]);
        setShowActionPanel(false);
        setActionType(null);
      }
    } catch (error) {
      console.error("Failed to execute action:", error);
      showToast("Failed to execute action. Please try again.", 'error');
    }
  };

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

  if (loading && questions.length === 0) {
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
              Question Filters & Actions
            </CardTitle>
            <Link
              to={
                window.location.pathname.includes("/admin/")
                  ? "/admin/questions/create"
                  : "/question-setter/questions/create"
              }
            >
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Question
              </Button>
            </Link>
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
                placeholder="Search questions..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection and Actions
      {selectedQuestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {selectedQuestions.length} question(s) selected
                </span>
                <Button variant="outline" size="sm" onClick={() => setSelectedQuestions([])}>
                  Clear Selection
                </Button>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('daily')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Add to Daily Questions
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('practice')}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Add to Practice
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkAction('contest')}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Create Contest
                </Button>

              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Action Panel */}
      {showActionPanel && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg">
              {actionType === "daily" && "Add to Daily Questions"}
              {actionType === "practice" && "Add to Practice Problems"}
              {actionType === "contest" && "Create Contest"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {actionType === "daily" && (
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <input
                    type="date"
                    className="mt-1 p-2 border rounded-md"
                    value={actionDate}
                    onChange={(e) => setActionDate(e.target.value)}
                  />
                </div>
              )}
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  onClick={() => setShowActionPanel(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={executeAction}>
                  <Check className="mr-2 h-4 w-4" />
                  Confirm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Questions ({totalElements})</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedQuestions.length === questions.length
                  ? "Deselect All"
                  : "Select All"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleBulkDelete}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {questionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <span className="text-sm text-muted-foreground">
                  Loading questions...
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    selectedQuestions.includes(question.id)
                      ? "border-blue-300 bg-blue-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => handleQuestionSelect(question.id)}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{question.text}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              className={getDifficultyColor(
                                question.difficulty
                              )}
                            >
                              {question.difficulty}
                            </Badge>
                            <Badge className={getTypeColor(question.type)}>
                              {question.type?.replace("_", " ")}
                            </Badge>
                            {question.subjectName && (
                              <Badge variant="outline">
                                {question.subjectName}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditQuestion(question.id)}
                            title="Edit Question"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                title="View Analytics"
                                onClick={() => handleViewAnalytics(question.id)}
                                className="text-blue-600 hover:text-blue-700 hover:border-blue-300"
                              >
                                <BarChart3 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border border-gray-200 p-6">
                              <DialogHeader className="mb-6">
                                <DialogTitle className="flex items-center gap-2">
                                  <BarChart3 className="h-5 w-5" />
                                  Question Analytics
                                </DialogTitle>
                                <DialogDescription>
                                  View submission statistics and performance metrics for this question
                                </DialogDescription>
                              </DialogHeader>
                              
                              {analyticsLoading ? (
                                <div className="flex items-center justify-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                              ) : analyticsData ? (
                                <div className="space-y-6">
                                  {/* Question Info */}
                                  <div className="border rounded-lg p-4 bg-gray-50">
                                    <h3 className="font-semibold text-lg mb-2">{analyticsData.questionText}</h3>
                                    <div className="flex items-center gap-2">
                                      <Badge className={getDifficultyColor(analyticsData.difficulty)}>
                                        {analyticsData.difficulty}
                                      </Badge>
                                      <Badge className={getTypeColor(analyticsData.type)}>
                                        {analyticsData.type?.replace("_", " ")}
                                      </Badge>
                                      <Badge variant="outline">{analyticsData.subjectName}</Badge>
                                      <Badge variant="outline">{analyticsData.topicName}</Badge>
                                    </div>
                                  </div>

                                  {/* Stats Cards */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm font-medium text-gray-600">Total Submissions</p>
                                          <p className="text-2xl font-bold text-gray-900">{analyticsData.totalSubmissions}</p>
                                        </div>
                                        <TrendingUp className="h-8 w-8 text-blue-600" />
                                      </div>
                                    </Card>
                                    
                                    <Card className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm font-medium text-gray-600">Accuracy</p>
                                          <p className="text-2xl font-bold text-gray-900">{analyticsData.accuracy}%</p>
                                        </div>
                                        <Target className="h-8 w-8 text-green-600" />
                                      </div>
                                    </Card>
                                    
                                    <Card className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm font-medium text-gray-600">Unique Users</p>
                                          <p className="text-2xl font-bold text-gray-900">{analyticsData.uniqueUsers}</p>
                                        </div>
                                        <Users className="h-8 w-8 text-purple-600" />
                                      </div>
                                    </Card>
                                    
                                    <Card className="p-4">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="text-sm font-medium text-gray-600">Avg Time</p>
                                          <p className="text-2xl font-bold text-gray-900">{analyticsData.averageTime}s</p>
                                        </div>
                                        <Clock className="h-8 w-8 text-orange-600" />
                                      </div>
                                    </Card>
                                  </div>

                                  {/* Submission Breakdown */}
                                  <div className="border rounded-lg p-4">
                                    <h4 className="font-semibold mb-3">Submission Breakdown by Context</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-lg font-bold text-blue-600">{analyticsData.submissionBreakdown.daily}</div>
                                        <div className="text-sm text-blue-600">Daily Questions</div>
                                      </div>
                                      <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-lg font-bold text-green-600">{analyticsData.submissionBreakdown.practice}</div>
                                        <div className="text-sm text-green-600">Practice Questions</div>
                                      </div>
                                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <div className="text-lg font-bold text-purple-600">{analyticsData.submissionBreakdown.contest}</div>
                                        <div className="text-sm text-purple-600">Contest Questions</div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Recent Submissions */}
                                  {analyticsData.recentSubmissions && analyticsData.recentSubmissions.length > 0 && (
                                    <div className="border rounded-lg p-4">
                                      <h4 className="font-semibold mb-3">Recent Submissions (Last 10)</h4>
                                      <div className="space-y-2">
                                        {analyticsData.recentSubmissions.map((submission: any, index: number) => (
                                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <div className="flex items-center gap-3">
                                              <Badge variant="outline">User {submission.userId}</Badge>
                                              <Badge className={submission.isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                                {submission.isCorrect ? "Correct" : "Incorrect"}
                                              </Badge>
                                              <span className="text-sm text-gray-600">{submission.context}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                              <span>{submission.pointsEarned} pts</span>
                                              <span>{submission.timeTaken}s</span>
                                              <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <p className="text-gray-500">No analytics data available</p>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDeleteQuestion(question.id, question.text)
                            }
                            title="Delete Question"
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
                {totalElements} questions
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

export default QuestionManagement;
