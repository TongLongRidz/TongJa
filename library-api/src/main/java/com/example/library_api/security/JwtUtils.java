package com.example.library_api.security;

import com.example.library_api.dto.DecodeJwtDTO;
import com.example.library_api.dto.JwtResponse;
import com.example.library_api.dto.ProfileDTO;
import com.example.library_api.entity.RoleUserEntity;
import com.example.library_api.repository.RoleUserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.logging.log4j.util.InternalException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtUtils {
    @Value("${JwtExpirationMs}")
    private long jwtExpirationMs;

    @Value("${jwtSecret}")
    private String jwtSecret;

    private final RoleUserRepository roleUserRepository;

    public JwtResponse generateJwtToken(Authentication authentication, ProfileDTO profileEntity) {
        if (authentication.getPrincipal() instanceof UserDetailsImpl userDetails) {
            List<RoleUserEntity> roleUserEntities = roleUserRepository.findAllByProfileCode(profileEntity.getProfileCode());
            List<String> roleCodes = roleUserEntities.stream()
                    .map(RoleUserEntity::getRoleCode)
                    .collect(Collectors.toList());
            Map<String, Object> claims = new HashMap<>();
            claims.put("id", profileEntity.getId());
            claims.put("profileCode", profileEntity.getProfileCode());
            claims.put("firstName", profileEntity.getFirstName());
            claims.put("lastName", profileEntity.getLastName());
            claims.put("roles", roleCodes);

            String accessToken = Jwts.builder()
                    .claims(claims)
                    .subject(userDetails.getEmail())
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                    .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                    .compact();
            return JwtResponse.builder().accessToken(accessToken).build();
        }
        return null;
    }

    public JwtResponse generateRefreshJwtToken(Authentication authentication) {
        if (authentication.getPrincipal() instanceof UserDetailsImpl userDetails) {
            Map<String, Object> claims = getClaims(authentication);
            String accessToken = Jwts.builder()
                    .claims(claims)
                    .subject(userDetails.getEmail())
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                    .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                    .compact();
            return JwtResponse.builder().accessToken(accessToken).build();
        }
        return null;
    }

    public Map<String, Object> getClaims(Authentication auth) {
        Map<String, Object> claims = new HashMap<>();
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        claims.put("email", ((UserDetailsImpl) userDetails).getEmail());
        claims.put("role", auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()));
        return claims;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String extractSubject(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String getEmailFromJwtToken(String token) {
        try {
            return Jwts.parser().setSigningKey(getSignInKey()).build().parseClaimsJws(token).getBody().get("email").toString();
        } catch (Exception ex) {
            throw new InternalException("เกิดข้อผิดพลาด: " + ex.getMessage());
        }
    }

    private SecretKey getSignInKey() {
        byte[] bytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(bytes);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public DecodeJwtDTO decodeJwt(HttpServletRequest jwtRequest) {
        try {
            String headerAuth = jwtRequest.getHeader("Authorization");
            if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
                String jwt = headerAuth.substring(7);

                Claims claims = Jwts.parser()
                        .setSigningKey(getSignInKey())
                        .build()
                        .parseClaimsJws(jwt)
                        .getBody();

                List<String> rolesList = (List<String>) claims.get("roles");
                String[] rolesArray = rolesList.toArray(new String[0]);

                DecodeJwtDTO decodedJwt = DecodeJwtDTO.builder()
                        .id(claims.get("id", Long.class))
                        .profileCode(claims.get("profileCode", String.class))
                        .firstName(claims.get("firstName", String.class))
                        .lastName(claims.get("lastName", String.class))
                        .roles(rolesArray)
                        .email(claims.getSubject())
                        .iat(claims.getIssuedAt().toString())
                        .exp(claims.getExpiration().toString())
                        .build();

                return decodedJwt;
            }
            return null;
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid JWT token", e);
        }
    }
}
