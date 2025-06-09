package ar.uade.edu.apprecetas.dto;

import lombok.Data;
import java.time.LocalDate;


@Data
public class UpgradeToAlumnoDTO {
    private String numeroTarjeta;
    private LocalDate fechaVencimientoTarjeta;
    private String codigoSeguridadTarjeta;

    private String dniFrente;
    private String dniFondo;

    private String tramite;
}
