package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="recetas")
@Getter @Setter @NoArgsConstructor
public class Receta {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer idReceta;

    private String nombreReceta;
    private String descripcionReceta;
    private String fotoPrincipal;
    private Integer porciones;
    private Integer cantidadPersonas;

    @Column(updatable=false)
    private Instant fechaCreacion; // asume que lo rellenas en el backend

    @PrePersist
    public void onCreate() {
        this.fechaCreacion = Instant.now();
    }

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="idTipo")
    private TipoReceta tipo;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="idUsuario")
    private Usuario usuario;

    @OneToMany(mappedBy="receta", fetch=FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Calificacion> calificaciones = new ArrayList<>();

    @OneToMany(mappedBy="receta", fetch=FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Utilizado> utilizados = new ArrayList<>();

    @OneToMany(mappedBy = "receta", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Paso> pasos;

}



