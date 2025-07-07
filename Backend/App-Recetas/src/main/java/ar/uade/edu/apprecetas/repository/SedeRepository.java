package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.Sede;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SedeRepository extends JpaRepository<Sede, Integer> {}
