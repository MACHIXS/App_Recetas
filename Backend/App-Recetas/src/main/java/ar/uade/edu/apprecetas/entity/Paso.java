package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "pasos")
@Getter @Setter @NoArgsConstructor
public class Paso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPaso;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idReceta")
    private Receta receta;

    private Integer nroPaso;
    private String texto;

    @OneToMany(mappedBy = "paso", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Multimedia> multimedia;
}
