package ar.uade.edu.apprecetas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "multimedia")
@Getter @Setter @NoArgsConstructor
public class Multimedia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idContenido;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idPaso")
    private Paso paso;

    private String tipoContenido; // foto, video, audio
    private String extension;
    private String urlContenido;
}
