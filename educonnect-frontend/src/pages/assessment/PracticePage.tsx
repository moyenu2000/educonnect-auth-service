import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

import { SubjectCard } from '../../components/assessment/SubjectCard';
import { QuestionCard } from '../../components/assessment/QuestionCard';
import { Card, CardBody, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { assessmentService } from '../../services/assessmentService';
import { type Subject, type PracticeProblem, Difficulty, QuestionType } from '../../types/assessment';

export const PracticePage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [currentProblem, setCurrentProblem] = useState<PracticeProblem | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [filters, setFilters] = useState({
    difficulty: '' as Difficulty | '',
    type: '' as QuestionType | '',
    search: ''
  });

  // Fetch subjects
  const { data: subjectsData, isLoading: subjectsLoading } = useQuery(
    ['subjects'],
    () => assessmentService.getSubjects(0, 20),
    {
      onError: (error) => {
        console.error('Failed to fetch subjects:', error);
        toast.error('Failed to load subjects');
      }
    }
  );

  // Fetch practice problems for selected subject
  const { 
    data: problemsData, 
    isLoading: problemsLoading,
    refetch: refetchProblems 
  } = useQuery(
    ['practice-problems', selectedSubject?.id, filters],
    () => selectedSubject ? assessmentService.getPracticeProblems({
      subjectId: selectedSubject.id,
      difficulty: filters.difficulty || undefined,
      type: filters.type || undefined,
      search: filters.search || undefined,
      size: 1 // Get one problem at a time
    }) : Promise.resolve({ data: [] }),
    {
      enabled: !!selectedSubject,
      onError: (error) => {
        console.error('Failed to fetch practice problems:', error);
        toast.error('Failed to load practice problems');
      }
    }
  );

  // Get the first problem from the results
  useEffect(() => {
    if (problemsData?.data && problemsData.data.length > 0) {
      setCurrentProblem(problemsData.data[0]);
      setShowResult(false);
      setUserAnswer('');
    }
  }, [problemsData]);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setCurrentProblem(null);
    setShowResult(false);
  };

  const handleAnswerSubmit = async (answer: string) => {
    if (!currentProblem) return;

    try {
      const result = await assessmentService.submitPracticeProblem(
        currentProblem.id,
        {
          answer,
          timeTaken: 0 // You can track time if needed
        }
      );

      setUserAnswer(answer);
      setIsCorrect(result.correct);
      setCorrectAnswer(result.correctAnswer);
      setExplanation(result.explanation);
      setShowResult(true);

      if (result.correct) {
        toast.success('Correct! Well done!');
      } else {
        toast.error('Incorrect. Check the explanation below.');
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      toast.error('Failed to submit answer');
    }
  };

  const handleBookmark = async () => {
    if (!currentProblem) return;

    try {
      const result = await assessmentService.bookmarkPracticeProblem(currentProblem.id);
      setCurrentProblem({
        ...currentProblem,
        bookmarked: result.bookmarked
      });
      
      toast.success(result.bookmarked ? 'Problem bookmarked!' : 'Bookmark removed!');
    } catch (error) {
      console.error('Failed to bookmark problem:', error);
      toast.error('Failed to bookmark problem');
    }
  };

  const handleGetHint = async () => {
    if (!currentProblem) return;

    try {
      const hint = await assessmentService.getPracticeProblemHint(currentProblem.id);
      toast.success(`Hint: ${hint.hint}`, { duration: 6000 });
    } catch (error) {
      console.error('Failed to get hint:', error);
      toast.error('Failed to get hint');
    }
  };

  const handleNextProblem = () => {
    refetchProblems();
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (!selectedSubject) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Practice Problems</h1>
          <p className="text-secondary-600 mt-2">
            Choose a subject to start practicing questions and improve your skills.
          </p>
        </div>

        {subjectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-secondary-200 rounded-lg h-48"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectsData?.data?.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onSelect={handleSubjectSelect}
                userProgress={{
                  completedTopics: Math.floor(Math.random() * subject.topicsCount),
                  totalQuestions: subject.questionsCount,
                  accuracy: Math.floor(Math.random() * 40) + 60
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900">
              {selectedSubject.name} Practice
            </h1>
            <p className="text-secondary-600 mt-2">
              Practice problems to improve your understanding
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setSelectedSubject(null)}
          >
            Change Subject
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="form-select"
              >
                <option value="">All Difficulties</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Question Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="form-select"
              >
                <option value="">All Types</option>
                <option value="MCQ">Multiple Choice</option>
                <option value="TRUE_FALSE">True/False</option>
                <option value="FILL_BLANK">Fill in the Blank</option>
                <option value="NUMERIC">Numeric</option>
                <option value="ESSAY">Essay</option>
              </select>
            </div>
            
            <Input
              label="Search"
              type="text"
              leftIcon={Search}
              placeholder="Search problems..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </CardBody>
      </Card>

      {/* Current Problem */}
      {problemsLoading ? (
        <div className="animate-pulse">
          <div className="bg-secondary-200 rounded-lg h-96"></div>
        </div>
      ) : currentProblem ? (
        <div className="space-y-6">
          <QuestionCard
            question={currentProblem.question}
            onSubmit={handleAnswerSubmit}
            onBookmark={handleBookmark}
            onGetHint={handleGetHint}
            showResult={showResult}
            userAnswer={userAnswer}
            isCorrect={isCorrect}
            correctAnswer={correctAnswer}
            explanation={explanation}
            isBookmarked={currentProblem.bookmarked}
          />

          {showResult && (
            <div className="flex justify-center">
              <Button
                leftIcon={RefreshCw}
                onClick={handleNextProblem}
                size="lg"
              >
                Next Problem
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-secondary-600 mb-4">
              No practice problems found with the current filters.
            </p>
            <Button
              variant="outline"
              onClick={() => setFilters({ difficulty: '', type: '', search: '' })}
            >
              Clear Filters
            </Button>
          </CardBody>
        </Card>
      )}
    </div>
  );
};