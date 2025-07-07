package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.Inscripcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InscripcionRepository extends JpaRepository<Inscripcion, Integer> {
    List<Inscripcion> findByAlumnoIdAlumno(Integer idAlumno);
}
