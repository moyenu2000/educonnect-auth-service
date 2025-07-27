import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2, Calendar, Clock, Trophy, FileText, Tag, X } from 'lucide-react';
import { assessmentService } from '../../services/assessmentService';
import { formatDateTimeForInput, convertToApiDateTime } from '../../lib/utils';

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
        startTime: convertToApiDateTime(form.startTime),
        endTime: convertToApiDateTime(form.endTime),
        prizes: form.prizes.filter(prize => prize.trim() !== '')
      };

      if (isEdit && contestId) {
        await assessmentService.updateContest(contestId, contestData);
      } else {
        await assessmentService.createContest(contestData);
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
      setError('Failed to save contest. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    // Redirect back to contest management (detect user type)
    const path = window.location.pathname;
    if (path.includes('/question-setter/')) {
      window.location.href = '/question-setter/contests';
    } else {
      window.location.href = '/admin/contests';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contest...</p>
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
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Trophy className="mr-3 text-indigo-600" />
                  {isEdit ? 'Edit Contest' : 'Create Contest'}
                </h1>
                <p className="mt-2 text-gray-600">
                  {isEdit ? 'Modify contest details and settings' : 'Set up a new programming contest'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50"
            >
              <Save className="mr-2" size={20} />
              {saving ? 'Saving...' : 'Save Contest'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Debug Information (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Debug Info</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <div>Contest ID: {contestId}</div>
              <div>Is Edit Mode: {isEdit ? 'Yes' : 'No'}</div>
              <div>Problem IDs in form: [{form.problemIds.join(', ')}]</div>
              <div>Selected Questions Count: {selectedQuestions.length}</div>
              <div>All Questions Count: {allQuestions.length}</div>
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
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
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="mr-2" size={20} />
            Schedule
          </h2>
          
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
        </div>

        {/* Two-panel layout for questions */}
        <div className="grid grid-cols-2 gap-6 min-h-[600px] mb-6">
          {/* Left Panel - All Questions */}
          <div className="bg-gray-50 rounded-lg shadow-sm">
            <div className="bg-white p-4 border-b rounded-t-lg">
              <h3 className="text-lg font-semibold text-gray-800">All Questions ({allQuestions.length})</h3>
            </div>
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
          </div>

          {/* Right Panel - Selected Questions */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-indigo-50 p-4 border-b rounded-t-lg">
              <h3 className="text-lg font-semibold text-indigo-800">Contest Questions ({selectedQuestions.length})</h3>
              <p className="text-sm text-indigo-600">Drag to reorder questions</p>
              {isEdit && form.problemIds.length > 0 && selectedQuestions.length !== form.problemIds.length && (
                <div className="text-xs text-yellow-700 mt-1">
                  Warning: {form.problemIds.length - selectedQuestions.length} question(s) could not be loaded
                </div>
              )}
            </div>
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
          </div>
        </div>

        {/* Prizes */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Trophy className="mr-2" size={20} />
              Prizes
            </h2>
            <button
              onClick={addPrize}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors flex items-center"
            >
              <Plus className="mr-2" size={16} />
              Add Prize
            </button>
          </div>

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
        </div>

        {/* Rules */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contest Rules</h2>
          <textarea
            value={form.rules}
            onChange={(e) => handleInputChange('rules', e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter contest rules and guidelines..."
          />
        </div>
      </div>
    </div>
  );
};

export default ContestEditor;