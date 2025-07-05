package com.educonnect.discussion.service.impl;

import com.educonnect.discussion.dto.ConversationDto;
import com.educonnect.discussion.dto.MessageDto;
import com.educonnect.discussion.dto.MessageRequest;
import com.educonnect.discussion.dto.PagedResponse;
import com.educonnect.discussion.entity.Conversation;
import com.educonnect.discussion.entity.Message;
import com.educonnect.discussion.entity.User;
import com.educonnect.discussion.exception.ResourceNotFoundException;
import com.educonnect.discussion.exception.UnauthorizedException;
import com.educonnect.discussion.repository.ConversationRepository;
import com.educonnect.discussion.repository.MessageRepository;
import com.educonnect.discussion.repository.UserRepository;
import com.educonnect.discussion.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.HashSet;
import java.util.Set;

@Service
@Transactional
public class MessageServiceImpl implements MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public PagedResponse<ConversationDto> getUserConversations(Long userId, Pageable pageable) {
        Page<Conversation> conversationsPage = conversationRepository.findByParticipantsId(userId, pageable);
        List<ConversationDto> conversationDtos = conversationsPage.getContent().stream()
            .map(ConversationDto::fromEntity)
            .collect(Collectors.toList());
        
        return new PagedResponse<>(
            conversationDtos,
            (int) conversationsPage.getTotalElements(),
            conversationsPage.getTotalPages(),
            conversationsPage.getNumber(),
            conversationsPage.getSize(),
            conversationsPage.isFirst(),
            conversationsPage.isLast(),
            conversationsPage.isEmpty()
        );
    }

    @Override
    public PagedResponse<MessageDto> getConversationMessages(Long conversationId, LocalDateTime before, Pageable pageable, Long currentUserId) {
        Conversation conversation = conversationRepository.findById(conversationId)
            .orElseThrow(() -> new ResourceNotFoundException("Conversation not found with id: " + conversationId));
        
        // Check if user is participant in conversation
        boolean isParticipant = conversation.getParticipants().stream()
            .anyMatch(user -> user.getId().equals(currentUserId));
        
        if (!isParticipant) {
            throw new UnauthorizedException("You are not a participant in this conversation");
        }
        
        Page<Message> messagesPage;
        if (before != null) {
            messagesPage = messageRepository.findByConversationIdAndCreatedAtBefore(conversationId, before, pageable);
        } else {
            messagesPage = messageRepository.findByConversationId(conversationId, pageable);
        }
        
        List<MessageDto> messageDtos = messagesPage.getContent().stream()
            .map(MessageDto::fromEntity)
            .collect(Collectors.toList());
        
        return new PagedResponse<>(
            messageDtos,
            (int) messagesPage.getTotalElements(),
            messagesPage.getTotalPages(),
            messagesPage.getNumber(),
            messagesPage.getSize(),
            messagesPage.isFirst(),
            messagesPage.isLast(),
            messagesPage.isEmpty()
        );
    }

    @Override
    public MessageDto sendMessage(MessageRequest request, Long senderId) {
        User sender = userRepository.findById(senderId)
            .orElseThrow(() -> new ResourceNotFoundException("Sender not found with id: " + senderId));
        
        User recipient = userRepository.findById(request.getRecipientId())
            .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with id: " + request.getRecipientId()));
        
        // Get or create conversation
        Conversation conversation = getOrCreateConversation(senderId, request.getRecipientId());
        
        Message message = new Message();
        message.setContent(request.getContent());
        message.setType(request.getType());
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setConversation(conversation);
        message.setAttachments(request.getAttachments());
        
        Message savedMessage = messageRepository.save(message);
        
        // Update conversation's last message and timestamp
        conversation.setLastMessage(savedMessage);
        conversation.setUnreadCount(conversation.getUnreadCount() + 1);
        conversationRepository.save(conversation);
        
        return MessageDto.fromEntity(savedMessage);
    }

    @Override
    public MessageDto updateMessage(Long messageId, String content, Long currentUserId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + messageId));
        
        if (!message.getSender().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You can only edit your own messages");
        }
        
        message.setContent(content);
        message.setIsEdited(true);
        
        Message updatedMessage = messageRepository.save(message);
        return MessageDto.fromEntity(updatedMessage);
    }

    @Override
    public void deleteMessage(Long messageId, Long currentUserId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + messageId));
        
        if (!message.getSender().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You can only delete your own messages");
        }
        
        messageRepository.delete(message);
    }

    @Override
    public void markMessageAsRead(Long messageId, Long currentUserId) {
        Message message = messageRepository.findById(messageId)
            .orElseThrow(() -> new ResourceNotFoundException("Message not found with id: " + messageId));
        
        if (!message.getRecipient().getId().equals(currentUserId)) {
            throw new UnauthorizedException("You can only mark messages sent to you as read");
        }
        
        if (!message.getIsRead()) {
            messageRepository.markAsRead(messageId);
            
            // Decrement unread count for conversation
            Conversation conversation = message.getConversation();
            if (conversation.getUnreadCount() > 0) {
                conversation.setUnreadCount(conversation.getUnreadCount() - 1);
                conversationRepository.save(conversation);
            }
        }
    }

    @Override
    public Long getUnreadMessagesCount(Long userId) {
        return messageRepository.countUnreadMessagesByUserId(userId);
    }

    @Override
    public Conversation getOrCreateConversation(Long user1Id, Long user2Id) {
        return conversationRepository.findDirectConversation(user1Id, user2Id)
            .orElseGet(() -> {
                User user1 = userRepository.findById(user1Id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + user1Id));
                User user2 = userRepository.findById(user2Id)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + user2Id));
                
                Conversation conversation = new Conversation();
                Set<User> participants = new HashSet<>();
                participants.add(user1);
                participants.add(user2);
                conversation.setParticipants(participants);
                
                return conversationRepository.save(conversation);
            });
    }
}