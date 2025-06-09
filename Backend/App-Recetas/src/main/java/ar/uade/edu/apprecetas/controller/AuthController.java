package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.dto.*;
import ar.uade.edu.apprecetas.service.FileStorageService;
import ar.uade.edu.apprecetas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private FileStorageService storage;

    @PostMapping("/registro/iniciar")
    public ResponseEntity<?> iniciarRegistro(@RequestBody RegistroInicioDTO dto) {
        try {
            usuarioService.iniciarRegistro(dto.getMail(), dto.getNickname());
            return ResponseEntity.ok("Registro iniciado. Revisa tu correo.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/registro/finalizar")
    public ResponseEntity<?> finalizarRegistro(@RequestBody RegistroFinalDTO dto) {
        try {
            usuarioService.finalizarRegistro(dto);
            return ResponseEntity.ok("Registro completado con éxito.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        try {
            return ResponseEntity.ok(usuarioService.login(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @PostMapping(value = "/upgrade-alumno"/*, consumes = MediaType.MULTIPART_FORM_DATA_VALUE*/)
    public ResponseEntity<?> upgradeToAlumno(
            Authentication authentication,                       // <–– inyecta autenticado
            @RequestParam("numeroTarjeta") String numeroTarjeta,
            @RequestParam("fechaVencimientoTarjeta")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fechaVencimientoTarjeta,
            @RequestParam("codigoSeguridadTarjeta") String codigoSeguridadTarjeta,
            @RequestParam("tramite") String tramite,
            @RequestParam("dniFrente") MultipartFile dniFrente,
            @RequestParam("dniFondo") MultipartFile dniFondo
    ) {
        try {
            String mail = authentication.getName();  // ← tu JWT-filter puso el mail aquí

            // guardo archivos
            String urlFrente = storage.store(dniFrente);
            String urlFondo  = storage.store(dniFondo);

            // llamo al service pasándole el mail real
            usuarioService.convertirAAlumno(
                    mail,
                    numeroTarjeta,
                    fechaVencimientoTarjeta,
                    codigoSeguridadTarjeta,
                    tramite,
                    urlFrente,
                    urlFondo
            );
            return ResponseEntity.ok("Registro como alumno completado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/password-reset/request")
    public ResponseEntity<?> requestPasswordReset(
            @RequestBody PasswordResetRequestDTO dto) {
        try {
            usuarioService.solicitarRecuperacion(dto.getMail());
            return ResponseEntity.ok("Código de recuperación enviado");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/password-reset/confirm")
    public ResponseEntity<?> confirmPasswordReset(
            @RequestBody PasswordResetDTO dto) {
        try {
            usuarioService.confirmarRecuperacion(dto);
            return ResponseEntity.ok("Contraseña actualizada");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
