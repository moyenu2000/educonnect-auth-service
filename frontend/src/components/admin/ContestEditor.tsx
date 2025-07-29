import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Calendar, Trophy, FileText, X } from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';
import { formatDateTimeForInput } from '../../lib/utils';
import { useToast } from '../../hooks/useToast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ContestForm {
  title: string;
  description: string;
  type: 'SPEED' | 'ACCURACY' | 'MIXED' | 'CODING';
  startTime: string;
  endTime: string;
  duration: number;
  problemIds: number[];
  prizes: string[];
  rules: string;
}

interface Question {
  id: number;
  text: string;
  type: string;
  subjectName: string;
  topicName?: string;
  difficulty: string;
  points: number;
  options?: Array<{
    id: number;
    text: string;
  }>;
  correctAnswerOptionId?: number;
  correctAnswerText?: string;
  explanation?: string;
  createdAt: string;
  updatedAt: string;
}

const ContestEditor: React.FC = () => {
  const { showToast } = useToast();
  const [isEdit, setIsEdit] = useState(false);
  const [contestId, setContestId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [form, setForm] = useState<ContestForm>({
    title: '',
    description: '',
    type: 'MIXED',
    startTime: '',
    endTime: '',
    duration: 120,
    problemIds: [],
    prizes: [''],
    rules: ''
  });

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  // Pagination for all questions
  const [currentPage, setCurrentPage] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const questionsPerPage = 20;

  useEffect(() => {
    // Check if we're in edit mode (both admin and question setter paths)
    const path = window.location.pathname;
    const editMatch = path.match(/\/(admin|question-setter)\/contests\/edit\/(\d+)/);
    
    if (editMatch) {
      setIsEdit(true);
      setContestId(parseInt(editMatch[2]));
      loadContest(parseInt(editMatch[2]));
    }

    loadQuestions();
  }, []);

  const loadContest = async (id: number) => {
    try {
      setLoading(true);
      const response = await assessmentService.getContestForEdit(id);
      
      console.log('Contest response:', response);
      
      // Handle the response structure from admin controller
      let contest;
      if (response.data && response.data.data) {
        contest = response.data.data;
      } else if (response.data) {
        contest = response.data;
      } else {
        throw new Error('Invalid response structure');
      }
      
      // Convert Long IDs to numbers for frontend
      const problemIds = contest.problemIds ? contest.problemIds.map((id: any) => Number(id)) : [];
      
      setForm({
        title: contest.title || '',
        description: contest.description || '',
        type: contest.type || 'MIXED',
        startTime: contest.startTime ? formatDateTimeForInput(new Date(contest.startTime)) : '',
        endTime: contest.endTime ? formatDateTimeForInput(new Date(contest.endTime)) : '',
        duration: contest.duration || 120,
        problemIds: problemIds,
        prizes: contest.prizes && contest.prizes.length > 0 ? contest.prizes : [''],
        rules: contest.rules || ''
      });

      if (problemIds.length > 0) {
        await loadSelectedQuestions(problemIds);
      }
    } catch (err: any) {
      console.error('Error loading contest:', err);
      setError('Failed to load contest details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async (page: number = 0, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      }

      const params = {
        page,
        size: questionsPerPage
      };

      const response = await assessmentService.getQuestions(params);
      console.log('Questions response:', response);
      
      // Handle different response structures
      let data;
      if (response.data && response.data.data) {
        data = response.data.data;
      } else if (response.data) {
        data = response.data;
      }

      if (data) {
        // Handle both paginated and simple array responses
        const newQuestions = data.questions || data.content || data || [];
        
        if (append) {
          setAllQuestions(prev => [...prev, ...newQuestions]);
        } else {
          setAllQuestions(newQuestions);
        }
        
        setTotalQuestions(data.totalQuestions || data.totalElements || newQuestions.length || 0);
        setCurrentPage(page);
      }
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions. Please refresh and try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  const loadSelectedQuestions = async (questionIds: number[]) => {
    try {
      console.log('Loading questions for IDs:', questionIds);
      
      const questionPromises = questionIds.map(async (id) => {
        try {
          const response = await assessmentService.getQuestionById(id);
          // Handle different response structures
          if (response.data && response.data.data) {
            return response.data.data;
          } else if (response.data) {
            return response.data;
          }
          return null;
        } catch (error) {
          console.warn(`Failed to load question ${id}:`, error);
          return null;
        }
      });
      
      const responses = await Promise.all(questionPromises);
      const validQuestions = responses.filter(question => question !== null);
      
      console.log(`Loaded ${validQuestions.length} out of ${questionIds.length} questions`);
      
      setSelectedQuestions(validQuestions);
      
      // Update form with only valid question IDs
      const validQuestionIds = validQuestions.map(q => q.id);
      setForm(prev => ({ ...prev, problemIds: validQuestionIds }));
      
    } catch (err) {
      console.error('Error loading selected questions:', err);
      setError('Some questions could not be loaded. Please check and re-add missing questions.');
    }
  };

  const handleInputChange = (field: keyof ContestForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePrizeChange = (index: number, value: string) => {
    const newPrizes = [...form.prizes];
    newPrizes[index] = value;
    setForm(prev => ({ ...prev, prizes: newPrizes }));
  };

  const addPrize = () => {
    setForm(prev => ({ ...prev, prizes: [...prev.prizes, ''] }));
  };

  const removePrize = (index: number) => {
    if (form.prizes.length > 1) {
      const newPrizes = form.prizes.filter((_, i) => i !== index);
      setForm(prev => ({ ...prev, prizes: newPrizes }));
    }
  };

  const addQuestionToContest = (question: Question) => {
    if (!selectedQuestions.some(q => q.id === question.id)) {
      const newSelected = [...selectedQuestions, question];
      setSelectedQuestions(newSelected);
      setForm(prev => ({ 
        ...prev, 
        problemIds: [...prev.problemIds, question.id]
      }));
    }
  };

  const removeQuestionFromContest = (questionId: number) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== questionId));
    setForm(prev => ({ 
      ...prev, 
      problemIds: prev.problemIds.filter(id => id !== questionId)
    }));
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    const newSelected = [...selectedQuestions];
    const [movedQuestion] = newSelected.splice(fromIndex, 1);
    newSelected.splice(toIndex, 0, movedQuestion);
    setSelectedQuestions(newSelected);
    setForm(prev => ({ 
      ...prev, 
      problemIds: newSelected.map(q => q.id)
    }));
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      moveQuestion(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  const loadMoreQuestions = () => {
    if (!loadingMore && allQuestions.length < totalQuestions) {
      loadQuestions(currentPage + 1, true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-orange-100 text-orange-800';
      case 'EXPERT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'MCQ': return 'bg-blue-100 text-blue-800';
      case 'TRUE_FALSE': return 'bg-purple-100 text-purple-800';
      case 'FILL_BLANK': return 'bg-indigo-100 text-indigo-800';
      case 'NUMERIC': return 'bg-pink-100 text-pink-800';
      case 'ESSAY': return 'bg-cyan-100 text-cyan-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const validateForm = (): string | null => {
    if (!form.title.trim()) return 'Title is required';
    if (!form.startTime) return 'Start time is required';
    if (!form.endTime) return 'End time is required';
    if (new Date(form.startTime) >= new Date(form.endTime)) {
      console.log('Start time:', form.startTime, 'End time:', form.endTime);
      return 'End time must be after start time';
    }
    if (form.duration < 5) return 'Duration must be at least 5 minutes';
    if (form.problemIds.length === 0) return 'At least one question must be selected';
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const contestData = {
        ...form,
        startTime: form.startTime,
        endTime: form.endTime,
        prizes: form.prizes.filter(prize => prize.trim() !== '')
      };

      if (isEdit && contestId) {
        await assessmentService.updateContest(contestId, contestData);
        showToast('Contest updated successfully!', 'success');
      } else {
        await assessmentService.createContest(contestData);
        showToast('Contest created successfully!', 'success');
      }

      // Redirect back to contest management (detect user type)
      const path = window.location.pathname;
      if (path.includes('/question-setter/')) {
        window.location.href = '/question-setter/contests';
      } else {
        window.location.href = '/admin/contests';
      }
    } catch (err: any) {
      console.error('Error saving contest:', err);
      const errorMessage = 'Failed to save contest. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-red-700">{error}</div>
              <button 
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contest Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter contest title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contest Type *
              </label>
              <select
                value={form.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="SPEED">Speed Contest</option>
                <option value="ACCURACY">Accuracy Contest</option>
                <option value="MIXED">Mixed Contest</option>
                <option value="CODING">Coding Contest</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter contest description"
            />
          </div>
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Calendar className="mr-2" size={20} />
            Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time *
              </label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time *
              </label>
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                min="5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="120"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two-panel layout for questions */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Panel - All Questions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Questions ({allQuestions.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 max-h-[600px] overflow-y-auto">
              {allQuestions.map((question) => {
                const isInContestList = selectedQuestions.some(q => q.id === question.id);
                return (
                  <div key={question.id} className="bg-white border rounded-lg p-4 mb-3 hover:shadow-sm transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-500">Q#{question.id}</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(question.type)}`}>
                            {question.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{question.text}</p>
                        <div className="text-xs text-gray-500">
                          <span>{question.subjectName}</span>
                          {question.topicName && <span> • {question.topicName}</span>}
                          <span> • {question.points} points</span>
                        </div>
                      </div>
                      <button
                        onClick={() => addQuestionToContest(question)}
                        disabled={isInContestList}
                        className={`ml-3 px-3 py-1 rounded text-sm font-medium transition-colors ${
                          isInContestList 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                        }`}
                      >
                        {isInContestList ? 'Added' : 'Add'}
                      </button>
                    </div>
                  </div>
                );
              })}
              
              {allQuestions.length < totalQuestions && (
                <button
                  onClick={loadMoreQuestions}
                  disabled={loadingMore}
                  className="w-full py-3 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  {loadingMore ? 'Loading...' : `Load More (${totalQuestions - allQuestions.length} remaining)`}
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Selected Questions */}
        <Card>
          <CardHeader className="bg-indigo-50">
            <CardTitle className="text-lg text-indigo-800">Contest Questions ({selectedQuestions.length})</CardTitle>
            <p className="text-sm text-indigo-600">Drag to reorder questions</p>
            {isEdit && form.problemIds.length > 0 && selectedQuestions.length !== form.problemIds.length && (
              <div className="text-xs text-yellow-700 mt-1">
                Warning: {form.problemIds.length - selectedQuestions.length} question(s) could not be loaded
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4 max-h-[600px] overflow-y-auto">
              {selectedQuestions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-sm">No questions selected</p>
                  <p className="text-xs">Add questions from the left panel</p>
                </div>
              ) : (
                selectedQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-3 cursor-move hover:shadow-sm transition-shadow ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-indigo-600">#{index + 1}</span>
                          <span className="text-sm font-medium text-gray-500">Q#{question.id}</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(question.difficulty)}`}>
                            {question.difficulty}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(question.type)}`}>
                            {question.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2 line-clamp-2">{question.text}</p>
                        <div className="text-xs text-gray-500">
                          <span>{question.subjectName}</span>
                          {question.topicName && <span> • {question.topicName}</span>}
                          <span> • {question.points} points</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeQuestionFromContest(question.id)}
                        className="ml-3 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prizes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Trophy className="mr-2" size={20} />
              Prizes
            </CardTitle>
            <Button onClick={addPrize} variant="outline">
              <Plus className="mr-2" size={16} />
              Add Prize
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {form.prizes.map((prize, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={prize}
                  onChange={(e) => handlePrizeChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={`Prize ${index + 1}`}
                />
                {form.prizes.length > 1 && (
                  <button
                    onClick={() => removePrize(index)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contest Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            value={form.rules}
            onChange={(e) => handleInputChange('rules', e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter contest rules and guidelines..."
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Save className="mr-2" size={20} />
              {saving ? 'Saving...' : 'Save Contest'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContestEditor;