// API Configuration
const VM_IP = import.meta.env.VITE_VM_IP || '35.188.75.223';
const API_CONFIG = {
  DISCUSSION_SERVICE: `http://${VM_IP}:8082/api/v1`,
}

export interface AIQueryRequest {
  question: string;
  type: 'CONCEPT' | 'PROBLEM' | 'EXPLANATION' | 'HOMEWORK';
  context?: string;
  subjectId?: number;
  topicId?: number;
}

export interface AIQueryResponse {
  answer: string;
  sources?: string[];
  confidence?: number;
  followUpQuestions?: string[];
}

export interface AIQuery {
  id: number;
  question: string;
  answer: string;
  type: string;
  subjectId?: number;
  topicId?: number;
  context?: string;
  confidence: number;
  sources?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AIHistoryResponse {
  content: AIQuery[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

class AIService {
  private getHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  async askAI(request: AIQueryRequest): Promise<AIQueryResponse> {
    const response = await fetch(`${API_CONFIG.DISCUSSION_SERVICE}/ai/ask`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || data.message || 'Failed to get AI response');
    }

    return data.data;
  }

  async getAIHistory(params: {
    page?: number;
    size?: number;
    subjectId?: number;
  } = {}): Promise<AIHistoryResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params.size !== undefined) {
      queryParams.append('size', params.size.toString());
    }
    if (params.subjectId !== undefined) {
      queryParams.append('subjectId', params.subjectId.toString());
    }

    const url = `${API_CONFIG.DISCUSSION_SERVICE}/ai/history${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || data.message || 'Failed to get AI history');
    }

    return data.data;
  }
}

export const aiService = new AIService();