package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "cronogramaCursos")
@Getter @Setter @NoArgsConstructor
public class CronogramaCurso {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCronograma;

    @ManyToOne @JoinColumn(name = "idSede")
    private Sede sede;

    @ManyToOne @JoinColumn(name = "idCurso")
    private Curso curso;

    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer vacantesDisponibles;
}
