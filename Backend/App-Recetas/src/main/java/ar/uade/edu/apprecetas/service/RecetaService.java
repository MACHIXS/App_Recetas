package ar.uade.edu.apprecetas.service;

import ar.uade.edu.apprecetas.dto.RecetaCreateDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO.CalificacionDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO.IngredienteDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO.MultimediaDTO;
import ar.uade.edu.apprecetas.dto.RecetaDetailDTO.PasoDTO;
import ar.uade.edu.apprecetas.dto.RecetaDto;
import ar.uade.edu.apprecetas.entity.*;
import ar.uade.edu.apprecetas.repository.*;
import ar.uade.edu.apprecetas.security.JwtUtil;
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
    private final JwtUtil                 jwtUtil;

    public RecetaService(
            RecetaRepository repo,
            UsuarioRepository usuarioRepo,
            TipoRecetaRepository tipoRepo,
            IngredienteRepository ingrRepo,
            UnidadRepository unidadRepo,
            UtilizadoRepository utilizadoRepo,
            PasoRepository pasoRepo,
            MultimediaRepository multimediaRepo,
            JwtUtil jwtUtil) {
        this.repo = repo;
        this.usuarioRepo = usuarioRepo;
        this.tipoRepo = tipoRepo;
        this.ingrRepo = ingrRepo;
        this.unidadRepo = unidadRepo;
        this.utilizadoRepo = utilizadoRepo;
        this.pasoRepo = pasoRepo;
        this.multimediaRepo = multimediaRepo;
        this.jwtUtil = jwtUtil;
    }

    // ─── 1) LISTADO PÚBLICO (solo RECETAS APROBADAS) ────────────────────────────
    public List<RecetaDto> listarRecetasPublicas() {
        return repo.findByEstado(EstadoReceta.APROBADA)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ─── 2) DETALLE PÚBLICO (solo si está APROBADA) ────────────────────────────
    public RecetaDetailDTO getDetallePublico(Integer idReceta) {
        Receta r = repo.findByIdRecetaAndEstado(idReceta, EstadoReceta.APROBADA)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Receta no encontrada o no aprobada"));
        return toDetailDto(r);
    }

    // ─── 3) APROBAR RECETA (solo ADMIN) ─────────────────────────────────────────
    @Transactional
    public void aprobarReceta(String mailUsuario, Integer idReceta) {
        Usuario usuario = usuarioRepo.findByMail(mailUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (usuario.getRol() != Rol.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo ADMIN puede aprobar");
        }
        Receta r = repo.findById(idReceta)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Receta no encontrada: " + idReceta));
        r.setEstado(EstadoReceta.APROBADA);
    }

    // ─── 4) RECHAZAR RECETA (solo ADMIN) ────────────────────────────────────────
    @Transactional
    public void rechazarReceta(String mailUsuario, Integer idReceta) {
        Usuario usuario = usuarioRepo.findByMail(mailUsuario)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (usuario.getRol() != Rol.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo ADMIN puede rechazar");
        }
        if (!repo.existsById(idReceta)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Receta no encontrada: " + idReceta);
        }
        repo.deleteById(idReceta);
    }

    // ─── 5) LISTADOS INTERNOS EXISTENTES ────────────────────────────────────────

    /** Listar todas las aprobadas */
    public List<RecetaDto> listarRecetas() {
        return listarRecetasPublicas();
    }

    /** Listar por ingrediente (solo aprobadas) */
    public List<RecetaDto> listarPorIngrediente(String nombre) {
        return repo.findByUtilizados_Ingrediente_NombreAndEstado(nombre, EstadoReceta.APROBADA)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    /** Listar mis recetas (todas, pendiente o aprobadas) */
    public List<RecetaDto> listarMias(String mailUsuario) {
        return repo.findByUsuario_Mail(mailUsuario)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public void crearOReemplazarReceta(String mailUsuario, RecetaCreateDTO dto) {
        // DEBUG: verifica que llegue la llamada
        System.out.println("📝 crearOReemplazarReceta llamado para user="
                + mailUsuario + " con nombreReceta=" + dto.getNombreReceta());

        // 1) Cargo el usuario y el tipo de receta
        Usuario u = usuarioRepo.findByMail(mailUsuario)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        TipoReceta tipo = tipoRepo.findById(dto.getIdTipo())
                .orElseThrow(() -> new IllegalArgumentException("Tipo no encontrado"));

        // 2) Si ya había recetas con ese nombre para este usuario, las borro
        if (repo.existsByUsuario_MailAndNombreReceta(mailUsuario, dto.getNombreReceta())) {
            List<Receta> antiguas =
                    repo.findByUsuario_MailAndNombreReceta(mailUsuario, dto.getNombreReceta());
            antiguas.forEach(rec -> {
                utilizadoRepo.deleteAll(rec.getUtilizados());
                pasoRepo.findByReceta_IdReceta(rec.getIdReceta())
                        .forEach(p -> multimediaRepo.deleteAll(p.getMultimedia()));
                pasoRepo.deleteAll(rec.getPasos());
                repo.delete(rec);
            });
        }

        // 3) Creo la nueva receta en estado PENDIENTE
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

        // 4) Persisto los ingredientes (tabla Utilizado)
        for (var in : dto.getIngredientes()) {
            Ingrediente ing = ingrRepo.findByNombre(in.getNombre())
                    .orElseGet(() -> ingrRepo.save(new Ingrediente(in.getNombre())));
            Unidad uni = unidadRepo.findById(in.getIdUnidad())
                    .orElseThrow(() -> new IllegalArgumentException("Unidad no encontrada"));

            Utilizado uUtil = new Utilizado();
            uUtil.setReceta(r);
            uUtil.setIngrediente(ing);
            uUtil.setUnidad(uni);
            uUtil.setCantidad(in.getCantidad().intValue());
            uUtil.setObservaciones(in.getObservaciones());
            utilizadoRepo.save(uUtil);
        }

        // 5) Persisto los pasos y su multimedia
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

    /** Devuelve true si ya existe receta con ese nombre para ese usuario */
    public boolean recetaExiste(String mailUsuario, String nombreReceta) {
        return repo.existsByUsuario_MailAndNombreReceta(mailUsuario, nombreReceta);
    }

    /** 6) DETALLE COMPLETO, permitiendo ver pendientes si eres dueño/admin */
    public RecetaDetailDTO getDetalle(String authHeader, Integer idReceta) {
        String mail = null;
        boolean esAdmin = false;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            mail = jwtUtil.extractMail(token);
            esAdmin = jwtUtil.extractRoles(token).contains("ADMIN");
        }

        Receta r = repo.findById(idReceta)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Receta no encontrada"));

        if (r.getEstado() == EstadoReceta.PENDIENTE
                && !esAdmin
                && !r.getUsuario().getMail().equals(mail)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Receta no encontrada o no aprobada");
        }

        return toDetailDto(r);
    }

    /** Listar pendientes (solo admin) */
    public List<RecetaDto> listarRecetasPendientes() {
        return repo.findByEstado(EstadoReceta.PENDIENTE)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    // ─── Métodos auxiliares para mapear DTOs ────────────────────────────────────

    private RecetaDto toDto(Receta r) {
        double avg = r.getCalificaciones()
                .stream().mapToInt(Calificacion::getCalificacion).average().orElse(0.0);
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

    private RecetaDetailDTO toDetailDto(Receta r) {
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

        dto.setIngredientes(r.getUtilizados().stream()
                .map(u -> new IngredienteDTO(
                        u.getIngrediente().getNombre(),
                        u.getCantidad(),
                        u.getUnidad().getDescripcion(),
                        u.getObservaciones()))
                .collect(Collectors.toList()));

        dto.setPasos(r.getPasos().stream()
                .sorted(Comparator.comparing(Paso::getNroPaso))
                .map(p -> new PasoDTO(
                        p.getNroPaso(),
                        p.getTexto(),
                        p.getMultimedia().stream()
                                .map(m -> new MultimediaDTO(m.getTipoContenido(), m.getUrlContenido()))
                                .collect(Collectors.toList())
                ))
                .collect(Collectors.toList()));

        dto.setCalificaciones(r.getCalificaciones().stream()
                .map(c -> new CalificacionDTO(
                        c.getUsuario().getNickname(),
                        c.getCalificacion(),
                        c.getComentarios()))
                .collect(Collectors.toList()));

        return dto;
    }

    private String detectarTipo(String url) {
        if (url.endsWith(".mp4")) return "video";
        if (url.endsWith(".mp3")) return "audio";
        return "foto";
    }
}
