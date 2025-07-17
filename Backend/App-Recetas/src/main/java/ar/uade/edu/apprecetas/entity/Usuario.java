package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idUsuario")
    private Integer idUsuario;

    @Column(nullable = false, unique = true)
    private String mail;

    @Column(nullable = false, unique = true)
    private String nickname;

    private String nombre;
    private String apellido;
    private String direccion;
    private String avatar;

    private String password;

    @Enumerated(EnumType.STRING)
    private EstadoRegistro estadoRegistro;

    private LocalDate fechaNacimiento;

    public enum EstadoRegistro {
        pendiente,
        completo
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol = Rol.USER;

    public Rol getRol() {
        return rol;
    }
    public void setRol(Rol rol) {
        this.rol = rol;
    }

}
