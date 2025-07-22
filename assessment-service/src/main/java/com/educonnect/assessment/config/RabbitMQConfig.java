package com.educonnect.assessment.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    
    // Exchange names
    public static final String USER_EXCHANGE = "user.exchange";
    public static final String SUBJECT_EXCHANGE = "subject.exchange";
    
    // Queue names
    public static final String USER_SYNC_QUEUE_ASSESSMENT = "user.sync.assessment";
    
    // Routing keys
    public static final String USER_CREATED_KEY = "user.created";
    public static final String USER_UPDATED_KEY = "user.updated";
    public static final String USER_DELETED_KEY = "user.deleted";
    public static final String USER_ROLE_CHANGED_KEY = "user.role.changed";
    
    public static final String SUBJECT_CREATED_KEY = "subject.created";
    public static final String SUBJECT_UPDATED_KEY = "subject.updated";
    public static final String SUBJECT_DELETED_KEY = "subject.deleted";
    public static final String TOPIC_CREATED_KEY = "topic.created";
    public static final String TOPIC_UPDATED_KEY = "topic.updated";
    public static final String TOPIC_DELETED_KEY = "topic.deleted";
    
    // Exchanges
    @Bean
    public TopicExchange userExchange() {
        return new TopicExchange(USER_EXCHANGE, true, false);
    }
    
    @Bean
    public TopicExchange subjectExchange() {
        return new TopicExchange(SUBJECT_EXCHANGE, true, false);
    }
    
    // Queues for Assessment Service
    @Bean
    public Queue userSyncQueueAssessment() {
        return QueueBuilder.durable(USER_SYNC_QUEUE_ASSESSMENT)
                .withArgument("x-dead-letter-exchange", USER_EXCHANGE + ".dlx")
                .build();
    }
    
    // Bindings for Assessment Service
    @Bean
    public Binding userCreatedBindingAssessment() {
        return BindingBuilder.bind(userSyncQueueAssessment())
                .to(userExchange())
                .with(USER_CREATED_KEY);
    }
    
    @Bean
    public Binding userUpdatedBindingAssessment() {
        return BindingBuilder.bind(userSyncQueueAssessment())
                .to(userExchange())
                .with(USER_UPDATED_KEY);
    }
    
    @Bean
    public Binding userDeletedBindingAssessment() {
        return BindingBuilder.bind(userSyncQueueAssessment())
                .to(userExchange())
                .with(USER_DELETED_KEY);
    }
    
    @Bean
    public Binding userRoleChangedBindingAssessment() {
        return BindingBuilder.bind(userSyncQueueAssessment())
                .to(userExchange())
                .with(USER_ROLE_CHANGED_KEY);
    }
    
    // Message converter
    @Bean
    public Jackson2JsonMessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }
    
    // RabbitTemplate with JSON converter
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter());
        return template;
    }
}