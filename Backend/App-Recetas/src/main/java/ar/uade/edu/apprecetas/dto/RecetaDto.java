package ar.uade.edu.apprecetas.dto;

import lombok.Value;

import java.time.Instant;

@Value
public class RecetaDto {
    Integer idReceta;
    String nombreReceta;
    String fotoPrincipal;
    String nickname;
    Double calificacionPromedio;
    Integer idTipo;
    Instant fechaCreacion;
}
