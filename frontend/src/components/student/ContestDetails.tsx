import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Award,
  ArrowLeft,
  Play,
  CheckCircle,
  AlertCircle,
  Gift
} from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCurrentTime, formatDate, formatDateTime } from '@/lib/utils'
import { useToast } from '../../hooks/useToast'
import LaTeXText from '../ui/LaTeXText'

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
  problemIds: number[]
  prizes: string[]
  rules?: string
  createdAt: string
  updatedAt: string
}

interface ContestResponse {
  contest: Contest
  questionsCount: number
  timeRemaining: number
  canParticipate: boolean
}

const ContestDetails: React.FC = () => {
  const navigate = useNavigate()
  const { contestId } = useParams<{ contestId: string }>()
  const { showToast } = useToast()
  
  const [contest, setContest] = useState<Contest | null>(null)
  const [questionsCount, setQuestionsCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(getCurrentTime())

  useEffect(() => {
    if (contestId) {
      loadContestDetails()
    }
  }, [contestId])

  useEffect(() => {
    // Update current time every second for real-time display
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const loadContestDetails = async () => {
    try {
      setLoading(true)
      const response = await assessmentService.getStudentContest(parseInt(contestId!))
      const responseData = response.data?.data || response.data
      const contestData = responseData?.contest || responseData
      console.log('Contest data:', contestData)
      console.log('Questions count:', responseData?.questionsCount)
      setContest(contestData)
      setQuestionsCount(responseData?.questionsCount || contestData?.problemIds?.length || 0)
      
    } catch (err: any) {
      console.error('Failed to load contest details:', err)
      setError('Failed to load contest details. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinContest = async () => {
    if (!contest) return
    
    try {
      console.log('Joining contest:', contest.id)
      const joinResponse = await assessmentService.joinContest(contest.id)
      console.log('Join contest response:', joinResponse)
      
      const result = joinResponse.data?.data || joinResponse.data
      
      if (result.alreadyJoined) {
        if (result.hasCompleted) {
          showToast('You have already completed this contest. You cannot participate again.', 'warning')
          return
        } else {
          // User is already registered but hasn't completed - allow them to continue
          showToast('You are already registered for this contest. Continuing to contest page.', 'info')
        }
      } else {
        showToast('Successfully joined the contest!', 'success')
      }
      
      // Navigate to contest taking page
      navigate(`/student/contest/${contest.id}`)
    } catch (error: any) {
      console.error('Failed to join contest:', error)
      const errorMessage = error.response?.data?.error || 'Failed to join contest. Please try again.'
      showToast(errorMessage, 'error')
    }
  }

  const handleRegisterContest = async () => {
    if (!contest) return
    
    try {
      await assessmentService.joinContest(contest.id)
      showToast('Successfully registered for the contest!', 'success')
      loadContestDetails() // Reload to update status
    } catch (error) {
      console.error('Failed to register for contest:', error)
      showToast('Failed to register for contest. Please try again.', 'error')
    }
  }

  const handleViewResults = () => {
    if (!contest) return
    navigate(`/student/contest/${contest.id}/results`)
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SPEED': return 'bg-orange-100 text-orange-800'
      case 'ACCURACY': return 'bg-green-100 text-green-800'
      case 'MIXED': return 'bg-purple-100 text-purple-800'
      case 'CODING': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatContestDate = (dateString: string) => {
    if (!dateString) return 'Invalid Date'
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Invalid Date'
      
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Dhaka'
      })
    } catch (error) {
      console.error('Date formatting error:', error)
      return 'Invalid Date'
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return 'Contest ended'
    
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

  const getTimeUntilStart = () => {
    if (!contest) return 0
    const startTime = new Date(contest.startTime).getTime()
    const now = currentTime.getTime()
    return Math.max(0, Math.floor((startTime - now) / 1000))
  }

  const getTimeRemaining = () => {
    if (!contest) return 0
    const endTime = new Date(contest.endTime).getTime()
    const now = currentTime.getTime()
    return Math.max(0, Math.floor((endTime - now) / 1000))
  }

  const getContestTimeStatus = () => {
    if (!contest) return { status: 'unknown', timeText: '', isLive: false }
    
    const now = currentTime.getTime()
    const startTime = new Date(contest.startTime).getTime()
    const endTime = new Date(contest.endTime).getTime()
    
    if (now < startTime) {
      // Contest hasn't started yet
      const timeUntil = getTimeUntilStart()
      return {
        status: 'upcoming',
        timeText: timeUntil > 0 ? `Starts in ${formatTimeRemaining(timeUntil)}` : 'Starting soon',
        isLive: false
      }
    } else if (now >= startTime && now <= endTime) {
      // Contest is live
      const timeLeft = getTimeRemaining()
      return {
        status: 'live',
        timeText: timeLeft > 0 ? `${formatTimeRemaining(timeLeft)} remaining` : 'Contest ending',
        isLive: true
      }
    } else {
      // Contest has ended
      return {
        status: 'ended',
        timeText: 'Contest ended',
        isLive: false
      }
    }
  }

  const formatDuration = (minutes: number) => {
    if (!minutes || isNaN(minutes)) return 'N/A'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error || !contest) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-lg">{error || 'Contest not found'}</p>
        <Button onClick={() => navigate('/student/contests')} className="mt-4">
          Back to Contests
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/student/contests')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Contests
        </Button>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          {contest.status === 'ACTIVE' && (
            <Button onClick={handleJoinContest} className="bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all duration-200">
              <Play className="mr-2 h-4 w-4" />
              Join Contest
            </Button>
          )}
          {contest.status === 'UPCOMING' && (
            <Button variant="outline" onClick={handleRegisterContest}>
              Register
            </Button>
          )}
          {contest.status === 'COMPLETED' && (
            <Button variant="outline" onClick={handleViewResults}>
              View Results
            </Button>
          )}
        </div>
      </div>

      {/* Contest Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Trophy className="h-8 w-8 text-yellow-600" />
                {contest.title}
              </CardTitle>
              <div className="flex items-center gap-3 mt-3">
                <Badge className={getStatusColor(contest.status)}>
                  {contest.status}
                </Badge>
                <Badge className={getTypeColor(contest.type)}>
                  {contest.type}
                </Badge>
                {(() => {
                  const timeStatus = getContestTimeStatus()
                  return (
                    <Badge className={
                      timeStatus.status === 'live' ? 'bg-red-100 text-red-800' :
                      timeStatus.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      <Clock className="w-3 h-3 mr-1" />
                      {timeStatus.timeText}
                    </Badge>
                  )
                })()}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {contest.description && (
            <p className="text-gray-700 text-lg mb-4">
              <LaTeXText text={contest.description} />
            </p>
          )}
        </CardContent>
      </Card>

      {/* Contest Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Start Time</p>
              <p className="text-lg">{formatContestDate(contest.startTime)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">End Time</p>
              <p className="text-lg">{formatContestDate(contest.endTime)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="text-lg">{formatDuration(contest.duration)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contest Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Contest Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-600">Participants</p>
              <p className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4" />
                {contest.participants}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Questions</p>
              <p className="text-lg flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {questionsCount}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Type</p>
              <p className="text-lg">{contest.type}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prizes */}
      {contest.prizes && contest.prizes.length > 0 && contest.prizes[0] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Prizes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {contest.prizes.map((prize, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">#{index + 1}</span>
                  <span>{prize}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rules */}
      {contest.rules && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Contest Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700">
                <LaTeXText text={contest.rules} />
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contest Status Messages */}
      <Card>
        <CardContent className="pt-6">
          {(() => {
            const timeStatus = getContestTimeStatus()
            
            if (timeStatus.status === 'upcoming') {
              return (
                <div className="text-center py-4">
                  <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-lg font-medium">Contest starts on {formatContestDate(contest.startTime)}</p>
                  <p className="text-gray-600">Register now to participate!</p>
                  <p className="text-blue-600 font-semibold text-xl mt-2">
                    {timeStatus.timeText}
                  </p>
                </div>
              )
            } else if (timeStatus.status === 'live') {
              return (
                <div className="text-center py-4">
                  <div className="relative">
                    <Play className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-lg font-medium">Contest is LIVE!</p>
                  <p className="text-gray-600">Join now to start competing</p>
                  <p className="text-red-600 font-mono text-xl mt-2">
                    {timeStatus.timeText}
                  </p>
                </div>
              )
            } else {
              return (
                <div className="text-center py-4">
                  <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-lg font-medium">Contest has ended</p>
                  <p className="text-gray-600">View results to see how you performed</p>
                </div>
              )
            }
          })()}
        </CardContent>
      </Card>
    </div>
  )
}

export default ContestDetails