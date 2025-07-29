import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentService } from '@/services/assessmentService'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MoreVertical,
  Search,
  ArrowLeft,
  List,
  Folder
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Dialog from '@radix-ui/react-dialog'

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
  createdAt: string
  updatedAt: string
  questionsCount: number
}

const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(true)
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreateTopicDialogOpen, setIsCreateTopicDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    classLevel: 'CLASS_10',
    displayOrder: 0
  })
  const [topicFormData, setTopicFormData] = useState({
    name: '',
    description: '',
    displayOrder: 0
  })

  useEffect(() => {
    loadSubjects()
  }, [])

  const loadSubjects = async () => {
    try {
      const response = await assessmentService.getSubjects({ page: 0, size: 100 })
      setSubjects(response.data.data?.content || [])
    } catch (error) {
      console.error('Failed to load subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSubject = async () => {
    try {
      const response = await assessmentService.createSubject(formData)
      setSubjects(prev => [...prev, response.data.data])
      setIsCreateDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Failed to create subject:', error)
    }
  }

  const handleUpdateSubject = async () => {
    if (!editingSubject) return

    try {
      const response = await assessmentService.updateSubject(editingSubject.id, formData)
      setSubjects(prev => prev.map(subject => 
        subject.id === editingSubject.id ? response.data.data : subject
      ))
      setEditingSubject(null)
      resetForm()
    } catch (error) {
      console.error('Failed to update subject:', error)
    }
  }

  const handleDeleteSubject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subject?')) return

    try {
      await assessmentService.deleteSubject(id)
      setSubjects(prev => prev.filter(subject => subject.id !== id))
    } catch (error) {
      console.error('Failed to delete subject:', error)
    }
  }

  const loadTopics = async (subjectId: number) => {
    setTopicsLoading(true)
    try {
      const response = await assessmentService.getTopics({ subjectId, page: 0, size: 100 })
      setTopics(response.data.data?.content || [])
    } catch (error) {
      console.error('Failed to load topics:', error)
    } finally {
      setTopicsLoading(false)
    }
  }

  const handleCreateTopic = async () => {
    if (!selectedSubject) return
    try {
      const response = await assessmentService.createTopic({
        ...topicFormData,
        subjectId: selectedSubject.id
      })
      setTopics(prev => [...prev, response.data.data])
      setIsCreateTopicDialogOpen(false)
      resetTopicForm()
      // Update subject's topic count
      setSubjects(prev => prev.map(subject => 
        subject.id === selectedSubject.id 
          ? { ...subject, topicsCount: subject.topicsCount + 1 }
          : subject
      ))
    } catch (error) {
      console.error('Failed to create topic:', error)
    }
  }

  const handleUpdateTopic = async () => {
    if (!editingTopic) return
    try {
      const response = await assessmentService.updateTopic(editingTopic.id, topicFormData)
      setTopics(prev => prev.map(topic => 
        topic.id === editingTopic.id ? response.data.data : topic
      ))
      setEditingTopic(null)
      resetTopicForm()
    } catch (error) {
      console.error('Failed to update topic:', error)
    }
  }

  const handleDeleteTopic = async (id: number) => {
    if (!confirm('Are you sure you want to delete this topic?')) return
    try {
      await assessmentService.deleteTopic(id)
      setTopics(prev => prev.filter(topic => topic.id !== id))
      // Update subject's topic count
      if (selectedSubject) {
        setSubjects(prev => prev.map(subject => 
          subject.id === selectedSubject.id 
            ? { ...subject, topicsCount: Math.max(0, subject.topicsCount - 1) }
            : subject
        ))
      }
    } catch (error) {
      console.error('Failed to delete topic:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      classLevel: 'CLASS_10',
      displayOrder: 0
    })
  }

  const resetTopicForm = () => {
    setTopicFormData({
      name: '',
      description: '',
      displayOrder: 0
    })
  }

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject)
    setFormData({
      name: subject.name,
      description: subject.description,
      classLevel: subject.classLevel,
      displayOrder: subject.displayOrder
    })
  }

  const openEditTopicDialog = (topic: Topic) => {
    setEditingTopic(topic)
    setTopicFormData({
      name: topic.name,
      description: topic.description,
      displayOrder: topic.displayOrder
    })
  }

  const handleSubjectClick = (subject: Subject) => {
    setSelectedSubject(subject)
    loadTopics(subject.id)
  }

  const handleBackToSubjects = () => {
    setSelectedSubject(null)
    setTopics([])
    setSearchQuery('')
  }

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTopics = topics.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getClassLevelColor = (classLevel: string) => {
    const level = parseInt(classLevel.replace('CLASS_', ''))
    if (level <= 8) return 'bg-green-100 text-green-800'
    if (level <= 10) return 'bg-blue-100 text-blue-800'
    return 'bg-purple-100 text-purple-800'
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
          {selectedSubject ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleBackToSubjects}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{selectedSubject.name} - Topics</h1>
                <p className="text-muted-foreground">
                  Manage topics for {selectedSubject.name}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Subject & Topic Management</h1>
              <p className="text-muted-foreground">
                Manage subjects and their topics across different class levels
              </p>
            </div>
          )}
        </div>
        {selectedSubject ? (
          <Button onClick={() => setIsCreateTopicDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Topic
          </Button>
        ) : (
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={selectedSubject ? "Search topics..." : "Search subjects..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      {selectedSubject ? (
        /* Topics Grid */
        <div>
          {topicsLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTopics.map((topic) => (
                <Card key={topic.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={topic.isActive ? "default" : "secondary"}>
                            {topic.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        <CardTitle className="flex items-center gap-2">
                          <List className="h-5 w-5" />
                          {topic.name}
                        </CardTitle>
                        
                        <CardDescription className="mt-2">
                          {topic.description}
                        </CardDescription>
                      </div>

                      <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content className="w-48 bg-white border rounded-md shadow-lg" align="end">
                          <DropdownMenu.Item 
                            className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                            onClick={() => openEditTopicDialog(topic)}
                          >
                            <Edit className="h-4 w-4" />
                            Edit Topic
                          </DropdownMenu.Item>
                          
                          <DropdownMenu.Separator className="h-px bg-border" />
                          
                          <DropdownMenu.Item 
                            className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer text-red-600"
                            onClick={() => handleDeleteTopic(topic.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Topic
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Root>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="text-sm">
                      <span className="font-medium">{topic.questionsCount}</span>
                      <p className="text-muted-foreground">Questions</p>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                      Created: {new Date(topic.createdAt).toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Subjects Grid */
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSubjects.map((subject) => (
            <Card key={subject.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleSubjectClick(subject)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getClassLevelColor(subject.classLevel)}>
                        {subject.classLevel.replace('_', ' ')}
                      </Badge>
                      <Badge variant={subject.isActive ? "default" : "secondary"}>
                        {subject.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <CardTitle className="flex items-center gap-2">
                      <Folder className="h-5 w-5" />
                      {subject.name}
                    </CardTitle>
                    
                    <CardDescription className="mt-2">
                      {subject.description}
                    </CardDescription>
                  </div>

                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content className="w-48 bg-white border rounded-md shadow-lg" align="end">
                      <DropdownMenu.Item 
                        className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSubjectClick(subject)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        View Topics
                      </DropdownMenu.Item>
                      
                      <DropdownMenu.Item 
                        className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditDialog(subject)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                        Edit Subject
                      </DropdownMenu.Item>
                      
                      <DropdownMenu.Separator className="h-px bg-border" />
                      
                      <DropdownMenu.Item 
                        className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteSubject(subject.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Subject
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">{subject.topicsCount}</span>
                    <p className="text-muted-foreground">Topics</p>
                  </div>
                  <div>
                    <span className="font-medium">{subject.questionsCount}</span>
                    <p className="text-muted-foreground">Questions</p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                  Created: {new Date(subject.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty States */}
      {selectedSubject ? (
        filteredTopics.length === 0 && !topicsLoading && (
          <Card>
            <CardContent className="text-center py-12">
              <List className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No topics found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search query' : `Create the first topic for ${selectedSubject.name}!`}
              </p>
              <Button onClick={() => setIsCreateTopicDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Topic
              </Button>
            </CardContent>
          </Card>
        )
      ) : (
        filteredSubjects.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Try adjusting your search query' : 'Create your first subject to get started!'}
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </CardContent>
          </Card>
        )
      )}

      {/* Create/Edit Subject Dialog */}
      <Dialog.Root open={isCreateDialogOpen || editingSubject !== null} onOpenChange={(open) => {
        if (!open) {
          setIsCreateDialogOpen(false)
          setEditingSubject(null)
          resetForm()
        }
      }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {editingSubject ? 'Edit Subject' : 'Create New Subject'}
            </Dialog.Title>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter subject name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter subject description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Class Level</label>
                <select
                  value={formData.classLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, classLevel: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="CLASS_6">Class 6</option>
                  <option value="CLASS_7">Class 7</option>
                  <option value="CLASS_8">Class 8</option>
                  <option value="CLASS_9">Class 9</option>
                  <option value="CLASS_10">Class 10</option>
                  <option value="CLASS_11">Class 11</option>
                  <option value="CLASS_12">Class 12</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={editingSubject ? handleUpdateSubject : handleCreateSubject}
                className="flex-1"
              >
                {editingSubject ? 'Update Subject' : 'Create Subject'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setEditingSubject(null)
                  resetForm()
                }}
              >
                Cancel
              </Button>
            </div>

            <Dialog.Close asChild>
              <button className="absolute right-4 top-4 opacity-70 hover:opacity-100">
                ✕
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Create/Edit Topic Dialog */}
      <Dialog.Root open={isCreateTopicDialogOpen || editingTopic !== null} onOpenChange={(open) => {
        if (!open) {
          setIsCreateTopicDialogOpen(false)
          setEditingTopic(null)
          resetTopicForm()
        }
      }}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg rounded-lg">
            <Dialog.Title className="text-lg font-semibold mb-4">
              {editingTopic ? 'Edit Topic' : `Create New Topic for ${selectedSubject?.name}`}
            </Dialog.Title>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Topic Name</label>
                <input
                  type="text"
                  value={topicFormData.name}
                  onChange={(e) => setTopicFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter topic name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={topicFormData.description}
                  onChange={(e) => setTopicFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter topic description"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  value={topicFormData.displayOrder}
                  onChange={(e) => setTopicFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={editingTopic ? handleUpdateTopic : handleCreateTopic}
                className="flex-1"
              >
                {editingTopic ? 'Update Topic' : 'Create Topic'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateTopicDialogOpen(false)
                  setEditingTopic(null)
                  resetTopicForm()
                }}
              >
                Cancel
              </Button>
            </div>

            <Dialog.Close asChild>
              <button className="absolute right-4 top-4 opacity-70 hover:opacity-100">
                ✕
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default SubjectManagement