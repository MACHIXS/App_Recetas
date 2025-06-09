package ar.uade.edu.apprecetas.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class RegistroFinalDTO {
    private String token;
    private String nombre;
    private String apellido;
    private String password;
    private LocalDate fechaNacimiento;
}