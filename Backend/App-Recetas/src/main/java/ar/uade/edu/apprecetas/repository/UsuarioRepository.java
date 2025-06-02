package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByMail(String mail);
    boolean existsByNickname(String nickname);
}