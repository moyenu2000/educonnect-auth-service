import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { discussionService } from '@/services/discussionService'
import { 
  Calendar, 
  Brain, 
  Trophy, 
  MessageSquare, 
  Flame,
  Star,
  Users,
  Target
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface StudentStats {
  currentStreak: number
  totalQuestionsAnswered: number
  accuracy: number
  rank: number
  totalPoints: number
  unreadMessages: number
  activeDiscussions: number
}

interface DailyQuestion {
  subject?: string
  difficulty?: string
}

interface UpcomingExam {
  title?: string
  date?: string
  type?: string
}

interface Discussion {
  title?: string
  authorName?: string
  answerCount?: number
  voteCount?: number
  subjectName?: string
  type?: string
}

const StudentDashboard: React.FC = () => {
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [dailyQuestions, setDailyQuestions] = useState<DailyQuestion[]>([])
  const [upcomingExams, setUpcomingExams] = useState<UpcomingExam[]>([])
  const [recentDiscussions, setRecentDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Load real student stats from analytics API
      try {
        const analyticsResponse = await assessmentService.getDashboardAnalytics()
        const analyticsData = analyticsResponse.data?.data
        
        if (analyticsData) {
          const overview = analyticsData.overview || {}
          const streaks = analyticsData.streaks || {}
          
          const realStats: StudentStats = {
            currentStreak: streaks.currentStreak || 0,
            totalQuestionsAnswered: overview.totalQuestions || 0,
            accuracy: overview.accuracy || 0,
            rank: overview.rank || 999,
            totalPoints: overview.totalPoints || 0,
            unreadMessages: 0, // This would come from discussion service
            activeDiscussions: 0 // This would come from discussion service
          }
          setStats(realStats)
        } else {
          // Fallback to default values if no analytics data
          setStats({
            currentStreak: 0,
            totalQuestionsAnswered: 0,
            accuracy: 0,
            rank: 999,
            totalPoints: 0,
            unreadMessages: 0,
            activeDiscussions: 0
          })
        }
      } catch (analyticsError) {
        console.warn('Failed to load analytics data:', analyticsError)
        // Use default values if analytics fail
        setStats({
          currentStreak: 0,
          totalQuestionsAnswered: 0,
          accuracy: 0,
          rank: 999,
          totalPoints: 0,
          unreadMessages: 0,
          activeDiscussions: 0
        })
      }

      // Load today's daily questions
      try {
        const dailyResponse = await assessmentService.getTodaysDailyQuestions()
        // Check if the response has the expected structure
        const dailyData = dailyResponse.data?.data || dailyResponse.data
        if (dailyData && Array.isArray(dailyData)) {
          setDailyQuestions(dailyData.slice(0, 3))
        } else if (dailyData && dailyData.questions && Array.isArray(dailyData.questions)) {
          setDailyQuestions(dailyData.questions.slice(0, 3))
        } else {
          console.log('Daily questions response structure:', dailyData)
          setDailyQuestions([])
        }
      } catch (dailyError) {
        console.warn('Failed to load daily questions:', dailyError)
        setDailyQuestions([])
      }

      // Load upcoming exams
      try {
        const examsResponse = await assessmentService.getUpcomingLiveExams()
        const examData = examsResponse.data?.data || examsResponse.data
        if (examData && Array.isArray(examData)) {
          setUpcomingExams(examData.slice(0, 3))
        } else if (examData && examData.content && Array.isArray(examData.content)) {
          setUpcomingExams(examData.content.slice(0, 3))
        } else {
          console.log('Live exams response structure:', examData)
          setUpcomingExams([])
        }
      } catch (examError) {
        console.warn('Failed to load upcoming exams:', examError)
        setUpcomingExams([])
      }

      // Load recent discussions
      try {
        const discussionsResponse = await discussionService.getDiscussions({ size: 5 })
        const discussionData = discussionsResponse.data?.data || discussionsResponse.data
        if (discussionData && Array.isArray(discussionData)) {
          setRecentDiscussions(discussionData)
        } else if (discussionData && discussionData.content && Array.isArray(discussionData.content)) {
          setRecentDiscussions(discussionData.content)
        } else {
          console.log('Discussions response structure:', discussionData)
          setRecentDiscussions([])
        }
      } catch (discussionError) {
        console.warn('Failed to load discussions:', discussionError)
        setRecentDiscussions([])
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
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
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Continue your learning journey
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/student/daily-questions">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Today's Questions
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.currentStreak || 0} days</div>
            <p className="text-xs text-muted-foreground">
              Keep it up! 🔥
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Solved</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalQuestionsAnswered || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.accuracy || 0}% accuracy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Rank</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#{stats?.rank || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.totalPoints || 0} points
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unreadMessages || 0}</div>
            <p className="text-xs text-muted-foreground">
              Unread messages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Activities */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Daily Questions
            </CardTitle>
            <CardDescription>
              Complete today's questions to maintain your streak
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dailyQuestions.length > 0 ? (
              <div className="space-y-3">
                {dailyQuestions.slice(0, 3).map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="text-sm font-medium">{question.subject || 'Mathematics'}</p>
                      <p className="text-xs text-muted-foreground">Question {index + 1}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {question.difficulty || 'Medium'}
                    </Badge>
                  </div>
                ))}
                <Link to="/student/daily-questions">
                  <Button className="w-full mt-3" variant="outline">
                    View All Questions
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No daily questions available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Upcoming Exams
            </CardTitle>
            <CardDescription>
              Live exams and contests you can participate in
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingExams.length > 0 ? (
              <div className="space-y-3">
                {upcomingExams.map((exam, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="text-sm font-medium">{exam.title || 'Math Quiz'}</p>
                      <p className="text-xs text-muted-foreground">{exam.date || 'Tomorrow'}</p>
                    </div>
                    <Badge variant="outline">
                      {exam.type || 'Live Exam'}
                    </Badge>
                  </div>
                ))}
                <Link to="/student/exams">
                  <Button className="w-full mt-3" variant="outline">
                    View All Exams
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-6">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No upcoming exams</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Jump into your learning activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/student/practice">
              <Button className="w-full justify-start" variant="outline">
                <Brain className="mr-2 h-4 w-4" />
                Practice Problems
              </Button>
            </Link>
            <Link to="/student/discussions">
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Join Discussions
              </Button>
            </Link>
            <Link to="/student/groups">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Study Groups
              </Button>
            </Link>
            <Link to="/student/ai">
              <Button className="w-full justify-start" variant="outline">
                <Brain className="mr-2 h-4 w-4" />
                AI Assistant
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Discussions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Discussions</CardTitle>
          <CardDescription>
            Latest questions and discussions from the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentDiscussions.length > 0 ? (
            <div className="space-y-3">
              {recentDiscussions.map((discussion, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded hover:bg-accent/50 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{discussion.title || 'How to solve quadratic equations?'}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      by {discussion.authorName || 'Anonymous'} • {discussion.answerCount || 3} answers • {discussion.voteCount || 5} votes
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{discussion.subjectName || 'Math'}</Badge>
                    <Badge className="bg-blue-100 text-blue-800">{discussion.type || 'Question'}</Badge>
                  </div>
                </div>
              ))}
              <Link to="/student/discussions">
                <Button className="w-full mt-3" variant="outline">
                  View All Discussions
                </Button>
              </Link>
            </div>
          ) : (
            <div className="text-center py-6">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No recent discussions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default StudentDashboard