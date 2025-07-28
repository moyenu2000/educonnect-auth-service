package com.educonnect.assessment.config;

import com.educonnect.assessment.security.JwtAuthenticationEntryPoint;
import com.educonnect.assessment.security.JwtAuthenticationFilterFixed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) // Enable method-level security
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;

    @Autowired
    @Qualifier("jwtAuthenticationFilterFixed")
    private JwtAuthenticationFilterFixed jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        // Public endpoints - no authentication required
                        .requestMatchers("/subjects/public").permitAll()
                        .requestMatchers("/subjects").permitAll() // Allow basic subjects access
                        .requestMatchers("/topics/public/by-subject/**").permitAll()
                        .requestMatchers("/daily-questions/public/**").permitAll()
                        .requestMatchers("/questions/public/**").permitAll()
                        .requestMatchers("/questions").permitAll() // Allow basic questions access
                        .requestMatchers("/leaderboard/public").permitAll()
                        .requestMatchers("/test/**").permitAll()
                        .requestMatchers("/admin/practice-problems-test").permitAll() // Temporary for testing
                        
                        // Health check endpoints  
                        .requestMatchers("/actuator/**").permitAll()
                        
                        // WebSocket endpoints
                        .requestMatchers("/ws/**").permitAll()
                        
                        // Admin only endpoints - temporarily allow daily-questions for testing
                        .requestMatchers("/admin/daily-questions").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        
                        // Daily question submission endpoints - temporarily allow all for testing
                        .requestMatchers("/daily-questions/*/submit").permitAll()
                        .requestMatchers("/daily-questions/*/draft-submit").permitAll()
                        .requestMatchers("/daily-questions/batch-submit").permitAll()
                        .requestMatchers("/daily-questions/today").permitAll()
                        .requestMatchers("/daily-questions/streak").permitAll()
                        .requestMatchers("/daily-questions/stats").permitAll()
                        .requestMatchers("/daily-questions/details").permitAll()
                        .requestMatchers("/daily-questions/history").permitAll()
                        .requestMatchers("/daily-questions/test-*").permitAll()
                        
                        // Practice problems endpoints for testing
                        .requestMatchers("/practice-problems").permitAll()
                        .requestMatchers("/practice-problems/**").permitAll()
                        
                        // Contest endpoints for testing
                        .requestMatchers("/contests").permitAll()
                        .requestMatchers("/contests/**").permitAll()
                        
                        // Temporarily allow all requests for testing
                        .anyRequest().permitAll()
                );

        // Enable JWT filter for proper authentication
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}