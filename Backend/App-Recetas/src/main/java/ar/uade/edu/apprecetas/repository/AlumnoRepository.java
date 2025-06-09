package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.Alumno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AlumnoRepository extends JpaRepository<Alumno, Integer> {
    boolean existsByUsuarioIdUsuario(Integer idUsuario);
}
