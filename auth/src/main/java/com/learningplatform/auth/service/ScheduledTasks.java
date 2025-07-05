package com.learningplatform.auth.service;

import com.learningplatform.auth.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasks {
    
    private final RefreshTokenRepository refreshTokenRepository;
    
    @Scheduled(cron = "0 0 0 * * ?") // Run daily at midnight
    @Transactional
    public void removeExpiredRefreshTokens() {
        log.info("Running expired refresh token cleanup task");
        int deletedCount = refreshTokenRepository.deleteAllByExpiryDateBefore(Instant.now());
        log.info("Deleted {} expired refresh tokens", deletedCount);
    }
}