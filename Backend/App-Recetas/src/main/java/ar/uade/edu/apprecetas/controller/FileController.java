package ar.uade.edu.apprecetas.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final Path uploadPath;

    public FileController(@Value("${file.upload-dir}") String uploadDir) throws IOException {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        // Crea la carpeta si no existe
        Files.createDirectories(this.uploadPath);
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Map<String, String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String original = Paths.get(file.getOriginalFilename()).getFileName().toString();
        String filename = UUID.randomUUID() + "_" + original;
        Path target = uploadPath.resolve(filename);

        // Copiamos el contenido
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // Construimos la URL pública
        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(filename)
                .toUriString();

        return Map.of("url", url);
    }
}
