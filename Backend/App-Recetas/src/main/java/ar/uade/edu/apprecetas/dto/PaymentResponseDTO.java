package ar.uade.edu.apprecetas.dto;

public class PaymentResponseDTO {
    private String preferenceId;
    private String initPoint;

    public PaymentResponseDTO(String preferenceId, String initPoint) {
        this.preferenceId = preferenceId;
        this.initPoint  = initPoint;
    }
    // getters
    public String getPreferenceId() { return preferenceId; }
    public String getInitPoint()    { return initPoint; }
}
