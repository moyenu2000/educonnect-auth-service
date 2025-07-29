import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { assessmentService } from '@/services/assessmentService'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import Pagination from '../ui/pagination'
import LaTeXText from '../ui/LaTeXText'

interface Question {
  id: number
  text: string
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'NUMERIC' | 'ESSAY'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  points: number
  subjectName?: string
  topicName?: string
  options?: Array<{
    id: number
    text: string
  }>
  tags: string[]
  isActive: boolean
  createdAt: string
}

interface QuestionsResponse {
  questions: Question[]
  totalElements: number
  totalPages: number
  currentPage: number
  pageSize: number
}

const Questions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')

  useEffect(() => {
    loadQuestions()
  }, [currentPage, pageSize, searchTerm, selectedDifficulty, selectedType])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const params: any = {
        page: currentPage,
        size: pageSize
      }
      
      if (searchTerm) params.search = searchTerm
      if (selectedDifficulty) params.difficulty = selectedDifficulty
      if (selectedType) params.type = selectedType

      const response = await assessmentService.getPublicQuestions(params)
      const data: QuestionsResponse = response.data.data

      setQuestions(data.questions || [])
      setTotalElements(data.totalElements || 0)
      setTotalPages(data.totalPages || 0)
    } catch (error) {
      console.error('Failed to load questions:', error)
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

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(0)
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MCQ':
        return 'bg-blue-100 text-blue-800'
      case 'TRUE_FALSE':
        return 'bg-purple-100 text-purple-800'
      case 'FILL_BLANK':
        return 'bg-teal-100 text-teal-800'
      case 'NUMERIC':
        return 'bg-indigo-100 text-indigo-800'
      case 'ESSAY':
        return 'bg-pink-100 text-pink-800'
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
          <h1 className="text-3xl font-bold tracking-tight">Questions Bank</h1>
          <p className="text-muted-foreground">
            Browse and search through all available questions
          </p>
        </div>
        <Badge variant="outline">
          {totalElements} question{totalElements !== 1 ? 's' : ''} total
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="All difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All difficulties</SelectItem>
                  <SelectItem value="EASY">Easy</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HARD">Hard</SelectItem>
                  <SelectItem value="EXPERT">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="MCQ">Multiple Choice</SelectItem>
                  <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                  <SelectItem value="FILL_BLANK">Fill in Blank</SelectItem>
                  <SelectItem value="NUMERIC">Numeric</SelectItem>
                  <SelectItem value="ESSAY">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No questions found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
            </CardContent>
          </Card>
        ) : (
          questions.map((question) => (
            <Card key={question.id} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                      <Badge className={getTypeColor(question.type)}>
                        {question.type}
                      </Badge>
                      <Badge variant="outline">
                        {question.points} points
                      </Badge>
                      {!question.isActive && (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                    {(question.subjectName || question.topicName) && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {question.subjectName && <span>{question.subjectName}</span>}
                        {question.subjectName && question.topicName && <span>•</span>}
                        {question.topicName && <span>{question.topicName}</span>}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">ID: {question.id}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-lg font-medium">
                    <LaTeXText text={question.text} />
                  </p>
                  
                  {question.type === 'MCQ' && question.options && question.options.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Options:</h4>
                      <div className="grid gap-2">
                        {question.options.map((option, index) => (
                          <div key={option.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <span className="font-medium text-sm w-6">{String.fromCharCode(65 + index)}.</span>
                            <span>{option.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.tags && question.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">Tags:</span>
                      {question.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(question.createdAt).toLocaleDateString()}
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

export default Questions