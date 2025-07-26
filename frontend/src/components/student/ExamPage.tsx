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

interface SubmissionResult {
  questionId: number
  answer: string
  isCorrect: boolean
  correctAnswer: string
  explanation?: string
  pointsEarned: number
  timeTaken: number
}

interface ExamState {
  questions: Question[]
  currentQuestionIndex: number
  answers: Record<number, string>
  submissionResults: Record<number, SubmissionResult>
  draftSubmissions: Record<number, boolean>
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
    submissionResults: {},
    draftSubmissions: {},
    examType: 'daily'
  })
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<number, number>>({})

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
        submissionResults: {},
        draftSubmissions: {},
        examType: examType as 'daily' | 'practice' | 'contest',
        examDate,
        timeRemaining: examType === 'contest' ? 3600 : undefined // 1 hour for contests
      })

      // Initialize start times for all questions
      const startTimes: Record<number, number> = {}
      questions.forEach(q => {
        startTimes[q.id] = Date.now()
      })
      setQuestionStartTimes(startTimes)
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

  const handleSubmitCurrentQuestion = async () => {
    const currentQuestion = examState.questions[examState.currentQuestionIndex]
    const answer = examState.answers[currentQuestion.id]
    
    if (!answer) {
      alert('Please select an answer before submitting.')
      return
    }

    // Check if already submitted as draft
    if (examState.draftSubmissions[currentQuestion.id]) {
      alert('This question has already been saved.')
      return
    }

    setSubmitting(true)
    try {
      const startTime = questionStartTimes[currentQuestion.id] || Date.now()
      const timeTaken = Math.round((Date.now() - startTime) / 1000) // in seconds

      if (examState.examType === 'daily') {
        // Submit as draft - no marks calculated yet
        await assessmentService.submitDraftDailyQuestion(currentQuestion.id, {
          answer,
          timeTaken
        })
        
        // Mark as draft submitted (no results shown)
        setExamState(prev => ({
          ...prev,
          draftSubmissions: {
            ...prev.draftSubmissions,
            [currentQuestion.id]: true
          }
        }))

        // Show success message without revealing correctness
        alert('Answer saved successfully! Complete all questions and click "Submit Full" to see results.')
      }
      // Add similar handling for practice and contest modes here
      
    } catch (error) {
      console.error('Failed to submit question:', error)
      alert('Failed to save answer. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitFullExam = async () => {
    // Check if all questions have draft submissions
    const unsavedQuestions = examState.questions.filter(q => !examState.draftSubmissions[q.id])
    
    if (unsavedQuestions.length > 0) {
      const proceed = confirm(`You have ${unsavedQuestions.length} unsaved questions. These will not count towards your score. Do you want to continue?`)
      if (!proceed) {
        setShowConfirmSubmit(false)
        return
      }
    }

    setSubmitting(true)
    try {
      if (examState.examType === 'daily') {
        // First, submit any unsaved questions as drafts
        for (const question of unsavedQuestions) {
          const answer = examState.answers[question.id]
          if (answer) {
            try {
              const startTime = questionStartTimes[question.id] || Date.now()
              const timeTaken = Math.round((Date.now() - startTime) / 1000)

              await assessmentService.submitDraftDailyQuestion(question.id, {
                answer,
                timeTaken
              })
              
              setExamState(prev => ({
                ...prev,
                draftSubmissions: {
                  ...prev.draftSubmissions,
                  [question.id]: true
                }
              }))
            } catch (error) {
              console.error(`Failed to save question ${question.id}:`, error)
            }
          }
        }

        // Now trigger batch submission to finalize all and calculate marks
        const batchResponse = await assessmentService.batchSubmitDailyQuestions({
          date: examState.examDate || new Date().toISOString().split('T')[0]
        })

        // Parse batch response to get all submission results
        const batchData = batchResponse?.data?.data
        if (batchData?.submissions) {
          const newSubmissionResults: Record<number, SubmissionResult> = {}
          
          batchData.submissions.forEach((submission: any) => {
            newSubmissionResults[submission.questionId] = {
              questionId: submission.questionId,
              answer: submission.answer,
              isCorrect: submission.isCorrect,
              correctAnswer: submission.correctAnswer,
              explanation: submission.explanation || '',
              pointsEarned: submission.pointsEarned,
              timeTaken: submission.timeTaken
            }
          })

          setExamState(prev => ({
            ...prev,
            submissionResults: newSubmissionResults
          }))
        }
      }
      
      // Show results after batch submission
      setShowResults(true)
      setShowConfirmSubmit(false)
      
    } catch (error) {
      console.error('Failed to submit exam:', error)
      alert('Failed to submit exam. Please try again.')
    } finally {
      setSubmitting(false)
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

  // Results Summary Component
  if (showResults) {
    const submittedCount = Object.keys(examState.submissionResults).length
    const correctCount = Object.values(examState.submissionResults).filter(r => r.isCorrect).length
    const totalPoints = Object.values(examState.submissionResults).reduce((sum, r) => sum + r.pointsEarned, 0)
    const totalPossiblePoints = examState.questions.reduce((sum, q) => sum + q.points, 0)
    const accuracy = submittedCount > 0 ? Math.round((correctCount / submittedCount) * 100) : 0

    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Exam Results</h1>
          <p className="text-muted-foreground">
            {examState.examType === 'daily' ? 'Daily Questions' : 
             examState.examType === 'practice' ? 'Practice' : 'Contest'} completed
          </p>
        </div>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Final Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{submittedCount}</div>
                <div className="text-sm text-muted-foreground">Questions Answered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{correctCount}</div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{accuracy}%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{totalPoints}</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card>
          <CardHeader>
            <CardTitle>Question Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {examState.questions.map((question, index) => {
                const result = examState.submissionResults[question.id]
                const userAnswer = examState.answers[question.id]
                
                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Q{index + 1}</span>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline">{question.points} pts</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {result ? (
                          <>
                            <Badge variant={result.isCorrect ? "default" : "destructive"}>
                              {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                            </Badge>
                            <Badge variant="outline">{result.pointsEarned} pts earned</Badge>
                          </>
                        ) : (
                          <Badge variant="secondary">Not Answered</Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm mb-3">{question.text}</p>
                    
                    {result && (
                      <div className="space-y-2 text-sm">
                        <div>
                          <strong>Your Answer:</strong> <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'}>{result.answer}</span>
                        </div>
                        {!result.isCorrect && (
                          <div>
                            <strong>Correct Answer:</strong> <span className="text-green-600">{result.correctAnswer}</span>
                          </div>
                        )}
                        {result.explanation && (
                          <div>
                            <strong>Explanation:</strong> <span className="text-gray-600">{result.explanation}</span>
                          </div>
                        )}
                        <div>
                          <strong>Time Taken:</strong> {result.timeTaken} seconds
                        </div>
                      </div>
                    )}
                    
                    {!result && userAnswer && (
                      <div className="text-sm text-gray-600">
                        <strong>Your Answer (Not Finalized):</strong> {userAnswer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-3">
              <Button 
                onClick={() => navigate('/student/daily-questions')}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Back to Daily Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

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
              {examState.questions.map((question, index) => {
                const isDraftSubmitted = examState.draftSubmissions[question.id]
                const hasAnswer = examState.answers[question.id]
                
                return (
                  <button
                    key={index}
                    onClick={() => navigateToQuestion(index)}
                    className={`w-8 h-8 rounded-full text-sm font-medium transition-colors relative ${
                      index === examState.currentQuestionIndex
                        ? 'bg-primary text-primary-foreground'
                        : isDraftSubmitted
                        ? 'bg-blue-500 text-white'
                        : hasAnswer
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                    {isDraftSubmitted && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">S</span>
                      </div>
                    )}
                  </button>
                )
              })}
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
              {examState.draftSubmissions[currentQuestion.id] && (
                <Badge variant="default" className="bg-blue-600">
                  <Save className="h-3 w-3 mr-1" />
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
                onClick={handleSubmitCurrentQuestion}
                disabled={!currentAnswer || examState.draftSubmissions[currentQuestion.id] || submitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {submitting ? 'Saving...' : examState.draftSubmissions[currentQuestion.id] ? 'Saved' : 'Save Answer'}
              </Button>
              
              <Button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={submitting}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Submit Full
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit All Daily Questions?</DialogTitle>
            <DialogDescription>
              This will finalize all your answers and calculate your marks. You will see detailed results after submission. This action cannot be undone.
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