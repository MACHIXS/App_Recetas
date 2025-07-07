package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.entity.TipoReceta;
import ar.uade.edu.apprecetas.repository.TipoRecetaRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/tiposReceta")
public class TipoRecetaController {
    private final TipoRecetaRepository repo;
    public TipoRecetaController(TipoRecetaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<TipoReceta> getAll() {
        return repo.findAll();
    }
}
