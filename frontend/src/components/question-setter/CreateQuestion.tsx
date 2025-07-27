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
  Check
} from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

interface Subject {
  id: number
  name: string
}

interface Topic {
  id: number
  name: string
  subjectId: number
}

interface Option {
  id?: number
  text: string
  isCorrect: boolean
}

interface QuestionFormData {
  text: string
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'NUMERIC' | 'ESSAY'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'
  subjectId: string
  topicId: string
  points: number
  explanation: string
  options: Option[]
  tags: string[]
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
    tags: []
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
          tags: question.tags || []
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

    if (formData.type === 'MCQ' || formData.type === 'TRUE_FALSE') {
      if (formData.options.some(opt => !opt.text.trim())) {
        newErrors.options = 'All options must have text'
      }
      if (!formData.options.some(opt => opt.isCorrect)) {
        newErrors.options = 'At least one option must be marked as correct'
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
      const correctOption = formData.options.find(opt => opt.isCorrect)
      
      // Prepare question data with new structure
      const questionData = {
        text: formData.text,
        type: formData.type,
        difficulty: formData.difficulty,
        subjectId: parseInt(formData.subjectId),
        topicId: formData.topicId ? parseInt(formData.topicId) : undefined,
        points: formData.points,
        explanation: formData.explanation,
        tags: formData.tags,
        // Send options for MCQ/TRUE_FALSE
        options: (formData.type === 'MCQ' || formData.type === 'TRUE_FALSE') ? 
          formData.options
            .filter(opt => opt.text.trim() !== '')
            .map((opt, index) => ({
              ...(opt.id && { id: opt.id }), // Only include id if it exists
              text: opt.text,
              optionOrder: index
            })) : [],
        // Send both correctAnswerOptionId (for updates) and correctAnswerText (for creates)
        correctAnswerOptionId: isEditing && correctOption?.id ? correctOption.id : undefined,
        correctAnswerText: correctOption?.text || null
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
        navigate(isAdminRoute ? '/admin/questions' : '/question-setter/manage')
      }
    } catch (error) {
      console.error(isEditing ? 'Failed to update question:' : 'Failed to create question:', error)
      alert(isEditing ? 'Failed to update question. Please try again.' : 'Failed to create question. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderOptionsSection = () => {
    if (formData.type !== 'MCQ' && formData.type !== 'TRUE_FALSE') {
      return null
    }

    return (
      <div className="space-y-4">
        <label className="text-sm font-medium">
          Options
          {isEditing && (
            <span className="text-xs text-gray-500 ml-2">
              (Current correct answer is highlighted)
            </span>
          )}
        </label>
        {formData.options.map((option, index) => (
          <div 
            key={index} 
            className={`flex items-center gap-3 p-3 border rounded transition-colors ${
              option.isCorrect 
                ? 'border-green-400 bg-green-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input
              type="radio"
              name="correctOption"
              checked={option.isCorrect}
              onChange={() => handleOptionChange(index, 'isCorrect', true)}
              className="text-green-600 focus:ring-green-500"
            />
            <input
              type="text"
              value={option.text}
              onChange={(e) => handleOptionChange(index, 'text', e.target.value)}
              placeholder={`Option ${index + 1}`}
              className={`flex-1 p-2 border rounded-md ${
                option.isCorrect 
                  ? 'border-green-300 bg-green-50 font-medium text-green-900' 
                  : 'border-gray-300'
              }`}
            />
            {formData.options.length > 2 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeOption(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        
        {formData.options.length < 6 && (
          <Button
            type="button"
            variant="outline"
            onClick={addOption}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Option
          </Button>
        )}
        
        {errors.options && (
          <p className="text-sm text-red-600">{errors.options}</p>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={
            returnTo === 'daily-questions' ? '/admin/daily-questions' :
            isAdminRoute ? '/admin/questions' : '/question-setter/manage'
          }>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Edit Question' : 'Create Question'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update the question details' : 'Add a new question to the question bank'}
            </p>
          </div>
        </div>
      </div>

      {/* Question Form */}
      <Card>
        <CardHeader>
          <CardTitle>Question Details</CardTitle>
          <CardDescription>
            {isEditing ? 'Update the question information below' : 'Fill in the details to create a new question'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="text-sm font-medium">Question Text *</label>
              <textarea
                value={formData.text}
                onChange={(e) => handleInputChange('text', e.target.value)}
                placeholder="Enter your question here..."
                className="w-full mt-1 p-3 border rounded-md h-32 resize-none"
              />
              {errors.text && (
                <p className="text-sm text-red-600 mt-1">{errors.text}</p>
              )}
            </div>

            {/* Type and Difficulty */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Question Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="MCQ">Multiple Choice</option>
                  <option value="TRUE_FALSE">True/False</option>
                  <option value="FILL_BLANK">Fill in the Blank</option>
                  <option value="NUMERIC">Numeric</option>
                  <option value="ESSAY">Essay</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Difficulty *</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>

            {/* Subject and Topic */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Subject *</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => handleInputChange('subjectId', e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
                {errors.subjectId && (
                  <p className="text-sm text-red-600 mt-1">{errors.subjectId}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Topic (Optional)</label>
                <select
                  value={formData.topicId}
                  onChange={(e) => handleInputChange('topicId', e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                  disabled={!formData.subjectId}
                >
                  <option value="">Select Topic</option>
                  {topics.map(topic => (
                    <option key={topic.id} value={topic.id}>{topic.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Points */}
            <div className="w-32">
              <label className="text-sm font-medium">Points *</label>
              <input
                type="number"
                min="1"
                max="100"
                value={formData.points}
                onChange={(e) => handleInputChange('points', parseInt(e.target.value))}
                className="w-full mt-1 p-2 border rounded-md"
              />
              {errors.points && (
                <p className="text-sm text-red-600 mt-1">{errors.points}</p>
              )}
            </div>

            {/* Current Correct Answer Display (when editing) */}
            {isEditing && formData.type === 'MCQ' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Current Correct Answer</h4>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-blue-800">
                    {formData.options.find(opt => opt.isCorrect)?.text || 'No correct answer selected'}
                  </span>
                </div>
              </div>
            )}

            {/* Options Section */}
            {renderOptionsSection()}

            {/* Explanation */}
            <div>
              <label className="text-sm font-medium">Explanation (Optional)</label>
              <textarea
                value={formData.explanation}
                onChange={(e) => handleInputChange('explanation', e.target.value)}
                placeholder="Provide an explanation for the correct answer..."
                className="w-full mt-1 p-3 border rounded-md h-24 resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium">Tags</label>
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                    className="flex-1 p-2 border rounded-md"
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
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
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Question' : 'Create Question')}
              </Button>
              <Link to={isAdminRoute ? '/admin/questions' : '/question-setter/manage'}>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default CreateQuestion