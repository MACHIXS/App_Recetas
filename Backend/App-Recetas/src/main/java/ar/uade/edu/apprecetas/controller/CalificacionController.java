package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.dto.CalificacionPendingDTO;
import ar.uade.edu.apprecetas.security.JwtUtil;
import ar.uade.edu.apprecetas.service.RecetaService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/calificaciones")
public class CalificacionController {
    private final RecetaService service;
    private final JwtUtil jwtUtil;

    public CalificacionController(RecetaService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/pendientes")
    @PreAuthorize("hasRole('ADMIN')")
    public List<CalificacionPendingDTO> pendientes() {
        return service.listarCalificacionesPendientes();
    }

    @PatchMapping("/{id}/aprobar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> aprobar(
            @RequestHeader("Authorization") String auth,
            @PathVariable Integer id) {

        String mail = jwtUtil.extractMail(auth.substring(7));
        service.aprobarCalificacion(mail, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/rechazar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> rechazar(
            @RequestHeader("Authorization") String auth,
            @PathVariable Integer id) {

        String mail = jwtUtil.extractMail(auth.substring(7));
        service.rechazarCalificacion(mail, id);
        return ResponseEntity.ok().build();
    }
}
