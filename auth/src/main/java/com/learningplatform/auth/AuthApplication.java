package com.learningplatform.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import java.util.TimeZone;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class AuthApplication {
    
    public static void main(String[] args) {
        TimeZone.setDefault(TimeZone.getTimeZone("Asia/Dhaka"));
        SpringApplication.run(AuthApplication.class, args);
    }
}