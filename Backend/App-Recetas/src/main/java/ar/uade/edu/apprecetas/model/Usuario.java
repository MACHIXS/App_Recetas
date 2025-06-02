package ar.uade.edu.apprecetas.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "usuarios")

public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuario;

    @Column(unique = true)
    private String mail;

    @Column(nullable = false)
    private String nickname;

    private String habilitado; // 'Si' o 'No'
    private String nombre;
    private String direccion;
    private String avatar; // URL

    private String password;
}
