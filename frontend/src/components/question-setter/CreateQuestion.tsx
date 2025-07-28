import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { 
  FileQuestion, 
  Plus, 
  Save, 
  ArrowLeft,
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Hash,
  Type,
  BookOpen,
  Target,
  Lightbulb,
  Star
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

interface Subject {
  id: number
  name: string
  description: string
  classLevel: string
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  topicsCount: number
  questionsCount: number
}

interface Topic {
  id: number
  name: string
  description: string
  subjectId: number
  displayOrder: number
  isActive: boolean
  questionsCount: number
}

interface Option {
  id?: number
  text: string
  isCorrect: boolean
  optionOrder?: number
}

interface QuestionFormData {
  text: string
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  subjectId: string
  topicId: string
  points: number
  explanation: string
  options: Option[]
  tags: string[]
  // Answer fields for different question types
  correctAnswer: string // For TRUE_FALSE and FILL_BLANK
  fillBlankType: 'TEXT' | 'NUMERIC' // For FILL_BLANK questions
}

const CreateQuestion: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const questionId = searchParams.get('edit')
  const returnTo = searchParams.get('returnTo')
  const isEditing = !!questionId
  const isAdminRoute = window.location.pathname.includes('/admin/')
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [allTopics, setAllTopics] = useState<Topic[]>([])
  const [showPreview, setShowPreview] = useState(false)
  
  const [formData, setFormData] = useState<QuestionFormData>({
    text: '',
    type: 'MCQ',
    difficulty: 'EASY',
    subjectId: '',
    topicId: '',
    points: 1,
    explanation: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    tags: [],
    correctAnswer: '',
    fillBlankType: 'TEXT'
  })

  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadSubjects()
    loadTopics()
    
    // Load question data if editing
    if (isEditing && questionId) {
      loadQuestionData(parseInt(questionId))
    }
  }, [])

  useEffect(() => {
    // Filter topics when subject changes
    if (formData.subjectId) {
      const filteredTopics = allTopics.filter(topic => 
        topic.subjectId === parseInt(formData.subjectId)
      )
      setTopics(filteredTopics)
      // Reset topic selection if current topic doesn't belong to selected subject
      if (formData.topicId) {
        const currentTopic = allTopics.find(t => t.id === parseInt(formData.topicId))
        if (!currentTopic || currentTopic.subjectId !== parseInt(formData.subjectId)) {
          setFormData(prev => ({ ...prev, topicId: '' }))
        }
      }
    } else {
      setTopics([])
    }
  }, [formData.subjectId, allTopics])

  const loadSubjects = async () => {
    try {
      const response = await assessmentService.getSubjects()
      const data = response.data?.data
      if (data && data.content) {
        setSubjects(data.content)
      }
    } catch (error) {
      console.error('Failed to load subjects:', error)
    }
  }

  const loadTopics = async () => {
    try {
      const response = await assessmentService.getTopics()
      const data = response.data?.data
      if (data && data.content) {
        setAllTopics(data.content)
      }
    } catch (error) {
      console.error('Failed to load topics:', error)
    }
  }

  const loadQuestionData = async (questionId: number) => {
    try {
      setLoading(true)
      const response = await assessmentService.getQuestion(questionId)
      if (response.data?.success) {
        const question = response.data.data
        
        // Convert backend question data to form format
        const options = question.options ? question.options.map((option: any) => ({
          id: option.id,
          text: option.text,
          isCorrect: question.correctAnswerOptionId === option.id
        })) : [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]

        setFormData({
          text: question.text || '',
          type: question.type || 'MCQ',
          difficulty: question.difficulty || 'EASY',
          subjectId: question.subjectId?.toString() || '',
          topicId: question.topicId?.toString() || '',
          points: question.points || 1,
          explanation: question.explanation || '',
          options: options,
          tags: question.tags || [],
          correctAnswer: question.correctAnswerText || '',
          fillBlankType: 'TEXT'
        })
      }
    } catch (error) {
      console.error('Failed to load question data:', error)
      alert('Failed to load question data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof QuestionFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleOptionChange = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const newOptions = [...formData.options]
    if (field === 'isCorrect' && value === true) {
      // For multiple choice, only one option can be correct
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index
      })
    } else {
      newOptions[index][field] = value as never
    }
    setFormData(prev => ({ ...prev, options: newOptions }))
  }

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData(prev => ({
        ...prev,
        options: [...prev.options, { text: '', isCorrect: false }]
      }))
    }
  }

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, options: newOptions }))
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.text.trim()) {
      newErrors.text = 'Question text is required'
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject is required'
    }

    // Validate based on question type
    if (formData.type === 'MCQ') {
      if (formData.options.some(opt => !opt.text.trim())) {
        newErrors.options = 'All options must have text'
      }
      if (!formData.options.some(opt => opt.isCorrect)) {
        newErrors.options = 'At least one option must be marked as correct'
      }
    } else if (formData.type === 'TRUE_FALSE') {
      if (!formData.correctAnswer || !['true', 'false'].includes(formData.correctAnswer.toLowerCase())) {
        newErrors.correctAnswer = 'Please select True or False as the correct answer'
      }
    } else if (formData.type === 'FILL_BLANK') {
      if (!formData.correctAnswer.trim()) {
        newErrors.correctAnswer = 'Correct answer is required for fill in the blank questions'
      }
      if (formData.fillBlankType === 'NUMERIC' && isNaN(Number(formData.correctAnswer))) {
        newErrors.correctAnswer = 'Answer must be a valid number for numeric type'
      }
    }

    if (formData.points < 1 || formData.points > 100) {
      newErrors.points = 'Points must be between 1 and 100'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      let questionData: any = {
        text: formData.text,
        type: formData.type,
        difficulty: formData.difficulty,
        subjectId: parseInt(formData.subjectId),
        topicId: formData.topicId ? parseInt(formData.topicId) : undefined,
        points: formData.points,
        explanation: formData.explanation,
        tags: formData.tags,
      }

      // Handle different question types
      if (formData.type === 'MCQ') {
        const correctOption = formData.options.find(opt => opt.isCorrect)
        questionData.options = formData.options
          .filter(opt => opt.text.trim() !== '')
          .map((opt, index) => ({
            ...(opt.id && { id: opt.id }),
            text: opt.text,
            optionOrder: index
          }))
        questionData.correctAnswerOptionId = isEditing && correctOption?.id ? correctOption.id : undefined
        questionData.correctAnswerText = correctOption?.text || null
      } else if (formData.type === 'TRUE_FALSE') {
        questionData.options = [
          { text: 'True', optionOrder: 0 },
          { text: 'False', optionOrder: 1 }
        ]
        questionData.correctAnswerText = formData.correctAnswer
      } else if (formData.type === 'FILL_BLANK') {
        questionData.correctAnswerText = formData.correctAnswer
        // Add fill blank type as a tag for backend processing
        questionData.tags = [...formData.tags, `FILL_BLANK_TYPE:${formData.fillBlankType}`]
      }

      console.log('Question data being sent:', questionData)
      console.log('Is editing:', isEditing)

      let response
      if (isEditing && questionId) {
        response = await assessmentService.updateQuestion(parseInt(questionId), questionData)
      } else {
        response = await assessmentService.createQuestion(questionData)
      }
      
      if (response.data?.success) {
        alert(isEditing ? 'Question updated successfully!' : 'Question created successfully!')
        navigate(isAdminRoute ? '/admin/questions' : '/question-setter/questions')
      }
    } catch (error: any) {
      console.error(isEditing ? 'Failed to update question:' : 'Failed to create question:', error)
      
      // Show more detailed error message
      let errorMessage = isEditing ? 'Failed to update question.' : 'Failed to create question.'
      if (error.response?.data?.error) {
        errorMessage += ` Error: ${error.response.data.error}`
      }
      if (error.response?.data?.details) {
        errorMessage += ` Details: ${JSON.stringify(error.response.data.details)}`
      }
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800 border-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'HARD': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'EXPERT': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MCQ': return <Target className="h-4 w-4" />
      case 'TRUE_FALSE': return <Check className="h-4 w-4" />
      case 'FILL_BLANK': return <Type className="h-4 w-4" />
      default: return <FileQuestion className="h-4 w-4" />
    }
  }

  const renderQuestionPreview = () => {
    if (!showPreview) return null

    return (
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
            <Eye className="h-5 w-5" />
            Question Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border">
              <p className="font-medium text-gray-900 mb-3">{formData.text || 'Question text will appear here...'}</p>
              
              {formData.type === 'MCQ' && (
                <div className="space-y-2">
                  {formData.options.filter(opt => opt.text.trim()).map((option, index) => (
                    <div key={index} className={`p-2 rounded border ${option.isCorrect ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option.text}
                      {option.isCorrect && <Check className="inline h-4 w-4 ml-2 text-green-600" />}
                    </div>
                  ))}
                </div>
              )}
              
              {formData.type === 'TRUE_FALSE' && (
                <div className="space-y-2">
                  <div className={`p-2 rounded border ${formData.correctAnswer === 'true' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    True {formData.correctAnswer === 'true' && <Check className="inline h-4 w-4 ml-2 text-green-600" />}
                  </div>
                  <div className={`p-2 rounded border ${formData.correctAnswer === 'false' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                    False {formData.correctAnswer === 'false' && <Check className="inline h-4 w-4 ml-2 text-green-600" />}
                  </div>
                </div>
              )}
              
              {formData.type === 'FILL_BLANK' && (
                <div className="space-y-2">
                  <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                    <span className="text-gray-600">Answer field: </span>
                    <span className="font-mono bg-white px-2 py-1 border rounded">
                      {formData.fillBlankType === 'NUMERIC' ? '(Number)' : '(Text)'}
                    </span>
                  </div>
                  {formData.correctAnswer && (
                    <div className="p-2 bg-green-50 border border-green-200 rounded">
                      <span className="text-green-700">Correct Answer: </span>
                      <span className="font-medium">{formData.correctAnswer}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Badge className={getDifficultyColor(formData.difficulty)}>
                {formData.difficulty}
              </Badge>
              <span>•</span>
              <span>{formData.points} point{formData.points !== 1 ? 's' : ''}</span>
              {formData.tags.length > 0 && (
                <>
                  <span>•</span>
                  <span>{formData.tags.length} tag{formData.tags.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderAnswerSection = () => {
    if (formData.type === 'MCQ') {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Answer Options *
              {isEditing && (
                <span className="text-xs text-gray-500 font-normal">
                  (Current correct answer is highlighted)
                </span>
              )}
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOption}
              disabled={formData.options.length >= 6}
              className="h-8"
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Option
            </Button>
          </div>
          
          <div className="space-y-3">
            {formData.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
                  option.isCorrect 
                    ? 'border-green-300 bg-green-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">
                    {String.fromCharCode(65 + index)}
                  </span>
                </div>
                
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={option.isCorrect}
                      onChange={(e) => handleOptionChange(index, 'isCorrect', e.target.checked)}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="text-sm font-medium text-green-600">Correct</span>
                  </label>
                  
                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {errors.options && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.options}
            </div>
          )}
        </div>
      )
    }

    if (formData.type === 'TRUE_FALSE') {
      return (
        <div className="space-y-4">
          <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Check className="h-4 w-4" />
            Correct Answer *
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <label className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.correctAnswer === 'true' 
                ? 'border-green-300 bg-green-50 text-green-800' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="trueFalseAnswer"
                value="true"
                checked={formData.correctAnswer === 'true'}
                onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <Check className="h-4 w-4" />
              <span className="font-medium">True</span>
            </label>
            
            <label className={`flex items-center justify-center gap-2 p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.correctAnswer === 'false' 
                ? 'border-green-300 bg-green-50 text-green-800' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="trueFalseAnswer"
                value="false"
                checked={formData.correctAnswer === 'false'}
                onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
                className="w-4 h-4 text-green-600"
              />
              <X className="h-4 w-4" />
              <span className="font-medium">False</span>
            </label>
          </div>
          
          {errors.correctAnswer && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.correctAnswer}
            </div>
          )}
        </div>
      )
    }

    if (formData.type === 'FILL_BLANK') {
      return (
        <div className="space-y-4">
          <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Type className="h-4 w-4" />
            Fill in the Blank Answer *
          </label>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Answer Type</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.fillBlankType === 'TEXT' 
                    ? 'border-blue-300 bg-blue-50 text-blue-800' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="fillBlankType"
                    value="TEXT"
                    checked={formData.fillBlankType === 'TEXT'}
                    onChange={(e) => handleInputChange('fillBlankType', e.target.value as 'TEXT' | 'NUMERIC')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Type className="h-4 w-4" />
                  <span className="font-medium">Text Answer</span>
                </label>
                
                <label className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.fillBlankType === 'NUMERIC' 
                    ? 'border-blue-300 bg-blue-50 text-blue-800' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="fillBlankType"
                    value="NUMERIC"
                    checked={formData.fillBlankType === 'NUMERIC'}
                    onChange={(e) => handleInputChange('fillBlankType', e.target.value as 'TEXT' | 'NUMERIC')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <Hash className="h-4 w-4" />
                  <span className="font-medium">Numeric Answer</span>
                </label>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Correct Answer</label>
              <div className="relative">
                <input
                  type={formData.fillBlankType === 'NUMERIC' ? 'number' : 'text'}
                  value={formData.correctAnswer}
                  onChange={(e) => handleInputChange('correctAnswer', e.target.value)}
                  placeholder={formData.fillBlankType === 'NUMERIC' ? 'Enter the correct number...' : 'Enter the correct text...'}
                  className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {formData.fillBlankType === 'NUMERIC' ? <Hash className="h-4 w-4" /> : <Type className="h-4 w-4" />}
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mt-1">
                {formData.fillBlankType === 'NUMERIC' 
                  ? 'Students will enter a number as their answer'
                  : 'Students will enter text as their answer (case-insensitive matching)'
                }
              </p>
            </div>
          </div>
          
          {errors.correctAnswer && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {errors.correctAnswer}
            </div>
          )}
        </div>
      )
    }

    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading question data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to={returnTo || (isAdminRoute ? '/admin/questions' : '/question-setter/questions')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Questions
              </Button>
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isEditing ? 'Edit Question' : 'Create New Question'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing ? 'Update the question details below' : 'Design an engaging question for your students'}
              </p>
            </div>
            <div className="w-24"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Preview Toggle */}
        <div className="mb-6 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>

        {/* Question Preview */}
        {renderQuestionPreview()}

        {/* Main Form */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileQuestion className="h-6 w-6" />
              Question Details
            </CardTitle>
            <CardDescription className="text-blue-100">
              {isEditing ? 'Update the question information below' : 'Fill in the details to create an engaging question'}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Question Text */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Question Text *
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => handleInputChange('text', e.target.value)}
                  placeholder="Enter your question here... Make it clear and engaging!"
                  className="w-full p-4 border-2 border-gray-300 rounded-lg h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {errors.text && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {errors.text}
                  </div>
                )}
              </div>

              {/* Type and Difficulty */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <FileQuestion className="h-4 w-4" />
                    Question Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="MCQ">Multiple Choice Question</option>
                    <option value="TRUE_FALSE">True/False</option>
                    <option value="FILL_BLANK">Fill in the Blank</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Difficulty Level *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="EASY">Easy - Basic concepts</option>
                    <option value="MEDIUM">Medium - Intermediate level</option>
                    <option value="HARD">Hard - Advanced concepts</option>
                    <option value="EXPERT">Expert - Professional level</option>
                  </select>
                </div>
              </div>

              {/* Subject and Topic */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Subject *</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => handleInputChange('subjectId', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                  {errors.subjectId && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      {errors.subjectId}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-900">Topic (Optional)</label>
                  <select
                    value={formData.topicId}
                    onChange={(e) => handleInputChange('topicId', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    disabled={!formData.subjectId}
                  >
                    <option value="">Select a topic (optional)</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Points */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Points *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.points}
                  onChange={(e) => handleInputChange('points', parseInt(e.target.value) || 1)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                {errors.points && (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    {errors.points}
                  </div>
                )}
              </div>

              {/* Answer Section */}
              {renderAnswerSection()}

              {/* Explanation */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Explanation (Optional)
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => handleInputChange('explanation', e.target.value)}
                  placeholder="Provide an explanation for the correct answer..."
                  className="w-full p-4 border-2 border-gray-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-900">Tags (Optional)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(isAdminRoute ? '/admin/questions' : '/question-setter/questions')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEditing ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? 'Update Question' : 'Create Question'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default CreateQuestion
