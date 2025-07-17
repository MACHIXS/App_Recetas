package ar.uade.edu.apprecetas.security;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain)
            throws ServletException, IOException {

        String authHeader = req.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.isTokenValid(token)) {
                // extraemos el mail
                String mail = jwtUtil.extractMail(token);

                // extraemos los roles desde el token
                // → tu JwtUtil debe implementar extractRoles(token) que devuelva List<String>
                List<String> roles = jwtUtil.extractRoles(token);

                // mapeamos a GrantedAuthority con el prefijo "ROLE_"
                Collection<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(r -> new SimpleGrantedAuthority("ROLE_" + r))
                        .collect(Collectors.toList());

                // creamos el Authentication con autoridades
                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(mail, null, authorities);
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));

                // seteamos en el contexto de seguridad
                SecurityContextHolder.getContext().setAuthentication(auth);

                System.out.println("JWT válido para user: " +
                        auth.getName() + " — authorities: " + auth.getAuthorities());
            }
        }
        chain.doFilter(req, res);
    }
}
