import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { Calendar, Flame, Trophy, CheckCircle, XCircle } from 'lucide-react'

interface DailyQuestion {
  id: number
  questionId: number
  date: string
  question: {
    id: number
    text: string
    type: string
    difficulty: string
    options: Array<{ id: number, text: string, isCorrect: boolean }>
    subjectName: string
  }
  isAnswered: boolean
  userAnswer?: string
  isCorrect?: boolean
}

interface StreakInfo {
  currentStreak: number
  longestStreak: number
}

const DailyQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<DailyQuestion[]>([])
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({})
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(new Set())

  useEffect(() => {
    loadTodaysQuestions()
  }, [])

  const loadTodaysQuestions = async () => {
    try {
      const response = await assessmentService.getTodaysDailyQuestions()
      const data = response.data.data
      setQuestions(data?.questions || [])
      setStreakInfo(data?.streakInfo || { currentStreak: 0, longestStreak: 0 })
    } catch (error) {
      console.error('Failed to load daily questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleSubmitAnswer = async (question: DailyQuestion) => {
    const selectedAnswer = selectedAnswers[question.id]
    if (!selectedAnswer) return

    try {
      const response = await assessmentService.submitDailyQuestion(question.questionId, {
        answer: selectedAnswer,
        timeTaken: 30, // Mock time taken
        explanation: ''
      })
      
      setSubmittedQuestions(prev => new Set(prev.add(question.id)))
      
      // Update question status
      setQuestions(prev => prev.map(q => 
        q.id === question.id 
          ? { 
              ...q, 
              isAnswered: true, 
              userAnswer: selectedAnswer,
              isCorrect: response.data.success 
            }
          : q
      ))
    } catch (error) {
      console.error('Failed to submit answer:', error)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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
                {questions.filter(q => q.isAnswered).length}
              </div>
              <div className="text-sm text-muted-foreground">Completed Today</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No daily questions available</h3>
              <p className="text-muted-foreground">Check back later for today's questions!</p>
            </CardContent>
          </Card>
        ) : (
          questions.map((question, index) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span>Question {index + 1}</span>
                    {question.isAnswered && (
                      question.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )
                    )}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{question.question?.subjectName || 'Unknown Subject'}</Badge>
                    <Badge className={getDifficultyColor(question.question?.difficulty || 'MEDIUM')}>
                      {question.question?.difficulty || 'MEDIUM'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">{question.question?.text || 'Question text not available'}</p>
                
                {question.question?.type === 'MCQ' && question.question?.options && (
                  <div className="space-y-2">
                    {question.question.options.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center space-x-2 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors ${
                          selectedAnswers[question.id] === option.text
                            ? 'border-primary bg-primary/5'
                            : 'border-input'
                        } ${
                          question.isAnswered
                            ? option.isCorrect
                              ? 'border-green-500 bg-green-50'
                              : selectedAnswers[question.id] === option.text && !option.isCorrect
                              ? 'border-red-500 bg-red-50'
                              : ''
                            : ''
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.text}
                          checked={selectedAnswers[question.id] === option.text}
                          onChange={() => handleAnswerSelect(question.id, option.text)}
                          disabled={question.isAnswered}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedAnswers[question.id] === option.text
                            ? 'border-primary bg-primary'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswers[question.id] === option.text && (
                            <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                          )}
                        </div>
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </div>
                )}

                {!question.isAnswered && (
                  <Button 
                    className="mt-4" 
                    onClick={() => handleSubmitAnswer(question)}
                    disabled={!selectedAnswers[question.id] || submittedQuestions.has(question.id)}
                  >
                    {submittedQuestions.has(question.id) ? 'Submitting...' : 'Submit Answer'}
                  </Button>
                )}

                {question.isAnswered && (
                  <div className="mt-4 p-3 rounded-lg bg-muted">
                    <p className="text-sm">
                      <strong>Your answer:</strong> {question.userAnswer}
                    </p>
                    <p className="text-sm">
                      <strong>Result:</strong> {' '}
                      <span className={question.isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {question.isCorrect ? 'Correct!' : 'Incorrect'}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default DailyQuestions