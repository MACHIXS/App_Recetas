package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name="calificaciones")
@Getter @Setter @NoArgsConstructor
public class Calificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="idReceta", nullable=false)
    private Receta receta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="idUsuario", nullable=false)
    private Usuario usuario;

    // puntaje de 1 a 5
    private Integer calificacion;

    // comentario libre
    @Column(length = 1000)
    private String comentarios;

    // por defecto false, hasta que el admin lo apruebe
    private boolean aprobado = false;

    @Column(updatable = false)
    private Instant fechaCreacion;

    @PrePersist
    public void onCreate() {
        this.fechaCreacion = Instant.now();
    }
}
