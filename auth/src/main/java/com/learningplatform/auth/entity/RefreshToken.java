package com.learningplatform.auth.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String token;
    
    @Column(nullable = false)
    private Instant expiryDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "device_info")
    private String deviceInfo;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @PrePersist
    public void generateToken() {
        if (token == null) {
            token = UUID.randomUUID().toString();
        }
    }
    
    public boolean isExpired() {
        return Instant.now().isAfter(expiryDate);
    }
}