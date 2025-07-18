package ar.uade.edu.apprecetas.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.Instant;

@Getter
@AllArgsConstructor
public class CalificacionPendingDTO {
    private Integer id;
    private Integer recetaId;
    private String nombreReceta;
    private String nickname;
    private Integer calificacion;
    private String comentarios;
    private Instant fechaCreacion;
}
