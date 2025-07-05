// package com.learningplatform.auth.security;

// import com.learningplatform.auth.entity.User;
// import io.jsonwebtoken.*;
// import io.jsonwebtoken.security.Keys;
// import lombok.extern.slf4j.Slf4j;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.security.core.Authentication;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.stereotype.Component;

// import java.security.Key;
// import java.util.Date;
// import java.util.HashMap;
// import java.util.Map;
// import java.util.function.Function;

// @Component
// @Slf4j
// public class JwtUtils {
    
//     @Value("${jwt.secret}")
//     private String jwtSecret;
    
//     @Value("${jwt.expiration}")
//     private int jwtExpirationMs;
    
//     @Value("${jwt.refresh-expiration}")
//     private int refreshExpirationMs;
    
//     private Key getSigningKey() {
//         return Keys.hmacShaKeyFor(jwtSecret.getBytes());
//     }
    
//     public String generateAccessToken(UserDetails userDetails) {
//         Map<String, Object> claims = new HashMap<>();
//         if (userDetails instanceof CustomUserPrincipal) {
//             CustomUserPrincipal principal = (CustomUserPrincipal) userDetails;
//             claims.put("userId", principal.getId());
//             claims.put("email", principal.getEmail());
//             claims.put("role", principal.getUser().getRole().name());
//         }
//         return createToken(claims, userDetails.getUsername(), jwtExpirationMs);
//     }
    
//     public String generateRefreshToken(UserDetails userDetails) {
//         Map<String, Object> claims = new HashMap<>();
//         return createToken(claims, userDetails.getUsername(), refreshExpirationMs);
//     }
    
//     private String createToken(Map<String, Object> claims, String subject, int expirationMs) {
//         return Jwts.builder()
//                 .setClaims(claims)
//                 .setSubject(subject)
//                 .setIssuedAt(new Date(System.currentTimeMillis()))
//                 .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
//                 .signWith(getSigningKey(), SignatureAlgorithm.HS512)
//                 .compact();
//     }
    
//     public Boolean validateToken(String token) {
//         try {
//             Jwts.parser()
//                 .setSigningKey(getSigningKey())
//                 .build()
//                 .parseClaimsJws(token);
            
//             return true;
//         } catch (SecurityException ex) {
//             log.error("Invalid JWT signature");
//         } catch (MalformedJwtException ex) {
//             log.error("Invalid JWT token");
//         } catch (ExpiredJwtException ex) {
//             log.error("Expired JWT token");
//         } catch (UnsupportedJwtException ex) {
//             log.error("Unsupported JWT token");
//         } catch (IllegalArgumentException ex) {
//             log.error("JWT claims string is empty");
//         }
//         return false;
//     }
    
//     public String getUsernameFromToken(String token) {
//         return getClaimFromToken(token, Claims::getSubject);
//     }
    
//     public Long getUserIdFromToken(String token) {
//         Claims claims = getAllClaimsFromToken(token);
//         return claims.get("userId", Long.class);
//     }
    
//     public String getRoleFromToken(String token) {
//         Claims claims = getAllClaimsFromToken(token);
//         return claims.get("role", String.class);
//     }
    
//     public Date getExpirationDateFromToken(String token) {
//         return getClaimFromToken(token, Claims::getExpiration);
//     }
    
//     public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
//         final Claims claims = getAllClaimsFromToken(token);
//         return claimsResolver.apply(claims);
//     }
    
//     private Claims getAllClaimsFromToken(String token) {
//         return Jwts.parser()
//                 .setSigningKey(getSigningKey())
//                 .build()
//                 .parseClaimsJws(token)
//                 .getBody();
//     }
    
//     public Boolean isTokenExpired(String token) {
//         final Date expiration = getExpirationDateFromToken(token);
//         return expiration.before(new Date());
//     }
// }

package com.learningplatform.auth.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@Slf4j
public class JwtUtils {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private int jwtExpirationMs;
    
    @Value("${jwt.refresh-expiration}")
    private int refreshExpirationMs;
    
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
    
    public String generateAccessToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        if (userDetails instanceof CustomUserPrincipal) {
            CustomUserPrincipal principal = (CustomUserPrincipal) userDetails;
            claims.put("userId", principal.getId());
            claims.put("email", principal.getEmail());
            claims.put("role", principal.getUser().getRole().name());
        }
        return createToken(claims, userDetails.getUsername(), jwtExpirationMs);
    }
    
    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, userDetails.getUsername(), refreshExpirationMs);
    }
    
    private String createToken(Map<String, Object> claims, String subject, int expirationMs) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey())
                .compact();
    }
    
    public Boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (SecurityException ex) {
            log.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty");
        }
        return false;
    }
    
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }
    
    public Long getUserIdFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return claims.get("userId", Long.class);
    }
    
    public String getRoleFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return claims.get("role", String.class);
    }
    
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }
    
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }
    
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    
    public Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }
}