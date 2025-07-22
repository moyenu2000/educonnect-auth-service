package com.educonnect.discussion.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable a simple in-memory message broker to carry messages back to the client
        config.enableSimpleBroker("/topic", "/queue");
        
        // Define prefix for messages that are bound for @MessageMapping methods
        config.setApplicationDestinationPrefixes("/app");
        
        // Define prefix for user-specific destinations
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register STOMP endpoints for discussion service
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
                
        registry.addEndpoint("/ws/messages")
                .setAllowedOriginPatterns("*")
                .withSockJS();
                
        registry.addEndpoint("/ws/notifications")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        registry.addEndpoint("/ws/groups/{groupId}")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // Register endpoints without SockJS for native WebSocket clients
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
                
        registry.addEndpoint("/ws/messages")
                .setAllowedOriginPatterns("*");
                
        registry.addEndpoint("/ws/notifications")
                .setAllowedOriginPatterns("*");

        registry.addEndpoint("/ws/groups/{groupId}")
                .setAllowedOriginPatterns("*");
    }
}