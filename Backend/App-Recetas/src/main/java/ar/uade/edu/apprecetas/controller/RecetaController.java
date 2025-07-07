package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.dto.RecetaCreateDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO;
import ar.uade.edu.apprecetas.dto.RecetaDto;
import ar.uade.edu.apprecetas.security.JwtUtil;
import ar.uade.edu.apprecetas.service.RecetaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ar.uade.edu.apprecetas.service.RecetaService;


import java.util.List;

@RestController
@RequestMapping("/api/recetas")
public class RecetaController {
    private final RecetaService service;
    private final JwtUtil jwtUtil;
    public RecetaController(RecetaService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/ingrediente")
    public List<RecetaDto> byIngrediente(@RequestParam String nombre) {
        return service.listarPorIngrediente(nombre);
    }

    @GetMapping("/{id}")
    public RecetaDetailDTO detalle(@PathVariable("id") Integer id) {
        return service.getDetalle(id);
    }

    @PostMapping
    public ResponseEntity<Void> crearReceta(
            @RequestHeader("Authorization") String auth,
            @RequestBody RecetaCreateDTO dto
    ) {
        // extraemos el mail del JWT (le quitamos "Bearer ")
        String mail = jwtUtil.extractMail(auth.substring(7));
        service.crearOReemplazarReceta(mail, dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<RecetaDto> listPublicas() {
        return service.listarRecetas();  // ahora solo aprobadas
    }

    @GetMapping("/mias")
    public List<RecetaDto> listMias(@RequestHeader("Authorization") String auth) {
        String mail = jwtUtil.extractMail(auth.substring(7));
        return service.listarMias(mail);
    }
}

