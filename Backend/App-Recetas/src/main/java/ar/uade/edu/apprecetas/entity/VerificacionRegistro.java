package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "verificaciones_registro")
@Getter
@Setter
public class VerificacionRegistro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "idUsuario", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String token;

    @Enumerated(EnumType.STRING)
    private Tipo tipo;

    private LocalDateTime fechaCreacion;
    private LocalDateTime expiracion;

    public enum Tipo {
        registro,
        password_reset
    }


}