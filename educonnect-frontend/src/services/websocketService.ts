/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_CONFIG } from '../constants/api';
import { authService } from './authService';

export interface WebSocketMessage<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private eventHandlers: Map<string, ((data: any) => void)[]> = new Map();

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    if (this.client) {
      return;
    }

    this.client = new Client({
      brokerURL: API_CONFIG.DISCUSSION_SERVICE.WEBSOCKET.BASE_URL.replace('ws://', 'ws://'),
      webSocketFactory: () => new SockJS(API_CONFIG.DISCUSSION_SERVICE.WEBSOCKET.BASE_URL + '/ws'),
      connectHeaders: this.getAuthHeaders(),
      debug: (str) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('[WebSocket]', str);
        }
      },
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        console.log('[WebSocket] Connected');
        this.reconnectAttempts = 0;
        this.emit('connect', null);
      },
      onDisconnect: () => {
        console.log('[WebSocket] Disconnected');
        this.emit('disconnect', null);
      },
      onStompError: (frame) => {
        console.error('[WebSocket] STOMP Error:', frame);
        this.emit('error', frame);
      },
      onWebSocketError: (error) => {
        console.error('[WebSocket] WebSocket Error:', error);
        this.emit('error', error);
      },
      onWebSocketClose: () => {
        console.log('[WebSocket] WebSocket Closed');
        this.handleReconnect();
      }
    });
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('accessToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && !this.isConnecting) {
      this.reconnectAttempts++;
      const delay = Math.min(this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1), 30000);
      
      console.log(`[WebSocket] Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        if (authService.isAuthenticated()) {
          this.connect();
        }
      }, delay);
    } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached', null);
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!authService.isAuthenticated()) {
        reject(new Error('User not authenticated'));
        return;
      }

      if (this.client?.connected) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        // Wait for current connection attempt
        this.once('connect', () => resolve());
        this.once('error', (error) => reject(error));
        return;
      }

      this.isConnecting = true;
      
      // Update auth headers before connecting
      if (this.client) {
        this.client.connectHeaders = this.getAuthHeaders();
      }

      const connectHandler = () => {
        this.isConnecting = false;
        this.off('connect', connectHandler);
        this.off('error', errorHandler);
        resolve();
      };

      const errorHandler = (error: any) => {
        this.isConnecting = false;
        this.off('connect', connectHandler);
        this.off('error', errorHandler);
        reject(error);
      };

      this.once('connect', connectHandler);
      this.once('error', errorHandler);

      this.client?.activate();
    });
  }

  disconnect(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
    
    if (this.client) {
      this.client.deactivate();
    }
    
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }

  // Message and Notification Subscriptions
  subscribeToMessages(onMessage: (message: any) => void): () => void {
    return this.subscribe('/queue/messages', onMessage);
  }

  subscribeToNotifications(onNotification: (notification: any) => void): () => void {
    return this.subscribe('/queue/notifications', onNotification);
  }

  subscribeToNotificationCount(onCountUpdate: (count: any) => void): () => void {
    return this.subscribe('/queue/notifications.count', onCountUpdate);
  }

  subscribeToTypingIndicators(onTyping: (status: any) => void): () => void {
    return this.subscribe('/queue/typing', onTyping);
  }

  subscribeToMessageStatus(onStatus: (status: any) => void): () => void {
    return this.subscribe('/queue/message.status', onStatus);
  }

  // Group Subscriptions
  subscribeToGroup(groupId: number, callbacks: {
    onDiscussion?: (discussion: any) => void;
    onAnswer?: (answer: any) => void;
    onVote?: (vote: any) => void;
    onMembership?: (membership: any) => void;
  }): () => void {
    const unsubscribeFunctions: (() => void)[] = [];

    if (callbacks.onDiscussion) {
      unsubscribeFunctions.push(
        this.subscribe(`/topic/groups/${groupId}/discussions`, callbacks.onDiscussion)
      );
    }

    if (callbacks.onAnswer) {
      unsubscribeFunctions.push(
        this.subscribe(`/topic/groups/${groupId}/answers`, callbacks.onAnswer)
      );
    }

    if (callbacks.onVote) {
      unsubscribeFunctions.push(
        this.subscribe(`/topic/groups/${groupId}/votes`, callbacks.onVote)
      );
    }

    if (callbacks.onMembership) {
      unsubscribeFunctions.push(
        this.subscribe(`/topic/groups/${groupId}/members`, callbacks.onMembership)
      );
    }

    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
  }

  // Send Messages
  sendMessage(message: {
    recipientId: number;
    content: string;
    type: string;
    attachments?: string[];
    tempId?: string;
  }): void {
    this.send('/app/messages.send', message);
  }

  startTyping(conversationId: number, recipientId: number): void {
    this.send('/app/typing.start', { conversationId, recipientId });
  }

  stopTyping(conversationId: number, recipientId: number): void {
    this.send('/app/typing.stop', { conversationId, recipientId });
  }

  markMessageAsRead(messageId: number, conversationId: number): void {
    this.send('/app/messages.read', { messageId, conversationId });
  }

  // Group Actions
  createGroupDiscussion(groupId: number, discussion: {
    title: string;
    content: string;
    tags?: string[];
    attachments?: string[];
    isAnonymous?: boolean;
  }): void {
    this.send(`/app/groups/${groupId}/discussions.create`, discussion);
  }

  createGroupAnswer(groupId: number, answer: {
    discussionId: number;
    content: string;
    attachments?: string[];
    isAnonymous?: boolean;
  }): void {
    this.send(`/app/groups/${groupId}/answers.create`, answer);
  }

  voteInGroup(groupId: number, vote: {
    targetId: number;
    targetType: 'DISCUSSION' | 'ANSWER';
    voteType: 'UPVOTE' | 'DOWNVOTE';
  }): void {
    this.send(`/app/groups/${groupId}/vote`, vote);
  }

  // Private helper methods
  private subscribe(destination: string, callback: (data: any) => void): () => void {
    if (!this.client?.connected) {
      console.warn('[WebSocket] Not connected, subscription will be attempted on next connection');
      return () => {};
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const data = JSON.parse(message.body);
        callback(data);
      } catch (error) {
        console.error('[WebSocket] Failed to parse message:', error);
      }
    });

    this.subscriptions.set(destination, subscription);

    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete(destination);
    };
  }

  private send(destination: string, data: any): void {
    if (!this.client?.connected) {
      console.warn('[WebSocket] Not connected, message not sent');
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(data)
    });
  }

  // Event handling
  on(event: string, handler: (data: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off(event: string, handler: (data: any) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  once(event: string, handler: (data: any) => void): void {
    const onceHandler = (data: any) => {
      handler(data);
      this.off(event, onceHandler);
    };
    this.on(event, onceHandler);
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error('[WebSocket] Error in event handler:', error);
        }
      });
    }
  }

  // Connection status
  isConnected(): boolean {
    return this.client?.connected || false;
  }

  getConnectionState(): string {
    if (!this.client) return 'NOT_INITIALIZED';
    if (this.client.connected) return 'CONNECTED';
    if (this.isConnecting) return 'CONNECTING';
    return 'DISCONNECTED';
  }
}

export const webSocketService = new WebSocketService();