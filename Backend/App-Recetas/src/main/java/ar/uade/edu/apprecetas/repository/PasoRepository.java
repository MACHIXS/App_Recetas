package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.Paso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasoRepository extends JpaRepository<Paso, Integer> {
    List<Paso> findByReceta_IdReceta(Integer idReceta);
}