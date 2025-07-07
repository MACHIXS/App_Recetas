package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sedes")
@Getter @Setter @NoArgsConstructor
public class Sede {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSede;

    private String nombreSede;
    private String direccionSede;
    private String telefonoSede;
    private String mailSede;
    private String whatsApp;
    private String tipoBonificacion;
    private Double bonificacionCursos;
    private String tipoPromocion;
    private Double promocionCursos;
}
