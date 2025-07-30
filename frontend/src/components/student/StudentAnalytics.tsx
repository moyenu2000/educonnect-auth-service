import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { assessmentService } from '@/services/assessmentService'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/useToast'
import {
  Calendar,
  FileQuestion,
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Target,
  BarChart3,
  TrendingUp,
  Award,
  Brain
} from 'lucide-react'

interface Submission {
  id: number
  questionId: number
  questionTitle: string
  questionText: string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  score: number
  maxScore: number
  timeSpent: number
  submittedAt: string
  difficulty: string
  subject: string
  topic: string
  type: 'DAILY' | 'PRACTICE' | 'CONTEST'
  contestName?: string
}

interface AnalyticsData {
  totalSubmissions: number
  correctSubmissions: number
  accuracy: number
  totalPoints: number
  averageTime: number
  totalQuestions: number
}

const StudentAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'daily' | 'practice' | 'contest'>('daily')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalyticsData()
    fetchSubmissions()
  }, [activeTab])

  const fetchAnalyticsData = async () => {
    try {
      const response = await assessmentService.getUserAnalytics('dashboard')
      if (response.success && response.data) {
        const overview = response.data.overview
        setAnalyticsData({
          totalSubmissions: overview.totalQuestions || 0,
          correctSubmissions: overview.correctAnswers || 0,
          accuracy: overview.accuracy || 0,
          totalPoints: overview.totalPoints || 0,
          averageTime: overview.averageTime || 0,
          totalQuestions: overview.totalQuestions || 0
        })
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  const fetchSubmissions = async () => {
    setLoading(true)
    setSubmissions([]) // Clear previous submissions when switching tabs
    try {
      let response
      switch (activeTab) {
        case 'daily':
          response = await assessmentService.getDailyQuestionSubmissions()
          break
        case 'practice':
          response = await assessmentService.getPracticeSubmissions()
          break
        case 'contest':
          response = await assessmentService.getContestSubmissions()
          break
        default:
          response = { success: false, data: [] }
      }

      console.log(`[${activeTab}] API Response:`, response)
      console.log(`[${activeTab}] Response.success:`, response.success)
      console.log(`[${activeTab}] Response.data:`, response.data)
      console.log(`[${activeTab}] Array.isArray(response.data):`, Array.isArray(response.data))

      // Extract the actual API response from axios response
      const apiResponse = response.data
      
      if (apiResponse.success && apiResponse.data) {
        // Transform the data to match our interface
        const transformedSubmissions: Submission[] = apiResponse.data.map((sub: any) => ({
          id: sub.id,
          questionId: sub.questionId,
          questionTitle: sub.questionTitle || `${activeTab === 'daily' ? 'Daily' : activeTab === 'practice' ? 'Practice' : 'Contest'} Question ${sub.questionId}`,
          questionText: sub.questionText || '',
          userAnswer: sub.answer,
          correctAnswer: sub.correctAnswer || '',
          isCorrect: sub.isCorrect,
          score: sub.score,
          maxScore: 10, // Default max score
          timeSpent: sub.timeSpent,
          submittedAt: sub.submittedAt,
          difficulty: sub.difficulty || 'MEDIUM',
          subject: sub.subject || 'General',
          topic: sub.topic || 'General',
          type: activeTab.toUpperCase() as 'DAILY' | 'PRACTICE' | 'CONTEST',
          contestName: sub.contestName
        }))
        console.log(`[${activeTab}] Transformed submissions:`, transformedSubmissions)
        setSubmissions(transformedSubmissions)
      } else {
        console.log(`[${activeTab}] API response failed or no data:`, apiResponse)
        setSubmissions([])
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch submissions',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const getSubmissionIcon = (type: string) => {
    switch (type) {
      case 'DAILY':
        return <Calendar className="h-4 w-4" />
      case 'PRACTICE':
        return <Brain className="h-4 w-4" />
      case 'CONTEST':
        return <Trophy className="h-4 w-4" />
      default:
        return <FileQuestion className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'hard':
        return 'bg-red-100 text-red-800'
      case 'expert':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your learning progress and submissions</p>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-blue-600">Performance Dashboard</span>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      {analyticsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Questions Solved</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.correctSubmissions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.accuracy.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Points</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalPoints}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Time</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(analyticsData.averageTime)}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'daily', label: 'Daily Questions', icon: Calendar },
          { key: 'practice', label: 'Practice Questions', icon: Brain },
          { key: 'contest', label: 'Contests', icon: Trophy }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'daily' | 'practice' | 'contest')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Submissions List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 capitalize">{activeTab} Submissions</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-8">
            <FileQuestion className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No submissions found for {activeTab} questions</p>
            <p className="text-xs text-gray-400 mt-2">Submissions array length: {submissions.length}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {submissions.map((submission) => (
              <Dialog key={submission.id}>
                <DialogTrigger asChild>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                    <div className="flex items-center gap-4">
                      {getSubmissionIcon(submission.type)}
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {submission.questionTitle}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getDifficultyColor(submission.difficulty)}>
                            {submission.difficulty}
                          </Badge>
                          <span className="text-sm text-gray-500">{submission.subject}</span>
                          {submission.contestName && (
                            <span className="text-sm text-blue-600">• {submission.contestName}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          {submission.isCorrect ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`font-medium ${
                            submission.isCorrect ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {submission.score}/{submission.maxScore}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          {formatTime(submission.timeSpent)}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {formatDate(submission.submittedAt)}
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white border border-gray-200 p-6">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="flex items-center gap-2">
                      {getSubmissionIcon(submission.type)}
                      Submission Details
                    </DialogTitle>
                    <DialogDescription>
                      Review your answer and see the correct solution
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Question Info */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={getDifficultyColor(submission.difficulty)}>
                          {submission.difficulty}
                        </Badge>
                        <Badge variant="outline">{submission.subject}</Badge>
                        <Badge variant="outline">{submission.topic}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{submission.questionTitle}</h3>
                      <p className="text-gray-700">{submission.questionText}</p>
                    </div>

                    {/* Answer Comparison */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Your Answer
                        </h4>
                        <div className={`p-3 rounded ${
                          submission.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                        }`}>
                          <p className="font-medium">{submission.userAnswer}</p>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          Correct Answer
                        </h4>
                        <div className="p-3 rounded bg-green-50 border border-green-200">
                          <p className="font-medium text-green-800">{submission.correctAnswer}</p>
                        </div>
                      </div>
                    </div>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{submission.score}/{submission.maxScore}</div>
                        <div className="text-sm text-gray-600">Score</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{formatTime(submission.timeSpent)}</div>
                        <div className="text-sm text-gray-600">Time Spent</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{formatDate(submission.submittedAt)}</div>
                        <div className="text-sm text-gray-600">Submitted</div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default StudentAnalytics