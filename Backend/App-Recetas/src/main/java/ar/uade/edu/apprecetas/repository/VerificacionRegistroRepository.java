package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.VerificacionRegistro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificacionRegistroRepository extends JpaRepository<VerificacionRegistro, Integer> {
    Optional<VerificacionRegistro> findByTokenAndTipo(String token, VerificacionRegistro.Tipo tipo);
}
