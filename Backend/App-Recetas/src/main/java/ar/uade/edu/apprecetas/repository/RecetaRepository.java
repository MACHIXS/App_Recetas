package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.Receta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecetaRepository extends JpaRepository<Receta, Integer> {
    @Query("""
      SELECT DISTINCT r
      FROM Receta r
      JOIN r.utilizados u
      JOIN u.ingrediente i
      WHERE LOWER(i.nombre) = LOWER(:nombre)
    """)
    List<Receta> findByIngredienteNombre(@Param("nombre") String nombre);
}

