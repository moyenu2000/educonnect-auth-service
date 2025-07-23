import React from 'react';
import { X, CheckCircle, AlertCircle, Clock, Award } from 'lucide-react';

interface QuestionOption {
  id: number;
  text: string;
}

interface Question {
  id: number;
  text: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'FILL_BLANK' | 'NUMERIC' | 'ESSAY';
  subjectName: string;
  topicName?: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT';
  options: QuestionOption[];
  correctAnswerOptionId?: number;
  correctAnswerText?: string;
  explanation?: string;
  points: number;
  tags: string[];
  attachments: string[];
  isActive: boolean;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

interface QuestionPreviewModalProps {
  question: Question;
  isOpen: boolean;
  onClose: () => void;
}

const QuestionPreviewModal: React.FC<QuestionPreviewModalProps> = ({
  question,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HARD': return 'text-orange-600 bg-orange-100';
      case 'EXPERT': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MCQ': return '🔘';
      case 'TRUE_FALSE': return '✓✗';
      case 'FILL_BLANK': return '___';
      case 'NUMERIC': return '123';
      case 'ESSAY': return '📝';
      default: return '❓';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCorrectAnswerText = () => {
    if (question.type === 'MCQ' && question.correctAnswerOptionId) {
      const correctOption = question.options.find(opt => opt.id === question.correctAnswerOptionId);
      return correctOption?.text || 'Not specified';
    }
    return question.correctAnswerText || 'Not specified';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getTypeIcon(question.type)}</div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Question Preview</h2>
              <p className="text-sm text-gray-500">ID: {question.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Question Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Subject</label>
                <p className="text-sm font-semibold text-gray-900">{question.subjectName}</p>
              </div>
              {question.topicName && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Topic</label>
                  <p className="text-sm font-semibold text-gray-900">{question.topicName}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <p className="text-sm font-semibold text-gray-900">{question.type.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Difficulty</label>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Points</label>
                <div className="flex items-center mt-1">
                  <Award size={16} className="text-yellow-500 mr-1" />
                  <p className="text-sm font-semibold text-gray-900">{question.points}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="flex items-center mt-1">
                  {question.isActive ? (
                    <>
                      <CheckCircle size={16} className="text-green-500 mr-1" />
                      <span className="text-sm font-semibold text-green-600">Active</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} className="text-red-500 mr-1" />
                      <span className="text-sm font-semibold text-red-600">Inactive</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">Question</label>
            <div className="bg-white border rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{question.text}</p>
            </div>
          </div>

          {/* Options (for MCQ and TRUE_FALSE) */}
          {(question.type === 'MCQ' || question.type === 'TRUE_FALSE') && question.options && question.options.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-3 block">Answer Options</label>
              <div className="space-y-2">
                {question.options.map((option, index) => {
                  const isCorrect = question.correctAnswerOptionId === option.id;
                  return (
                    <div
                      key={option.id}
                      className={`flex items-center p-3 rounded-lg border ${
                        isCorrect 
                          ? 'border-green-300 bg-green-50' 
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mr-3 ${
                        isCorrect 
                          ? 'border-green-500 bg-green-500 text-white' 
                          : 'border-gray-300'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className={`flex-1 ${isCorrect ? 'font-semibold text-green-900' : 'text-gray-900'}`}>
                        {option.text}
                      </span>
                      {isCorrect && (
                        <CheckCircle size={20} className="text-green-500 ml-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Correct Answer (for non-MCQ questions) */}
          {question.type !== 'MCQ' && question.type !== 'TRUE_FALSE' && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Correct Answer</label>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-green-900 whitespace-pre-wrap">{getCorrectAnswerText()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Explanation */}
          {question.explanation && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Explanation</label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle size={20} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-900 whitespace-pre-wrap">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Attachments */}
          {question.attachments && question.attachments.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Attachments</label>
              <div className="space-y-2">
                {question.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded border">
                    <span className="text-sm text-gray-700">📎 {attachment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <div className="flex items-center mt-1">
                  <Clock size={16} className="text-gray-400 mr-1" />
                  <p className="text-sm text-gray-900">{formatDate(question.createdAt)}</p>
                </div>
              </div>
              {question.updatedAt !== question.createdAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Last Updated</label>
                  <div className="flex items-center mt-1">
                    <Clock size={16} className="text-gray-400 mr-1" />
                    <p className="text-sm text-gray-900">{formatDate(question.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionPreviewModal;