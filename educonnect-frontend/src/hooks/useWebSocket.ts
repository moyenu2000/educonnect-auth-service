import { useEffect, useState, useCallback } from 'react';
import { webSocketService } from '../services/websocketService';
import { useAuthStore } from '../stores/authStore';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('DISCONNECTED');
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      webSocketService.disconnect();
      setIsConnected(false);
      setConnectionState('DISCONNECTED');
      return;
    }

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionState('CONNECTED');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setConnectionState('DISCONNECTED');
    };

    const handleError = (error: unknown) => {
      console.error('WebSocket error:', error);
      setConnectionState('ERROR');
    };

    // Set up event listeners
    webSocketService.on('connect', handleConnect);
    webSocketService.on('disconnect', handleDisconnect);
    webSocketService.on('error', handleError);

    // Connect if authenticated
    if (isAuthenticated) {
      setConnectionState('CONNECTING');
      webSocketService.connect().catch((error) => {
        console.error('Failed to connect WebSocket:', error);
        setConnectionState('ERROR');
      });
    }

    return () => {
      webSocketService.off('connect', handleConnect);
      webSocketService.off('disconnect', handleDisconnect);
      webSocketService.off('error', handleError);
    };
  }, [isAuthenticated]);

  const reconnect = useCallback(() => {
    if (isAuthenticated) {
      setConnectionState('CONNECTING');
      webSocketService.connect().catch((error) => {
        console.error('Failed to reconnect WebSocket:', error);
        setConnectionState('ERROR');
      });
    }
  }, [isAuthenticated]);

  return {
    isConnected,
    connectionState,
    reconnect,
    service: webSocketService
  };
};

export const useMessages = () => {
  const [messages, setMessages] = useState<unknown[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [unreadCount, setUnreadCount] = useState(0);
  const { service } = useWebSocket();

  useEffect(() => {
    const unsubscribeMessages = service.subscribeToMessages((message) => {
      setMessages(prev => [...prev, message]);
    });

    const unsubscribeTyping = service.subscribeToTypingIndicators((status) => {
      // Handle typing indicators
      console.log('Typing status:', status);
    });

    const unsubscribeStatus = service.subscribeToMessageStatus((status) => {
      // Handle message status updates
      console.log('Message status:', status);
    });

    return () => {
      unsubscribeMessages();
      unsubscribeTyping();
      unsubscribeStatus();
    };
  }, [service]);

  const sendMessage = useCallback((recipientId: number, content: string, type = 'TEXT') => {
    service.sendMessage({
      recipientId,
      content,
      type,
      tempId: Date.now().toString()
    });
  }, [service]);

  const startTyping = useCallback((conversationId: number, recipientId: number) => {
    service.startTyping(conversationId, recipientId);
  }, [service]);

  const stopTyping = useCallback((conversationId: number, recipientId: number) => {
    service.stopTyping(conversationId, recipientId);
  }, [service]);

  return {
    messages,
    unreadCount,
    sendMessage,
    startTyping,
    stopTyping
  };
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<unknown[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { service } = useWebSocket();

  useEffect(() => {
    const unsubscribeNotifications = service.subscribeToNotifications((notification) => {
      setNotifications(prev => [notification, ...prev]);
      if (!notification.isRead) {
        setUnreadCount(prev => prev + 1);
      }
    });

    const unsubscribeCount = service.subscribeToNotificationCount((countData) => {
      setUnreadCount(countData.unreadCount);
    });

    return () => {
      unsubscribeNotifications();
      unsubscribeCount();
    };
  }, [service]);

  return {
    notifications,
    unreadCount
  };
};

export const useGroupRealtime = (groupId: number) => {
  const [discussions, setDiscussions] = useState<unknown[]>([]);
  const [answers, setAnswers] = useState<unknown[]>([]);
  const { service } = useWebSocket();

  useEffect(() => {
    if (!groupId) return;

    const unsubscribe = service.subscribeToGroup(groupId, {
      onDiscussion: (discussion) => {
        setDiscussions(prev => [discussion, ...prev]);
      },
      onAnswer: (answer) => {
        setAnswers(prev => [answer, ...prev]);
      },
      onVote: (vote) => {
        // Handle vote updates
        console.log('Vote update:', vote);
      },
      onMembership: (membership) => {
        // Handle membership changes
        console.log('Membership update:', membership);
      }
    });

    return unsubscribe;
  }, [groupId, service]);

  const createDiscussion = useCallback((discussion: {
    title: string;
    content: string;
    tags?: string[];
    attachments?: string[];
    isAnonymous?: boolean;
  }) => {
    service.createGroupDiscussion(groupId, discussion);
  }, [groupId, service]);

  const createAnswer = useCallback((answer: {
    discussionId: number;
    content: string;
    attachments?: string[];
    isAnonymous?: boolean;
  }) => {
    service.createGroupAnswer(groupId, answer);
  }, [groupId, service]);

  const vote = useCallback((targetId: number, targetType: 'DISCUSSION' | 'ANSWER', voteType: 'UPVOTE' | 'DOWNVOTE') => {
    service.voteInGroup(groupId, { targetId, targetType, voteType });
  }, [groupId, service]);

  return {
    discussions,
    answers,
    createDiscussion,
    createAnswer,
    vote
  };
};