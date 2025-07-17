package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.entity.Usuario;
import ar.uade.edu.apprecetas.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import ar.uade.edu.apprecetas.repository.UsuarioRepository;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UsuarioService usuarioService;

    @DeleteMapping("/registro-pendiente/{mail}")
    public Map<String, String> liberarRegistroPendiente(@PathVariable String mail) {
        usuarioService.liberarRegistroPendiente(mail);
        return Map.of("msg", "Mail '" + mail + "' liberado correctamente");
    }

    @GetMapping("/registro-pendiente")
    public List<String> listarPendientes() {
        return usuarioService.listarMailsPendientes();
    }
}
