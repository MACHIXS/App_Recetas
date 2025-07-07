package ar.uade.edu.apprecetas.dto;
import java.util.List;

// Paso (instrucción) en la creación de la receta
public class PasoCreateDTO {
    private Integer nroPaso;
    private String texto;
    private List<String> multimediaUrls;  // URLs (fotos/video/audio)

    // getters y setters
    public Integer getNroPaso() { return nroPaso; }
    public void setNroPaso(Integer nroPaso) { this.nroPaso = nroPaso; }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public List<String> getMultimediaUrls() { return multimediaUrls; }
    public void setMultimediaUrls(List<String> multimediaUrls) { this.multimediaUrls = multimediaUrls; }
}