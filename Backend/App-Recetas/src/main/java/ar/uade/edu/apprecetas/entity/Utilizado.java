package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name="utilizados")
public class Utilizado {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer idUtilizado;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="idReceta")
    private Receta receta;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="idIngrediente")
    private Ingrediente ingrediente;

    private int cantidad;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="idUnidad")
    private Unidad unidad;

    private String observaciones;


}

