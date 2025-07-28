
// OAuth2AuthenticationFailureHandler.java
package com.learningplatform.auth.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {
    
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                      AuthenticationException exception) throws IOException, ServletException {
        String targetUrl = request.getParameter("redirect_uri");
        targetUrl = targetUrl != null ? targetUrl : "/";
        
        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("error", exception.getLocalizedMessage())
                .build().toUriString();
        
        HttpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
        
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}