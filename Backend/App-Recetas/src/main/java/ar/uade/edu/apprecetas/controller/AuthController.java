package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.dto.RegistroDTO;
import ar.uade.edu.apprecetas.dto.LoginDTO;
import ar.uade.edu.apprecetas.model.Usuario;
import ar.uade.edu.apprecetas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody RegistroDTO dto) {
        try {
            Usuario nuevo = usuarioService.registrarUsuario(dto);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        try {
            Usuario usuario = usuarioService.login(dto);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
}
