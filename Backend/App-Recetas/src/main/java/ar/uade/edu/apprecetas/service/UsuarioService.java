package ar.uade.edu.apprecetas.service;

import ar.uade.edu.apprecetas.dto.*;
import ar.uade.edu.apprecetas.entity.Alumno;
import ar.uade.edu.apprecetas.entity.Usuario;
import ar.uade.edu.apprecetas.entity.VerificacionRegistro;
import ar.uade.edu.apprecetas.repository.AlumnoRepository;
import ar.uade.edu.apprecetas.repository.UsuarioRepository;
import ar.uade.edu.apprecetas.repository.VerificacionRegistroRepository;
import ar.uade.edu.apprecetas.security.JwtUtil;
import ar.uade.edu.apprecetas.utils.CodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
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

    @Autowired
    private EmailService emailService;

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

        vr.setToken(CodeGenerator.generateAlphaNumCode(6));

        vr.setFechaCreacion(LocalDateTime.now());
        vr.setExpiracion(LocalDateTime.now().plusHours(24));
        verificacionRepo.save(vr);

        emailService.enviarTokenRegistro(usuario.getMail(), vr.getToken());
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

    @Autowired
    private AlumnoRepository alumnoRepository;

    public void convertirAAlumno(
            String mail,
            String numeroTarjeta,
            LocalDate fechaVencimientoTarjeta,
            String codigoSeguridadTarjeta,
            String tramite,
            String urlDniFrente,
            String urlDniFondo){
        // Buscá usuario
        Usuario usuario = usuarioRepository.findByMail(mail)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // 2) Chequea que no sea alumno
        if (alumnoRepository.existsByUsuarioIdUsuario(usuario.getIdUsuario())) {
            throw new IllegalStateException("Ya eres alumno");
        }

        // 3) construye la entity y guardá
        Alumno a = new Alumno();
        a.setUsuario(usuario);
        a.setNumeroTarjeta(numeroTarjeta);
        a.setFechaVencimientoTarjeta(fechaVencimientoTarjeta);
        a.setCodigoSeguridadTarjeta(codigoSeguridadTarjeta);
        a.setDniFrente(urlDniFrente);
        a.setDniFondo(urlDniFondo);
        a.setTramite(tramite);
        a.setCuentaCorriente(BigDecimal.ZERO);

        alumnoRepository.save(a);
    }


    /** Paso 1: Genera y envía token de recuperación */
    public void solicitarRecuperacion(String mail) {
        Usuario u = usuarioRepository.findByMail(mail)
                .orElseThrow(() -> new IllegalArgumentException("Email no registrado"));
        if (u.getEstadoRegistro() != Usuario.EstadoRegistro.completo) {
            throw new IllegalStateException("Registro incompleto");
        }

        // Genera código corto
        String code = CodeGenerator.generateAlphaNumCode(6);
        VerificacionRegistro vr = new VerificacionRegistro();
        vr.setUsuario(u);
        vr.setToken(code);
        vr.setTipo(VerificacionRegistro.Tipo.password_reset);
        vr.setFechaCreacion(LocalDateTime.now());
        vr.setExpiracion(LocalDateTime.now().plusMinutes(30));
        verificacionRepo.save(vr);

        emailService.enviarTokenRecuperacion(mail, code);
    }

    /** Paso 2: Confirma token y cambia la contraseña */
    public void confirmarRecuperacion(PasswordResetDTO dto) {
        VerificacionRegistro vr = verificacionRepo
                .findByTokenAndTipo(dto.getToken(), VerificacionRegistro.Tipo.password_reset)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido"));
        if (vr.getExpiracion().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Token expirado");
        }
        Usuario u = vr.getUsuario();
        u.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        usuarioRepository.save(u);
        verificacionRepo.delete(vr);
    }



}