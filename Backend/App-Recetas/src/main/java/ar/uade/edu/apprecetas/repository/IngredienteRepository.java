package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IngredienteRepository extends JpaRepository<Ingrediente,Integer> {
    Optional<Ingrediente> findByNombre(String nombre);
}

