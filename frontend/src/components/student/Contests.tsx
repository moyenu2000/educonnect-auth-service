import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { assessmentService } from '@/services/assessmentService'
import { Trophy, Calendar, Users, Clock, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getCurrentTime, formatDate } from '@/lib/utils'

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
  const navigate = useNavigate()
  const [contests, setContests] = useState<Contest[]>([])
  const [loading, setLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(getCurrentTime())

  useEffect(() => {
    loadContests()
    
    // Update current time every second for real-time countdown
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 1000)

    return () => clearInterval(timer)
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

  const handleJoinContest = async (contest: Contest) => {
    try {
      await assessmentService.joinContest(contest.id)
      // Navigate to contest taking page
      navigate(`/student/contest/${contest.id}`)
    } catch (error) {
      console.error('Failed to join contest:', error)
      alert('Failed to join contest. Please try again.')
    }
  }

  const handleRegisterContest = async (contest: Contest) => {
    try {
      await assessmentService.joinContest(contest.id)
      alert('Successfully registered for the contest!')
      loadContests() // Reload to update status
    } catch (error) {
      console.error('Failed to register for contest:', error)
      alert('Failed to register for contest. Please try again.')
    }
  }

  const handleViewResults = (contest: Contest) => {
    navigate(`/student/contest/${contest.id}/results`)
  }

  const handleViewDetails = (contest: Contest) => {
    navigate(`/student/contest/${contest.id}/details`)
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

  const formatContestDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Dhaka'
    })
  }

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Ended'
    
    const days = Math.floor(seconds / (24 * 3600))
    const hours = Math.floor((seconds % (24 * 3600)) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getTimeUntilStart = (contest: Contest) => {
    const startTime = new Date(contest.startTime).getTime()
    const now = currentTime.getTime()
    return Math.max(0, Math.floor((startTime - now) / 1000))
  }

  const getTimeRemaining = (contest: Contest) => {
    const endTime = new Date(contest.endTime).getTime()
    const now = currentTime.getTime()
    return Math.max(0, Math.floor((endTime - now) / 1000))
  }

  const categorizeContests = () => {
    const now = currentTime.getTime()
    
    const live = contests.filter(contest => {
      const startTime = new Date(contest.startTime).getTime()
      const endTime = new Date(contest.endTime).getTime()
      return now >= startTime && now <= endTime
    })

    const upcoming = contests.filter(contest => {
      const startTime = new Date(contest.startTime).getTime()
      return now < startTime
    })

    const past = contests.filter(contest => {
      const endTime = new Date(contest.endTime).getTime()
      return now > endTime
    })

    return { live, upcoming, past }
  }

  const renderContestCard = (contest: Contest, section: 'live' | 'upcoming' | 'past') => {
    const timeUntilStart = getTimeUntilStart(contest)
    const timeRemaining = getTimeRemaining(contest)
    
    return (
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
            <div className="flex flex-col items-end gap-2">
              <Badge className={getStatusColor(contest.status)}>
                {contest.status}
              </Badge>
              {section === 'live' && timeRemaining > 0 && (
                <Badge className="bg-red-100 text-red-800">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTimeRemaining(timeRemaining)} left
                </Badge>
              )}
              {section === 'upcoming' && timeUntilStart > 0 && (
                <Badge className="bg-blue-100 text-blue-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Starts in {formatTimeRemaining(timeUntilStart)}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatContestDate(contest.startTime)}</span>
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
            {section === 'live' && (
              <Button onClick={() => handleJoinContest(contest)} className="bg-green-600 hover:bg-green-700">
                <Play className="mr-2 h-4 w-4" />
                Join Contest
              </Button>
            )}
            {section === 'upcoming' && (
              <Button variant="outline" onClick={() => handleRegisterContest(contest)}>
                Register
              </Button>
            )}
            {section === 'past' && (
              <Button variant="outline" onClick={() => handleViewResults(contest)}>
                View Results
              </Button>
            )}
            <Button variant="outline" onClick={() => handleViewDetails(contest)}>
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderContestSection = (title: string, contests: Contest[], section: 'live' | 'upcoming' | 'past', icon: React.ReactNode, emptyMessage: string) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {icon}
          <h2 className="text-2xl font-bold">{title}</h2>
          <Badge variant="outline" className="ml-auto">
            {contests.length}
          </Badge>
        </div>
        {contests.length > 0 ? (
          <div className="grid gap-4">
            {contests.map((contest) => renderContestCard(contest, section))}
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">{emptyMessage}</p>
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const { live, upcoming, past } = categorizeContests()

  return (
    <div className="space-y-8">
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

      {/* Live Contests */}
      {renderContestSection(
        "Live Contests", 
        live, 
        'live', 
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />,
        "No live contests at the moment"
      )}

      {/* Upcoming Contests */}
      {renderContestSection(
        "Upcoming Contests", 
        upcoming, 
        'upcoming', 
        <Clock className="w-6 h-6 text-blue-600" />,
        "No upcoming contests scheduled"
      )}

      {/* Past Contests */}
      {renderContestSection(
        "Past Contests", 
        past, 
        'past', 
        <Trophy className="w-6 h-6 text-gray-600" />,
        "No past contests to display"
      )}
    </div>
  )
}

export default Contests