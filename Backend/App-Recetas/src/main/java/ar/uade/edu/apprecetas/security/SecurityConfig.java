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
                // no CSRF ni sesiones
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // rutas públicas y protegidas
                .authorizeHttpRequests(auth -> auth

                        // registros y login
                        .requestMatchers(HttpMethod.POST, "/api/auth/registro/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/password-reset/**").permitAll()

                        // listar recetas y tipos es público
                        .requestMatchers(HttpMethod.GET,
                                "/api/recetas/**",
                                "/api/tiposReceta/**",
                                "/api/ingredientes/**",
                                "/api/unidades/**"
                        ).permitAll()

                        .requestMatchers(HttpMethod.GET, "/api/cursos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/cronogramas/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/sedes").permitAll()

                        .requestMatchers(HttpMethod.GET,   "/api/cursos/inscripciones").hasRole("ALUMNO")
                        .requestMatchers(HttpMethod.POST,  "/api/cursos/inscripciones/**").hasRole("ALUMNO")
                        .requestMatchers(HttpMethod.DELETE,"/api/cursos/inscripciones/**").hasRole("ALUMNO")

                        .requestMatchers(HttpMethod.POST, "/api/files/upload").permitAll()

                        .requestMatchers(HttpMethod.PATCH, "/api/recetas/*/aprobar").hasRole("ADMIN")

                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        .requestMatchers("/error").permitAll()

                        // todo lo demás requiere JWT
                        .anyRequest().authenticated()
                )

                // nuestro filtro JWT
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)

                // deshabilitar login/logout por defecto
                .httpBasic(basic -> basic.disable())
                .formLogin(form -> form.disable())
        ;

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
