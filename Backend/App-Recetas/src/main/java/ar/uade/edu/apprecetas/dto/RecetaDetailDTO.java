package ar.uade.edu.apprecetas.dto;

import lombok.*;
import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecetaDetailDTO {
    private Integer idReceta;
    private String nombreReceta;
    private String descripcionReceta;
    private String fotoPrincipal;
    private Integer porciones;
    private Integer cantidadPersonas;
    private Instant fechaCreacion;
    private String nickname;
    private Integer idTipo;
    private List<IngredienteDTO> ingredientes;
    private List<PasoDTO> pasos;
    private List<CalificacionDTO> calificaciones;

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class IngredienteDTO {
        private String nombre;
        private Integer cantidad;
        private String unidad;
        private String observaciones;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class PasoDTO {
        private Integer nroPaso;
        private String texto;
        private List<MultimediaDTO> multimedia;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class MultimediaDTO {
        private String tipoContenido;
        private String urlContenido;
    }

    @Data @NoArgsConstructor @AllArgsConstructor
    public static class CalificacionDTO {
        private String nickname;
        private Integer calificacion;
        private String comentarios;
    }
}


