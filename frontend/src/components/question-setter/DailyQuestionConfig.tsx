import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  ArrowLeft,
  Plus,
  X
} from 'lucide-react'

interface QuestionOption {
  id: number
  text: string
}

interface Question {
  id: number
  text: string
  type: string
  difficulty: string
  subjectId: number
  subjectName?: string
  topicId?: number
  topicName?: string
  options?: QuestionOption[]
  correctAnswerOptionId?: number
  correctAnswerText?: string
  explanation?: string
  createdAt: string
  updatedAt: string
}

const DailyQuestionConfig: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedQuestionIds = location.state?.selectedQuestions || []
  const allQuestions = location.state?.allQuestions || []

  const [actionDate, setActionDate] = useState(new Date().toISOString().split('T')[0])
  const [questionConfigs, setQuestionConfigs] = useState<Record<number, {difficulty: string, points: number}>>({})
  const [dailyQuestionsList, setDailyQuestionsList] = useState<number[]>([])
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Initialize with selected questions
    const configs: Record<number, {difficulty: string, points: number}> = {}
    selectedQuestionIds.forEach((questionId: number) => {
      const question = allQuestions.find((q: Question) => q.id === questionId)
      configs[questionId] = {
        difficulty: question?.difficulty || 'MEDIUM',
        points: 10
      }
    })
    setQuestionConfigs(configs)
    setDailyQuestionsList([...selectedQuestionIds])
    setAvailableQuestions(allQuestions.filter((q: Question) => !selectedQuestionIds.includes(q.id)))
  }, [selectedQuestionIds, allQuestions])

  const addQuestionToDailyList = (questionId: number) => {
    const question = allQuestions.find((q: Question) => q.id === questionId)
    if (!question) return
    
    setDailyQuestionsList(prev => [...prev, questionId])
    setAvailableQuestions(prev => prev.filter(q => q.id !== questionId))
    
    // Initialize config for new question
    setQuestionConfigs(prev => ({
      ...prev,
      [questionId]: {
        difficulty: question.difficulty || 'MEDIUM',
        points: 10
      }
    }))
  }

  const removeQuestionFromDailyList = (questionId: number) => {
    const question = allQuestions.find((q: Question) => q.id === questionId)
    if (!question) return
    
    setDailyQuestionsList(prev => prev.filter(id => id !== questionId))
    setAvailableQuestions(prev => [...prev, question].sort((a, b) => a.id - b.id))
    
    // Remove config for removed question
    setQuestionConfigs(prev => {
      const newConfigs = { ...prev }
      delete newConfigs[questionId]
      return newConfigs
    })
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex === null) return
    
    const newList = [...dailyQuestionsList]
    const draggedItem = newList[draggedIndex]
    newList.splice(draggedIndex, 1)
    newList.splice(dropIndex, 0, draggedItem)
    
    setDailyQuestionsList(newList)
    setDraggedIndex(null)
  }

  const handleSubmit = async () => {
    if (dailyQuestionsList.length === 0) return

    setLoading(true)
    try {
      // Prepare the data with individual question configurations
      const questionConfigurations = dailyQuestionsList.map(questionId => ({
        questionId,
        difficulty: questionConfigs[questionId]?.difficulty || 'MEDIUM',
        points: questionConfigs[questionId]?.points || 10
      }))

      const response = await assessmentService.addQuestionsToDailyQuestions({
        date: actionDate,
        questionIds: dailyQuestionsList,
        subjectDistribution: {
          questionConfigurations
        }
      })

      if (response.data?.success) {
        alert('Questions added to daily questions successfully')
        navigate(-1) // Go back to previous page
      }
    } catch (error) {
      console.error('Failed to add questions to daily questions:', error)
      alert('Failed to add questions to daily questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toUpperCase()) {
      case 'EASY': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HARD': return 'bg-orange-100 text-orange-800'
      case 'EXPERT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'MULTIPLE_CHOICE': return 'bg-blue-100 text-blue-800'
      case 'TRUE_FALSE': return 'bg-purple-100 text-purple-800'
      case 'SHORT_ANSWER': return 'bg-indigo-100 text-indigo-800'
      case 'ESSAY': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configure Daily Questions</h1>
            <p className="text-muted-foreground">
              Add questions to daily questions list and configure their settings
            </p>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Date Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <input 
              type="date"
              className="w-full p-3 border rounded-md"
              value={actionDate}
              onChange={(e) => setActionDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Two-panel layout */}
      <div className="grid grid-cols-2 gap-6 min-h-[600px]">
        {/* Left Panel - Available Questions */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-gray-800">Available Questions ({availableQuestions.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto p-4 space-y-3">
              {availableQuestions.map(question => (
                <div key={question.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">Q#{question.id}</span>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                        <Badge className={getTypeColor(question.type)}>
                          {question.type?.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700">{question.text}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="ml-3 text-green-600 hover:text-green-700 hover:border-green-300"
                      onClick={() => addQuestionToDailyList(question.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {availableQuestions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  All questions have been added to daily questions
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Right Panel - Selected Daily Questions */}
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle className="text-gray-800">Daily Questions ({dailyQuestionsList.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[500px] overflow-y-auto p-4 space-y-3">
              {dailyQuestionsList.map((questionId, index) => {
                const question = allQuestions.find((q: Question) => q.id === questionId)
                if (!question) return null
                
                return (
                  <div 
                    key={questionId}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`bg-white border rounded-lg p-4 cursor-move hover:shadow-sm transition-shadow ${
                      draggedIndex === index ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                          <span className="text-sm font-medium text-gray-500">Q#{question.id}</span>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{question.text}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-3 text-red-600 hover:text-red-700 hover:border-red-300"
                        onClick={() => removeQuestionFromDailyList(questionId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Configuration for each question */}
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t">
                      <div>
                        <label className="block text-sm font-medium mb-1">Difficulty</label>
                        <select 
                          className="w-full p-2 border rounded text-sm"
                          value={questionConfigs[questionId]?.difficulty || question.difficulty}
                          onChange={(e) => setQuestionConfigs(prev => ({
                            ...prev,
                            [questionId]: {
                              ...prev[questionId],
                              difficulty: e.target.value,
                              points: prev[questionId]?.points || 10
                            }
                          }))}
                        >
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                          <option value="EXPERT">Expert</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Points</label>
                        <input 
                          type="number"
                          min="1"
                          max="100"
                          className="w-full p-2 border rounded text-sm"
                          value={questionConfigs[questionId]?.points || 10}
                          onChange={(e) => setQuestionConfigs(prev => ({
                            ...prev,
                            [questionId]: {
                              ...prev[questionId],
                              difficulty: prev[questionId]?.difficulty || question.difficulty,
                              points: parseInt(e.target.value) || 10
                            }
                          }))}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
              {dailyQuestionsList.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No questions selected for daily questions
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Ready to Submit</h3>
              <p className="text-sm text-gray-600">
                {dailyQuestionsList.length} questions configured for {actionDate}
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={dailyQuestionsList.length === 0 || loading}
              >
                {loading ? 'Adding...' : `Add ${dailyQuestionsList.length} Questions to Daily`}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DailyQuestionConfig