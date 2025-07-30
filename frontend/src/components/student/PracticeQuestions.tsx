import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { assessmentService } from '@/services/assessmentService'
import { BookOpen, Target, Trophy, Play, Filter, Search, Clock, CheckCircle, RotateCcw, History } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../ui/pagination'
import LaTeXText from '../ui/LaTeXText'

interface PracticeQuestion {
  id: number
  questionId: number
  text: string
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'NUMERIC' | 'ESSAY'
  subjectId: number
  subjectName: string
  topicId?: number
  topicName?: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  options: QuestionOption[]
  explanation: string
  points: number
  tags: string[]
  attachments: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  submissionStatus: 'NOT_ATTEMPTED' | 'ATTEMPTED' | 'SOLVED'
  hasAttempted: boolean
  hasSolved: boolean
  totalAttempts: number
  bestScore?: number
  lastAttemptAt?: string
  hintText?: string
  hints: string[]
  solutionSteps?: string
}

interface QuestionOption {
  id: number
  text: string
  optionOrder: number
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

interface Subject {
  id: number
  name: string
}

interface Topic {
  id: number
  name: string
  subjectId: number
}

const PracticeQuestions: React.FC = () => {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<PracticeQuestion[]>([])
  const [stats, setStats] = useState<PracticeStats | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadPracticeQuestions()
  }, [currentPage, pageSize, selectedSubject, selectedTopic, selectedDifficulty, searchQuery])

  // Refresh stats when the component becomes visible (user returns from solving a question)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Refresh stats and questions when tab becomes visible
        loadData()
        loadPracticeQuestions()
      }
    }

    const handleFocus = () => {
      // Also refresh when window gains focus (user navigates back)
      loadData()
      loadPracticeQuestions()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  useEffect(() => {
    // Load topics when subject changes
    if (selectedSubject && selectedSubject !== 'all') {
      loadTopics(parseInt(selectedSubject))
      setSelectedTopic('all') // Reset topic selection
    } else {
      setTopics([])
      setSelectedTopic('all')
    }
  }, [selectedSubject])

  const loadData = async () => {
    try {
      // Load subjects and stats in parallel
      const [subjectsResponse, statsResponse] = await Promise.all([
        assessmentService.getPublicSubjects(),
        assessmentService.getPracticeQuestionStats()
      ])

      if (subjectsResponse.data?.data) {
        setSubjects(subjectsResponse.data.data)
      }

      if (statsResponse.data?.data) {
        setStats(statsResponse.data.data)
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const loadTopics = async (subjectId: number) => {
    try {
      const response = await assessmentService.getPublicTopicsBySubject(subjectId)
      if (response.data?.data) {
        setTopics(response.data.data)
      }
    } catch (error) {
      console.error('Failed to load topics:', error)
    }
  }

  const loadPracticeQuestions = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: currentPage,
        size: pageSize
      }

      if (selectedSubject && selectedSubject !== 'all') params.subjectId = parseInt(selectedSubject)
      if (selectedTopic && selectedTopic !== 'all') params.topicId = parseInt(selectedTopic)
      if (selectedDifficulty && selectedDifficulty !== 'all') params.difficulty = selectedDifficulty
      if (searchQuery.trim()) params.search = searchQuery.trim()

      const response = await assessmentService.getPracticeQuestions(params)
      const data = response.data.data

      if (data) {
        setQuestions(data.content || [])
        setTotalElements(data.totalElements || 0)
        setTotalPages(data.totalPages || 0)
      }
    } catch (error) {
      console.error('Failed to load practice questions:', error)
      setQuestions([])
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
    setSelectedSubject('all')
    setSelectedTopic('all')
    setSelectedDifficulty('all')
    setSearchQuery('')
    setCurrentPage(0)
  }

  const handleSolveQuestion = (question: PracticeQuestion) => {
    // Navigate to practice question solving interface for individual question only
    const queryParams = new URLSearchParams({
      type: 'practice',
      questionId: question.questionId.toString(),
      individual: 'true' // Flag to indicate this is an individual question practice
    })

    console.log('Navigating to individual practice question:', `/student/exam?${queryParams.toString()}`)
    navigate(`/student/exam?${queryParams.toString()}`)
  }


  const handleViewSubmissionHistory = () => {
    navigate('/student/practice-questions/submissions')
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SOLVED':
        return 'bg-green-100 text-green-800'
      case 'ATTEMPTED':
        return 'bg-orange-100 text-orange-800'
      case 'NOT_ATTEMPTED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SOLVED':
        return <CheckCircle className="h-4 w-4" />
      case 'ATTEMPTED':
        return <RotateCcw className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Practice Questions</h1>
          <p className="text-muted-foreground">
            Practice unlimited questions and improve your skills
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleViewSubmissionHistory}
            variant="outline"
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Submission History
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Your Progress
            </CardTitle>
            <CardDescription>
              Track your practice question performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.solvedQuestions}
                </div>
                <div className="text-sm text-gray-700 font-semibold">Questions Solved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.accuracyPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-700 font-semibold">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {stats.totalPoints}
                </div>
                <div className="text-sm text-gray-700 font-semibold">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalSubmissions}
                </div>
                <div className="text-sm text-gray-700 font-semibold">Total Attempts</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={(value) => {
                setSelectedSubject(value)
                handleFilterChange()
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All subjects</SelectItem>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Select value={selectedTopic} onValueChange={(value) => {
                setSelectedTopic(value)
                handleFilterChange()
              }} disabled={selectedSubject === 'all'}>
                <SelectTrigger>
                  <SelectValue placeholder="All topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All topics</SelectItem>
                  {topics.map((topic) => (
                    <SelectItem key={topic.id} value={topic.id.toString()}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={(value) => {
                setSelectedDifficulty(value)
                handleFilterChange()
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="All difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All difficulties</SelectItem>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    
                    // Clear existing timer
                    if (debounceTimer.current) {
                      clearTimeout(debounceTimer.current)
                    }
                    
                    // Set new timer for debounced search
                    debounceTimer.current = setTimeout(() => {
                      handleFilterChange()
                    }, 500)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2 flex items-end">
              <Button onClick={handleClearFilters} variant="outline" className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : questions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No practice questions found</h3>
              <p className="text-gray-600 font-medium">Try adjusting your filters or check back later!</p>
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                      <Badge variant="outline">{question.points} pts</Badge>
                      <Badge className={getStatusColor(question.submissionStatus)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(question.submissionStatus)}
                          {question.submissionStatus.replace('_', ' ')}
                        </div>
                      </Badge>
                      {question.totalAttempts > 0 && (
                        <Badge variant="secondary">
                          {question.totalAttempts} attempt{question.totalAttempts > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                      <LaTeXText text={question.text} />
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span>{question.subjectName}</span>
                      {question.topicName && (
                        <>
                          <span>•</span>
                          <span>{question.topicName}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{question.type}</span>
                    </div>

                    {question.hasAttempted && (
                      <div className="flex items-center gap-4 text-sm">
                        {question.bestScore !== undefined && (
                          <span className="text-green-600">
                            Best Score: {question.bestScore} pts
                          </span>
                        )}
                        {question.lastAttemptAt && (
                          <span className="text-muted-foreground">
                            Last Attempt: {new Date(question.lastAttemptAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      onClick={() => handleSolveQuestion(question)}
                      className="flex items-center gap-2"
                      variant={question.hasSolved ? "outline" : "default"}
                    >
                      {question.hasSolved ? (
                        <>
                          <Target className="h-4 w-4" />
                          Practice Again
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          {question.hasAttempted ? 'Continue' : 'Start'}
                        </>
                      )}
                    </Button>
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

export default PracticeQuestions