package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "asistenciaCursos") // o "inscripciones" si cambias nombre
@Getter @Setter @NoArgsConstructor
public class Inscripcion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idAsistencia;  // puedes renombrar a idInscripcion

    @ManyToOne @JoinColumn(name = "idAlumno")
    private Alumno alumno;

    @ManyToOne @JoinColumn(name = "idCronograma")
    private CronogramaCurso cronograma;

    private LocalDateTime fecha;
}

