package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.dto.RecetaDetailDTO;
import ar.uade.edu.apprecetas.dto.RecetaDto;
import ar.uade.edu.apprecetas.service.RecetaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recetas")
public class RecetaController {
    private final RecetaService service;
    public RecetaController(RecetaService service) {
        this.service = service;
    }

    @GetMapping
    public List<RecetaDto> list() {
        return service.listarRecetas();
    }

    @GetMapping("/ingrediente")
    public List<RecetaDto> byIngrediente(@RequestParam String nombre) {
        return service.listarPorIngrediente(nombre);
    }

    @GetMapping("/{id}")
    public RecetaDetailDTO detalle(@PathVariable("id") Integer id) {
        return service.getDetalle(id);
    }
}

