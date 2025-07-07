package ar.uade.edu.apprecetas.dto;

import lombok.Getter;

@Getter
public class LoginResponseDTO {
    private String token;
    private String nickname;
    private boolean alumno;

    public LoginResponseDTO(String token, String nickname, boolean alumno) {
        this.token = token;
        this.nickname = nickname;
        this.alumno = alumno;

    }
}
