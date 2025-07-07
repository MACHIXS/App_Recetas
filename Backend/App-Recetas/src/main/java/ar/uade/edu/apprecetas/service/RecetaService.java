package ar.uade.edu.apprecetas.service;

import ar.uade.edu.apprecetas.dto.RecetaDetailDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO.IngredienteDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO.PasoDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO.MultimediaDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO.CalificacionDTO;
import ar.uade.edu.apprecetas.dto.RecetaDto;
import ar.uade.edu.apprecetas.entity.Receta;
import ar.uade.edu.apprecetas.entity.Paso;
import ar.uade.edu.apprecetas.repository.RecetaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecetaService {
    private final RecetaRepository repo;

    public RecetaService(RecetaRepository repo) {
        this.repo = repo;
    }

    public List<RecetaDto> listarRecetas() {
        return repo.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<RecetaDto> listarPorIngrediente(String nombre) {
        return repo.findByIngredienteNombre(nombre).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private RecetaDto toDto(Receta r) {
        double avg = r.getCalificaciones().stream()
                .mapToInt(c -> c.getCalificacion())
                .average().orElse(0.0);
        return new RecetaDto(
                r.getIdReceta(),
                r.getNombreReceta(),
                r.getFotoPrincipal(),
                r.getUsuario().getNickname(),
                avg,
                r.getTipo().getIdTipo(),
                r.getFechaCreacion()
        );
    }

    public RecetaDetailDTO getDetalle(Integer idReceta) {
        // 1) Usamos la instancia repo, no la clase estática
        Receta r = repo.findById(idReceta)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // 2) Mapear campos básicos
        RecetaDetailDTO dto = new RecetaDetailDTO();
        dto.setIdReceta(r.getIdReceta());
        dto.setNombreReceta(r.getNombreReceta());
        dto.setDescripcionReceta(r.getDescripcionReceta());
        dto.setFotoPrincipal(r.getFotoPrincipal());
        dto.setPorciones(r.getPorciones());
        dto.setCantidadPersonas(r.getCantidadPersonas());
        dto.setFechaCreacion(r.getFechaCreacion());
        dto.setNickname(r.getUsuario().getNickname());
        dto.setIdTipo(r.getTipo().getIdTipo());

        // 3) Ingredientes
        List<IngredienteDTO> ing = r.getUtilizados().stream()
                .map(u -> new IngredienteDTO(
                        u.getIngrediente().getNombre(),
                        u.getCantidad(),
                        u.getUnidad().getDescripcion(),
                        u.getObservaciones()
                ))
                .toList();
        dto.setIngredientes(ing);

        // 4) Pasos + multimedia
        List<PasoDTO> pasos = r.getPasos().stream()
                .sorted(Comparator.comparing(Paso::getNroPaso))
                .map(p -> new PasoDTO(
                        p.getNroPaso(),
                        p.getTexto(),
                        p.getMultimedia().stream()
                                .map(m -> new MultimediaDTO(m.getTipoContenido(), m.getUrlContenido()))
                                .toList()
                ))
                .toList();
        dto.setPasos(pasos);

        // 5) Calificaciones
        List<CalificacionDTO> cals = r.getCalificaciones().stream()
                .map(c -> new CalificacionDTO(
                        c.getUsuario().getNickname(),
                        c.getCalificacion(),
                        c.getComentarios()
                ))
                .toList();
        dto.setCalificaciones(cals);

        return dto;
    }
}
