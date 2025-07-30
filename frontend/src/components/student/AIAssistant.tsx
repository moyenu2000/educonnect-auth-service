import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  History, 
  Lightbulb, 
  Calculator,
  HelpCircle,
  BookOpen,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import type { AIQueryRequest, AIQueryResponse, AIQuery } from '../../services/aiService';
import { assessmentService } from '../../services/assessmentService';
import LaTeXText from '../ui/LaTeXText';

interface Subject {
  id: number;
  name: string;
}

const AIAssistant: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [type, setType] = useState<AIQueryRequest['type']>('CONCEPT');
  const [context, setContext] = useState('');
  const [subjectId, setSubjectId] = useState<number | undefined>();
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [response, setResponse] = useState<AIQueryResponse | null>(null);
  const [history, setHistory] = useState<AIQuery[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load subjects on mount
  useEffect(() => {
    loadSubjects();
    loadHistory();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await assessmentService.getSubjects();
      const data = response.data?.data;
      if (data && data.content) {
        setSubjects(data.content);
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const loadHistory = async () => {
    try {
      setHistoryLoading(true);
      const historyData = await aiService.getAIHistory({ page: 0, size: 10 });
      setHistory(historyData.content || []);
    } catch (error) {
      console.error('Failed to load AI history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const request: AIQueryRequest = {
        question: question.trim(),
        type,
        context: context.trim() || undefined,
        subjectId
      };

      const aiResponse = await aiService.askAI(request);
      setResponse(aiResponse);
      
      // Reload history to include the new query
      loadHistory();
      
      // Clear form
      setQuestion('');
      setContext('');
    } catch (err: any) {
      setError(err.message || 'Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CONCEPT': return <Lightbulb className="h-4 w-4" />;
      case 'PROBLEM': return <Calculator className="h-4 w-4" />;
      case 'EXPLANATION': return <HelpCircle className="h-4 w-4" />;
      case 'HOMEWORK': return <BookOpen className="h-4 w-4" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONCEPT': return 'bg-blue-100 text-blue-800';
      case 'PROBLEM': return 'bg-green-100 text-green-800';
      case 'EXPLANATION': return 'bg-purple-100 text-purple-800';
      case 'HOMEWORK': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <Bot className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Get instant help with concepts, problems, explanations, and homework assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ask AI Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span>Ask AI</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as AIQueryRequest['type'])}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="CONCEPT">Concept Explanation</option>
                      <option value="PROBLEM">Problem Solving</option>
                      <option value="EXPLANATION">Detailed Explanation</option>
                      <option value="HOMEWORK">Homework Help</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject (Optional)
                    </label>
                    <select
                      value={subjectId || ''}
                      onChange={(e) => setSubjectId(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">All Subjects</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Question
                    </label>
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask me anything about your studies..."
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Context (Optional)
                    </label>
                    <textarea
                      value={context}
                      onChange={(e) => setContext(e.target.value)}
                      placeholder="Provide any additional context that might help..."
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={!question.trim() || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Getting Answer...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Ask AI
                      </>
                    )}
                  </Button>
                </form>

                {/* AI Response */}
                {response && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                      <Bot className="h-4 w-4 mr-2" />
                      AI Response:
                    </h3>
                    <p className="text-blue-800 whitespace-pre-wrap mb-3">
                      <LaTeXText text={response.answer} />
                    </p>
                    
                    {response.sources && response.sources.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-blue-700 mb-1">Sources:</p>
                        <ul className="text-sm text-blue-600 list-disc list-inside">
                          {response.sources.map((source, index) => (
                            <li key={index}>{source}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {response.followUpQuestions && response.followUpQuestions.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-blue-700 mb-1">Follow-up questions:</p>
                        <ul className="text-sm text-blue-600 list-disc list-inside">
                          {response.followUpQuestions.map((q, index) => (
                            <li key={index} className="cursor-pointer hover:text-blue-800"
                                onClick={() => setQuestion(q)}>
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {response.confidence !== undefined && (
                      <div className="text-xs text-blue-600">
                        Confidence: {Math.round(response.confidence * 100)}%
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                      <p className="text-red-800">Error: {error}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* History Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Recent History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : history.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {history.map((item) => (
                      <div key={item.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={getTypeColor(item.type)}>
                            <div className="flex items-center space-x-1">
                              {getTypeIcon(item.type)}
                              <span>{item.type}</span>
                            </div>
                          </Badge>
                          <span className="text-xs text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {item.question}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          <LaTeXText text={item.answer} />
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Confidence: {Math.round(item.confidence * 100)}%
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setQuestion(item.question)}
                            className="text-xs"
                          >
                            Ask Again
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No AI queries yet</p>
                    <p className="text-sm">Ask your first question to get started!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;