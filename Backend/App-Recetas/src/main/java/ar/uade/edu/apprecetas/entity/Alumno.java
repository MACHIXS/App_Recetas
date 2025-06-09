package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "alumnos")
@Getter @Setter
public class Alumno {

    @Id
    private Integer idAlumno;

    @Column(nullable = false, length = 20)
    private String numeroTarjeta;

    @Column(nullable = false)
    private LocalDate fechaVencimientoTarjeta;

    @Column(nullable = false, length = 5)
    private String codigoSeguridadTarjeta;

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
