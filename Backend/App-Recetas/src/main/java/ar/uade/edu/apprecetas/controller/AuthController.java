package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.dto.*;
import ar.uade.edu.apprecetas.service.FileStorageService;
import ar.uade.edu.apprecetas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private FileStorageService storage;

    @PostMapping("/registro/iniciar")
    public ResponseEntity<?> iniciarRegistro(@RequestBody RegistroInicioDTO dto) {
        String alias = dto.getNickname();
        // 1) Si el alias ya existe, devolvemos 409 con sugerencias
        if (usuarioService.aliasExists(alias)) {
            List<String> sugerencias = usuarioService.generarSugerenciasAlias(alias);
            Map<String,Object> body = new HashMap<>();
            body.put("message", "Alias en uso");
            body.put("suggestions", sugerencias);
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(body);
        }

        // 2) Si no existe, procedemos con el registro
        usuarioService.iniciarRegistro(dto.getMail(), alias);
        return ResponseEntity.ok("Registro iniciado. Revisa tu correo.");
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
            @RequestParam("codigoSeguridadTarjeta") String codigoSeguridadTarjeta,
            @RequestParam("tramite") String tramite,
            @RequestParam("dniFrente") MultipartFile dniFrente,
            @RequestParam("dniFondo") MultipartFile dniFondo
    ) {
        try {
            String mail = authentication.getName();  // ← tu JWT-filter puso el mail aquí

            // guardo archivos
            String urlDniFrente = storage.store(dniFrente);
            String urlDniFondo  = storage.store(dniFondo);

            // llamo al service pasándole el mail real
            usuarioService.convertirAAlumno(
                    mail,
                    numeroTarjeta,
                    tramite,
                    urlDniFrente,
                    urlDniFondo
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

    @GetMapping("/alias-suggestions")
    public ResponseEntity<List<String>> aliasSuggestions(@RequestParam String nickname) {
        List<String> list = usuarioService.generarSugerenciasAlias(nickname);
        return ResponseEntity.ok(list);
    }

}
