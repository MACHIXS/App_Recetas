package ar.uade.edu.apprecetas.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Value("${upload.dir:uploads}")  // carpeta base en tu proyecto o filesystem
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<Map<String,String>> upload(@RequestParam("file") MultipartFile file) throws IOException {
        // crea carpeta si no existe
        Path dir = Paths.get(uploadDir);
        if (!Files.exists(dir)) Files.createDirectories(dir);

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path target = dir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // aquí defines la URL pública. Si sirves estáticamente desde /uploads/**:
        String url = "/uploads/" + filename;

        Map<String,String> resp = new HashMap<>();
        resp.put("url", url);
        return ResponseEntity.ok(resp);
    }
}
