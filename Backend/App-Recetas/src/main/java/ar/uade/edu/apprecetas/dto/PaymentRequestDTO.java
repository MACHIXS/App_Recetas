package ar.uade.edu.apprecetas.dto;

import java.math.BigDecimal;

public class PaymentRequestDTO {
    private BigDecimal amount;
    private String description;
    private String payerEmail;

    // getters y setters
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPayerEmail() { return payerEmail; }
    public void setPayerEmail(String payerEmail) { this.payerEmail = payerEmail; }
}
