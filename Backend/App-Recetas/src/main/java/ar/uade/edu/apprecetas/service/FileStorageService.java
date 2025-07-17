package ar.uade.edu.apprecetas.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path uploadDir = Paths.get("uploads");

    @PostConstruct
    public void init() throws IOException {
        if (Files.notExists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }
    }

    /**
     * Guarda el archivo en disco y retorna la URL para accederlo.
     */
    public String store(MultipartFile file) throws IOException {
        String original = StringUtils.cleanPath(file.getOriginalFilename());
        String filename = UUID.randomUUID() + "_" + original;
        Path target = uploadDir.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        // La URL pública será /uploads/{filename}
        return "/uploads/" + filename;
    }
}
