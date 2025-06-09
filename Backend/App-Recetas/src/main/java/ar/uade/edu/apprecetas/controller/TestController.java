package ar.uade.edu.apprecetas.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestController {
    @GetMapping("/privado")
    public ResponseEntity<String> privado() {
        return ResponseEntity.ok("¡Accediste a un recurso protegido!");
    }
}
