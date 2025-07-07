package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "unidades")
@Getter @Setter @NoArgsConstructor
public class Unidad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUnidad;

    @Column(nullable = false, length = 50)
    private String descripcion;
}
