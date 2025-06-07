package ar.uade.edu.apprecetas.service;

import ar.uade.edu.apprecetas.dto.LoginRequestDTO;
import ar.uade.edu.apprecetas.dto.LoginResponseDTO;
import ar.uade.edu.apprecetas.dto.RegistroFinalDTO;
import ar.uade.edu.apprecetas.entity.Usuario;
import ar.uade.edu.apprecetas.entity.VerificacionRegistro;
import ar.uade.edu.apprecetas.repository.UsuarioRepository;
import ar.uade.edu.apprecetas.repository.VerificacionRegistroRepository;
import ar.uade.edu.apprecetas.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VerificacionRegistroRepository verificacionRepo;

    @Autowired
    private PasswordEncoder passwordEncoder; // Lo configurás en SecurityConfig

    /**

     Inicia el proceso de registro creando un usuario "pendiente" y un token.*/
    public void iniciarRegistro(String mail, String nickname) {
        if (usuarioRepository.existsByMail(mail)) {
            throw new IllegalStateException("El mail ya está registrado.");}
        if (usuarioRepository.existsByNickname(nickname)) {
            throw new IllegalStateException("El alias ya está en uso.");}

        Usuario usuario = new Usuario();
        usuario.setMail(mail);
        usuario.setNickname(nickname);
        usuario.setEstadoRegistro(Usuario.EstadoRegistro.pendiente);
        usuarioRepository.save(usuario);

        VerificacionRegistro vr = new VerificacionRegistro();
        vr.setUsuario(usuario);
        vr.setTipo(VerificacionRegistro.Tipo.registro);
        vr.setToken(UUID.randomUUID().toString());
        vr.setFechaCreacion(LocalDateTime.now());
        vr.setExpiracion(LocalDateTime.now().plusHours(24));
        verificacionRepo.save(vr);

        // Acá podrías mandar un mail real.
        System.out.println("TOKEN DE ACTIVACIÓN: " + vr.getToken());
    }

    public void finalizarRegistro(RegistroFinalDTO dto) {
        VerificacionRegistro vr = verificacionRepo.findByTokenAndTipo(dto.getToken(), VerificacionRegistro.Tipo.registro)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido o no encontrado."));

        if (vr.getExpiracion().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("El token ha expirado.");
        }

        Usuario usuario = vr.getUsuario();
        if (usuario.getEstadoRegistro() == Usuario.EstadoRegistro.completo) {
            throw new IllegalStateException("El registro ya fue completado.");
        }

        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setFechaNacimiento(dto.getFechaNacimiento());
        usuario.setEstadoRegistro(Usuario.EstadoRegistro.completo);

        usuarioRepository.save(usuario);
        verificacionRepo.delete(vr); // eliminamos el token usado
    }

    @Autowired
    private JwtUtil jwtUtil;

    public LoginResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByMail(dto.getMail())
                .orElseThrow(() -> new IllegalArgumentException("El mail no está registrado."));

        if (usuario.getEstadoRegistro() != Usuario.EstadoRegistro.completo) {
            throw new IllegalStateException("El registro no está completo.");
        }

        if (!passwordEncoder.matches(dto.getPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("Contraseña incorrecta.");
        }

        String jwt = jwtUtil.generateToken(usuario.getMail());

        return new LoginResponseDTO(jwt, usuario.getNickname());
    }

}