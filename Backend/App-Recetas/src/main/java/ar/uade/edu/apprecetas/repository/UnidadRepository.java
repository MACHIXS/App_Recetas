package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.Unidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UnidadRepository extends JpaRepository<Unidad, Integer> {

}