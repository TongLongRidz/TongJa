package com.example.library_api.security;

import com.example.library_api.dto.master.LdapDTO;
import com.example.library_api.entity.ProfileEntity;
import com.example.library_api.repository.ProfileRepository;
import com.example.library_api.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class LdapOfficerAuthenticationProvider implements AuthenticationProvider {

    @Value("${office.ldap.url}")
    private String urlLdap;
    @Value("${office.ldap.apikey}")
    private String apikey;

    private final ProfileRepository profileRepository;
    private final ProfileService profileService;

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String user = authentication.getName();
        String password = authentication.getCredentials().toString();
        LdapDTO ldapDTO = getOfficeLDAP(user, password);

        if (ldapDTO.getUsername() != null) {
            ProfileEntity profile = profileRepository.findProfileByUsername(user);

            if (profile == null) {
                ProfileEntity profileCreate = new ProfileEntity();
                profileCreate.setEmail(ldapDTO.getEmail());
                profileCreate.setUsername(user);
                profileCreate.setPassword(password);
                profileCreate.setFirstName(ldapDTO.getFirstName());
                profileCreate.setLastName(ldapDTO.getLastName());
                profileService.registerUser(profileCreate);
                profile = profileRepository.findProfileByUsername(user);
            } else {
                profile = profileService.userLdapIsDeleteOrNot(profile);
            }

            List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADM"));
            UserDetailsImpl userDetails = UserDetailsImpl.builder()
                    .id(profile.getId())
                    .email(profile.getEmail())
                    .firstName(profile.getFirstName())
                    .lastName(profile.getLastName())
                    .image(profile.getImage())
                    .authorities(authorities)
                    .build();

            return new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
        }

        throw new BadCredentialsException("Invalid username or password");
    }


    private LdapDTO getOfficeLDAP(String email, String pwd) {
        LdapDTO ldapDTO = new LdapDTO();
        try {
            String username = Base64.getEncoder().encodeToString(email.getBytes(StandardCharsets.UTF_8));
            String password = Base64.getEncoder().encodeToString(pwd.getBytes(StandardCharsets.UTF_8));

            JSONObject json = new JSONObject();
            json.put("username", username);
            json.put("password", password);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(new URI(urlLdap))
                    .header("Content-Type", "application/json")
                    .header("apikey", apikey)
                    .POST(HttpRequest.BodyPublishers.ofString(json.toString()))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JSONObject responseJson = new JSONObject(response.body());
                ldapDTO.setEmail(responseJson.getString("email"));
                ldapDTO.setUsername(email);
                ldapDTO.setPassword(pwd);
                ldapDTO.setFullName(responseJson.getString("fullname"));
                ldapDTO.setFirstName(responseJson.getString("first_name"));
                ldapDTO.setLastName(responseJson.getString("last_name"));
                ldapDTO.setCompany(responseJson.getString("company"));

                System.out.println("LDAP: " + ldapDTO.getUsername() + " Success");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return ldapDTO;
    }



}