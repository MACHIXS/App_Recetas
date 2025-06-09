package ar.uade.edu.apprecetas.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;


    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                // 2) Stateless (no cookies/sesión)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 3) Rutas públicas vs protegidas
                .authorizeHttpRequests(auth -> auth
                        // *** pública: iniciar + finalizar registro
                        .requestMatchers(HttpMethod.POST, "/api/auth/registro/**").permitAll()
                        // *** pública: login
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        // *** pública: recuperación de contraseña
                        .requestMatchers(HttpMethod.POST, "/api/auth/password-reset/**").permitAll()
                        // *** todo lo demás requiere JWT
                        .anyRequest().authenticated()
                )
                // 4) Insertamos nuestro filtro antes de que Spring intente form-login/basic
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                // 5) Deshabilitamos los mecanismos por defecto
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

