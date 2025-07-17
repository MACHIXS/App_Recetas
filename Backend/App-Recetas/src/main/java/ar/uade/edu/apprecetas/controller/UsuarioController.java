package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.service.FileStorageService;
import ar.uade.edu.apprecetas.service.UsuarioService;
import ar.uade.edu.apprecetas.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired private UsuarioService usuarioService;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private FileStorageService fileStorageService;

    @PostMapping("/convertir")
    public ResponseEntity<Void> convertirAAlumno(
            @RequestHeader("Authorization") String auth,
            @RequestParam String numeroTarjeta,
            @RequestParam String tramite,
            @RequestParam("dniFrente") MultipartFile dniFrente,
            @RequestParam("dniFondo")  MultipartFile dniFondo
    ) throws Exception {
        // 1) extraigo mail
        String token = auth.substring(7);
        String mail  = jwtUtil.extractMail(token);

        // 2) guardo archivos y obtengo URLs
        String urlFrente = fileStorageService.store(dniFrente);
        String urlFondo  = fileStorageService.store(dniFondo);

        // 3) convierto
        usuarioService.convertirAAlumno(mail, numeroTarjeta, tramite, urlFrente, urlFondo);
        return ResponseEntity.ok().build();
    }
}
