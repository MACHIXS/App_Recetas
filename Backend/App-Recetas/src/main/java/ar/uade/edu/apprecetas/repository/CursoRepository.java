package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Integer> {}