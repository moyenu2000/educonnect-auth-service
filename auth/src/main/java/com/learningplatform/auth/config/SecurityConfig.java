package com.learningplatform.auth.config;

import com.learningplatform.auth.security.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.http.HttpMethod;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final CustomUserDetailsService customUserDetailsService;
        private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
        private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;
        private final CustomOAuth2UserService customOAuth2UserService;

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public DaoAuthenticationProvider authenticationProvider() {
                DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
                authProvider.setUserDetailsService(customUserDetailsService);
                authProvider.setPasswordEncoder(passwordEncoder());
                return authProvider;
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
                return authConfig.getAuthenticationManager();
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http, CorsConfigurationSource corsConfigurationSource)
                        throws Exception {
                http.cors(cors -> cors.configurationSource(corsConfigurationSource))
                                .csrf(csrf -> csrf.disable())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .exceptionHandling(exception -> exception
                                                .authenticationEntryPoint(jwtAuthenticationEntryPoint))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                                .requestMatchers(
                                                                "/auth/login",
                                                                "/auth/register",
                                                                "/auth/refresh-token",
                                                                "/auth/verify-email",
                                                                "/auth/resend-verification",
                                                                "/auth/forgot-password",
                                                                "/auth/reset-password",
                                                                "/auth/verify-2fa",
                                                                "/oauth2/**",
                                                                "/v3/api-docs/**",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/actuator/health",
                                                                "/actuator/health/**",
                                                                "/api/actuator/health",
                                                                "/api/actuator/health/**")
                                                .permitAll()
                                                .requestMatchers("/auth/admin/**").hasRole("ADMIN")
                                                .anyRequest().authenticated())
                                .oauth2Login(oauth2 -> oauth2
                                                .authorizationEndpoint(authorization -> authorization
                                                                .baseUri("/oauth2/authorize"))
                                                .redirectionEndpoint(redirection -> redirection
                                                                .baseUri("/oauth2/callback/*"))
                                                .userInfoEndpoint(userInfo -> userInfo
                                                                .userService(customOAuth2UserService))
                                                .successHandler(oAuth2AuthenticationSuccessHandler)
                                                .failureHandler(oAuth2AuthenticationFailureHandler))
                                .authenticationProvider(authenticationProvider())
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

                return http.build();
        }
}