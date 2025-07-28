import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { assessmentService } from '@/services/assessmentService'
import { Brain, Target, Trophy, BookOpen, Play, Star, Clock, CheckCircle } from 'lucide-react'

interface PracticeProblem {
  id: number
  question: {
    id: number
    text: string
    type: string
    difficulty: string
    subjectName?: string
  }
  difficulty: string
  topicId: number
  subjectId: number
  type: string
  points: number
  hints: string[]
  status?: string
  attempts?: number
  solved?: boolean
  bookmarked?: boolean
}

interface Subject {
  id: number
  name: string
  description: string
  classLevel: string
  problemCount: number
}

const Practice: React.FC = () => {
  const [practiceProblems, setPracticeProblems] = useState<PracticeProblem[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)

  useEffect(() => {
    loadPracticeData()
  }, [])

  const loadPracticeData = async () => {
    try {
      // Load subjects
      const subjectsResponse = await assessmentService.getPublicSubjects()
      const subjectData = subjectsResponse.data.data || []
      
      // Load practice problems
      const problemsResponse = await assessmentService.getPracticeProblems({ size: 50 })
      const problemData = problemsResponse.data.data?.problems || []
      
      setPracticeProblems(problemData)
      
      // Group problems by subject and count them
      const subjectMap = new Map()
      subjectData.forEach((subject: any) => {
        subjectMap.set(subject.id, { ...subject, problemCount: 0 })
      })
      
      problemData.forEach((problem: PracticeProblem) => {
        if (subjectMap.has(problem.subjectId)) {
          const subject = subjectMap.get(problem.subjectId)
          subject.problemCount++
        }
      })
      
      setSubjects(Array.from(subjectMap.values()).filter((s: any) => s.problemCount > 0))
    } catch (error) {
      console.error('Failed to load practice data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProblems = selectedSubject 
    ? practiceProblems.filter(p => p.subjectId === selectedSubject)
    : practiceProblems

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HARD': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MCQ': return <Target className="h-4 w-4" />
      case 'TRUE_FALSE': return <CheckCircle className="h-4 w-4" />
      case 'NUMERIC': return <Brain className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold tracking-tight">Practice Problems</h1>
          <p className="text-muted-foreground">
            Improve your skills with {practiceProblems.length} curated practice problems
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSelectedSubject(null)}>
            All Subjects
          </Button>
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Start Random Practice
          </Button>
        </div>
      </div>

      {/* Subject Filter Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {subjects.map((subject) => (
          <Card 
            key={subject.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedSubject === subject.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedSubject(subject.id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {subject.name}
              </CardTitle>
              <CardDescription>{subject.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary">{subject.classLevel}</Badge>
                <span className="text-sm text-muted-foreground">
                  {subject.problemCount} problems
                </span>
              </div>
              <Button 
                className="w-full" 
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedSubject(subject.id)
                }}
              >
                Practice {subject.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Practice Problems List */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedSubject 
              ? `${subjects.find(s => s.id === selectedSubject)?.name} Practice Problems`
              : 'All Practice Problems'
            }
          </CardTitle>
          <CardDescription>
            {filteredProblems.length} problems available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {filteredProblems.length > 0 ? (
              filteredProblems.map((problem, index) => (
                <div 
                  key={problem.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(problem.type)}
                      <span className="font-medium">
                        Problem {index + 1}: {problem.question?.text?.substring(0, 50)}...
                      </span>
                      {problem.bookmarked && <Star className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        {problem.points} points
                      </span>
                      {problem.question?.subjectName && (
                        <span>{problem.question.subjectName}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {problem.solved && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Solved
                      </Badge>
                    )}
                    <Button size="sm">
                      <Play className="h-3 w-3 mr-1" />
                      Solve
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {selectedSubject 
                    ? 'No practice problems available for this subject'
                    : 'No practice problems available'
                  }
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Practice