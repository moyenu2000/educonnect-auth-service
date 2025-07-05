import React from 'react';
import { BookOpen, Clock, Target, ChevronRight } from 'lucide-react';
import { type Subject } from '../../types/assessment';
import { Card, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';

interface SubjectCardProps {
  subject: Subject;
  onSelect: (subject: Subject) => void;
  userProgress?: {
    completedTopics: number;
    totalQuestions: number;
    accuracy: number;
  };
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ 
  subject, 
  onSelect, 
  userProgress 
}) => {
  const getClassLevelDisplay = (classLevel: string) => {
    return classLevel.replace('CLASS_', 'Class ');
  };

  const getProgressColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-success-600';
    if (accuracy >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer group">
      <CardBody className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors">
              {subject.name}
            </h3>
            <p className="text-sm text-secondary-600 mt-1">
              {getClassLevelDisplay(subject.classLevel)}
            </p>
          </div>
          <div className="ml-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>

        <p className="text-secondary-700 text-sm mb-4 line-clamp-2">
          {subject.description}
        </p>

        <div className="flex items-center justify-between text-sm text-secondary-600 mb-4">
          <div className="flex items-center">
            <Target className="h-4 w-4 mr-1" />
            <span>{subject.topicsCount} topics</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{subject.questionsCount} questions</span>
          </div>
        </div>

        {userProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-secondary-600">Progress</span>
              <span className={`font-medium ${getProgressColor(userProgress.accuracy)}`}>
                {userProgress.accuracy}% accuracy
              </span>
            </div>
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(userProgress.completedTopics / subject.topicsCount) * 100}%` 
                }}
              />
            </div>
            <p className="text-xs text-secondary-500 mt-1">
              {userProgress.completedTopics} of {subject.topicsCount} topics completed
            </p>
          </div>
        )}

        <Button
          variant="outline"
          fullWidth
          rightIcon={ChevronRight}
          onClick={() => onSelect(subject)}
          className="group-hover:bg-primary-50 group-hover:border-primary-300"
        >
          Explore Subject
        </Button>
      </CardBody>
    </Card>
  );
};