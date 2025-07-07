package ar.uade.edu.apprecetas.dto;
import java.math.BigDecimal;

// Ingrediente en la creación de la receta
public class IngredienteCreateDTO {
    private String nombre;
    private Integer idUnidad;
    private BigDecimal cantidad;
    private String observaciones;

    // getters y setters
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public Integer getIdUnidad() { return idUnidad; }
    public void setIdUnidad(Integer idUnidad) { this.idUnidad = idUnidad; }

    public BigDecimal getCantidad() { return cantidad; }
    public void setCantidad(BigDecimal cantidad) { this.cantidad = cantidad; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}