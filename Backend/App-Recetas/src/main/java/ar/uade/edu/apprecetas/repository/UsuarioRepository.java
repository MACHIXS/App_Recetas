package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByMail(String mail);
    Optional<Usuario> findByNickname(String nickname);
    boolean existsByMail(String mail);
    boolean existsByNickname(String nickname);
    Optional<Usuario> findByMailAndEstadoRegistro(String mail, Usuario.EstadoRegistro estadoRegistro);
    void deleteByMail(String mail);
    List<Usuario> findAllByEstadoRegistro(Usuario.EstadoRegistro estadoRegistro);

}