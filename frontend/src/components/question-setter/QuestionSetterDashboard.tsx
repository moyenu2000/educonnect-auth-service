import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileQuestion, BookOpen, Brain, Trophy, Plus, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

interface QuestionStats {
  totalQuestions: number
  questionsByDifficulty: {
    EASY: number
    MEDIUM: number
    HARD: number
    EXPERT: number
  }
  questionsBySubject: Array<{
    subjectName: string
    count: number
  }>
}

const QuestionSetterDashboard: React.FC = () => {
  const [stats, setStats] = useState<QuestionStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      // Mock data - you can replace with actual API call
      const mockStats: QuestionStats = {
        totalQuestions: 45,
        questionsByDifficulty: {
          EASY: 15,
          MEDIUM: 18,
          HARD: 10,
          EXPERT: 2
        },
        questionsBySubject: [
          { subjectName: 'Mathematics', count: 20 },
          { subjectName: 'Physics', count: 15 },
          { subjectName: 'Chemistry', count: 10 }
        ]
      }
      setStats(mockStats)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800'
      case 'HARD':
        return 'bg-orange-100 text-orange-800'
      case 'EXPERT':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
          <h1 className="text-3xl font-bold tracking-tight">Question Setter Dashboard</h1>
          <p className="text-muted-foreground">
            Create and manage questions for the platform
          </p>
        </div>
        <Link to="/question-setter/create-question">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Question
          </Button>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalQuestions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Questions created by you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Easy Questions</CardTitle>
            <Brain className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.questionsByDifficulty.EASY || 0}</div>
            <p className="text-xs text-muted-foreground">
              Beginner level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Questions</CardTitle>
            <Brain className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.questionsByDifficulty.MEDIUM || 0}</div>
            <p className="text-xs text-muted-foreground">
              Intermediate level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hard + Expert</CardTitle>
            <Brain className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats?.questionsByDifficulty.HARD || 0) + (stats?.questionsByDifficulty.EXPERT || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Advanced level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Distribution */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for question setters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/question-setter/create-question">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create New Question
              </Button>
            </Link>
            <Link to="/question-setter/questions">
              <Button className="w-full justify-start" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View All Questions
              </Button>
            </Link>
            <Link to="/question-setter/subjects">
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Subjects
              </Button>
            </Link>
            <Link to="/question-setter/contests">
              <Button className="w-full justify-start" variant="outline">
                <Trophy className="mr-2 h-4 w-4" />
                Create Contest
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Question Distribution</CardTitle>
            <CardDescription>
              Questions by difficulty level
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats?.questionsByDifficulty || {}).map(([difficulty, count]) => (
              <div key={difficulty} className="flex items-center justify-between">
                <span className="text-sm">{difficulty}</span>
                <Badge className={getDifficultyColor(difficulty)}>
                  {count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Subject Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Questions by Subject</CardTitle>
          <CardDescription>
            Distribution of your questions across subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.questionsBySubject.map((subject, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{subject.subjectName}</span>
                </div>
                <Badge variant="secondary">{subject.count} questions</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest question-setting activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="text-sm font-medium">Created "Quadratic Equations Basics"</p>
                <p className="text-xs text-muted-foreground">Mathematics • 2 hours ago</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Easy</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="text-sm font-medium">Updated "Newton's Laws of Motion"</p>
                <p className="text-xs text-muted-foreground">Physics • 1 day ago</p>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <div>
                <p className="text-sm font-medium">Created contest "Math Challenge Week"</p>
                <p className="text-xs text-muted-foreground">Contest • 3 days ago</p>
              </div>
              <Badge variant="outline">Contest</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuestionSetterDashboard