package com.educonnect.discussion.config;

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
    public static final String USER_SYNC_QUEUE_DISCUSSION = "user.sync.discussion";
    public static final String SUBJECT_SYNC_QUEUE_DISCUSSION = "subject.sync.discussion";
    
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
    
    // Queues for Discussion Service
    @Bean
    public Queue userSyncQueueDiscussion() {
        return QueueBuilder.durable(USER_SYNC_QUEUE_DISCUSSION)
                .withArgument("x-dead-letter-exchange", USER_EXCHANGE + ".dlx")
                .build();
    }
    
    @Bean
    public Queue subjectSyncQueueDiscussion() {
        return QueueBuilder.durable(SUBJECT_SYNC_QUEUE_DISCUSSION)
                .withArgument("x-dead-letter-exchange", SUBJECT_EXCHANGE + ".dlx")
                .build();
    }
    
    // Bindings for Discussion Service
    @Bean
    public Binding userCreatedBindingDiscussion() {
        return BindingBuilder.bind(userSyncQueueDiscussion())
                .to(userExchange())
                .with(USER_CREATED_KEY);
    }
    
    @Bean
    public Binding userUpdatedBindingDiscussion() {
        return BindingBuilder.bind(userSyncQueueDiscussion())
                .to(userExchange())
                .with(USER_UPDATED_KEY);
    }
    
    @Bean
    public Binding userDeletedBindingDiscussion() {
        return BindingBuilder.bind(userSyncQueueDiscussion())
                .to(userExchange())
                .with(USER_DELETED_KEY);
    }
    
    @Bean
    public Binding userRoleChangedBindingDiscussion() {
        return BindingBuilder.bind(userSyncQueueDiscussion())
                .to(userExchange())
                .with(USER_ROLE_CHANGED_KEY);
    }
    
    // Subject/Topic bindings for Discussion Service
    @Bean
    public Binding subjectCreatedBindingDiscussion() {
        return BindingBuilder.bind(subjectSyncQueueDiscussion())
                .to(subjectExchange())
                .with(SUBJECT_CREATED_KEY);
    }
    
    @Bean
    public Binding subjectUpdatedBindingDiscussion() {
        return BindingBuilder.bind(subjectSyncQueueDiscussion())
                .to(subjectExchange())
                .with(SUBJECT_UPDATED_KEY);
    }
    
    @Bean
    public Binding topicCreatedBindingDiscussion() {
        return BindingBuilder.bind(subjectSyncQueueDiscussion())
                .to(subjectExchange())
                .with(TOPIC_CREATED_KEY);
    }
    
    @Bean
    public Binding topicUpdatedBindingDiscussion() {
        return BindingBuilder.bind(subjectSyncQueueDiscussion())
                .to(subjectExchange())
                .with(TOPIC_UPDATED_KEY);
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