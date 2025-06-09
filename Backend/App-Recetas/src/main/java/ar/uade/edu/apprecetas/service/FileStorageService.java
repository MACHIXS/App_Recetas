package ar.uade.edu.apprecetas.service;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class FileStorageService {
    private final Path root = Paths.get("uploads");

    public FileStorageService() throws IOException {
        Files.createDirectories(root);
    }

    public String store(MultipartFile file) throws IOException {
        String filename = System.currentTimeMillis() + "-"
                + StringUtils.cleanPath(file.getOriginalFilename());
        Path target = root.resolve(filename);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        return "/uploads/" + filename;
    }
}
