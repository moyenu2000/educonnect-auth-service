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
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Save, 
  CheckCircle,
  AlertCircle,
  Trophy,
  Users,
  Calendar,
  Flag
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'
import { getCurrentTime } from '@/lib/utils'
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
  points: number
  subjectName?: string
}

interface Contest {
  id: number
  title: string
  description: string
  type: string
  status: string
  startTime: string
  endTime: string
  duration: number
  participants: number
}

interface ContestSubmission {
  questionId: number
  answer: string
  timeTaken: number
  timestamp: number
}

const ContestTaking: React.FC = () => {
  const navigate = useNavigate()
  const { contestId } = useParams<{ contestId: string }>()
  const { showToast } = useToast()
  
  const [contest, setContest] = useState<Contest | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submissions, setSubmissions] = useState<ContestSubmission[]>([])
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [showConfirmEnd, setShowConfirmEnd] = useState(false)
  const [contestCompleted, setContestCompleted] = useState(false)
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<number, number>>({})
  const [autoSaving, setAutoSaving] = useState<Record<number, boolean>>({})
  
  const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({})

  useEffect(() => {
    if (contestId) {
      loadContestData()
    }
    
    return () => {
      Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer))
    }
  }, [contestId])

  useEffect(() => {
    // Contest timer
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            handleAutoSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [timeRemaining])

  const loadContestData = async () => {
    try {
      setLoading(true)
      
      // Load contest details
      const contestResponse = await assessmentService.getStudentContest(parseInt(contestId!))
      const responseData = contestResponse.data?.data || contestResponse.data
      const contestData = responseData?.contest || responseData
      setContest(contestData)
      
      // Calculate time remaining
      const now = getCurrentTime().getTime()
      const endTime = new Date(contestData.endTime).getTime()
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000))
      setTimeRemaining(remaining)
      
      // Load contest questions
      let questionsData: any[] = []
      try {
        const questionsResponse = await assessmentService.getContestQuestions(parseInt(contestId!))
        const responseData = questionsResponse.data?.data || questionsResponse.data
        
        console.log('Contest questions response:', questionsResponse.data)
        console.log('Response data:', responseData)
        
        // Handle different response structures
        if (Array.isArray(responseData)) {
          questionsData = responseData
        } else if (responseData && Array.isArray(responseData.questions)) {
          questionsData = responseData.questions
        } else if (responseData && responseData.currentTime && Array.isArray(responseData.questions)) {
          // New structure with timing info
          questionsData = responseData.questions
        } else {
          console.warn('Unexpected questions response structure:', responseData)
          questionsData = []
        }
        
        console.log('Processed questions data:', questionsData)
        setQuestions(questionsData)
      } catch (questionsError) {
        console.error('Failed to load contest questions:', questionsError)
        // Continue without questions for now - we can handle this gracefully
        setQuestions([])
      }
      
      // Initialize start time for first question
      if (questionsData.length > 0) {
        setQuestionStartTimes({ [questionsData[0].id]: Date.now() })
      }
      
    } catch (error) {
      console.error('Failed to load contest data:', error)
      showToast('Failed to load contest. Please try again.', 'error')
      navigate('/student/contests')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = useCallback((questionId: number, answer: string) => {
    // Update answer locally
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    
    // Clear previous debounce timer
    if (debounceTimers.current[questionId]) {
      clearTimeout(debounceTimers.current[questionId])
    }
    
    // Set new debounce timer for auto-save (silent submission)
    debounceTimers.current[questionId] = setTimeout(() => {
      submitSilentAnswer(questionId, answer)
    }, 2000) // 2 second delay
  }, [])

  const submitSilentAnswer = async (questionId: number, answer: string) => {
    if (!answer.trim()) return
    
    try {
      setAutoSaving(prev => ({ ...prev, [questionId]: true }))
      
      const startTime = questionStartTimes[questionId] || Date.now()
      const timeTaken = Math.round((Date.now() - startTime) / 1000)
      
      // Silent submission - no feedback given to user
      await assessmentService.submitContestAnswer(parseInt(contestId!), questionId, {
        answer: answer.trim(),
        timeTaken
      })
      
      // Store submission locally for tracking
      const submission: ContestSubmission = {
        questionId,
        answer: answer.trim(),
        timeTaken,
        timestamp: Date.now()
      }
      
      setSubmissions(prev => {
        const filtered = prev.filter(s => s.questionId !== questionId)
        return [...filtered, submission]
      })
      
    } catch (error) {
      console.error('Failed to submit answer silently:', error)
    } finally {
      setAutoSaving(prev => ({ ...prev, [questionId]: false }))
    }
  }

  const handleQuestionNavigation = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentQuestionIndex - 1)
      : Math.min(questions.length - 1, currentQuestionIndex + 1)
    
    setCurrentQuestionIndex(newIndex)
    
    // Set start time for new question if not already set
    const questionId = questions[newIndex]?.id
    if (questionId && !questionStartTimes[questionId]) {
      setQuestionStartTimes(prev => ({ ...prev, [questionId]: Date.now() }))
    }
  }

  const handleSubmitAll = () => {
    setShowConfirmSubmit(true)
  }

  const handleConfirmSubmit = async () => {
    try {
      setSubmitting(true)
      
      // Submit any remaining unsaved answers
      const currentQuestion = questions[currentQuestionIndex]
      if (currentQuestion && answers[currentQuestion.id]) {
        await submitSilentAnswer(currentQuestion.id, answers[currentQuestion.id])
      }
      
      // Final contest submission (just marks as completed, no results shown)
      // This would be a separate API call to finalize the contest
      
      setShowConfirmSubmit(false)
      
      // Show completion message and redirect
      showToast('Contest submitted successfully! Results will be available after the contest ends.', 'success')
      navigate('/student/contests')
      
    } catch (error) {
      console.error('Failed to submit contest:', error)
      showToast('Failed to submit contest. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAutoSubmit = async () => {
    // Auto-submit when time runs out
    try {
      const currentQuestion = questions[currentQuestionIndex]
      if (currentQuestion && answers[currentQuestion.id]) {
        await submitSilentAnswer(currentQuestion.id, answers[currentQuestion.id])
      }
      
      showToast('Time is up! Your contest has been automatically submitted.', 'warning')
      navigate('/student/contests')
    } catch (error) {
      console.error('Failed to auto-submit contest:', error)
    }
  }

  const handleEndContest = () => {
    setShowConfirmEnd(true)
  }

  const handleConfirmEndContest = async () => {
    try {
      setSubmitting(true)
      
      // Submit current answer if any
      const currentQuestion = questions[currentQuestionIndex]
      if (currentQuestion && answers[currentQuestion.id]) {
        await submitSilentAnswer(currentQuestion.id, answers[currentQuestion.id])
      }
      
      // End the contest participation
      await assessmentService.endContest(parseInt(contestId!))
      
      setContestCompleted(true)
      setShowConfirmEnd(false)
      
      showToast('Contest completed successfully! You can now view your results.', 'success')
      navigate(`/student/contest/${contestId}/results`)
    } catch (error) {
      console.error('Failed to end contest:', error)
      showToast('Failed to end contest. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getSubmissionStatus = (questionId: number) => {
    return submissions.some(s => s.questionId === questionId)
  }

  const renderQuestion = (question: Question) => {
    const answer = answers[question.id] || ''
    const isSubmitted = getSubmissionStatus(question.id)
    const isSaving = autoSaving[question.id]

    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">
                Question {currentQuestionIndex + 1} of {questions.length}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{question.difficulty}</Badge>
                <Badge variant="outline">{question.points} points</Badge>
                {question.subjectName && (
                  <Badge variant="outline">{question.subjectName}</Badge>
                )}
                {isSubmitted && (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Saved
                  </Badge>
                )}
                {isSaving && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    <Save className="w-3 h-3 mr-1" />
                    Saving...
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            <LaTeXText text={question.text} />
          </p>
          
          {question.type === 'MCQ' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <label 
                  key={option.id} 
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    answer === option.text
                      ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200 ring-opacity-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25 hover:shadow-sm'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option.text}
                    checked={answer === option.text}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    answer === option.text
                      ? 'border-blue-500 bg-blue-500 shadow-sm'
                      : 'border-gray-400 hover:border-blue-400'
                  }`}>
                    {answer === option.text && (
                      <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    )}
                  </div>
                  <span className={`flex-1 transition-colors duration-200 ${
                    answer === option.text ? 'text-blue-900 font-medium' : 'text-gray-700'
                  }`}>
                    <span className={`font-semibold mr-2 text-lg ${
                      answer === option.text ? 'text-blue-600' : 'text-gray-500'
                    }`}>{String.fromCharCode(65 + index)}.</span>
                    <LaTeXText text={option.text} />
                  </span>
                </label>
              ))}
            </div>
          )}
          
          {question.type === 'TRUE_FALSE' && (
            <div className="space-y-3">
              {['True', 'False'].map(option => (
                <label 
                  key={option} 
                  className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    answer === option
                      ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200 ring-opacity-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25 hover:shadow-sm'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answer === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    answer === option
                      ? 'border-blue-500 bg-blue-500 shadow-sm'
                      : 'border-gray-400 hover:border-blue-400'
                  }`}>
                    {answer === option && (
                      <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    )}
                  </div>
                  <span className={`text-lg font-medium transition-colors duration-200 ${
                    answer === option ? 'text-blue-900' : 'text-gray-700'
                  }`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          )}
          
          {(question.type === 'FILL_BLANK' || question.type === 'NUMERIC' || question.type === 'ESSAY') && (
            <textarea
              value={answer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={question.type === 'ESSAY' ? 6 : 2}
              placeholder={`Enter your ${question.type === 'ESSAY' ? 'essay' : 'answer'} here...`}
            />
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!contest || questions.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-lg">Contest not found or no questions available</p>
        <Button onClick={() => navigate('/student/contests')} className="mt-4">
          Back to Contests
        </Button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Contest Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-6 w-6" />
                {contest.title}
              </CardTitle>
              <p className="text-gray-600 mt-2">{contest.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-red-600">
                {formatTime(timeRemaining)}
              </div>
              <p className="text-sm text-gray-500">Time Remaining</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Question Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => handleQuestionNavigation('prev')}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium ${
                index === currentQuestionIndex
                  ? 'bg-blue-600 text-white'
                  : getSubmissionStatus(questions[index].id)
                  ? 'bg-green-200 text-green-800'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          onClick={() => handleQuestionNavigation('next')}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Current Question */}
      {currentQuestion && renderQuestion(currentQuestion)}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button 
          onClick={handleEndContest}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
          size="lg"
          disabled={contestCompleted || submitting}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          End Contest
        </Button>
        <Button 
          onClick={handleSubmitAll}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
          size="lg"
          disabled={contestCompleted || submitting}
        >
          <Flag className="w-4 h-4 mr-2" />
          Submit All & End
        </Button>
      </div>

      {/* Submission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Submission Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            {submissions.length} of {questions.length} questions answered
          </p>
          <div className="mt-2 text-xs text-gray-500">
            Note: Answers are automatically saved as you type. No feedback will be shown until the contest ends.
          </div>
        </CardContent>
      </Card>

      {/* Confirm Submit Dialog */}
      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent className="sm:max-w-[500px] p-6 bg-white border-2 border-red-200 shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-red-900 text-center">
              Submit Contest
            </DialogTitle>
            <DialogDescription className="text-base text-gray-700 text-center leading-relaxed">
              Are you sure you want to submit your contest? This action cannot be undone.
              <br />
              <span className="font-semibold text-gray-900">
                You have answered {submissions.length} out of {questions.length} questions.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmSubmit(false)}
              className="px-6 py-2 text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmSubmit} 
              disabled={submitting}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </span>
              ) : (
                'Submit Contest'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm End Contest Dialog */}
      <Dialog open={showConfirmEnd} onOpenChange={setShowConfirmEnd}>
        <DialogContent className="sm:max-w-[500px] p-6 bg-white border-2 border-green-200 shadow-2xl">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-xl font-bold text-green-900 text-center">
              End Contest
            </DialogTitle>
            <DialogDescription className="text-base text-gray-700 text-center leading-relaxed">
              Are you sure you want to end your contest participation? Your current answers will be saved and your completion time will be recorded for ranking purposes.
              <br />
              <span className="font-semibold text-gray-900">
                You have answered {submissions.length} out of {questions.length} questions.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmEnd(false)}
              className="px-6 py-2 text-gray-700 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmEndContest} 
              disabled={submitting}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Ending Contest...
                </span>
              ) : (
                'End Contest'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ContestTaking