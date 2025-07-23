import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { Users, BookOpen, FileQuestion, Trophy, TrendingUp, Activity, Settings, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

interface AdminAnalytics {
  userStats: {
    totalUsers: number
    activeUsers: number
    newUsersThisWeek: number
    retentionRate: number
  }
  examStats: {
    totalExams: number
    activeExams: number
    completionRate: number
    averageScore: number
  }
  performanceStats: {
    overallAccuracy: number
    averageTime: number
    difficultyDistribution: Record<string, number>
  }
  engagementStats: {
    dailyActiveUsers: number
    avgSessionTime: number
    questionsPerDay: number
    streakParticipation: number
  }
}

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const response = await assessmentService.getAdminAnalytics()
      const data = response.data?.data || response.data
      
      if (data) {
        setAnalytics(data)
      } else {
        console.warn('No analytics data received')
        setAnalytics(null)
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setAnalytics(null)
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
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and monitor the EduConnect platform
          </p>
        </div>
        <Button>
          View Reports
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.userStats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics?.userStats?.newUsersThisWeek || 0} this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.examStats?.totalExams || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.examStats?.completionRate || 0}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.examStats?.activeExams || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active exams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.engagementStats?.dailyActiveUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Statistics</CardTitle>
            <CardDescription>
              Platform activity for this week
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">New Users This Week</span>
              <Badge variant="secondary">
                {analytics?.userStats?.newUsersThisWeek || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Questions Per Day</span>
              <Badge variant="secondary">
                {analytics?.engagementStats?.questionsPerDay || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Average Score</span>
              <Badge variant="secondary">
                {analytics?.examStats?.averageScore || 0}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Retention Rate</span>
              <Badge variant="secondary">
                {analytics?.userStats?.retentionRate || 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
            <Link to="/admin/questions">
              <Button className="w-full justify-start" variant="outline">
                <FileQuestion className="mr-2 h-4 w-4" />
                Manage Questions
              </Button>
            </Link>
            <Link to="/admin/daily-questions">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Daily Questions
              </Button>
            </Link>
            <Button className="w-full justify-start" variant="outline">
              <Trophy className="mr-2 h-4 w-4" />
              Create Contest
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>
            Current status of EduConnect services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <span>Auth Service</span>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span>Assessment Service</span>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span>Discussion Service</span>
              <Badge className="bg-green-100 text-green-800">Online</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminDashboard