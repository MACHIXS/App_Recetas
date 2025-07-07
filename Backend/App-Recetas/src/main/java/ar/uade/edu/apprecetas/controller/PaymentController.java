package ar.uade.edu.apprecetas.controller;

import ar.uade.edu.apprecetas.dto.PaymentRequestDTO;
import ar.uade.edu.apprecetas.dto.PaymentResponseDTO;
import ar.uade.edu.apprecetas.service.PaymentService;
import com.mercadopago.exceptions.MPException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.mercadopago.exceptions.MPException;
import ar.uade.edu.apprecetas.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService svc;

    public PaymentController(PaymentService svc) {
        this.svc = svc;
    }

    @PostMapping("/create-preference")
    public ResponseEntity<?> createPreference(@RequestBody PaymentRequestDTO req) {
        try {
            PaymentResponseDTO resp = svc.createPreference(req);
            return ResponseEntity.ok(resp);
        } catch (MPException e) {
            return ResponseEntity
                    .status(500)
                    .body(
                            new ErrorResponse("Error creando preferencia", e.getMessage())
                    );
        }
    }

    // DTO interno para errores
    static class ErrorResponse {
        public String error;
        public String details;
        public ErrorResponse(String error, String details) {
            this.error   = error;
            this.details = details;
        }
    }
}
