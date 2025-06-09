package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "alumnos")
@Getter @Setter
public class Alumno {

    @Id
    private Integer idAlumno;  // coincide con usuarios.idUsuario

    @Column(nullable = false, length = 12)
    private String numeroTarjeta;

    @Column(nullable = false)
    private String dniFrente;

    @Column(nullable = false)
    private String dniFondo;

    @Column(nullable = false, length = 12)
    private String tramite;

    @Column(nullable = false)
    private java.math.BigDecimal cuentaCorriente;

    @OneToOne
    @MapsId
    @JoinColumn(name = "idAlumno")
    private Usuario usuario;
}
