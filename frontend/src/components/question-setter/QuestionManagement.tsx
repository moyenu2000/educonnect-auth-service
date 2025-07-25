import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Eye, 
  Calendar,
  BookOpen,
  Trophy,
  Check,
  X,
  Trash2
} from 'lucide-react'

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface QuestionOption {
  id: number
  text: string
}

interface Question {
  id: number
  text: string
  type: string
  difficulty: string
  subjectId: number
  subjectName?: string
  topicId?: number
  topicName?: string
  options?: QuestionOption[]
  correctAnswerOptionId?: number
  correctAnswerText?: string
  explanation?: string
  createdAt: string
  updatedAt: string
}

interface Subject {
  id: number
  name: string
}

const QuestionManagement: React.FC = () => {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  
  // Filters
  const [filters, setFilters] = useState({
    subjectId: '',
    difficulty: '',
    type: '',
    search: ''
  })

  // Debounced search to prevent excessive API calls
  const debouncedSearch = useDebounce(filters.search, 500)

  // Action states
  const [showActionPanel, setShowActionPanel] = useState(false)
  const [actionType, setActionType] = useState<'daily' | 'practice' | 'contest' | null>(null)
  const [actionDate, setActionDate] = useState(new Date().toISOString().split('T')[0])

  const loadQuestions = useCallback(async () => {
    try {
      // Only show questions loading for filter changes, not initial load
      if (questions.length > 0) {
        setQuestionsLoading(true)
      } else {
        setLoading(true)
      }
      
      const params = {
        page: currentPage,
        size: 20,
        ...(filters.subjectId && { subjectId: parseInt(filters.subjectId) }),
        ...(filters.difficulty && { difficulty: filters.difficulty }),
        ...(filters.type && { type: filters.type }),
        ...(debouncedSearch && { search: debouncedSearch })
      }

      const response = await assessmentService.getQuestions(params)
      console.log('API Response:', response) // Debug log
      const data = response.data?.data

      if (data) {
        console.log('Response data:', data) // Debug log
        setQuestions(data.questions || [])
        setTotalPages(data.totalPages || 0)
        setTotalElements(data.totalElements || 0)
      } else {
        console.log('No data in response') // Debug log
      }
    } catch (error) {
      console.error('Failed to load questions:', error)
      alert('Failed to load questions. Please check authentication and try again.')
    } finally {
      setLoading(false)
      setQuestionsLoading(false)
    }
  }, [currentPage, filters.subjectId, filters.difficulty, filters.type, debouncedSearch, questions.length])

  useEffect(() => {
    loadQuestions()
  }, [loadQuestions])

  // Reset page and load questions when filters change
  useEffect(() => {
    setCurrentPage(0)
  }, [filters.subjectId, filters.difficulty, filters.type, debouncedSearch])

  // Optimized filter handlers to prevent unnecessary re-renders
  const handleSubjectChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, subjectId: value }))
  }, [])

  const handleDifficultyChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, difficulty: value }))
  }, [])

  const handleTypeChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, type: value }))
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }))
  }, [])

  // Optimized pagination handlers
  const handlePreviousPage = useCallback(() => {
    setCurrentPage(prev => prev - 1)
  }, [])

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => prev + 1)
  }, [])

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      const response = await assessmentService.getSubjects()
      const data = response.data?.data
      if (data && data.content) {
        setSubjects(data.content)
      }
    } catch (error) {
      console.error('Failed to load subjects:', error)
    }
  }

  const handleEditQuestion = (questionId: number) => {
    const editPath = window.location.pathname.includes('/admin/') 
      ? `/admin/questions/create?edit=${questionId}`
      : `/question-setter/create?edit=${questionId}`
    navigate(editPath)
  }

  const handleDeleteQuestion = async (questionId: number, questionText: string) => {
    // Show confirmation dialog
    const truncatedText = questionText.length > 100 ? questionText.substring(0, 100) + '...' : questionText
    const confirmMessage = `Are you sure you want to delete this question?\n\n"${truncatedText}"`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      await assessmentService.deleteQuestion(questionId)
      
      // Remove from selected questions if it was selected
      setSelectedQuestions(prev => prev.filter(id => id !== questionId))
      
      // Reload questions to reflect the change
      await loadQuestions()
      
      alert('Question deleted successfully')
    } catch (error) {
      console.error('Failed to delete question:', error)
      alert('Failed to delete question. Please try again.')
    }
  }

  const handleQuestionSelect = (questionId: number) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    )
  }

  const handleSelectAll = () => {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([])
    } else {
      setSelectedQuestions(questions.map(q => q.id))
    }
  }

  const handleBulkAction = (type: 'daily' | 'practice' | 'contest') => {
    if (selectedQuestions.length === 0) {
      alert('Please select questions first')
      return
    }
    
    if (type === 'daily') {
      // Navigate to DailyQuestionConfig page with selected questions
      const currentPath = window.location.pathname.includes('/admin/') 
        ? '/admin/questions/daily-config'
        : '/question-setter/daily-config'
      
      navigate(currentPath, {
        state: {
          selectedQuestions,
          allQuestions: questions
        }
      })
    } else {
      setActionType(type)
      setShowActionPanel(true)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) {
      alert('Please select questions first')
      return
    }

    const confirmMessage = `Are you sure you want to delete ${selectedQuestions.length} selected question(s)?\n\nThis action cannot be undone.`
    
    if (!window.confirm(confirmMessage)) {
      return
    }

    try {
      // Delete questions one by one
      const deletePromises = selectedQuestions.map(questionId => 
        assessmentService.deleteQuestion(questionId)
      )
      
      await Promise.all(deletePromises)
      
      // Clear selected questions
      setSelectedQuestions([])
      
      // Reload questions to reflect the changes
      await loadQuestions()
      
      alert(`${selectedQuestions.length} question(s) deleted successfully`)
    } catch (error) {
      console.error('Failed to delete questions:', error)
      alert('Failed to delete some questions. Please try again.')
    }
  }


  const executeAction = async () => {
    if (!actionType || selectedQuestions.length === 0) return

    try {
      let response
      let message = ''

      switch (actionType) {
        case 'practice':
          response = await assessmentService.addQuestionsToPractice(selectedQuestions)
          message = 'Questions added to practice problems successfully'
          break

        case 'contest':
          // For contest creation, we'll redirect to contest creation page with selected questions
          localStorage.setItem('selectedQuestions', JSON.stringify(selectedQuestions))
          window.location.href = '/question-setter/create-contest'
          return

        default:
          return
      }

      if (response.data?.success) {
        alert(message)
        setSelectedQuestions([])
        setShowActionPanel(false)
        setActionType(null)
      }
    } catch (error) {
      console.error('Failed to execute action:', error)
      alert('Failed to execute action. Please try again.')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HARD': return 'bg-orange-100 text-orange-800'
      case 'EXPERT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'MULTIPLE_CHOICE': return 'bg-blue-100 text-blue-800'
      case 'TRUE_FALSE': return 'bg-purple-100 text-purple-800'
      case 'SHORT_ANSWER': return 'bg-indigo-100 text-indigo-800'
      case 'ESSAY': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading && questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Filters / controls / configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Question Filters & Actions</CardTitle>
            <Link to={window.location.pathname.includes('/admin/') ? '/admin/questions/create' : '/question-setter/create'}>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Question
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={filters.subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>{subject.name}</option>
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
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="TRUE_FALSE">True/False</option>
                <option value="SHORT_ANSWER">Short Answer</option>
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

      {/* Selection and Actions */}
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
          </CardContent>
        </Card>
      )}


      {/* Action Panel */}
      {showActionPanel && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-lg">
              {actionType === 'daily' && 'Add to Daily Questions'}
              {actionType === 'practice' && 'Add to Practice Problems'}
              {actionType === 'contest' && 'Create Contest'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {actionType === 'daily' && (
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
                <Button variant="outline" onClick={() => setShowActionPanel(false)}>
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedQuestions.length === questions.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {questionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                <span className="text-sm text-muted-foreground">Loading questions...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <div 
                  key={question.id} 
                  className={`border rounded-lg p-4 transition-colors ${
                    selectedQuestions.includes(question.id) 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'hover:bg-gray-50'
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
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                            <Badge className={getTypeColor(question.type)}>
                              {question.type?.replace('_', ' ')}
                            </Badge>
                            {question.subjectName && (
                              <Badge variant="outline">{question.subjectName}</Badge>
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
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteQuestion(question.id, question.text)}
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
                Showing {currentPage * 20 + 1} to {Math.min((currentPage + 1) * 20, totalElements)} of {totalElements} questions
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
  )
}

export default QuestionManagement