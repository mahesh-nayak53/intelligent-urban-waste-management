package backend.config;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import backend.util.JwtFilter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.http.HttpMethod;

@Configuration
public class SecurityConfig {

        private final JwtFilter jwtFilter;

        @Value("${app.cors.allowed-origins:http://localhost:5173,http://localhost:5174}")
        private String allowedOrigins;

public SecurityConfig(JwtFilter jwtFilter) {

    this.jwtFilter = jwtFilter;
}

@Bean
public SecurityFilterChain securityFilterChain(
        HttpSecurity http) throws Exception {

    http     
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth

                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

        .requestMatchers(
                "/api/auth/**"
        ).permitAll()

        .requestMatchers(
                "/uploads/**"
        ).permitAll()

        .requestMatchers(
                "/api/dashboard/**"
        ).hasRole("ADMIN")

        .requestMatchers(
                "/api/staff/**"
        ).hasRole("ADMIN")

        .requestMatchers(
                "/api/users/**"
        ).hasRole("ADMIN")

               .requestMatchers(
                "/api/task-management/**",
                "/api/staff-management/**"
        ).hasRole("ADMIN")

        .requestMatchers(
                "/api/staff-workflow/**"
        ).hasAnyRole("STAFF", "ADMIN")

        .requestMatchers(
                "/api/workers/**",
                "/api/worker-assignments/**",
                "/api/navigation/**"
        ).hasAnyRole("ADMIN", "STAFF", "WORKER")

               .requestMatchers(HttpMethod.POST, "/api/complaints").hasRole("CITIZEN")

               .requestMatchers(HttpMethod.GET, "/api/complaints/my").hasRole("CITIZEN")

               .requestMatchers(
                "/api/complaints/**"
        ).hasRole("ADMIN")

               .requestMatchers(
                "/api/citizen-portal/**"
        ).hasRole("CITIZEN")


.requestMatchers(
        "/",
        "/health",
        "/swagger-ui/**",
        "/v3/api-docs/**"
).permitAll()


        .anyRequest().authenticated())

            .addFilterBefore(
                    jwtFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

    return http.build();
}
@Bean
public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration configuration =
            new CorsConfiguration();

        for (String origin : allowedOrigins.split(",")) {
                String trimmedOrigin = origin.trim();
                if (!trimmedOrigin.isEmpty()) {
                        configuration.addAllowedOrigin(trimmedOrigin);
                }
        }

    configuration.addAllowedHeader("*");

    configuration.addAllowedMethod("*");

    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

    source.registerCorsConfiguration(
            "/**",
            configuration
    );

    return source;
}
}
