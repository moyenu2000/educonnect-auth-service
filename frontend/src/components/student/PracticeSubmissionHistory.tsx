import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { assessmentService } from '@/services/assessmentService'
import { History, Calendar, Clock, CheckCircle, XCircle, ArrowLeft, Target } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../ui/pagination'

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

interface PracticeStats {
  totalSubmissions: number
  correctSubmissions: number
  totalPoints: number
  uniqueQuestions: number
  solvedQuestions: number
  accuracyPercentage: number
  averagePointsPerQuestion: number
}

const PracticeSubmissionHistory: React.FC = () => {
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState<PracticeSubmission[]>([])
  const [stats, setStats] = useState<PracticeStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadSubmissionHistory()
  }, [currentPage, pageSize, startDate, endDate])

  const loadData = async () => {
    try {
      const statsResponse = await assessmentService.getPracticeQuestionStats()
      if (statsResponse.data?.data) {
        setStats(statsResponse.data.data)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const loadSubmissionHistory = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: currentPage,
        size: pageSize
      }

      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const response = await assessmentService.getPracticeSubmissionHistory(params)
      const data = response.data.data

      if (data) {
        setSubmissions(data.content || [])
        setTotalElements(data.totalElements || 0)
        setTotalPages(data.totalPages || 0)
      }
    } catch (error) {
      console.error('Failed to load submission history:', error)
      setSubmissions([])
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(0)
  }

  const handleFilterChange = () => {
    setCurrentPage(0) // Reset to first page when filters change
  }

  const handleClearFilters = () => {
    setStartDate('')
    setEndDate('')
    setCurrentPage(0)
  }

  const handleBackToPracticeQuestions = () => {
    navigate('/student/practice-questions')
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

  if (loading && currentPage === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Practice Submission History</h1>
          <p className="text-muted-foreground">
            View all your practice question submissions and track your progress
          </p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Overall Statistics
            </CardTitle>
            <CardDescription>
              Your practice question performance summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalSubmissions}
                </div>
                <div className="text-sm text-muted-foreground">Total Submissions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.correctSubmissions}
                </div>
                <div className="text-sm text-muted-foreground">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.accuracyPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalPoints}
                </div>
                <div className="text-sm text-muted-foreground">Points Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div className="space-y-2 flex items-end">
              <Button onClick={handleClearFilters} variant="outline" className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : submissions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No submissions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your date filters or start practicing questions!
              </p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
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
                        <span className="text-sm font-medium text-gray-600">Question ID:</span>
                        <span className="ml-2 text-sm">{submission.questionId}</span>
                      </div>
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

      {/* Pagination */}
      {!loading && totalElements > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalElements}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            loading={loading}
          />
        </div>
      )}
    </div>
  )
}

export default PracticeSubmissionHistory