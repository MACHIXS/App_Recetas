package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.dto.LoginRequestDTO;
import ar.uade.edu.apprecetas.dto.RegistroFinalDTO;
import ar.uade.edu.apprecetas.dto.RegistroInicioDTO;
import ar.uade.edu.apprecetas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * Etapa 1 - Iniciar registro con mail y alias.
     */
    @PostMapping("/registro/iniciar")
    public ResponseEntity<?> iniciarRegistro(@RequestBody RegistroInicioDTO dto) {
        try {
            usuarioService.iniciarRegistro(dto.getMail(), dto.getNickname());
            return ResponseEntity.ok("Registro iniciado. Revisa tu correo.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Etapa 2 - Finalizar registro con token + datos personales + clave.
     */
    @PostMapping("/registro/finalizar")
    public ResponseEntity<?> finalizarRegistro(@RequestBody RegistroFinalDTO dto) {
        try {
            usuarioService.finalizarRegistro(dto);
            return ResponseEntity.ok("Registro completado con éxito.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * Login - Validación de usuario con JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO dto) {
        try {
            return ResponseEntity.ok(usuarioService.login(dto));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
