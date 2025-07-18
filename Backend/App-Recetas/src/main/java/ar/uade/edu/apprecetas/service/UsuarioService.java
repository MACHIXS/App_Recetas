package ar.uade.edu.apprecetas.service;

import ar.uade.edu.apprecetas.dto.LoginRequestDTO;
import ar.uade.edu.apprecetas.dto.LoginResponseDTO;
import ar.uade.edu.apprecetas.dto.RegistroFinalDTO;
import ar.uade.edu.apprecetas.dto.PasswordResetDTO;
import ar.uade.edu.apprecetas.entity.Alumno;
import ar.uade.edu.apprecetas.entity.Rol;
import ar.uade.edu.apprecetas.entity.Usuario;
import ar.uade.edu.apprecetas.entity.VerificacionRegistro;
import ar.uade.edu.apprecetas.repository.AlumnoRepository;
import ar.uade.edu.apprecetas.repository.RecetaRepository;
import ar.uade.edu.apprecetas.repository.UsuarioRepository;
import ar.uade.edu.apprecetas.repository.VerificacionRegistroRepository;
import ar.uade.edu.apprecetas.security.JwtUtil;
import ar.uade.edu.apprecetas.utils.CodeGenerator;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VerificacionRegistroRepository verificacionRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private RecetaRepository recetaRepository;

    @Autowired
    private FileStorageService fileStorageService;


    // ─── MÉTODOS DE REGISTRO ─────────────────────────────────────────────────────

    public void iniciarRegistro(String mail, String nickname) {
        if (usuarioRepository.existsByMail(mail)) {
            throw new IllegalStateException("El mail ya está registrado.");
        }
        if (usuarioRepository.existsByNickname(nickname)) {
            throw new IllegalStateException("El alias ya está en uso.");
        }

        Usuario usuario = new Usuario();
        usuario.setMail(mail);
        usuario.setNickname(nickname);
        usuario.setEstadoRegistro(Usuario.EstadoRegistro.pendiente);
        usuario.setRol(Rol.USER);
        usuarioRepository.save(usuario);

        VerificacionRegistro vr = new VerificacionRegistro();
        vr.setUsuario(usuario);
        vr.setTipo(VerificacionRegistro.Tipo.registro);
        vr.setToken(CodeGenerator.generateAlphaNumCode(6));
        vr.setFechaCreacion(LocalDateTime.now());
        vr.setExpiracion(LocalDateTime.now().plusHours(24));
        verificacionRepo.save(vr);

        emailService.enviarTokenRegistro(mail, vr.getToken());
    }

    public void finalizarRegistro(RegistroFinalDTO dto) {
        VerificacionRegistro vr = verificacionRepo
                .findByTokenAndTipo(dto.getToken(), VerificacionRegistro.Tipo.registro)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido o no encontrado."));
        if (vr.getExpiracion().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("El token ha expirado.");
        }

        Usuario usuario = vr.getUsuario();
        if (usuario.getEstadoRegistro() == Usuario.EstadoRegistro.completo) {
            throw new IllegalStateException("Registro ya completado.");
        }

        usuario.setNombre(dto.getNombre());
        usuario.setApellido(dto.getApellido());
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setFechaNacimiento(dto.getFechaNacimiento());
        usuario.setEstadoRegistro(Usuario.EstadoRegistro.completo);
        usuarioRepository.save(usuario);

        verificacionRepo.delete(vr);
    }

    @Transactional
    public void liberarRegistroPendiente(String mail) {
        Usuario usuario = usuarioRepository
                .findByMailAndEstadoRegistro(mail, Usuario.EstadoRegistro.pendiente)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No hay registro pendiente para: " + mail
                ));

        // 1) Borrar verificación (token)
        verificacionRepo.deleteByUsuario(usuario);

        // 2) Borrar recetas vinculadas a este usuario
        recetaRepository.deleteByUsuario(usuario);

        // 3) Finalmente, borrar el usuario
        usuarioRepository.deleteByMail(mail);
    }

    public List<String> listarMailsPendientes() {
        return usuarioRepository
                .findAllByEstadoRegistro(Usuario.EstadoRegistro.pendiente)
                .stream()
                .map(Usuario::getMail)
                .toList();
    }


    // ─── MÉTODO DE LOGIN ─────────────────────────────────────────────────────────

    public LoginResponseDTO login(LoginRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByMail(dto.getMail())
                .orElseThrow(() -> new IllegalArgumentException("Mail no registrado."));
        if (usuario.getEstadoRegistro() != Usuario.EstadoRegistro.completo) {
            throw new IllegalStateException("Registro no completo.");
        }
        if (!passwordEncoder.matches(dto.getPassword(), usuario.getPassword())) {
            throw new IllegalArgumentException("Contraseña incorrecta.");
        }

        // 1) Armamos la lista de roles para el token
        List<String> roles = new ArrayList<>();
        // rol principal desde la entidad Usuario (Rol es tu enum)
        roles.add(usuario.getRol().name());
        // si además es alumno, lo agregamos como rol
        if (alumnoRepository.existsByUsuarioIdUsuario(usuario.getIdUsuario())) {
            roles.add("ALUMNO");
        }

        // 2) Generamos el token con mail + roles
        String token = jwtUtil.generateToken(usuario.getMail(), roles);

        // 3) Indicamos si es alumno para la respuesta
        boolean esAlumno = roles.contains("ALUMNO");

        return new LoginResponseDTO(token, usuario.getNickname(), esAlumno);
    }

    // ─── MÉTODOS DE RECUPERACIÓN DE CONTRASEÑA ──────────────────────────────────

    public void solicitarRecuperacion(String mail) {
        Usuario u = usuarioRepository.findByMail(mail)
                .orElseThrow(() -> new IllegalArgumentException("Mail no registrado."));
        if (u.getEstadoRegistro() != Usuario.EstadoRegistro.completo) {
            throw new IllegalStateException("Registro no completo.");
        }
        VerificacionRegistro vr = new VerificacionRegistro();
        vr.setUsuario(u);
        vr.setTipo(VerificacionRegistro.Tipo.password_reset);
        vr.setToken(CodeGenerator.generateAlphaNumCode(6));
        vr.setFechaCreacion(LocalDateTime.now());
        vr.setExpiracion(LocalDateTime.now().plusMinutes(30));
        verificacionRepo.save(vr);

        emailService.enviarTokenRecuperacion(mail, vr.getToken());
    }

    public void confirmarRecuperacion(PasswordResetDTO dto) {
        VerificacionRegistro vr = verificacionRepo
                .findByTokenAndTipo(dto.getToken(), VerificacionRegistro.Tipo.password_reset)
                .orElseThrow(() -> new IllegalArgumentException("Token inválido."));
        if (vr.getExpiracion().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Token expirado.");
        }
        Usuario u = vr.getUsuario();
        u.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        usuarioRepository.save(u);
        verificacionRepo.delete(vr);
    }

    // ─── MÉTODO DE CONVERSIÓN A ALUMNO ───────────────────────────────────────────

    @Transactional
       public void convertirAAlumno(
               String mailUsuario,
               String numeroTarjeta,
               String tramite,
               String urlDniFrente,
               String urlDniFondo) {

        Usuario usuario = usuarioRepository.findByMail(mailUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado."));
        if (alumnoRepository.existsByUsuarioIdUsuario(usuario.getIdUsuario())) {
            throw new IllegalStateException("Ya eres alumno.");
        }

        Alumno a = new Alumno();
        a.setUsuario(usuario);
        a.setNumeroTarjeta(numeroTarjeta);
        a.setTramite(tramite);
        a.setDniFrente(urlDniFrente);
        a.setDniFondo(urlDniFondo);
        a.setCuentaCorriente(BigDecimal.ZERO);
        alumnoRepository.save(a);
    }

    /**
     * Devuelve el Usuario que está autenticado por JWT.
     * Lanza 401 si no hay nadie autenticado o mail inválido.
     */
    public Usuario usuarioLogueado() {
        String mail = Optional.ofNullable(SecurityContextHolder.getContext()
                        .getAuthentication())
                .map(auth -> auth.getName())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado.")
                );
        return usuarioRepository.findByMail(mail)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado.")
                );
    }

    /**
     * Devuelve el Alumno asociado al Usuario autenticado.
     * Lanza 403 si ese usuario no está dado de alta como alumno.
     */
    public Alumno usuarioLogueadoComoAlumno() {
        Usuario user = usuarioLogueado();
        return alumnoRepository.findById(user.getIdUsuario())
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.FORBIDDEN,
                                "El usuario no está registrado como alumno.")
                );
    }

    /** Comprueba si un alias ya está registrado */
    public boolean aliasExists(String nickname) {
        return usuarioRepository.existsByNickname(nickname);
    }

    /** Genera hasta 3 alias alternativos que no estén en uso */
    public List<String> generarSugerenciasAlias(String base) {
        List<String> sugerencias = new ArrayList<>();
        Random rnd = new Random();
        while (sugerencias.size() < 3) {
            // por ejemplo, base + dos dígitos aleatorios
            String candidato = base + (rnd.nextInt(90) + 10);
            if (!usuarioRepository.existsByNickname(candidato)
                    && !sugerencias.contains(candidato)) {
                sugerencias.add(candidato);
            }
        }
        return sugerencias;
    }
}

