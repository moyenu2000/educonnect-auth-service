import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { 
  Trophy, 
  Medal, 
  Target, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Award,
  TrendingUp
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

interface Question {
  id: number
  text: string
  type: string
  difficulty: string
  points: number
  correctAnswer: string
  explanation?: string
}

interface SubmissionResult {
  questionId: number
  question: Question
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  pointsEarned: number
  timeTaken: number
  explanation?: string
}

interface ContestResult {
  contestId: number
  contestTitle: string
  totalQuestions: number
  correctAnswers: number
  totalPoints: number
  pointsEarned: number
  accuracy: number
  totalTimeTaken: number
  rank: number
  totalParticipants: number
  submissions: SubmissionResult[]
}

interface LeaderboardEntry {
  rank: number
  userId: number
  username: string
  fullName: string
  score: number
  accuracy: number
  timeTaken: number
}

const ContestResults: React.FC = () => {
  const navigate = useNavigate()
  const { contestId } = useParams<{ contestId: string }>()
  
  const [results, setResults] = useState<ContestResult | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'results' | 'leaderboard'>('results')

  useEffect(() => {
    if (contestId) {
      loadContestResults()
    }
  }, [contestId])

  const loadContestResults = async () => {
    try {
      setLoading(true)
      
      // Load contest results
      const resultsResponse = await assessmentService.getContestResults(parseInt(contestId!))
      const resultsData = resultsResponse.data?.data || resultsResponse.data
      
      // Load leaderboard
      const leaderboardResponse = await assessmentService.getContestLeaderboard(parseInt(contestId!))
      const leaderboardData = leaderboardResponse.data?.data || leaderboardResponse.data
      
      // Process results data to match expected format
      if (resultsData && resultsData.finalLeaderboard) {
        // Find current user's result in the leaderboard
        const currentUserId = 93 // This should ideally come from auth context
        const userResult = resultsData.finalLeaderboard.find((entry: any) => entry.userId === currentUserId)
        
        if (userResult) {
          const processedResults: ContestResult = {
            contestId: parseInt(contestId!),
            contestTitle: resultsData.contest?.title || 'Contest',
            totalQuestions: resultsData.totalQuestions || 0,
            correctAnswers: userResult.totalSubmissions || 0, // This is approximate
            totalPoints: resultsData.totalQuestions * 2, // Assuming 2 points per question
            pointsEarned: userResult.totalPoints || 0,
            accuracy: resultsData.totalQuestions > 0 ? (userResult.totalPoints / (resultsData.totalQuestions * 2)) * 100 : 0,
            totalTimeTaken: userResult.timeTaken || 0,
            rank: resultsData.finalLeaderboard.findIndex((entry: any) => entry.userId === currentUserId) + 1,
            totalParticipants: resultsData.totalParticipants || 0,
            submissions: [] // This would need to be loaded separately if needed
          }
          setResults(processedResults)
        }
      }
      
      // Set leaderboard data
      const leaderboardEntries = resultsData?.finalLeaderboard?.map((entry: any, index: number) => ({
        rank: index + 1,
        userId: entry.userId,
        username: `User ${entry.userId}`, // This should ideally come from user service
        fullName: `User ${entry.userId}`,
        score: entry.totalPoints || 0,
        accuracy: resultsData.totalQuestions > 0 ? (entry.totalPoints / (resultsData.totalQuestions * 2)) * 100 : 0,
        timeTaken: entry.timeTaken || 0
      })) || []
      
      setLeaderboard(leaderboardEntries)
      
    } catch (error) {
      console.error('Failed to load contest results:', error)
      alert('Failed to load contest results. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getAnswerStatusIcon = (isCorrect: boolean) => {
    return isCorrect ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <XCircle className="w-5 h-5 text-red-600" />
    )
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

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />
      default:
        return <Award className="w-6 h-6 text-blue-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg">Contest results not available</p>
        <Button onClick={() => navigate('/student/contests')} className="mt-4">
          Back to Contests
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/student/contests')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Contests
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{results.contestTitle}</h1>
            <p className="text-gray-600">Contest Results</p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex rounded-lg border">
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 rounded-l-lg ${
              activeTab === 'results' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            My Results
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-r-lg ${
              activeTab === 'leaderboard' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {activeTab === 'results' && (
        <>
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  {getRankIcon(results.rank)}
                  Your Rank
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">#{results.rank}</div>
                <p className="text-sm text-gray-600">out of {results.totalParticipants}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {results.pointsEarned}/{results.totalPoints}
                </div>
                <p className="text-sm text-gray-600">
                  {((results.pointsEarned / results.totalPoints) * 100).toFixed(1)}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{results.accuracy.toFixed(1)}%</div>
                <p className="text-sm text-gray-600">
                  {results.correctAnswers}/{results.totalQuestions} correct
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time Taken
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatTime(results.totalTimeTaken)}</div>
                <p className="text-sm text-gray-600">Total time</p>
              </CardContent>
            </Card>
          </div>

          {/* Question-by-Question Results */}
          <Card>
            <CardHeader>
              <CardTitle>Question Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.submissionResults.map((result, index) => (
                <div key={result.questionId} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getAnswerStatusIcon(result.isCorrect)}
                      <div>
                        <h3 className="font-medium">Question {index + 1}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getDifficultyColor(result.question.difficulty)}>
                            {result.question.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {result.pointsEarned}/{result.question.points} points
                          </Badge>
                          <Badge variant="outline">
                            {formatTime(result.timeTaken)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-800">{result.question.text}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Your Answer:</span>
                      <p className={`mt-1 p-2 rounded ${
                        result.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                      }`}>
                        {result.userAnswer || 'No answer provided'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Correct Answer:</span>
                      <p className="mt-1 p-2 rounded bg-green-50 text-green-800">
                        {result.correctAnswer}
                      </p>
                    </div>
                  </div>
                  
                  {result.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 rounded">
                      <span className="font-medium text-blue-800">Explanation:</span>
                      <p className="text-blue-700 mt-1">{result.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'leaderboard' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Contest Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div 
                  key={entry.userId} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.rank <= 3 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(entry.rank)}
                    <div>
                      <p className="font-medium">{entry.fullName || entry.username}</p>
                      <p className="text-sm text-gray-600">@{entry.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-bold">{entry.score} pts</p>
                        <p className="text-sm text-gray-600">{entry.accuracy.toFixed(1)}% accuracy</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTime(entry.timeTaken)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ContestResults