package ar.uade.edu.apprecetas.dto;

import lombok.Getter;

@Getter
public class LoginResponseDTO {
    private String token;
    private String nickname;

    public LoginResponseDTO(String token, String nickname) {
        this.token = token;
        this.nickname = nickname;
    }
}
