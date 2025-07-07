package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="tiposReceta")
@Getter @Setter @NoArgsConstructor
public class TipoReceta {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer idTipo;

    private String descripcion;
}

