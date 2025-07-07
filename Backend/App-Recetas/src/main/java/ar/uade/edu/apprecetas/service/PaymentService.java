package ar.uade.edu.apprecetas.service;

import ar.uade.edu.apprecetas.dto.PaymentRequestDTO;
import ar.uade.edu.apprecetas.dto.PaymentResponseDTO;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferencePayerRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Value("${app.url.success}")
    private String successUrl;

    @Value("${app.url.failure}")
    private String failureUrl;

    @Value("${app.url.pending}")
    private String pendingUrl;

    /**
     * Crea una preferencia en Mercado Pago.
     * Sólo declara throws MPException, cualquier MPApiException se envuelve.
     */
    public PaymentResponseDTO createPreference(PaymentRequestDTO req) throws MPException {
        // 1) Construir Payer
        PreferencePayerRequest payer = PreferencePayerRequest.builder()
                .email(req.getPayerEmail())
                .build();

        // 2) Armar el request de preferencia
        PreferenceRequest request = PreferenceRequest.builder()
                .items(List.of(
                        PreferenceItemRequest.builder()
                                .title(req.getDescription())
                                .quantity(1)
                                .unitPrice(req.getAmount())
                                .build()
                ))
                .payer(payer)
                .backUrls(
                        PreferenceBackUrlsRequest.builder()
                                .success(successUrl)
                                .failure(failureUrl)
                                .pending(pendingUrl)
                                .build()
                )
                .autoReturn("approved")
                .build();

        try {
            // 3) Crear la preferencia
            PreferenceClient client = new PreferenceClient();
            Preference     preference = client.create(request);

            // 4) Extraer datos
            String prefId    = preference.getId();
            String initPoint = preference.getInitPoint();

            return new PaymentResponseDTO(prefId, initPoint);

        } catch (MPApiException apiEx) {
            // Envuelvo el APIException en un MPException para el controller
            throw new MPException("Error al crear la preferencia en Mercado Pago", apiEx);
        }
    }
}
