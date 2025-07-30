import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { Calendar, Flame, Trophy, Play, Eye, Clock, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Pagination from '../ui/pagination'
import LaTeXText from '../ui/LaTeXText'

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

interface QuestionOption {
  id: number
  text: string
}

interface CompleteQuestionDetails {
  id: number
  text: string
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'NUMERIC' | 'ESSAY'
  subjectName: string
  topicName?: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  options: QuestionOption[]
  correctAnswerOptionId?: number
  correctAnswerText?: string
  explanation?: string
  points: number
  tags: string[]
  attachments: string[]
  isActive: boolean
  createdBy: number
  createdAt: string
  updatedAt: string
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
  
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // State for expanded previous day questions with full details
  const [expandedDates, setExpandedDates] = useState<Set<string>>(new Set())
  const [detailedQuestions, setDetailedQuestions] = useState<{[key: string]: CompleteQuestionDetails[]}>({})
  const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadDailyQuestions()
  }, [currentPage, pageSize])


  const generateDateRange = (days: number = 30): string[] => {
    const dates: string[] = []
    // today should be Date + 6 hours to get Asia/Dhaka timezone
    const today = new Date()
    today.setHours(today.getHours() + 6)

    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      dates.push(date.toISOString().split('T')[0])
    }

    // console.log('Generated date range:', dates)
    return dates
  }

  const loadDailyQuestions = async () => {
    try {
      const dates = generateDateRange(30) // Last 30 days including today
      
      // Include all dates including today
      setDateRange(dates)
      
      // Load daily questions for each date individually to get both attempted and unattempted
      const questionsByDateMap: DailyQuestionsByDate = {}
      let allStreakInfo: StreakInfo | null = null
      
      // Check each date for daily questions
      for (const date of dates) {
        try {
          const detailsResponse = await assessmentService.getDailyQuestionDetails(date)
          const detailsData = detailsResponse.data.data
          
          if (detailsData?.questions && detailsData.questions.length > 0) {
            questionsByDateMap[date] = detailsData.questions
          }
          
          // Get streak info from the first successful response
          if (!allStreakInfo && detailsData?.streakInfo) {
            allStreakInfo = detailsData.streakInfo
          }
        } catch (error) {
          console.error(`Failed to load question details for ${date}:`, error)
          // Still check if there are questions available for this date
          try {
            const questionsResponse = await assessmentService.getDailyQuestions(date)
            const questionsData = questionsResponse.data.data
            
            if (questionsData?.questions && questionsData.questions.length > 0) {
              // Add questions without submission details
              questionsByDateMap[date] = questionsData.questions.map((q: any) => ({
                id: q.id,
                questionId: q.questionId,
                questionText: q.text || 'Question text not available',
                difficulty: q.difficulty,
                points: q.points,
                subjectId: q.subjectId,
                date: date,
                attempted: false,
                correct: undefined,
                userAnswer: undefined,
                pointsEarned: undefined,
                submittedAt: undefined
              }))
            }
          } catch (fallbackError) {
            console.error(`Failed to load questions for ${date}:`, fallbackError)
          }
        }
      }
      
      // Update pagination info - for now, we'll show all loaded data
      setTotalElements(Object.values(questionsByDateMap).flat().length)
      setTotalPages(1)
      
      setQuestionsByDate(questionsByDateMap)
      setStreakInfo(allStreakInfo || { currentStreak: 0, longestStreak: 0 })
    } catch (error) {
      console.error('Failed to load daily questions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(0) // Reset to first page when changing page size
  }

  const handleSolveQuestions = (date: string, forceShowResults = false) => {
    const questions = questionsByDate[date]
    if (!questions || questions.length === 0) return
    
    const questionIds = questions.map(q => q.questionId)
    const today = getTodayAdjusted()
    const isPreviousDay = date < today
    const completedCount = questions.filter(q => q.attempted).length
    const isAllCompleted = completedCount === questions.length
    
    // For previous days, completed today's questions, or forced results - show results immediately
    const shouldShowResults = isPreviousDay || forceShowResults || (date === today && isAllCompleted)
    
    const url = `/student/exam?type=daily&date=${date}&questions=${questionIds.join(',')}`
    navigate(shouldShowResults ? `${url}&showResults=true` : url)
  }


  const handleToggleQuestionDetails = async (date: string) => {
    const questions = questionsByDate[date]
    if (!questions || questions.length === 0) return

    // Toggle expanded state
    const newExpandedDates = new Set(expandedDates)
    if (expandedDates.has(date)) {
      newExpandedDates.delete(date)
      setExpandedDates(newExpandedDates)
      return
    }

    newExpandedDates.add(date)
    setExpandedDates(newExpandedDates)

    // If we already have detailed questions for this date, don't fetch again
    if (detailedQuestions[date] && detailedQuestions[date].length > 0) {
      return
    }

    // Fetch detailed question information
    const newLoadingDetails = new Set(loadingDetails)
    newLoadingDetails.add(date)
    setLoadingDetails(newLoadingDetails)

    try {
      // Use the question data we already have from daily questions API, which now includes correct answers for previous days
      const detailedQuestionsForDate: CompleteQuestionDetails[] = []
      
      console.log(`Creating question details from daily questions API data for date ${date}:`, questions)
      
      // Log the structure of the first question to understand what data we have
      if (questions.length > 0) {
        console.log('Sample question data structure:', Object.keys(questions[0]))
        console.log('Sample question full data:', questions[0])
      }
      
      for (const question of questions) {
        // Create a detailed question object from the daily question data we have
        const detailedQuestion: CompleteQuestionDetails = {
          id: question.questionId,
          text: question.questionText,
          type: question.type || 'MCQ', // Use actual type if available
          subjectName: `Subject ${question.subjectId}`, // Fallback
          topicName: undefined,
          difficulty: question.difficulty as 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT',
          options: question.options || [], // Use options if available
          correctAnswerOptionId: question.correctAnswerOptionId, // Now included for previous days
          correctAnswerText: question.correctAnswerText, // Now included for previous days
          explanation: question.explanation, // Now included for previous days
          points: question.points,
          tags: [],
          attachments: [],
          isActive: true,
          createdBy: 0,
          createdAt: question.date,
          updatedAt: question.date
        }
        
        detailedQuestionsForDate.push(detailedQuestion)
        console.log(`Created question details for question ${question.questionId}`)
      }

      console.log(`Total detailed questions processed for ${date}:`, detailedQuestionsForDate.length)
      
      if (detailedQuestionsForDate.length > 0) {
        setDetailedQuestions(prev => ({
          ...prev,
          [date]: detailedQuestionsForDate
        }))
        console.log(`Successfully set detailed questions for ${date}`)
      } else {
        console.error(`No detailed questions processed for ${date}`)
      }
    } catch (error) {
      console.error(`Failed to fetch questions for ${date}:`, error)
    } finally {
      const finalLoadingDetails = new Set(loadingDetails)
      finalLoadingDetails.delete(date)
      setLoadingDetails(finalLoadingDetails)
    }
  }

  // Helper functions for date logic (adjusted for Asia/Dhaka timezone: UTC+6)
  const getTodayAdjusted = (): string => {
    const utcNow = new Date()
    const adjustedDate = new Date(utcNow.getTime() + (6 * 3600000))
    return adjustedDate.toISOString().split('T')[0]
  }

  const isToday = (date: string): boolean => {
    const today = getTodayAdjusted()
    return date === today
  }

  const isPreviousDay = (date: string): boolean => {
    const today = getTodayAdjusted()
    return date < today
  }

  const isFutureDay = (date: string): boolean => {
    const today = getTodayAdjusted()
    return date > today
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

  const renderQuestionWithAnswer = (question: CompleteQuestionDetails, userSubmission?: DailyQuestionDetails) => {
    const getCorrectAnswerText = () => {
      if (question.type === 'MCQ' && question.correctAnswerOptionId) {
        const correctOption = question.options.find(opt => opt.id === question.correctAnswerOptionId)
        return correctOption?.text || 'Correct answer not found'
      }
      if (question.correctAnswerText) {
        return question.correctAnswerText
      }
      
      // For today's questions, correct answers are not shown until the next day
      return 'Correct answer will be available tomorrow'
    }

    const getUserAnswerText = () => {
      if (!userSubmission?.userAnswer) return 'Not answered'
      
      if (question.type === 'MCQ') {
        const userOptionId = parseInt(userSubmission.userAnswer)
        const userOption = question.options.find(opt => opt.id === userOptionId)
        return userOption?.text || userSubmission.userAnswer
      }
      return userSubmission.userAnswer
    }

    return (
      <div key={question.id} className="border rounded-lg p-4 bg-white">
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getDifficultyColor(question.difficulty.toLowerCase())}>
              {question.difficulty}
            </Badge>
            <Badge variant="outline">{question.points} pts</Badge>
            {userSubmission && (
              <Badge variant={userSubmission.correct ? "default" : "destructive"}>
                {userSubmission.correct ? '✓ Correct' : '✗ Incorrect'}
              </Badge>
            )}
          </div>
          <p className="text-lg font-medium text-gray-900 mb-3">
            <LaTeXText text={question.text} />
          </p>
        </div>

        {question.type === 'MCQ' && (
          question.options.length > 0 ? (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Options:</h4>
              <div className="space-y-2">
                {question.options.map((option) => {
                  const isCorrect = option.id === question.correctAnswerOptionId
                  const isUserAnswer = userSubmission?.userAnswer && parseInt(userSubmission.userAnswer) === option.id
                  
                  return (
                    <div
                      key={option.id}
                      className={`p-2 rounded border ${
                        isCorrect 
                          ? 'bg-green-50 border-green-200 text-green-800' 
                          : isUserAnswer 
                          ? 'bg-red-50 border-red-200 text-red-800'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isCorrect && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {isUserAnswer && !isCorrect && <span className="text-red-600">✗</span>}
                        <LaTeXText text={option.text} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-sm text-gray-600">
                Question options are not available in the current view.
              </p>
            </div>
          )
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          <div>
            <h4 className="text-sm font-semibold text-green-700 mb-1">Correct Answer:</h4>
            <p className="text-sm text-green-800 bg-green-50 p-2 rounded">
              <LaTeXText text={getCorrectAnswerText()} />
            </p>
          </div>
          {userSubmission && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Your Answer:</h4>
              <p className={`text-sm p-2 rounded ${
                userSubmission.correct 
                  ? 'text-green-800 bg-green-50' 
                  : 'text-red-800 bg-red-50'
              }`}>
                <LaTeXText text={getUserAnswerText()} />
              </p>
            </div>
          )}
        </div>

        {question.explanation && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
            <h4 className="text-sm font-semibold text-blue-700 mb-1">Explanation:</h4>
            <p className="text-sm text-blue-800">
              <LaTeXText text={question.explanation} />
            </p>
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


      {/* Daily Questions */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Daily Questions</h2>
        {dateRange.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No daily questions available</h3>
              <p className="text-muted-foreground">Daily questions will appear here once they are added!</p>
            </CardContent>
          </Card>
        ) : (
          dateRange.map((date) => {
            const questions = questionsByDate[date] || []
            // Show all dates, even if they have no questions
            
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
                    {questions.length === 0 ? (
                      // No questions for this date
                      <Badge variant="secondary" className="text-gray-500">
                        No Questions
                      </Badge>
                    ) : isPreviousDay(date) ? (
                      // Previous day: Show appropriate button based on completion status
                      completedCount > 0 ? (
                        <Button 
                          onClick={() => handleToggleQuestionDetails(date)}
                          className="flex items-center gap-2"
                          variant="outline"
                          disabled={loadingDetails.has(date)}
                        >
                          {loadingDetails.has(date) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                              Loading...
                            </>
                          ) : expandedDates.has(date) ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              Hide Answers
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              Show Answers
                            </>
                          )}
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleSolveQuestions(date)}
                          className="flex items-center gap-2"
                          variant="default"
                        >
                          <Play className="h-4 w-4" />
                          Solve
                        </Button>
                      )
                    ) : isFutureDay(date) ? (
                      // Future day: Show disabled button
                      <Button 
                        disabled
                        className="flex items-center gap-2"
                        variant="outline"
                      >
                        <Clock className="h-4 w-4" />
                        Coming Soon
                      </Button>
                    ) : (
                      // Today: Show normal solve/review button
                      <Button 
                        onClick={() => handleSolveQuestions(date)}
                        className="flex items-center gap-2"
                        variant={completedCount === questions.length && questions.length > 0 ? "outline" : "default"}
                      >
                        {completedCount === questions.length && questions.length > 0 ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Review
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Solve
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {questions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p>No daily questions were set for this date</p>
                    </div>
                  ) : (
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
                              <LaTeXText text={question.questionText} />
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                
                {/* Expanded section for previous day questions showing detailed questions with answers */}
                {isPreviousDay(date) && expandedDates.has(date) && questions.length > 0 && (
                  <CardContent className="pt-0">
                    <div className="border-t border-gray-200 pt-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions & Answers</h3>
                      <div className="space-y-4">
                        {detailedQuestions[date]?.map((detailedQuestion, index) => {
                          // Find corresponding user submission
                          const userSubmission = questions.find(q => q.questionId === detailedQuestion.id)
                          return (
                            <div key={detailedQuestion.id}>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                              </div>
                              {renderQuestionWithAnswer(detailedQuestion, userSubmission)}
                            </div>
                          )
                        })}
                        
                        {(!detailedQuestions[date] || detailedQuestions[date].length === 0) && !loadingDetails.has(date) && (
                          <div className="text-center py-4 text-gray-500">
                            <p>Unable to load detailed question information.</p>
                            <p className="text-sm mt-2">
                              Check the browser console for more details, or try refreshing the page.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })
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

export default DailyQuestions