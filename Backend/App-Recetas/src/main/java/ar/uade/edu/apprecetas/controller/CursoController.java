package ar.uade.edu.apprecetas.controller;


import ar.uade.edu.apprecetas.entity.CronogramaCurso;
import ar.uade.edu.apprecetas.entity.Curso;
import ar.uade.edu.apprecetas.entity.Inscripcion;
import ar.uade.edu.apprecetas.entity.Sede;
import ar.uade.edu.apprecetas.service.CursoService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class CursoController {
    private final CursoService svc;
    public CursoController(CursoService svc) { this.svc = svc; }

    @GetMapping("/sedes")
    public List<Sede> getSedes() {
        return svc.listarSedes();
    }

    @GetMapping("/cursos")
    public List<Curso> getCursos() {
        return svc.listarCursos();
    }

    @GetMapping("/cronogramas")
    public List<CronogramaCurso> getCronogramas() {
        return svc.listarCronogramas();
    }

    @GetMapping("/cronogramas/curso/{idCurso}")
    public List<CronogramaCurso> getCronogramasPorCurso(@PathVariable Integer idCurso) {
        return svc.listarCronogramasPorCurso(idCurso);
    }

    @PostMapping("/inscripciones/{idCronograma}")
    public Inscripcion inscribir(@PathVariable Integer idCronograma) {
        return svc.inscribir(idCronograma);
    }

    @GetMapping("/inscripciones")
    public List<Inscripcion> misInscripciones() {
        return svc.misInscripciones();
    }

    @DeleteMapping("/inscripciones/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelar(@PathVariable Integer id) {
        svc.cancelarInscripcion(id);
    }
}
