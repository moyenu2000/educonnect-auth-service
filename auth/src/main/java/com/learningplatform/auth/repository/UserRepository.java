// UserRepository.java
package com.learningplatform.auth.repository;

import com.learningplatform.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsernameOrEmail(String username, String email);
    Optional<User> findByVerificationToken(String token);
    Optional<User> findByResetToken(String token);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}