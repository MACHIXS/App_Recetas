package ar.uade.edu.apprecetas.repository;

import ar.uade.edu.apprecetas.entity.EstadoReceta;
import ar.uade.edu.apprecetas.entity.Receta;
import ar.uade.edu.apprecetas.entity.Usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface RecetaRepository extends JpaRepository<Receta, Integer> {
    @Query("""
      SELECT DISTINCT r
      FROM Receta r
      JOIN r.utilizados u
      JOIN u.ingrediente i
      WHERE LOWER(i.nombre) = LOWER(:nombre)
    """)
    List<Receta> findByIngredienteNombre(@Param("nombre") String nombre);

    boolean existsByUsuario_MailAndNombreReceta(String mail, String nombreReceta);

    List<Receta> findByUsuario_MailAndNombreReceta(String mail, String nombreReceta);

    List<Receta> findByEstado(EstadoReceta estado);

    @Query("SELECT r FROM Receta r WHERE r.usuario.mail = :mail")
    List<Receta> findByUsuarioMail(@Param("mail") String mail);

    Optional<Receta> findByIdRecetaAndEstado(Integer idReceta, EstadoReceta estado);

    List<Receta> findByUsuario_Mail(String mailUsuario);

    List<Receta> findByUtilizados_Ingrediente_NombreAndEstado(String nombre, EstadoReceta estado);



    @Transactional
    void deleteByUsuario(Usuario usuario);
}

