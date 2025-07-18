package ar.uade.edu.apprecetas.service;

import ar.uade.edu.apprecetas.entity.Inscripcion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

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

    public void enviarTokenRecuperacion(String destinatario, String code) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(destinatario);
        msg.setSubject("Recuperación de contraseña");
        msg.setText("Tu código de recuperación es: " + code
                + "\nVálido por 30 minutos.");
        mailSender.send(msg);
    }

    public void enviarInscripcionExitosa(String destinatario, String nombreCurso) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(destinatario);
        msg.setSubject("Inscripción exitosa");
        msg.setText("¡Hola!\n\nTe has inscrito correctamente al curso \""
                + nombreCurso + "\".\n\nNos vemos pronto!");
        mailSender.send(msg);
    }

    public void enviarCancelacion(String destinatario,
                                  String nombreCurso,
                                  BigDecimal montoReintegro,
                                  int porcentaje) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(destinatario);
        msg.setSubject("Cancelación de inscripción");
        msg.setText(String.format("Te has dado de baja del curso \"%s\".\n"
                        + "Se ha procesado un reintegro de %s (%d%%).",
                nombreCurso,
                montoReintegro.setScale(2, RoundingMode.HALF_UP).toString(),
                porcentaje));
        mailSender.send(msg);
    }
}
