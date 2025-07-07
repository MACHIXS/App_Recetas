package ar.uade.edu.apprecetas.service;

import ar.uade.edu.apprecetas.dto.RecetaCreateDTO;
import ar.uade.edu.apprecetas.dto.RecetaCreateDTO.IngredienteIn;
import ar.uade.edu.apprecetas.dto.RecetaCreateDTO.PasoIn;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO.CalificacionDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO.IngredienteDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO.MultimediaDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO.PasoDTO;
import ar.uade.edu.apprecetas.dto.RecetaDto;
import ar.uade.edu.apprecetas.entity.*;
import ar.uade.edu.apprecetas.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecetaService {

    private final RecetaRepository        repo;
    private final UsuarioRepository       usuarioRepo;
    private final TipoRecetaRepository    tipoRepo;
    private final IngredienteRepository   ingrRepo;
    private final UnidadRepository        unidadRepo;
    private final UtilizadoRepository     utilizadoRepo;
    private final PasoRepository          pasoRepo;
    private final MultimediaRepository    multimediaRepo;

    public RecetaService(RecetaRepository repo,
                         UsuarioRepository usuarioRepo,
                         TipoRecetaRepository tipoRepo,
                         IngredienteRepository ingrRepo,
                         UnidadRepository unidadRepo,
                         UtilizadoRepository utilizadoRepo,
                         PasoRepository pasoRepo,
                         MultimediaRepository multimediaRepo) {
        this.repo           = repo;
        this.usuarioRepo    = usuarioRepo;
        this.tipoRepo       = tipoRepo;
        this.ingrRepo       = ingrRepo;
        this.unidadRepo     = unidadRepo;
        this.utilizadoRepo  = utilizadoRepo;
        this.pasoRepo       = pasoRepo;
        this.multimediaRepo = multimediaRepo;
    }

    /** Listado básico de recetas */
    public List<RecetaDto> listarRecetas() {
        return repo.findByEstado(EstadoReceta.APROBADA)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Listado de recetas que usan un ingrediente */
    public List<RecetaDto> listarPorIngrediente(String nombre) {
        return repo.findByIngredienteNombre(nombre)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<RecetaDto> listarMias(String mailUsuario) {
        return repo.findByUsuarioMail(mailUsuario)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    /** Crea o reemplaza la receta del usuario, borrando la versión anterior si existe */
    @Transactional
    public void crearOReemplazarReceta(String mailUsuario, RecetaCreateDTO dto) {
        // 1) cargar usuario y tipo…
        Usuario u = usuarioRepo.findByMail(mailUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        TipoReceta tipo = tipoRepo.findById(dto.getIdTipo())
                .orElseThrow(() -> new IllegalArgumentException("Tipo no encontrado"));

        // 2) ¿ya existe receta con ese nombre para este usuario?
        if ( repo.existsByUsuario_MailAndNombreReceta(mailUsuario, dto.getNombreReceta()) ) {
            // borramos sus viejas recetas
            List<Receta> antiguas =
                    repo.findByUsuario_MailAndNombreReceta(mailUsuario, dto.getNombreReceta());
            antiguas.forEach(rec -> {
                // elimina utilizados, pasos, multimedia…
                utilizadoRepo.deleteAll(rec.getUtilizados());
                pasoRepo.findByReceta_IdReceta(rec.getIdReceta())
                        .forEach(p -> multimediaRepo.deleteAll(p.getMultimedia()));
                pasoRepo.deleteAll(rec.getPasos());
                repo.delete(rec);
            });
        }

        // 3) Creo la nueva receta
        Receta r = new Receta();
        r.setUsuario(u);
        r.setTipo(tipo);
        r.setNombreReceta(dto.getNombreReceta());
        r.setDescripcionReceta(dto.getDescripcionReceta());
        r.setFotoPrincipal(dto.getFotoPrincipal());
        r.setPorciones(dto.getPorciones());
        r.setCantidadPersonas(dto.getCantidadPersonas());
        r.setEstado(EstadoReceta.PENDIENTE);
        repo.save(r);

        for (var in : dto.getIngredientes()) {
            // buscamos o creamos el ingrediente
            Ingrediente ing = ingrRepo.findByNombre(in.getNombre())
                    .orElseGet(() -> {
                        Ingrediente nuevo = new Ingrediente(in.getNombre());
                        return ingrRepo.save(nuevo);
                    });

            Unidad uni = unidadRepo.findById(in.getIdUnidad())
                    .orElseThrow(() -> new IllegalArgumentException("Unidad no encontrada"));

            Utilizado uUtil = new Utilizado();
            uUtil.setReceta(r);
            uUtil.setIngrediente(ing);
            uUtil.setUnidad(uni);
            // convierte BigDecimal → Integer si tu entidad usa Integer
            uUtil.setCantidad(in.getCantidad().intValue());
            uUtil.setObservaciones(in.getObservaciones());
            utilizadoRepo.save(uUtil);
        }

        // 5) Persistir pasos y multimedia
        for (var pIn : dto.getPasos()) {
            Paso p = new Paso();
            p.setReceta(r);
            p.setNroPaso(pIn.getNroPaso());
            p.setTexto(pIn.getTexto());
            pasoRepo.save(p);

            for (var url : pIn.getMultimediaUrls()) {
                Multimedia m = new Multimedia();
                m.setPaso(p);
                m.setTipoContenido(detectarTipo(url));
                m.setUrlContenido(url);
                multimediaRepo.save(m);
            }
        }
    }

    /** Util para mapear Receta ➞ RecetaDto */
    private RecetaDto toDto(Receta r) {
        double avg = r.getCalificaciones()
                .stream()
                .mapToInt(Calificacion::getCalificacion)
                .average()
                .orElse(0.0);
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

    /** Obtiene detalle completo de la receta */
    public RecetaDetailDTO getDetalle(Integer idReceta) {
        Receta r = repo.findById(idReceta)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

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

        // Ingredientes
        List<IngredienteDTO> ing = r.getUtilizados()
                .stream()
                .map(u -> new IngredienteDTO(
                        u.getIngrediente().getNombre(),
                        u.getCantidad(),
                        u.getUnidad().getDescripcion(),
                        u.getObservaciones()
                ))
                .collect(Collectors.toList());
        dto.setIngredientes(ing);

        // Pasos + multimedia
        List<PasoDTO> pasos = r.getPasos()
                .stream()
                .sorted(Comparator.comparing(Paso::getNroPaso))
                .map(p -> new PasoDTO(
                        p.getNroPaso(),
                        p.getTexto(),
                        p.getMultimedia()
                                .stream()
                                .map(m -> new MultimediaDTO(m.getTipoContenido(), m.getUrlContenido()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList());
        dto.setPasos(pasos);

        // Calificaciones
        List<CalificacionDTO> cals = r.getCalificaciones()
                .stream()
                .map(c -> new CalificacionDTO(c.getUsuario().getNickname(),
                        c.getCalificacion(),
                        c.getComentarios()))
                .collect(Collectors.toList());
        dto.setCalificaciones(cals);

        return dto;
    }

    /** Detecta tipo de multimedia según extensión */
    private String detectarTipo(String url) {
        if (url.endsWith(".mp4")) return "video";
        if (url.endsWith(".mp3")) return "audio";
        return "foto";
    }
}
