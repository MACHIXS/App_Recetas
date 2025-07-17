package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.dto.RecetaCreateDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO;
import ar.uade.edu.apprecetas.dto.RecetaDto;
import ar.uade.edu.apprecetas.service.RecetaService;
import ar.uade.edu.apprecetas.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recetas")
public class RecetaController {

    private final RecetaService service;
    private final JwtUtil jwtUtil;

    public RecetaController(RecetaService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    /** Público: listar por ingrediente (solo aprobadas) */
    @GetMapping("/ingrediente")
    public List<RecetaDto> byIngrediente(@RequestParam String nombre) {
        return service.listarPorIngrediente(nombre);
    }

    /** Público: detalle (solo aprobadas) */
    @GetMapping("/{id}")
    public RecetaDetailDTO detalle(@PathVariable("id") Integer id) {
        return service.getDetallePublico(id);
    }

    /** Crear o reemplazar (requiere token) */
    @PostMapping
    public ResponseEntity<Void> crearReceta(
            @RequestHeader("Authorization") String auth,
            @RequestBody RecetaCreateDTO dto
    ) {
        String mail = jwtUtil.extractMail(auth.substring(7));
        service.crearOReemplazarReceta(mail, dto);
        return ResponseEntity.ok().build();
    }

    /** Público: listar todas las aprobadas */
    @GetMapping
    public List<RecetaDto> listPublicas() {
        return service.listarRecetasPublicas();
    }

    /** Mis recetas (token) */
    @GetMapping("/mias")
    public List<RecetaDto> listMias(@RequestHeader("Authorization") String auth) {
        String mail = jwtUtil.extractMail(auth.substring(7));
        return service.listarMias(mail);
    }

    /** Admin: aprobar receta */
    @PatchMapping("/{idReceta}/aprobar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> aprobarReceta(
            @RequestHeader("Authorization") String auth,
            @PathVariable Integer idReceta) {

        String mail = jwtUtil.extractMail(auth.substring(7));
        service.aprobarReceta(mail, idReceta);
        return ResponseEntity.ok(Map.of("msg", "Receta aprobada"));
    }

    /** Admin: rechazar receta */
    @DeleteMapping("/{idReceta}/rechazar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> rechazarReceta(
            @RequestHeader("Authorization") String auth,
            @PathVariable Integer idReceta) {

        String mail = jwtUtil.extractMail(auth.substring(7));
        service.rechazarReceta(mail, idReceta);
        return ResponseEntity.ok(Map.of("msg", "Receta rechazada"));
    }

    @GetMapping("/pendientes")
    @PreAuthorize("hasRole('ADMIN')")
    public List<RecetaDto> listarPendientes() {
        return service.listarRecetasPendientes();
    }
}


