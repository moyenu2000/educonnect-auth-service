package com.educonnect.discussion.service.impl;

import com.educonnect.discussion.dto.AnswerRequest;
import com.educonnect.discussion.dto.DiscussionRequest;
import com.educonnect.discussion.dto.MessageRequest;
import com.educonnect.discussion.dto.websocket.*;
import com.educonnect.discussion.entity.Message;
import com.educonnect.discussion.enums.DiscussionType;
import com.educonnect.discussion.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketServiceImpl implements WebSocketService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageService messageService;

    @Autowired
    private DiscussionService discussionService;

    @Autowired
    private AnswerService answerService;

    @Override
    public void handleSendMessage(MessageSendDto messageDto, Long senderId) {
        try {
            MessageRequest request = new MessageRequest();
            request.setRecipientId(messageDto.getRecipientId());
            request.setContent(messageDto.getContent());
            request.setType(messageDto.getType());
            request.setAttachments(messageDto.getAttachments());

            com.educonnect.discussion.dto.MessageDto message = messageService.sendMessage(request, senderId);

            // Send message to recipient
            messagingTemplate.convertAndSendToUser(
                messageDto.getRecipientId().toString(),
                "/queue/messages",
                message
            );

            // Send confirmation to sender
            messagingTemplate.convertAndSendToUser(
                senderId.toString(),
                "/queue/message.status",
                new MessageStatusDto(message.getId(), "SENT", message.getCreatedAt())
            );
        } catch (Exception e) {
            // Send error to sender
            messagingTemplate.convertAndSendToUser(
                senderId.toString(),
                "/queue/message.error",
                "Failed to send message: " + e.getMessage()
            );
        }
    }

    @Override
    public void handleTypingStart(TypingDto typingDto, Long senderId, String senderName) {
        TypingStatusDto status = new TypingStatusDto(
            senderId, 
            senderName, 
            typingDto.getConversationId(), 
            true
        );

        messagingTemplate.convertAndSendToUser(
            typingDto.getRecipientId().toString(),
            "/queue/typing",
            status
        );
    }

    @Override
    public void handleTypingStop(TypingDto typingDto, Long senderId, String senderName) {
        TypingStatusDto status = new TypingStatusDto(
            senderId, 
            senderName, 
            typingDto.getConversationId(), 
            false
        );

        messagingTemplate.convertAndSendToUser(
            typingDto.getRecipientId().toString(),
            "/queue/typing",
            status
        );
    }

    @Override
    public void handleMarkMessageAsRead(MessageReadDto messageReadDto, Long userId) {
        try {
            messageService.markMessageAsRead(messageReadDto.getMessageId(), userId);

            // Broadcast read receipt
            messagingTemplate.convertAndSend(
                "/topic/conversation/" + messageReadDto.getConversationId() + "/read",
                new MessageStatusDto(messageReadDto.getMessageId(), "READ", java.time.LocalDateTime.now())
            );
        } catch (Exception e) {
            // Send error to user
            messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/error",
                "Failed to mark message as read: " + e.getMessage()
            );
        }
    }

    @Override
    public void handleCreateGroupDiscussion(Long groupId, GroupDiscussionDto discussionDto, Long authorId) {
        try {
            DiscussionRequest request = new DiscussionRequest();
            request.setTitle(discussionDto.getTitle());
            request.setContent(discussionDto.getContent());
            request.setType(DiscussionType.GENERAL);
            request.setTags(discussionDto.getTags());
            request.setAttachments(discussionDto.getAttachments());
            request.setIsAnonymous(discussionDto.getIsAnonymous());

            var discussion = discussionService.createGroupDiscussion(groupId, request, authorId);

            // Broadcast to group members
            messagingTemplate.convertAndSend(
                "/topic/groups/" + groupId + "/discussions",
                discussion
            );
        } catch (Exception e) {
            // Send error to author
            messagingTemplate.convertAndSendToUser(
                authorId.toString(),
                "/queue/error",
                "Failed to create group discussion: " + e.getMessage()
            );
        }
    }

    @Override
    public void handleCreateGroupAnswer(Long groupId, GroupAnswerDto answerDto, Long authorId) {
        try {
            AnswerRequest request = new AnswerRequest();
            request.setContent(answerDto.getContent());
            request.setAttachments(answerDto.getAttachments());
            request.setIsAnonymous(answerDto.getIsAnonymous());

            var answer = answerService.createAnswer(answerDto.getDiscussionId(), request, authorId);

            // Broadcast to group members
            messagingTemplate.convertAndSend(
                "/topic/groups/" + groupId + "/answers",
                answer
            );
        } catch (Exception e) {
            // Send error to author
            messagingTemplate.convertAndSendToUser(
                authorId.toString(),
                "/queue/error",
                "Failed to create group answer: " + e.getMessage()
            );
        }
    }

    @Override
    public void handleGroupVote(Long groupId, VoteDto voteDto, Long userId) {
        try {
            if ("DISCUSSION".equals(voteDto.getTargetType())) {
                if ("UPVOTE".equals(voteDto.getVoteType())) {
                    discussionService.upvoteDiscussion(voteDto.getTargetId(), userId);
                } else {
                    discussionService.downvoteDiscussion(voteDto.getTargetId(), userId);
                }
            } else if ("ANSWER".equals(voteDto.getTargetType())) {
                if ("UPVOTE".equals(voteDto.getVoteType())) {
                    answerService.upvoteAnswer(voteDto.getTargetId(), userId);
                } else {
                    answerService.downvoteAnswer(voteDto.getTargetId(), userId);
                }
            }

            // Broadcast vote update to group
            messagingTemplate.convertAndSend(
                "/topic/groups/" + groupId + "/votes",
                new VoteUpdateDto(voteDto.getTargetId(), voteDto.getTargetType(), 0, 0, voteDto.getVoteType())
            );
        } catch (Exception e) {
            // Send error to user
            messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/error",
                "Failed to vote: " + e.getMessage()
            );
        }
    }

    @Override
    public void broadcastVoteUpdate(Long targetId, String targetType, Integer upvotes, Integer downvotes) {
        VoteUpdateDto update = new VoteUpdateDto(targetId, targetType, upvotes, downvotes, null);
        messagingTemplate.convertAndSend("/topic/votes/" + targetType.toLowerCase() + "/" + targetId, update);
    }

    @Override
    public void broadcastNotification(Long userId, String title, String content) {
        NotificationDto notification = new NotificationDto(title, content, java.time.LocalDateTime.now());
        messagingTemplate.convertAndSendToUser(
            userId.toString(),
            "/queue/notifications",
            notification
        );
    }
}