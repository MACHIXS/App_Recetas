package ar.uade.edu.apprecetas.service;

import ar.uade.edu.apprecetas.entity.*;
import ar.uade.edu.apprecetas.repository.CronogramaCursoRepository;
import ar.uade.edu.apprecetas.repository.CursoRepository;
import ar.uade.edu.apprecetas.repository.InscripcionRepository;
import ar.uade.edu.apprecetas.repository.SedeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CursoService {
    private final SedeRepository sedeRepo;
    private final CursoRepository cursoRepo;
    private final CronogramaCursoRepository cronRepo;
    private final InscripcionRepository insRepo;
    private final UsuarioService usuarioService; // para obtener el alumno actual

    public CursoService(SedeRepository sedeRepo,
                        CursoRepository cursoRepo,
                        CronogramaCursoRepository cronRepo,
                        InscripcionRepository insRepo,
                        UsuarioService usuarioService) {
        this.sedeRepo = sedeRepo;
        this.cursoRepo = cursoRepo;
        this.cronRepo = cronRepo;
        this.insRepo = insRepo;
        this.usuarioService = usuarioService;
    }

    public List<Sede> listarSedes() {
        return sedeRepo.findAll();
    }

    public List<Curso> listarCursos() {
        return cursoRepo.findAll();
    }

    public List<CronogramaCurso> listarCronogramas() {
        return cronRepo.findAll();
    }

    public List<CronogramaCurso> listarCronogramasPorCurso(Integer cursoId) {
        return cronRepo.findByCursoIdCurso(cursoId);
    }

    public Inscripcion inscribir(Integer idCronograma) {
        Alumno alumno = usuarioService.usuarioLogueadoComoAlumno();
        CronogramaCurso cr = cronRepo.findById(idCronograma)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (cr.getVacantesDisponibles() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sin vacantes");
        }
        // Reducir vacantes
        cr.setVacantesDisponibles(cr.getVacantesDisponibles() - 1);
        cronRepo.save(cr);

        Inscripcion ins = new Inscripcion();
        ins.setAlumno(alumno);
        ins.setCronograma(cr);
        ins.setFecha(LocalDateTime.now());
        return insRepo.save(ins);
    }

    public List<Inscripcion> misInscripciones() {
        Alumno alumno = usuarioService.usuarioLogueadoComoAlumno();
        return insRepo.findByAlumnoIdAlumno(alumno.getIdAlumno());
    }

    public void cancelarInscripcion(Integer idInscripcion) {
        Inscripcion ins = insRepo.findById(idInscripcion)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        // lógica de devolución según fechaInicio-cronograma
        cronRepo.findById(ins.getCronograma().getIdCronograma())
                .ifPresent(cr -> {
                    // aquí podrías sumar de vuelta la vacante, aplicar reembolso, etc.
                    cr.setVacantesDisponibles(cr.getVacantesDisponibles() + 1);
                    cronRepo.save(cr);
                });
        insRepo.delete(ins);
    }
}
