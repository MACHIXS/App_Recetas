package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="ingredientes")
@Getter @Setter @NoArgsConstructor
public class Ingrediente {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer idIngrediente;
    private String nombre;
}
