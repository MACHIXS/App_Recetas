package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cursos")
@Getter @Setter @NoArgsConstructor
public class Curso {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCurso;

    private String descripcion;
    private String contenidos;
    private String requerimientos;
    private Integer duracion;
    private Double precio;

    @Enumerated(EnumType.STRING)
    private Modalidad modalidad;

    public enum Modalidad { presencial, remoto, virtual }
}
