import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { useNavigate } from 'react-router-dom'
import { getTodayDateString } from '@/lib/utils'
import { 
  Plus,
  X
} from 'lucide-react'

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

interface DailyQuestion {
  id: number
  questionId: number
  date: string
  subjectId: number
  difficulty: string
  points: number
  bonusPoints?: number
  createdAt: string
}

const DailyQuestionConfig: React.FC = () => {
  const navigate = useNavigate()

  const [actionDate, setActionDate] = useState(getTodayDateString())
  const [questionConfigs, setQuestionConfigs] = useState<Record<number, {difficulty: string, points: number}>>({})
  const [dailyQuestionsList, setDailyQuestionsList] = useState<number[]>([])
  const [allQuestions, setAllQuestions] = useState<Question[]>([]) // All questions for left panel
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [existingDailyQuestions, setExistingDailyQuestions] = useState<DailyQuestion[]>([]) // Existing daily questions
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  
  // API-based pagination
  const [currentPage, setCurrentPage] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const questionsPerPage = 20
  
  // Toast state
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error', show: boolean}>({
    message: '', 
    type: 'success', 
    show: false
  })
  
  // Calculate if there are more questions available
  const hasMoreQuestions = allQuestions.length < totalQuestions

  // Toast functions
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type, show: true })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 3000) // Hide after 3 seconds
  }

  // Load all questions from API
  const loadQuestions = async (page: number = 0, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const params = {
        page,
        size: questionsPerPage
      }

      const response = await assessmentService.getQuestions(params)
      const data = response.data?.data

      if (data) {
        const newQuestions = data.questions || []
        
        if (append) {
          setAllQuestions(prev => [...prev, ...newQuestions])
        } else {
          setAllQuestions(newQuestions)
        }
        
        setTotalQuestions(data.totalElements || 0)
      }
    } catch (error) {
      console.error('Failed to load questions:', error)
      showToast('Failed to load questions. Please try again.', 'error')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  // Load existing daily questions for a specific date
  const loadDailyQuestionsForDate = async (date: string) => {
    try {
      setLoading(true)
      const response = await assessmentService.getDailyQuestions(date)
      const data = response.data?.data

      if (data && data.questions) {
        setExistingDailyQuestions(data.questions)
        const questionIds = data.questions.map((dq: DailyQuestion) => dq.questionId)
        setDailyQuestionsList(questionIds)
        
        // Set configurations for existing daily questions
        const configs: Record<number, {difficulty: string, points: number}> = {}
        data.questions.forEach((dq: DailyQuestion) => {
          configs[dq.questionId] = {
            difficulty: dq.difficulty || 'MEDIUM',
            points: dq.points || 10
          }
        })
        setQuestionConfigs(configs)
      } else {
        setExistingDailyQuestions([])
        setDailyQuestionsList([])
        setQuestionConfigs({})
      }
    } catch (error) {
      console.error('Failed to load daily questions:', error)
      setExistingDailyQuestions([])
      setDailyQuestionsList([])
      setQuestionConfigs({})
    } finally {
      setLoading(false)
    }
  }

  // Load more function
  const handleLoadMore = () => {
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    loadQuestions(nextPage, true)
  }

  useEffect(() => {
    // Load questions from API on component mount
    loadQuestions(0, false)
  }, [])

  useEffect(() => {
    // Load daily questions when date changes
    loadDailyQuestionsForDate(actionDate)
  }, [actionDate])

  const addQuestionToDailyList = (questionId: number) => {
    const question = allQuestions.find((q: Question) => q.id === questionId)
    if (!question) return
    
    setDailyQuestionsList(prev => [...prev, questionId])
    
    // Initialize config for new question
    setQuestionConfigs(prev => ({
      ...prev,
      [questionId]: {
        difficulty: question.difficulty || 'MEDIUM',
        points: 10
      }
    }))
  }

  const removeQuestionFromDailyList = (questionId: number) => {
    // Remove from daily questions list
    setDailyQuestionsList(prev => prev.filter(id => id !== questionId))
    
    // Remove config for removed question
    setQuestionConfigs(prev => {
      const newConfigs = { ...prev }
      delete newConfigs[questionId]
      return newConfigs
    })
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null) return
    
    const newList = [...dailyQuestionsList]
    const draggedItem = newList[draggedIndex]
    newList.splice(draggedIndex, 1)
    newList.splice(dropIndex, 0, draggedItem)
    
    setDailyQuestionsList(newList)
    setDraggedIndex(null)
  }

  const handleSubmit = async () => {
    if (dailyQuestionsList.length === 0) return

    setLoading(true)
    try {
      // Prepare the data with individual question configurations
      const questionConfigurations = dailyQuestionsList.map(questionId => ({
        questionId,
        difficulty: questionConfigs[questionId]?.difficulty || 'MEDIUM',
        points: questionConfigs[questionId]?.points || 10
      }))

      const response = await assessmentService.setDailyQuestions({
        date: actionDate,
        questionIds: dailyQuestionsList,
        subjectDistribution: {
          questionConfigurations
        }
      })

      if (response.data?.success) {
        showToast(`Daily questions updated successfully! ${dailyQuestionsList.length} questions set for ${actionDate}`, 'success')
        setTimeout(() => {
          navigate(-1) // Go back to previous page after showing toast
        }, 1500)
      }
    } catch (error) {
      console.error('Failed to add questions to daily questions:', error)
      showToast('Failed to add questions to daily questions. Please try again.', 'error')
    } finally {
      setLoading(false)
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
      case 'MCQ': return 'bg-blue-100 text-blue-800'
      case 'TRUE_FALSE': return 'bg-purple-100 text-purple-800'
      case 'FILL_BLANK': return 'bg-indigo-100 text-indigo-800'
      case 'NUMERIC': return 'bg-teal-100 text-teal-800'
      case 'ESSAY': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">


      {/* Date Selection */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <label className="text-lg font-semibold">Select Date</label>
            <input 
              type="date"
              className="p-3 border rounded-md"
              value={actionDate}
              onChange={(e) => setActionDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Two-panel layout */}
      <div className="grid grid-cols-2 gap-6 min-h-[600px]">
        {/* Left Panel - All Questions */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-gray-800">All Questions ({allQuestions.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto p-4 space-y-3">
              {allQuestions.map(question => {
                const isInDailyList = dailyQuestionsList.includes(question.id)
                return (
                <div key={question.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">Q#{question.id}</span>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                        <Badge className={getTypeColor(question.type)}>
                          {question.type?.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{question.text}</p>
                    </div>
                    {isInDailyList ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-3 text-red-600 hover:text-red-700 hover:border-red-300"
                        onClick={() => removeQuestionFromDailyList(question.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-3 text-green-600 hover:text-green-700 hover:border-green-300"
                        onClick={() => addQuestionToDailyList(question.id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
                )
              })}
              {allQuestions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No questions available
                </div>
              )}
            </div>
            
            {/* Load More Button */}
            {hasMoreQuestions && (
              <div className="border-t p-4">
                <Button 
                  variant="outline" 
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="w-full"
                >
                  {loadingMore ? 'Loading...' : `Load More Questions (${totalQuestions - allQuestions.length} remaining)`}
                </Button>
              </div>
            )}
            
          </CardContent>
        </Card>
        
        {/* Right Panel - Selected Daily Questions */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-gray-800">Daily Questions ({dailyQuestionsList.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto p-4 space-y-3">
              {dailyQuestionsList.map((questionId, index) => {
                const question = allQuestions.find((q: Question) => q.id === questionId)
                if (!question) return null
                
                return (
                  <div 
                    key={questionId}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`bg-white border rounded-lg p-4 cursor-move hover:shadow-sm transition-shadow ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                          <span className="text-sm font-medium text-gray-500">Q#{question.id}</span>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                          <Badge className={getTypeColor(question.type)}>
                            {question.type?.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{question.text}</p>
                        
                        {/* Show options for multiple choice and true/false questions */}
                        {question.options && question.options.length > 0 && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-gray-600 mb-1">Options:</p>
                            <div className="space-y-1">
                              {question.options.map((option: QuestionOption, optionIndex: number) => (
                                <div key={option.id} className={`text-xs p-2 rounded ${
                                  option.id === question.correctAnswerOptionId 
                                    ? 'bg-green-100 text-green-800 font-medium' 
                                    : 'bg-gray-50 text-gray-700'
                                }`}>
                                  <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span> {option.text}
                                  {option.id === question.correctAnswerOptionId && (
                                    <span className="ml-2 text-green-600">✓ Correct</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Show correct answer for non-multiple choice questions */}
                        {question.correctAnswerText && !question.options?.length && (
                          <div className="mb-2">
                            <p className="text-xs font-medium text-gray-600">Correct Answer:</p>
                            <p className="text-xs bg-green-100 text-green-800 p-2 rounded font-medium">
                              {question.correctAnswerText}
                            </p>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-3 text-red-600 hover:text-red-700 hover:border-red-300"
                        onClick={() => removeQuestionFromDailyList(questionId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Configuration for each question */}
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t">
                      <div>
                        <label className="block text-sm font-medium mb-1">Difficulty</label>
                        <select 
                          className="w-full p-2 border rounded text-sm"
                          value={questionConfigs[questionId]?.difficulty || question.difficulty}
                          onChange={(e) => setQuestionConfigs(prev => ({
                            ...prev,
                            [questionId]: {
                              ...prev[questionId],
                              difficulty: e.target.value,
                              points: prev[questionId]?.points || 10
                            }
                          }))}
                        >
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                          <option value="EXPERT">Expert</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Points</label>
                        <input 
                          type="number"
                          min="1"
                          max="100"
                          className="w-full p-2 border rounded text-sm"
                          value={questionConfigs[questionId]?.points || 10}
                          onChange={(e) => setQuestionConfigs(prev => ({
                            ...prev,
                            [questionId]: {
                              ...prev[questionId],
                              difficulty: prev[questionId]?.difficulty || question.difficulty,
                              points: parseInt(e.target.value) || 10
                            }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
              {dailyQuestionsList.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No questions selected for daily questions
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Ready to Submit</h3>
              <p className="text-sm text-gray-600">
                {dailyQuestionsList.length} questions configured for {actionDate}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={dailyQuestionsList.length === 0 || loading}
              >
                {loading ? 'Updating...' : `Set ${dailyQuestionsList.length} Questions for ${actionDate}`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-lg transition-all duration-300 ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default DailyQuestionConfig