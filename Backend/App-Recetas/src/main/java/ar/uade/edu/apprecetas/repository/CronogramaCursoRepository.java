package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.CronogramaCurso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CronogramaCursoRepository extends JpaRepository<CronogramaCurso, Integer> {
    List<CronogramaCurso> findByCursoIdCurso(Integer idCurso);
}