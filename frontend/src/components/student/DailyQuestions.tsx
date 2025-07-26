import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { Calendar, Flame, Trophy, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface DailyQuestionDetails {
  id: number
  questionId: number
  questionText: string
  difficulty: string
  points: number
  subjectId: number
  date: string
  attempted: boolean
  correct?: boolean
  userAnswer?: string
  pointsEarned?: number
  submittedAt?: string
}

interface DailyQuestionsByDate {
  [date: string]: DailyQuestionDetails[]
}

interface StreakInfo {
  currentStreak: number
  longestStreak: number
}

const DailyQuestions: React.FC = () => {
  const navigate = useNavigate()
  const [questionsByDate, setQuestionsByDate] = useState<DailyQuestionsByDate>({})
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<string[]>([])

  useEffect(() => {
    loadDailyQuestions()
  }, [])

  const generateDateRange = (days: number = 30): string[] => {
    const dates: string[] = []
    const today = new Date()
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }
    
    return dates
  }

  const loadDailyQuestions = async () => {
    try {
      const dates = generateDateRange(30) // Last 30 days including today
      setDateRange(dates)
      
      const questionsByDateMap: DailyQuestionsByDate = {}
      let allStreakInfo: StreakInfo | null = null
      
      // Load questions for each date
      for (const date of dates) {
        try {
          const response = await assessmentService.getDailyQuestions(date)
          const data = response.data.data
          
          if (data?.questions && data.questions.length > 0) {
            // Use the details endpoint to get full question information
            const detailsResponse = await assessmentService.getDailyQuestionDetails(date)
            const detailsData = detailsResponse.data.data
            
            if (detailsData?.questions) {
              questionsByDateMap[date] = detailsData.questions
            }
          }
          
          // Get streak info from the first successful response
          if (!allStreakInfo && data?.streakInfo) {
            allStreakInfo = data.streakInfo
          }
        } catch (error) {
          console.error(`Failed to load questions for ${date}:`, error)
        }
      }
      
      setQuestionsByDate(questionsByDateMap)
      setStreakInfo(allStreakInfo || { currentStreak: 0, longestStreak: 0 })
    } catch (error) {
      console.error('Failed to load daily questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSolveQuestions = (date: string) => {
    const questions = questionsByDate[date]
    if (!questions || questions.length === 0) return
    
    const questionIds = questions.map(q => q.questionId)
    navigate(`/student/exam?type=daily&date=${date}&questions=${questionIds.join(',')}`)
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  if (loading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Daily Questions</h1>
          <p className="text-muted-foreground">
            Complete today's questions to maintain your streak
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-600" />
            <span className="font-bold">{streakInfo?.currentStreak || 0} day streak</span>
          </div>
          <Badge variant="outline">
            Best: {streakInfo?.longestStreak || 0} days
          </Badge>
        </div>
      </div>

      {/* Streak Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Your Progress
          </CardTitle>
          <CardDescription>
            Keep your streak alive by answering questions daily
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {streakInfo?.currentStreak || 0}
              </div>
              <div className="text-sm text-muted-foreground">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {streakInfo?.longestStreak || 0}
              </div>
              <div className="text-sm text-muted-foreground">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(questionsByDate).flat().filter(q => q.attempted).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Questions by Date */}
      <div className="space-y-6">
        {dateRange.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No daily questions available</h3>
              <p className="text-muted-foreground">Check back later for daily questions!</p>
            </CardContent>
          </Card>
        ) : (
          dateRange.map((date) => {
            const questions = questionsByDate[date]
            if (!questions || questions.length === 0) return null
            
            const completedCount = questions.filter(q => q.attempted).length
            const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
            const earnedPoints = questions.reduce((sum, q) => sum + (q.pointsEarned || 0), 0)
            
            return (
              <Card key={date} className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <Calendar className="h-5 w-5" />
                        {formatDate(date)}
                        <Badge variant="outline" className="ml-2">
                          {completedCount}/{questions.length} completed
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {questions.length} question{questions.length > 1 ? 's' : ''} • {totalPoints} points available
                        {earnedPoints > 0 && ` • ${earnedPoints} points earned`}
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => handleSolveQuestions(date)}
                      className="flex items-center gap-2"
                      variant={completedCount === questions.length ? "outline" : "default"}
                    >
                      <Play className="h-4 w-4" />
                      {completedCount === questions.length ? 'Review' : 'Solve'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {questions.map((question, index) => (
                      <div key={question.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-600">Q{index + 1}</span>
                            <Badge className={getDifficultyColor(question.difficulty)}>
                              {question.difficulty}
                            </Badge>
                            <Badge variant="outline">
                              {question.points} pts
                            </Badge>
                            {question.attempted && (
                              <Badge variant={question.correct ? "default" : "destructive"}>
                                {question.correct ? '✓ Correct' : '✗ Incorrect'}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-800 line-clamp-2">
                            {question.questionText}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default DailyQuestions