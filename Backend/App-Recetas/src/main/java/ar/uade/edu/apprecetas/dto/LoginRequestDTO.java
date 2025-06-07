package ar.uade.edu.apprecetas.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDTO {
    private String mail;
    private String password;
}