import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { History, Clock, CheckCircle, XCircle, ArrowLeft, Play } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

interface PracticeSubmission {
  id: number
  userId: number
  questionId: number
  answer: string
  isCorrect: boolean
  pointsEarned: number
  timeTakenSeconds: number
  submittedAt: string
}

interface PracticeQuestion {
  id: number
  questionId: number
  text: string
  type: string
  difficulty: string
  points: number
  subjectName: string
  topicName?: string
}

const PracticeQuestionSubmissions: React.FC = () => {
  const navigate = useNavigate()
  const { questionId } = useParams<{ questionId: string }>()
  const [submissions, setSubmissions] = useState<PracticeSubmission[]>([])
  const [question, setQuestion] = useState<PracticeQuestion | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (questionId) {
      loadData()
    }
  }, [questionId])

  const loadData = async () => {
    if (!questionId) return

    try {
      setLoading(true)
      
      // Load question details and submissions in parallel
      const [questionResponse, submissionsResponse] = await Promise.all([
        assessmentService.getPracticeQuestion(parseInt(questionId)),
        assessmentService.getPracticeQuestionSubmissions(parseInt(questionId))
      ])

      if (questionResponse.data?.data) {
        setQuestion(questionResponse.data.data)
      }

      if (submissionsResponse.data?.data) {
        setSubmissions(submissionsResponse.data.data)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToPracticeQuestions = () => {
    navigate('/student/practice-questions')
  }

  const handlePracticeAgain = () => {
    if (question) {
      navigate(`/student/exam?type=practice&questionId=${question.questionId}`)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`
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

  const getStats = () => {
    const totalAttempts = submissions.length
    const correctAttempts = submissions.filter(s => s.isCorrect).length
    const totalPoints = submissions.reduce((sum, s) => sum + s.pointsEarned, 0)
    const bestScore = Math.max(...submissions.map(s => s.pointsEarned), 0)
    const averageTime = totalAttempts > 0 
      ? submissions.reduce((sum, s) => sum + s.timeTakenSeconds, 0) / totalAttempts 
      : 0

    return {
      totalAttempts,
      correctAttempts,
      totalPoints,
      bestScore,
      averageTime,
      accuracy: totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Question not found</h3>
        <p className="text-muted-foreground mb-4">
          The requested practice question could not be found.
        </p>
        <Button onClick={handleBackToPracticeQuestions}>
          Back to Practice Questions
        </Button>
      </div>
    )
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button
            onClick={handleBackToPracticeQuestions}
            variant="ghost"
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Practice Questions
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Question Submissions</h1>
          <p className="text-muted-foreground">
            View all your attempts for this practice question
          </p>
        </div>
        <Button 
          onClick={handlePracticeAgain}
          className="flex items-center gap-2"
        >
          <Play className="h-4 w-4" />
          Practice Again
        </Button>
      </div>

      {/* Question Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Question Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(question.difficulty)}>
                {question.difficulty}
              </Badge>
              <Badge variant="outline">{question.points} pts</Badge>
              <Badge variant="secondary">{question.type}</Badge>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">{question.text}</h3>
              <div className="text-sm text-muted-foreground">
                <span>{question.subjectName}</span>
                {question.topicName && (
                  <>
                    <span> • </span>
                    <span>{question.topicName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Your Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalAttempts}
              </div>
              <div className="text-sm text-muted-foreground">Total Attempts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.correctAttempts}
              </div>
              <div className="text-sm text-muted-foreground">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.accuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.bestScore}
              </div>
              <div className="text-sm text-muted-foreground">Best Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {formatTime(Math.round(stats.averageTime))}
              </div>
              <div className="text-sm text-muted-foreground">Avg Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Submission History</h2>
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No submissions yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't attempted this question yet.
              </p>
              <Button onClick={handlePracticeAgain}>
                <Play className="h-4 w-4 mr-2" />
                Start Practicing
              </Button>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission, index) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">
                        Attempt #{submissions.length - index}
                      </Badge>
                      <Badge variant={submission.isCorrect ? "default" : "destructive"}>
                        <div className="flex items-center gap-1">
                          {submission.isCorrect ? (
                            <CheckCircle className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {submission.isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                      </Badge>
                      <Badge variant="outline">
                        {submission.pointsEarned} pts
                      </Badge>
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(submission.timeTakenSeconds)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Your Answer:</span>
                        <span className="ml-2 text-sm">{submission.answer}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Submitted:</span>
                        <span className="ml-2 text-sm">{formatDate(submission.submittedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default PracticeQuestionSubmissions