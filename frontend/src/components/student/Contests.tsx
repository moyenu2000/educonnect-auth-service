import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { assessmentService } from '@/services/assessmentService'
import { Trophy, Calendar, Users, Clock, Play } from 'lucide-react'

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
  maxParticipants?: number
}

const Contests: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContests()
  }, [])

  const loadContests = async () => {
    try {
      const response = await assessmentService.getContests({ size: 20 })
      setContests(response.data.data?.content || [])
    } catch (error) {
      console.error('Failed to load contests:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'UPCOMING': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
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
          <h1 className="text-3xl font-bold tracking-tight">Contests</h1>
          <p className="text-muted-foreground">
            Compete with other students in live contests
          </p>
        </div>
        <Button>
          <Trophy className="mr-2 h-4 w-4" />
          View Leaderboard
        </Button>
      </div>

      <div className="grid gap-4">
        {contests.length > 0 ? (
          contests.map((contest) => (
            <Card key={contest.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      {contest.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {contest.description}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(contest.status)}>
                    {contest.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(contest.startTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{contest.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{contest.participants} participants</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span>{contest.type}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {contest.status === 'ACTIVE' && (
                    <Button>
                      <Play className="mr-2 h-4 w-4" />
                      Join Contest
                    </Button>
                  )}
                  {contest.status === 'UPCOMING' && (
                    <Button variant="outline">
                      Register
                    </Button>
                  )}
                  {contest.status === 'COMPLETED' && (
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
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No contests available</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Contests