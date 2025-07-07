package ar.uade.edu.apprecetas.config;

import com.mercadopago.MercadoPagoConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

@Configuration
public class MercadoPagoConfigInit {

    @Value("${mercadopago.accessToken}")
    private String accessToken;

    @PostConstruct
    public void init() {
        // Seteamos el token global del SDK
        MercadoPagoConfig.setAccessToken(accessToken);
    }
}
