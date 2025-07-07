package ar.uade.edu.apprecetas.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter @Setter @NoArgsConstructor
public class RecetaCreateDTO {
    private Integer idTipo;
    private String nombreReceta;
    private String descripcionReceta;
    private String fotoPrincipal;      // URL o path
    private Integer porciones;
    private Integer cantidadPersonas;
    private List<IngredienteIn> ingredientes;
    private List<PasoIn> pasos;

    @Getter @Setter @NoArgsConstructor
    public static class IngredienteIn {
        private String nombre;
        private BigDecimal cantidad;
        private Integer idUnidad;
        private String observaciones;
    }

    @Getter @Setter @NoArgsConstructor
    public static class PasoIn {
        private Integer nroPaso;
        private String texto;
        private List<String> multimediaUrls;
    }
}

