import React, { useState, useEffect, useRef, useCallback } from 'react'
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
import { useToast } from '../../hooks/useToast'
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Save, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react'
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import LaTeXText from '../ui/LaTeXText'

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
  lastSubmittedAnswers: Record<number, string>
  timeRemaining?: number
  examType: 'daily' | 'practice' | 'contest'
  examDate?: string
  isAlreadySubmitted?: boolean
  viewOnly?: boolean
  isIndividualPractice?: boolean
}

const ExamPage: React.FC = () => {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  
  const [examState, setExamState] = useState<ExamState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    submissionResults: {},
    draftSubmissions: {},
    lastSubmittedAnswers: {},
    examType: 'daily'
  })
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<number, number>>({})
  const [pendingSaves, setPendingSaves] = useState<Record<number, boolean>>({})
  const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({})

  // Helper function for back navigation
  const handleBackNavigation = () => {
    const backPath = examState.examType === 'practice' ? '/student/practice-questions' : '/student/daily-questions'
    navigate(backPath)
  }

  // Helper function for back button text
  const getBackButtonText = () => {
    return examState.examType === 'practice' ? 'Practice Questions' : 'Daily Questions'
  }

  useEffect(() => {
    loadExamQuestions()
    
    // Cleanup function to clear all timers on unmount
    return () => {
      Object.values(debounceTimers.current).forEach(timer => {
        clearTimeout(timer)
      })
    }
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
      const viewOnly = searchParams.get('viewOnly') === 'true'
      const forceShowResults = searchParams.get('showResults') === 'true'
      const questionId = searchParams.get('questionId') // For practice questions
      const questionIndex = parseInt(searchParams.get('index') || '0') // For practice navigation
      const isIndividualPractice = searchParams.get('individual') === 'true' // For individual practice questions
      
      if (questionIds.length === 0 && !questionId) {
        navigate(examType === 'practice' ? '/student/practice-questions' : '/student/daily-questions')
        return
      }

      // For daily questions, check if already submitted
      let isAlreadySubmitted = false
      let existingResults: Record<number, SubmissionResult> = {}
      let existingAnswers: Record<number, string> = {}
      
      if (examType === 'practice') {
        // Practice questions don't have submission restrictions - always allow new attempts
        isAlreadySubmitted = false
      } else if (examType === 'daily') {
        // Check if trying to access daily questions for a different date than today
        const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        const requestedDate = examDate || today
        
        if (requestedDate !== today) {
          // For past or future dates, allow viewing in results mode regardless of submission status
          try {
            const statusResponse = await assessmentService.checkDailyQuestionSubmissionStatus(requestedDate)
            if (statusResponse.data?.data?.isSubmitted) {
              // If already submitted for past date, load existing results
              isAlreadySubmitted = true
              const submissionResults = statusResponse.data.data.submissionResults || []
              submissionResults.forEach((result: any) => {
                existingResults[result.questionId] = {
                  questionId: result.questionId,
                  answer: result.answer,
                  isCorrect: result.isCorrect,
                  correctAnswer: result.correctAnswer,
                  explanation: result.explanation || '',
                  pointsEarned: result.pointsEarned,
                  timeTaken: result.timeTaken
                }
                existingAnswers[result.questionId] = result.answer
              })
            } else {
              // Not submitted - treat as view-only mode to show answers without submission
              isAlreadySubmitted = false
              // For previous days, we'll automatically show results view even without submission
            }
          } catch (error) {
            console.error('Failed to check submission status:', error)
            // Even if status check fails, allow viewing previous day questions
            isAlreadySubmitted = false
          }
        } else {
          // Today's date - check submission status normally
          try {
            const statusResponse = await assessmentService.checkDailyQuestionSubmissionStatus(examDate || undefined)
            if (statusResponse.data?.data?.isSubmitted) {
              isAlreadySubmitted = true
              
              // Load existing submission results
              const submissionResults = statusResponse.data.data.submissionResults || []
              submissionResults.forEach((result: any) => {
                existingResults[result.questionId] = {
                  questionId: result.questionId,
                  answer: result.answer,
                  isCorrect: result.isCorrect,
                  correctAnswer: result.correctAnswer,
                  explanation: result.explanation || '',
                  pointsEarned: result.pointsEarned,
                  timeTaken: result.timeTaken
                }
                // Also populate the answers so they show in the UI
                existingAnswers[result.questionId] = result.answer
              })
            }
          } catch (error) {
            console.error('Failed to check submission status:', error)
          }
        }
      }

      // Load questions based on IDs
      const questions: Question[] = []
      const questionsToLoad = questionIds.length > 0 ? questionIds : (questionId ? [parseInt(questionId)] : [])
      
      for (const qId of questionsToLoad) {
        try {
          let response
          if (examType === 'practice') {
            // For practice questions, use public question API since we have questionId
            // The practice question API expects practice problem ID, not question ID
            response = await assessmentService.getPublicQuestion(qId)
          } else {
            // For daily questions, use public question API
            response = await assessmentService.getPublicQuestion(qId)
          }
          
          if (response.data?.data) {
            const questionData = response.data.data
            console.log(`Question ${qId} data:`, questionData) // Debug log
            questions.push(questionData)
          }
        } catch (error) {
          console.error(`Failed to load question ${qId}:`, error)
        }
      }
      
      console.log('Loaded questions:', questions) // Debug log

      setExamState({
        questions,
        currentQuestionIndex: questionIndex || 0, // Use provided index for practice question navigation
        answers: existingAnswers,
        submissionResults: existingResults,
        draftSubmissions: {},
        lastSubmittedAnswers: {},
        examType: examType as 'daily' | 'practice' | 'contest',
        examDate: examDate || undefined,
        timeRemaining: examType === 'contest' ? 3600 : undefined, // 1 hour for contests
        isAlreadySubmitted,
        viewOnly,
        isIndividualPractice // Add flag for individual practice questions
      })

      // Check if this is a previous day question (not today)
      const today = new Date().toISOString().split('T')[0]
      const requestedDate = examDate || today
      const isPreviousDay = requestedDate < today
      
      // If already submitted, in view-only mode, previous day question, or forced to show results, show results immediately
      if (isAlreadySubmitted || viewOnly || isPreviousDay || forceShowResults) {
        setShowResults(true)
      }

      // Initialize start time only for the first/current question
      const startTimes: Record<number, number> = {}
      const currentQuestion = questions[questionIndex || 0]
      if (currentQuestion) {
        startTimes[currentQuestion.id] = Date.now()
      }
      setQuestionStartTimes(startTimes)
    } catch (error) {
      console.error('Failed to load exam questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitDraftAnswer = useCallback(async (questionId: number, answer: string) => {
    // Immediately mark as draft submitted and track the submitted answer
    setExamState(prev => ({
      ...prev,
      draftSubmissions: {
        ...prev.draftSubmissions,
        [questionId]: true
      },
      lastSubmittedAnswers: {
        ...prev.lastSubmittedAnswers,
        [questionId]: answer
      }
    }))
    
    try {
      const startTime = questionStartTimes[questionId] || Date.now()
      const timeTaken = Math.round((Date.now() - startTime) / 1000)

      console.log(`Submitting draft answer for question ${questionId}: "${answer}"`)
      
      await assessmentService.submitDraftDailyQuestion(questionId, {
        answer,
        timeTaken
      })
      
      // Clear any pending save status for this question
      setPendingSaves(prev => ({ ...prev, [questionId]: false }))
      
      console.log(`Successfully auto-saved answer for question ${questionId}`)
    } catch (error) {
      console.error('Failed to auto-save answer:', error)
      // If submission failed, remove the draft submission flag and clear last submitted answer
      setExamState(prev => ({
        ...prev,
        draftSubmissions: {
          ...prev.draftSubmissions,
          [questionId]: false
        },
        lastSubmittedAnswers: {
          ...prev.lastSubmittedAnswers,
          [questionId]: ''
        }
      }))
      // Clear pending save status even on error
      setPendingSaves(prev => ({ ...prev, [questionId]: false }))
    }
  }, [questionStartTimes])

  const handleAnswerChange = useCallback(async (questionId: number, answer: string, immediate: boolean = false) => {
    // Update the answer locally
    setExamState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answer
      }
    }))

    // Auto-submit as draft if it's a daily question and not already submitted
    // Practice questions don't use draft submissions - they submit immediately
    if (examState.examType === 'daily' && !examState.isAlreadySubmitted) {
      if (immediate) {
        // For radio buttons and immediate answers, submit right away
        // Check if answer has changed from last submitted answer
        const lastSubmittedAnswer = examState.lastSubmittedAnswers[questionId]
        if (answer !== lastSubmittedAnswer) {
          submitDraftAnswer(questionId, answer)
        }
      } else {
        // For text inputs, use proper debouncing
        // Clear existing timer for this question to prevent wrong answers
        if (debounceTimers.current[questionId]) {
          clearTimeout(debounceTimers.current[questionId])
          delete debounceTimers.current[questionId]
        }
        
        // Mark as pending save
        setPendingSaves(prev => ({ ...prev, [questionId]: true }))
        
        // Set new timer with current answer value captured in closure
        debounceTimers.current[questionId] = setTimeout(async () => {
          // Check current state to avoid submitting if answer hasn't changed
          setExamState(currentState => {
            const lastSubmittedAnswer = currentState.lastSubmittedAnswers[questionId]
            if (answer !== lastSubmittedAnswer) {
              console.log(`Auto-saving answer for question ${questionId}: "${answer}"`)
              submitDraftAnswer(questionId, answer)
            }
            return currentState
          })
          
          // Clean up timer and pending status
          delete debounceTimers.current[questionId]
          setPendingSaves(prev => ({ ...prev, [questionId]: false }))
        }, 1500) // 1.5 seconds delay
      }
    }
  }, [examState.examType, submitDraftAnswer])

  // Auto-submit functionality is now handled in handleAnswerChange

  const submitPracticeAnswer = async (questionId: number, answer: string) => {
    try {
      const startTime = questionStartTimes[questionId] || Date.now()
      const timeTaken = Math.round((Date.now() - startTime) / 1000)

      console.log(`Submitting practice question ${questionId}: "${answer}"`)
      
      const response = await assessmentService.submitPracticeQuestionAnswer(questionId, {
        answer,
        timeTaken,
        deviceInfo: navigator.userAgent
      })
      
      const result = response.data.data
      
      // Store submission result for immediate feedback
      const submissionResult: SubmissionResult = {
        questionId: result.questionId,
        answer: result.answer,
        isCorrect: result.isCorrect,
        correctAnswer: result.correctAnswer,
        explanation: result.explanation || '',
        pointsEarned: result.pointsEarned,
        timeTaken: result.timeTakenSeconds
      }
      
      setExamState(prev => ({
        ...prev,
        submissionResults: {
          ...prev.submissionResults,
          [questionId]: submissionResult
        }
      }))
      
      // Show results immediately for practice questions
      setShowResults(true)
      
      console.log(`Successfully submitted practice question ${questionId}`)
    } catch (error) {
      console.error('Failed to submit practice question:', error)
      showToast('Failed to submit answer. Please try again.', 'error')
    }
  }

  const handleSubmitPracticeQuestion = async () => {
    const currentQuestion = examState.questions[examState.currentQuestionIndex]
    const answer = examState.answers[currentQuestion.id]
    
    if (!answer) {
      showToast('Please select an answer before submitting.', 'warning')
      return
    }
    
    setSubmitting(true)
    await submitPracticeAnswer(currentQuestion.id, answer)
    setSubmitting(false)
    setShowConfirmSubmit(false)
  }

  const handleSubmitFullExam = async () => {
    if (examState.examType === 'practice') {
      // For practice questions, submit only the current question
      await handleSubmitPracticeQuestion()
      return
    }
    
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
      showToast('Failed to submit exam. Please try again.', 'error')
    } finally {
      setSubmitting(false)
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

  // If daily questions are already submitted, show the submitted state with Show Results button
  if (examState.examType === 'daily' && examState.isAlreadySubmitted && !showResults) {
    const isToday = examState.examDate === new Date().toISOString().split('T')[0]
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Questions Completed</h1>
          <p className="text-muted-foreground">
            You have already submitted your answers for {examState.examDate ? new Date(examState.examDate).toLocaleDateString() : 'today'}
            {!isToday && <span className="block text-sm mt-1 text-amber-600">Note: Daily questions can only be submitted on their assigned date</span>}
          </p>
        </div>

        {/* Completed Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              All Questions Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <p className="text-lg">
                Congratulations! You have successfully completed all daily questions for this date.
              </p>
              <p className="text-muted-foreground">
                Your answers have been submitted and finalized. You can view your detailed results below.
              </p>
              
              <div className="flex items-center justify-center gap-3 pt-4">
                <Button
                  onClick={() => setShowResults(true)}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <CheckCircle className="h-4 w-4" />
                  Show Results
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBackNavigation}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to {getBackButtonText()}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }


  // Results Summary Component
  if (showResults) {
    const submittedCount = Object.keys(examState.submissionResults).length
    const correctCount = Object.values(examState.submissionResults).filter(r => r.isCorrect).length
    const totalPoints = Object.values(examState.submissionResults).reduce((sum, r) => sum + r.pointsEarned, 0)
    const totalPossiblePoints = examState.questions.reduce((sum, q) => sum + q.points, 0)
    const accuracy = submittedCount > 0 ? Math.round((correctCount / submittedCount) * 100) : 0
    
    // Check if this is a previous day question
    const today = new Date().toISOString().split('T')[0]
    const requestedDate = examState.examDate || today
    const isPreviousDay = requestedDate < today
    const isNotSubmitted = submittedCount === 0

    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {isPreviousDay && isNotSubmitted ? 'Daily Questions Review' : 'Exam Results'}
          </h1>
          <p className="text-muted-foreground">
            {isPreviousDay && isNotSubmitted 
              ? 'Review questions and answers from previous day'
              : examState.examType === 'daily' ? 'Daily Questions completed' : 
                examState.examType === 'practice' ? 'Practice completed' : 'Contest completed'
            }
          </p>
        </div>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>
              {isPreviousDay && isNotSubmitted ? 'Questions Overview' : 'Final Results'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isPreviousDay && isNotSubmitted ? (
              // Show different stats for non-submitted previous day questions
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{examState.questions.length}</div>
                  <div className="text-sm text-muted-foreground">Total Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{totalPossiblePoints}</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">Not Submitted</div>
                  <div className="text-sm text-muted-foreground">Status</div>
                </div>
              </div>
            ) : (
              // Show normal stats for submitted questions
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
            )}
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
                    
                    <p className="text-sm mb-3 font-medium">
                      <LaTeXText text={question.text} />
                    </p>
                    
                    {/* MCQ Options Display */}
                    {question.type === 'MCQ' && question.options && question.options.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Options:</h4>
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => {
                            const isCorrect = option.id === question.correctAnswerOptionId
                            const isUserAnswer = result && parseInt(result.answer) === option.id
                            const wasUserAnswerWithoutResult = !result && userAnswer && parseInt(userAnswer) === option.id
                            
                            return (
                              <div
                                key={option.id}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  isCorrect 
                                    ? 'bg-green-50 border-green-300 text-green-900 shadow-sm' 
                                    : isUserAnswer && !isCorrect
                                    ? 'bg-red-50 border-red-300 text-red-900 shadow-sm'
                                    : wasUserAnswerWithoutResult
                                    ? 'bg-yellow-50 border-yellow-300 text-yellow-900 shadow-sm'
                                    : 'bg-gray-50 border-gray-200 text-gray-700'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 font-medium text-xs">
                                    {String.fromCharCode(65 + optIndex)} {/* A, B, C, D */}
                                  </div>
                                  {isCorrect && <CheckCircle className="h-5 w-5 text-green-600" />}
                                  {(isUserAnswer && !isCorrect) && <span className="text-red-600 font-bold text-lg">✗</span>}
                                  {wasUserAnswerWithoutResult && <span className="text-yellow-600 font-bold text-lg">?</span>}
                                  <span className="flex-1">
                                    <LaTeXText text={option.text} />
                                  </span>
                                  <div className="flex gap-2">
                                    {isCorrect && <Badge variant="default" className="bg-green-600 text-white">✓ Correct</Badge>}
                                    {isUserAnswer && !isCorrect && <Badge variant="destructive">Your Answer</Badge>}
                                    {wasUserAnswerWithoutResult && <Badge className="bg-yellow-600 text-white">Your Answer (Not Submitted)</Badge>}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                    
                    {result && (
                      <div className="space-y-2 text-sm bg-gray-50 p-3 rounded">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <strong>Your Answer:</strong> 
                            <div className={`mt-1 ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                              {question.type === 'MCQ' ? 
                                question.options?.find(opt => opt.id === parseInt(result.answer))?.text || result.answer
                                : result.answer
                              }
                            </div>
                          </div>
                          <div>
                            <strong>Correct Answer:</strong> 
                            <div className="text-green-600 mt-1">
                              {question.type === 'MCQ' ? 
                                question.options?.find(opt => opt.id === question.correctAnswerOptionId)?.text || result.correctAnswer
                                : result.correctAnswer
                              }
                            </div>
                          </div>
                        </div>
                        {result.explanation && (
                          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                            <strong className="text-blue-700">Explanation:</strong> 
                            <div className="text-blue-600 mt-1">
                              <LaTeXText text={result.explanation} />
                            </div>
                          </div>
                        )}
                        <div className="mt-2 text-gray-600">
                          <strong>Time Taken:</strong> {result.timeTaken} seconds
                        </div>
                      </div>
                    )}
                    
                    {!result && userAnswer && (
                      <div className="text-sm bg-yellow-50 p-3 rounded border border-yellow-200">
                        <strong className="text-yellow-700">Your Answer (Not Submitted):</strong> 
                        <div className="text-yellow-600 mt-1">
                          {question.type === 'MCQ' ? 
                            question.options?.find(opt => opt.id === parseInt(userAnswer))?.text || userAnswer
                            : userAnswer
                          }
                        </div>
                      </div>
                    )}
                    
                    {!result && !userAnswer && (
                      <div className="text-sm bg-gray-100 p-3 rounded border border-gray-200">
                        <div className="text-gray-600">
                          <strong>Status:</strong> No answer provided
                        </div>
                        <div className="text-green-600 mt-2">
                          <strong>Correct Answer:</strong> 
                          {question.type === 'MCQ' ? 
                            question.options?.find(opt => opt.id === question.correctAnswerOptionId)?.text || question.correctAnswerText
                            : question.correctAnswerText
                          }
                        </div>
                        {question.explanation && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                            <strong className="text-blue-700">Explanation:</strong> 
                            <div className="text-blue-600 mt-1">
                              <LaTeXText text={question.explanation} />
                            </div>
                          </div>
                        )}
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
                onClick={handleBackNavigation}
                className="flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Back to {getBackButtonText()}
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
            {examState.viewOnly && (
              <Badge variant="outline" className="ml-3 text-sm font-normal">
                View Only - Previous Day
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            {examState.questions.length} questions total
            {examState.examDate && ` • ${new Date(examState.examDate).toLocaleDateString()}`}
            {examState.viewOnly && (
              <span className="block text-sm mt-1 text-amber-600">
                This is a previous day's questions. You can only view the answers.
              </span>
            )}
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

      {/* Progress Overview - Hidden for individual practice questions */}
      {!examState.isIndividualPractice && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Progress Overview</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Auto-saved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>Saving...</span>
                </div>
                <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span>Not answered</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {examState.questions.map((question, index) => {
              const isDraftSubmitted = examState.draftSubmissions[question.id]
              const hasAnswer = examState.answers[question.id]
              const isPending = pendingSaves[question.id]
              
              return (
                <button
                  key={index}
                  onClick={() => {
                    const element = document.getElementById(`question-${question.id}`)
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors relative ${
                    isDraftSubmitted
                      ? 'bg-green-500 text-white'
                      : isPending
                      ? 'bg-yellow-400 text-yellow-900'
                      : hasAnswer
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                  {isDraftSubmitted && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  {isPending && !isDraftSubmitted && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">⋯</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
      )}

      {/* Auto-save info */}
      {((examState.examType === 'daily' && !examState.isAlreadySubmitted) || examState.isIndividualPractice) && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {examState.isIndividualPractice 
              ? '💾 Your answer will be automatically saved when you select options or finish typing. Click "Submit Answer" to get the result.'
              : '💾 Your answers will be automatically saved when you select options or finish typing. Scroll down to answer all questions, then click "Submit All" at the bottom.'
            }
          </p>
        </div>
      )}

      {/* Already submitted info */}
      {examState.isAlreadySubmitted && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ These daily questions have already been submitted and finalized. Your answers cannot be changed.
          </p>
        </div>
      )}

      {/* All Questions */}
      <div className="space-y-8">
        {examState.questions.map((question, questionIndex) => {
          const currentAnswer = examState.answers[question.id]
          const isDraftSubmitted = examState.draftSubmissions[question.id]
          const isPending = pendingSaves[question.id]
          
          return (
            <Card key={question.id} id={`question-${question.id}`} className="scroll-mt-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-lg">Question {questionIndex + 1}</span>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {question.points} pts
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {question.subjectName && (
                      <Badge variant="outline">{question.subjectName}</Badge>
                    )}
                    {isDraftSubmitted && (
                      <Badge variant="default" className="bg-green-600">
                        <Save className="h-3 w-3 mr-1" />
                        Auto-saved
                      </Badge>
                    )}
                    {isPending && !isDraftSubmitted && (
                      <Badge variant="default" className="bg-yellow-600">
                        <Clock className="h-3 w-3 mr-1" />
                        Saving...
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6">
                  <LaTeXText text={question.text} />
                </p>
                
                {/* Multiple Choice Options */}
                {question.type === 'MCQ' && question.options && (
                  <div className="space-y-3">
                    {question.options.map((option, index) => (
                      <label
                        key={option.id}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          currentAnswer === option.text
                            ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200 ring-opacity-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25 hover:shadow-sm'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.text}
                          checked={currentAnswer === option.text}
                          onChange={() => !examState.isAlreadySubmitted && !examState.viewOnly && handleAnswerChange(question.id, option.text, true)}
                          disabled={examState.isAlreadySubmitted || examState.viewOnly}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          currentAnswer === option.text
                            ? 'border-blue-500 bg-blue-500 shadow-sm'
                            : 'border-gray-400 hover:border-blue-400'
                        }`}>
                          {currentAnswer === option.text && (
                            <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                          )}
                        </div>
                        <span className={`flex-1 transition-colors duration-200 ${
                          currentAnswer === option.text ? 'text-blue-900 font-medium' : 'text-gray-700'
                        }`}>
                          <span className={`font-semibold mr-2 text-lg ${
                            currentAnswer === option.text ? 'text-blue-600' : 'text-gray-500'
                          }`}>{String.fromCharCode(65 + index)}.</span>
                          <LaTeXText text={option.text} />
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* True/False */}
                {question.type === 'TRUE_FALSE' && (
                  <div className="space-y-3">
                    {['True', 'False'].map((option) => (
                      <label
                        key={option}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                          currentAnswer === option
                            ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200 ring-opacity-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25 hover:shadow-sm'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option}
                          checked={currentAnswer === option}
                          onChange={() => !examState.isAlreadySubmitted && !examState.viewOnly && handleAnswerChange(question.id, option, true)}
                          disabled={examState.isAlreadySubmitted || examState.viewOnly}
                          className="sr-only"
                        />
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          currentAnswer === option
                            ? 'border-blue-500 bg-blue-500 shadow-sm'
                            : 'border-gray-400 hover:border-blue-400'
                        }`}>
                          {currentAnswer === option && (
                            <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                          )}
                        </div>
                        <span className={`flex-1 text-lg font-medium transition-colors duration-200 ${
                          currentAnswer === option ? 'text-blue-900' : 'text-gray-700'
                        }`}>
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Text Input for other types */}
                {(['FILL_BLANK', 'NUMERIC', 'ESSAY'].includes(question.type)) && (
                  <div className="space-y-3">
                    <textarea
                      placeholder={examState.isAlreadySubmitted || examState.viewOnly ? 'This question has been submitted' : `Enter your answer... ${isPending ? '(saving...)' : '(auto-saves after 1.5s)'}`}
                      value={currentAnswer || ''}
                      onChange={(e) => !examState.isAlreadySubmitted && !examState.viewOnly && handleAnswerChange(question.id, e.target.value)}
                      disabled={examState.isAlreadySubmitted || examState.viewOnly}
                      className={`w-full p-4 border rounded-lg resize-none ${isPending ? 'border-yellow-300' : ''} ${examState.isAlreadySubmitted || examState.viewOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      rows={question.type === 'ESSAY' ? 6 : 2}
                    />
                  </div>
                )}

                {/* Fallback: If no specific type matched, show a generic input */}
                {!(['MCQ', 'TRUE_FALSE'].includes(question.type)) && 
                 !(['FILL_BLANK', 'NUMERIC', 'ESSAY'].includes(question.type)) && (
                  <div className="space-y-3">
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
                      <p className="text-sm text-yellow-800">
                        Question type "{question.type}" - using generic text input
                      </p>
                    </div>
                    <textarea
                      placeholder={examState.isAlreadySubmitted || examState.viewOnly ? 'This question has been submitted' : `Enter your answer... ${isPending ? '(saving...)' : '(auto-saves after 1.5s)'}`}
                      value={currentAnswer || ''}
                      onChange={(e) => !examState.isAlreadySubmitted && !examState.viewOnly && handleAnswerChange(question.id, e.target.value)}
                      disabled={examState.isAlreadySubmitted || examState.viewOnly}
                      className={`w-full p-4 border rounded-lg resize-none ${isPending ? 'border-yellow-300' : ''} ${examState.isAlreadySubmitted || examState.viewOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                      rows={3}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

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
              {examState.isAlreadySubmitted ? (
                <Button
                  onClick={() => setShowResults(true)}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  <CheckCircle className="h-4 w-4" />
                  Show Results
                </Button>
              ) : (
                <Button
                  onClick={() => setShowConfirmSubmit(true)}
                  disabled={submitting || examState.viewOnly}
                  className="flex items-center gap-2"
                  size="lg"
                >
                  <CheckCircle className="h-4 w-4" />
                  {examState.isIndividualPractice ? 'Submit Answer' : 'Submit All Questions'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent className="sm:max-w-[500px] p-6 bg-white border-2 border-gray-200 shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-gray-900 text-center">
              {examState.isIndividualPractice ? 'Submit Answer?' : 'Submit All Daily Questions?'}
            </DialogTitle>
            <DialogDescription className="text-base text-gray-700 text-center leading-relaxed">
              {examState.isIndividualPractice 
                ? 'This will submit your answer for this practice question. You will see the result and explanation after submission.'
                : 'This will finalize all your answers and calculate your marks. You will see detailed results with correct answers and explanations after submission. This action cannot be undone.'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowConfirmSubmit(false)}
              className="px-6 py-2 text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitFullExam}
              disabled={submitting}
              className={`px-6 py-2 text-white font-semibold transition-all duration-200 transform hover:scale-105 ${
                examState.isIndividualPractice
                  ? 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {submitting 
                ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) 
                : (examState.isIndividualPractice ? 'Submit Answer' : 'Submit All')
              }
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ExamPage