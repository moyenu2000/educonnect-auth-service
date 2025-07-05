package com.educonnect.discussion.repository;

import com.educonnect.discussion.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.username LIKE %:query% OR u.fullName LIKE %:query%")
    org.springframework.data.domain.Page<User> searchUsers(@Param("query") String query, org.springframework.data.domain.Pageable pageable);
}