package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.Calificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CalificacionRepository extends JpaRepository<Calificacion, Integer> {
    // para el detalle de receta público solo traemos las ya aprobadas
    List<Calificacion> findByReceta_IdRecetaAndAprobado(Integer idReceta, boolean aprobado);
    // para que admin vea pendientes
    List<Calificacion> findByAprobadoFalse();
}
