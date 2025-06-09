package ar.uade.edu.apprecetas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarTokenRegistro(String destinatario, String token) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(destinatario);
        msg.setSubject("Completa tu registro");
        msg.setText("¡Hola! Tu código de validación es:\n\n"
                + token
                + "\n\nVálido por 24 horas.");
        mailSender.send(msg);
    }
}
