package com.example.library_api.security;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Objects;
import java.util.Properties;

@Configuration
@OpenAPIDefinition
public class SwaggerConfig {

    @Value("${spring.profiles.active}")
    private String profile;

    @Bean
    public OpenAPI customOpenAPI() {
        String securitySchemeName = "bearerAuth";
        return new OpenAPI()
                .info(
                        new io.swagger.v3.oas.models.info.Info()
                                .title("TakeLibro API")
                                .version("version " + getTag())
                                .description("API documentation for the TakeLibro System.")
                                .contact(new io.swagger.v3.oas.models.info.Contact().name("TakeLibro").url(getUrl()))
                                .license(new io.swagger.v3.oas.models.info.License().name("Apache 2.0").url("https://www.apache.org/licenses/LICENSE-2.0.html"))
                )
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components().addSecuritySchemes(securitySchemeName,
                        new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }

    public String getTag() {
        try (FileInputStream fis = new FileInputStream(Objects.equals(profile, "dev") ? ".env" : "/app/.env")) {
            Properties props = new Properties();
            props.load(fis);
            return props.getProperty("TAG", "0.0.0");
        } catch (IOException e) {
            System.out.println("Could not load .env file, using default value.");
            return "0.0.0";
        }
    }


    public String getUrl(){
        return Objects.equals(profile, "dev") ? "http://localhost:4200/" : "http://172.17.51.192/takeLibro/";
    }

}
