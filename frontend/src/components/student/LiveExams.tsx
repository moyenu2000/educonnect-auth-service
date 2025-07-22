import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { assessmentService } from '@/services/assessmentService'
import { GraduationCap, Calendar, Clock, BookOpen, Play } from 'lucide-react'

interface LiveExam {
  id: number
  title: string
  description: string
  subjectId: number
  classLevel: string
  scheduledAt: string
  duration: number
  passingScore: number
  status: string
  totalParticipants: number
  instructions?: string
}

const LiveExams: React.FC = () => {
  const [liveExams, setLiveExams] = useState<LiveExam[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLiveExams()
  }, [])

  const loadLiveExams = async () => {
    try {
      const response = await assessmentService.getLiveExams({ size: 20 })
      setLiveExams(response.data.data?.content || [])
    } catch (error) {
      console.error('Failed to load live exams:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
          <h1 className="text-3xl font-bold tracking-tight">Live Exams</h1>
          <p className="text-muted-foreground">
            Take live exams and tests scheduled by your teachers
          </p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          View Calendar
        </Button>
      </div>

      <div className="grid gap-4">
        {liveExams.length > 0 ? (
          liveExams.map((exam) => (
            <Card key={exam.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5" />
                      {exam.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {exam.description}
                    </CardDescription>
                    {exam.instructions && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Instructions:</strong> {exam.instructions}
                      </p>
                    )}
                  </div>
                  <Badge className={getStatusColor(exam.status)}>
                    {exam.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDateTime(exam.scheduledAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{exam.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{exam.classLevel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span>Pass: {exam.passingScore}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {exam.status === 'ACTIVE' && (
                    <Button>
                      <Play className="mr-2 h-4 w-4" />
                      Start Exam
                    </Button>
                  )}
                  {exam.status === 'SCHEDULED' && (
                    <Button variant="outline">
                      Register for Exam
                    </Button>
                  )}
                  {exam.status === 'COMPLETED' && (
                    <Button variant="outline">
                      View Results
                    </Button>
                  )}
                  <Button variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No live exams scheduled</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveExams