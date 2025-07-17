package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.entity.Unidad;
import ar.uade.edu.apprecetas.repository.UnidadRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/unidades")
public class UnidadController {
    private final UnidadRepository repo;

    public UnidadController(UnidadRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Unidad> getAll() {
        return repo.findAll();
    }
}
