import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { assessmentService } from "@/services/assessmentService";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import {
  ArrowLeft,
  Plus,
  Check,
  X,
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
  isInPracticeProblem?: boolean;
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

const AddPracticeQuestions: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [modalForm, setModalForm] = useState({
    difficulty: "",
    points: ""
  });

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
      console.log("API Response:", response);
      const data = response.data?.data;

      if (data) {
        console.log("Response data:", data);
        setQuestions(data.questions || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      } else {
        console.log("No data in response");
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

  const handleAddToPractice = (question: Question) => {
    setSelectedQuestion(question);
    setModalForm({
      difficulty: question.difficulty || "",
      points: ""
    });
    setShowAddModal(true);
  };

  const handleConfirmAddToPractice = async () => {
    if (!selectedQuestion) return;

    try {
      // Use the new API with difficulty and points
      await assessmentService.addQuestionsToPracticeWithDetails([{
        questionId: selectedQuestion.id,
        difficulty: modalForm.difficulty,
        points: parseInt(modalForm.points)
      }]);
      
      // Update the question's isInPracticeProblem status in the local state
      setQuestions(prevQuestions => 
        prevQuestions.map(question => 
          question.id === selectedQuestion.id 
            ? { ...question, isInPracticeProblem: true }
            : question
        )
      );
      
      setShowAddModal(false);
      setSelectedQuestion(null);
      setModalForm({ difficulty: "", points: "" });
      
      showToast("Question added to practice problems successfully", 'success');
    } catch (error) {
      console.error("Failed to add question to practice:", error);
      showToast("Failed to add question to practice. Please try again.", 'error');
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

  const goBack = () => {
    const backPath = window.location.pathname.includes("/admin/")
      ? "/admin/practice-problems"
      : "/question-setter/practice-problems";
    navigate(backPath);
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
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={goBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Practice Problems
              </Button>
              <CardTitle className="text-lg">
                Add Questions to Practice Problems
              </CardTitle>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters / controls / configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Question Filters
            </CardTitle>
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

      {/* Questions List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Questions ({totalElements})</CardTitle>
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
              {questions.map((question) => {
                const isAdded = question.isInPracticeProblem || false;
                return (
                  <div
                    key={question.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-4">
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
                              variant={isAdded ? "secondary" : "default"}
                              size="sm"
                              onClick={() => handleAddToPractice(question)}
                              disabled={isAdded}
                              className={isAdded ? "opacity-50" : ""}
                            >
                              {isAdded ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  Added
                                </>
                              ) : (
                                <>
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add to Practice
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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

      {/* Add to Practice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add to Practice Questions</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedQuestion(null);
                  setModalForm({ difficulty: "", points: "" });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {selectedQuestion && (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedQuestion.text}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getDifficultyColor(selectedQuestion.difficulty)}>
                      {selectedQuestion.difficulty}
                    </Badge>
                    <Badge className={getTypeColor(selectedQuestion.type)}>
                      {selectedQuestion.type?.replace("_", " ")}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Difficulty
                    </label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={modalForm.difficulty}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, difficulty: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Difficulty</option>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Points
                    </label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={modalForm.points}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, points: e.target.value })
                      }
                      placeholder="Enter points (e.g., 10)"
                      min="1"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedQuestion(null);
                      setModalForm({ difficulty: "", points: "" });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmAddToPractice}
                    disabled={!modalForm.difficulty || !modalForm.points}
                  >
                    Add to Practice
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddPracticeQuestions;