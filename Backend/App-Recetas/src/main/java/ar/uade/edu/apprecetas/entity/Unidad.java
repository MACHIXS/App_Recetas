package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="unidades")
@Data
public class Unidad {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer idUnidad;
    private String descripcion;
}
