import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { assessmentService } from '@/services/assessmentService'
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Save, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'

interface QuestionOption {
  id: number
  text: string
}

interface Question {
  id: number
  text: string
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'NUMERIC' | 'ESSAY'
  difficulty: string
  options?: QuestionOption[]
  correctAnswerOptionId?: number
  correctAnswerText?: string
  explanation?: string
  points: number
  subjectName?: string
}

interface ExamState {
  questions: Question[]
  currentQuestionIndex: number
  answers: Record<number, string>
  savedAnswers: Record<number, boolean>
  timeRemaining?: number
  examType: 'daily' | 'practice' | 'contest'
  examDate?: string
}

const ExamPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const [examState, setExamState] = useState<ExamState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    savedAnswers: {},
    examType: 'daily'
  })
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSaving] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)

  useEffect(() => {
    loadExamQuestions()
  }, [])

  useEffect(() => {
    // Timer for contest mode
    if (examState.examType === 'contest' && examState.timeRemaining && examState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setExamState(prev => ({
          ...prev,
          timeRemaining: Math.max(0, (prev.timeRemaining || 0) - 1)
        }))
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [examState.examType, examState.timeRemaining])

  const loadExamQuestions = async () => {
    try {
      const examType = searchParams.get('type') || 'daily'
      const questionIds = searchParams.get('questions')?.split(',').map(Number) || []
      const examDate = searchParams.get('date')
      
      if (questionIds.length === 0) {
        navigate('/student/daily-questions')
        return
      }

      // Load questions based on IDs
      const questions: Question[] = []
      for (const questionId of questionIds) {
        try {
          const response = await assessmentService.getQuestion(questionId)
          if (response.data?.data) {
            const questionData = response.data.data
            console.log(`Question ${questionId} data:`, questionData) // Debug log
            questions.push(questionData)
          }
        } catch (error) {
          console.error(`Failed to load question ${questionId}:`, error)
        }
      }
      
      console.log('Loaded questions:', questions) // Debug log

      setExamState({
        questions,
        currentQuestionIndex: 0,
        answers: {},
        savedAnswers: {},
        examType: examType as 'daily' | 'practice' | 'contest',
        examDate,
        timeRemaining: examType === 'contest' ? 3600 : undefined // 1 hour for contests
      })
    } catch (error) {
      console.error('Failed to load exam questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setExamState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }))
  }

  const handleSaveCurrentQuestion = async () => {
    const currentQuestion = examState.questions[examState.currentQuestionIndex]
    const answer = examState.answers[currentQuestion.id]
    
    if (!answer) return

    setSaving(true)
    try {
      if (examState.examType === 'daily') {
        await assessmentService.submitDailyQuestion(currentQuestion.id, {
          answer,
          timeTaken: 30
        })
      }
      // Add similar handling for practice and contest modes here
      
      setExamState(prev => ({
        ...prev,
        savedAnswers: {
          ...prev.savedAnswers,
          [currentQuestion.id]: true
        }
      }))
    } catch (error) {
      console.error('Failed to save answer:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitFullExam = async () => {
    setSaving(true)
    try {
      // Submit all answers
      for (const question of examState.questions) {
        const answer = examState.answers[question.id]
        if (answer && !examState.savedAnswers[question.id]) {
          if (examState.examType === 'daily') {
            await assessmentService.submitDailyQuestion(question.id, {
              answer,
              timeTaken: 30
            })
          }
          // Add handling for other exam types
        }
      }
      
      // Navigate back with success message
      navigate('/student/daily-questions', { 
        state: { message: 'Exam submitted successfully!' }
      })
    } catch (error) {
      console.error('Failed to submit exam:', error)
    } finally {
      setSaving(false)
      setShowConfirmSubmit(false)
    }
  }

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < examState.questions.length) {
      setExamState(prev => ({
        ...prev,
        currentQuestionIndex: index
      }))
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-orange-100 text-orange-800'
      case 'expert':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (examState.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No questions found</h3>
        <p className="text-muted-foreground mb-4">The exam questions could not be loaded.</p>
        <Button onClick={() => navigate('/student/daily-questions')}>
          Go Back
        </Button>
      </div>
    )
  }

  const currentQuestion = examState.questions[examState.currentQuestionIndex]
  const currentAnswer = examState.answers[currentQuestion.id]
  const isCurrentSaved = examState.savedAnswers[currentQuestion.id]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {examState.examType === 'daily' ? 'Daily Questions' : 
             examState.examType === 'practice' ? 'Practice' : 'Contest'}
          </h1>
          <p className="text-muted-foreground">
            Question {examState.currentQuestionIndex + 1} of {examState.questions.length}
            {examState.examDate && ` • ${new Date(examState.examDate).toLocaleDateString()}`}
          </p>
        </div>
        
        {examState.timeRemaining !== undefined && (
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="h-5 w-5" />
            <span className={examState.timeRemaining < 300 ? 'text-red-600' : ''}>
              {formatTime(examState.timeRemaining)}
            </span>
          </div>
        )}
      </div>

      {/* Question Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigateToQuestion(examState.currentQuestionIndex - 1)}
              disabled={examState.currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {examState.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => navigateToQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index === examState.currentQuestionIndex
                      ? 'bg-primary text-primary-foreground'
                      : examState.answers[examState.questions[index].id]
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={() => navigateToQuestion(examState.currentQuestionIndex + 1)}
              disabled={examState.currentQuestionIndex === examState.questions.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Question {examState.currentQuestionIndex + 1}</CardTitle>
            <div className="flex items-center gap-2">
              {currentQuestion.subjectName && (
                <Badge variant="outline">{currentQuestion.subjectName}</Badge>
              )}
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="outline">
                {currentQuestion.points} pts
              </Badge>
              {isCurrentSaved && (
                <Badge variant="default" className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Saved
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6">{currentQuestion.text}</p>
          
          {/* Debug info - remove this after fixing */}
          <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
            <strong>Debug:</strong> Type: {currentQuestion.type}, Options: {currentQuestion.options?.length || 0}
          </div>
          
          {/* Multiple Choice Options */}
          {(currentQuestion.type === 'MCQ' || currentQuestion.type === 'MULTIPLE_CHOICE') && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <label
                  key={option.id}
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors ${
                    currentAnswer === option.text
                      ? 'border-primary bg-primary/5'
                      : 'border-input'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.text}
                    checked={currentAnswer === option.text}
                    onChange={() => handleAnswerChange(currentQuestion.id, option.text)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === option.text
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {currentAnswer === option.text && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="flex-1">
                    <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                    {option.text}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* True/False */}
          {currentQuestion.type === 'TRUE_FALSE' && (
            <div className="space-y-3">
              {['True', 'False'].map((option) => (
                <label
                  key={option}
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors ${
                    currentAnswer === option
                      ? 'border-primary bg-primary/5'
                      : 'border-input'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option}
                    checked={currentAnswer === option}
                    onChange={() => handleAnswerChange(currentQuestion.id, option)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    currentAnswer === option
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {currentAnswer === option && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span>{option}</span>
                </label>
              ))}
            </div>
          )}

          {/* Text Input for other types */}
          {(['FILL_BLANK', 'NUMERIC', 'ESSAY', 'SHORT_ANSWER', 'FILL_IN_BLANK'].includes(currentQuestion.type)) && (
            <div className="space-y-3">
              <textarea
                placeholder="Enter your answer..."
                value={currentAnswer || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="w-full p-4 border rounded-lg resize-none"
                rows={currentQuestion.type === 'ESSAY' ? 6 : 2}
              />
            </div>
          )}

          {/* Fallback: If no specific type matched, show a generic input */}
          {!(['MCQ', 'MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(currentQuestion.type)) && 
           !(['FILL_BLANK', 'NUMERIC', 'ESSAY', 'SHORT_ANSWER', 'FILL_IN_BLANK'].includes(currentQuestion.type)) && (
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                <p className="text-sm text-yellow-800">
                  Question type "{currentQuestion.type}" - using generic text input
                </p>
              </div>
              <textarea
                placeholder="Enter your answer..."
                value={currentAnswer || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="w-full p-4 border rounded-lg resize-none"
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigate('/student/daily-questions')}
            >
              Exit Exam
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleSaveCurrentQuestion}
                disabled={!currentAnswer || isCurrentSaved || submitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {submitting ? 'Saving...' : isCurrentSaved ? 'Saved' : 'Save Current'}
              </Button>
              
              <Button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={submitting}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Submit Exam
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Exam?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit your exam? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmSubmit(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFullExam}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ExamPage