package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.entity.Ingrediente;
import ar.uade.edu.apprecetas.repository.IngredienteRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ingredientes")
public class IngredienteController {

    private final IngredienteRepository repo;

    public IngredienteController(IngredienteRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Ingrediente> listarTodos() {
        return repo.findAll();
    }
}
