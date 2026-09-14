package backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private static final String UPLOAD_DIR =
        System.getProperty("user.dir") + File.separator + "uploads" + File.separator;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file)
            throws IOException {

        File uploadDir = new File(UPLOAD_DIR);

        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }

        String fileName =
                UUID.randomUUID() + "_" + file.getOriginalFilename();

        File destination = new File(UPLOAD_DIR, fileName);
  
        System.out.println("Saving file to: "
        + destination.getAbsolutePath());   

        file.transferTo(destination);

        Map<String, String> response = new HashMap<>();

        response.put(
                "url",
                "/uploads/" + fileName
        );

        return ResponseEntity.ok(response);
    }
}