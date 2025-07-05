import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Lightbulb, Bookmark, Check } from 'lucide-react';
import { type Question, QuestionType, Difficulty } from '../../types/assessment';
import { Card, CardBody, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

interface QuestionCardProps {
  question: Question;
  onSubmit: (answer: string) => void;
  onBookmark?: () => void;
  onGetHint?: () => void;
  showResult?: boolean;
  userAnswer?: string;
  isCorrect?: boolean;
  correctAnswer?: string;
  explanation?: string;
  isBookmarked?: boolean;
  timeLimit?: number;
  onTimeUp?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onSubmit,
  onBookmark,
  onGetHint,
  showResult = false,
  userAnswer,
  isCorrect,
  correctAnswer,
  explanation,
  isBookmarked = false,
  timeLimit,
  onTimeUp
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  React.useEffect(() => {
    if (timeLimit && !showResult) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev && prev <= 1) {
            onTimeUp?.();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLimit, showResult, onTimeUp]);

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'EASY': return 'text-success-600 bg-success-100';
      case 'MEDIUM': return 'text-warning-600 bg-warning-100';
      case 'HARD': return 'text-error-600 bg-error-100';
      case 'EXPERT': return 'text-purple-600 bg-purple-100';
      default: return 'text-secondary-600 bg-secondary-100';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    if (selectedAnswer.trim()) {
      onSubmit(selectedAnswer);
    }
  };

  const renderQuestionInput = () => {
    switch (question.type) {
      case QuestionType.MCQ:
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedAnswer === option
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:bg-secondary-50'
                } ${showResult ? 'cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={showResult}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedAnswer === option ? 'border-primary-500' : 'border-secondary-300'
                }`}>
                  {selectedAnswer === option && (
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                  )}
                </div>
                <span className="text-secondary-700">{option}</span>
                {showResult && (
                  <div className="ml-auto">
                    {option === correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-success-600" />
                    )}
                    {option === userAnswer && option !== correctAnswer && (
                      <XCircle className="h-5 w-5 text-error-600" />
                    )}
                  </div>
                )}
              </label>
            ))}
          </div>
        );

      case QuestionType.TRUE_FALSE:
        return (
          <div className="space-y-3">
            {['True', 'False'].map((option) => (
              <label
                key={option}
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedAnswer === option
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 hover:bg-secondary-50'
                } ${showResult ? 'cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={showResult}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  selectedAnswer === option ? 'border-primary-500' : 'border-secondary-300'
                }`}>
                  {selectedAnswer === option && (
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                  )}
                </div>
                <span className="text-secondary-700">{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <textarea
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            disabled={showResult}
            placeholder="Enter your answer..."
            className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={4}
          />
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Question #{question.id}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {timeRemaining !== undefined && !showResult && (
              <div className="flex items-center text-sm text-secondary-600">
                <Clock className="h-4 w-4 mr-1" />
                <span className={timeRemaining < 60 ? 'text-error-600 font-medium' : ''}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            )}
            
            {onBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBookmark}
                leftIcon={isBookmarked ? Check : Bookmark}
                className={isBookmarked ? 'text-warning-600' : 'text-secondary-600'}
              >
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <div className="space-y-6">
          {/* Question Text */}
          <div className="prose max-w-none">
            <p className="text-secondary-900 text-base leading-relaxed">
              {question.text}
            </p>
          </div>

          {/* Question Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Answer Input */}
          {!showResult && (
            <div>
              <h4 className="text-sm font-medium text-secondary-700 mb-3">Your Answer:</h4>
              {renderQuestionInput()}
            </div>
          )}

          {/* Result Display */}
          {showResult && (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-success-50 border border-success-200' : 'bg-error-50 border border-error-200'}`}>
                <div className="flex items-center">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-success-600 mr-2" />
                  ) : (
                    <XCircle className="h-5 w-5 text-error-600 mr-2" />
                  )}
                  <span className={`font-medium ${isCorrect ? 'text-success-800' : 'text-error-800'}`}>
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                
                {!isCorrect && correctAnswer && (
                  <p className="mt-2 text-sm text-secondary-700">
                    <strong>Correct answer:</strong> {correctAnswer}
                  </p>
                )}
                
                {userAnswer && (
                  <p className="mt-1 text-sm text-secondary-600">
                    <strong>Your answer:</strong> {userAnswer}
                  </p>
                )}
              </div>

              {explanation && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">Explanation:</h5>
                  <p className="text-blue-700 text-sm">{explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {!showResult && (
            <div className="flex items-center justify-between pt-4">
              <div>
                {onGetHint && (
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={Lightbulb}
                    onClick={onGetHint}
                  >
                    Get Hint
                  </Button>
                )}
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer.trim()}
                className="min-w-[120px]"
              >
                Submit Answer
              </Button>
            </div>
          )}

          {/* Points Display */}
          <div className="flex items-center justify-between text-sm text-secondary-600 pt-4 border-t border-secondary-200">
            <span>Points: {question.points}</span>
            <span>Type: {question.type.replace('_', ' ')}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};