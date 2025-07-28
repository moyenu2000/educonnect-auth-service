

// RefreshTokenRepository.java
package com.learningplatform.auth.repository;

import com.learningplatform.auth.entity.RefreshToken;
import com.learningplatform.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    
    @Modifying
    int deleteByUser(User user);
    
    @Modifying
    int deleteAllByExpiryDateBefore(Instant now);
}