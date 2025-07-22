package com.educonnect.discussion.controller;

import com.educonnect.discussion.dto.websocket.*;
import com.educonnect.discussion.security.UserPrincipal;
import com.educonnect.discussion.service.MessageService;
import com.educonnect.discussion.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private WebSocketService webSocketService;

    @MessageMapping("/messages.send")
    public void sendMessage(@Payload MessageSendDto messageDto, Authentication authentication) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        webSocketService.handleSendMessage(messageDto, user.getId());
    }

    @MessageMapping("/typing.start")
    public void startTyping(@Payload TypingDto typingDto, Authentication authentication) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        webSocketService.handleTypingStart(typingDto, user.getId(), user.getFullName());
    }

    @MessageMapping("/typing.stop")
    public void stopTyping(@Payload TypingDto typingDto, Authentication authentication) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        webSocketService.handleTypingStop(typingDto, user.getId(), user.getFullName());
    }

    @MessageMapping("/messages.read")
    public void markMessageAsRead(@Payload MessageReadDto messageReadDto, Authentication authentication) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        webSocketService.handleMarkMessageAsRead(messageReadDto, user.getId());
    }

    @MessageMapping("/groups/{groupId}/discussions.create")
    public void createGroupDiscussion(@DestinationVariable Long groupId, 
                                    @Payload GroupDiscussionDto discussionDto, 
                                    Authentication authentication) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        webSocketService.handleCreateGroupDiscussion(groupId, discussionDto, user.getId());
    }

    @MessageMapping("/groups/{groupId}/answers.create")
    public void createGroupAnswer(@DestinationVariable Long groupId, 
                                @Payload GroupAnswerDto answerDto, 
                                Authentication authentication) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        webSocketService.handleCreateGroupAnswer(groupId, answerDto, user.getId());
    }

    @MessageMapping("/groups/{groupId}/vote")
    public void voteInGroup(@DestinationVariable Long groupId, 
                          @Payload VoteDto voteDto, 
                          Authentication authentication) {
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        webSocketService.handleGroupVote(groupId, voteDto, user.getId());
    }
}