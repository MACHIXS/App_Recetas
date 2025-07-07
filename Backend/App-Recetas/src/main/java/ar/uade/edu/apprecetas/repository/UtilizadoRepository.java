package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.Utilizado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UtilizadoRepository extends JpaRepository<Utilizado, Integer> {

}
