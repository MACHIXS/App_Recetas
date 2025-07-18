// src/main/java/ar/uade/edu/apprecetas/entity/ListaReceta.java
package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="lista_recetas",
        uniqueConstraints=@UniqueConstraint(columnNames={"usuario_idUsuario","receta_idReceta"}))
@Getter @Setter @NoArgsConstructor
public class ListaReceta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="usuario_idUsuario", nullable=false)
    private Usuario usuario;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="receta_idReceta", nullable=false)
    private Receta receta;

    // getters/setters…
}
