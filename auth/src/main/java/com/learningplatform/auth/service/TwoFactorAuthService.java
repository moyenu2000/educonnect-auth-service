package com.learningplatform.auth.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.learningplatform.auth.dto.ApiResponse;
import com.learningplatform.auth.dto.TwoFactorSetupResponse;
import com.learningplatform.auth.entity.User;
import com.learningplatform.auth.exception.BadRequestException;
import com.learningplatform.auth.exception.ResourceNotFoundException;
import com.learningplatform.auth.repository.UserRepository;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Slf4j
public class TwoFactorAuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final GoogleAuthenticator googleAuthenticator = new GoogleAuthenticator();
    
    @Value("${two-factor.issuer}")
    private String issuer;
    
    @Value("${two-factor.qr-code.width}")
    private int qrCodeWidth;
    
    @Value("${two-factor.qr-code.height}")
    private int qrCodeHeight;
    
    @Transactional
    public TwoFactorSetupResponse enableTwoFactorAuth(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (user.isTwoFactorEnabled()) {
            throw new BadRequestException("Two-factor authentication is already enabled");
        }
        
        // Generate secret key
        GoogleAuthenticatorKey key = googleAuthenticator.createCredentials();
        String secret = key.getKey();
        
        // Generate QR code URL
        String qrCodeUrl = GoogleAuthenticatorQRGenerator.getOtpAuthURL(
                issuer,
                user.getEmail(),
                key
        );
        
        // Generate QR code image
        String qrCodeImage = generateQRCodeImage(qrCodeUrl);
        
        // Store secret temporarily (don't save until confirmed)
        user.setTwoFactorSecret(secret);
        userRepository.save(user);
        
        return TwoFactorSetupResponse.builder()
                .secret(secret)
                .qrCodeUrl("data:image/png;base64," + qrCodeImage)
                .manualEntryKey(formatSecretForManualEntry(secret))
                .build();
    }
    
    @Transactional
    public ApiResponse confirmTwoFactorAuth(String username, String code) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (user.isTwoFactorEnabled()) {
            throw new BadRequestException("Two-factor authentication is already enabled");
        }
        
        if (user.getTwoFactorSecret() == null) {
            throw new BadRequestException("Two-factor setup not initiated");
        }
        
        // Verify the code
        if (!googleAuthenticator.authorize(user.getTwoFactorSecret(), Integer.parseInt(code))) {
            throw new BadRequestException("Invalid verification code");
        }
        
        // Enable 2FA
        user.setTwoFactorEnabled(true);
        userRepository.save(user);
        
        return new ApiResponse(true, "Two-factor authentication enabled successfully");
    }
    
    @Transactional
    public ApiResponse disableTwoFactorAuth(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (!user.isTwoFactorEnabled()) {
            throw new BadRequestException("Two-factor authentication is not enabled");
        }
        
        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Invalid password");
        }
        
        // Disable 2FA
        user.setTwoFactorEnabled(false);
        user.setTwoFactorSecret(null);
        userRepository.save(user);
        
        return new ApiResponse(true, "Two-factor authentication disabled successfully");
    }
    
    public boolean verifyTwoFactorCode(String username, String code) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        if (!user.isTwoFactorEnabled() || user.getTwoFactorSecret() == null) {
            return false;
        }
        
        return googleAuthenticator.authorize(user.getTwoFactorSecret(), Integer.parseInt(code));
    }
    
    private String generateQRCodeImage(String text) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, qrCodeWidth, qrCodeHeight);
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            
            return Base64.getEncoder().encodeToString(outputStream.toByteArray());
        } catch (WriterException | IOException e) {
            log.error("Error generating QR code", e);
            throw new RuntimeException("Error generating QR code");
        }
    }
    
    private String formatSecretForManualEntry(String secret) {
        // Format secret in groups of 4 for easier manual entry
        return secret.replaceAll("(.{4})", "$1 ").trim();
    }
}