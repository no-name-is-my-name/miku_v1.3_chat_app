package com.example.chat.controller;

import com.example.chat.entity.User;
import com.example.chat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "D:\\miku_chat_app v1.3\\miku_v1.3_chat_app\\chat\\src\\main\\resources\\static\\uploads\\";

    @GetMapping("/online")
    public ResponseEntity<List<User>> getOnlineUsers() {
        return ResponseEntity.ok(userRepository.findByOnlineStatusTrue());
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));
        return ResponseEntity.ok(user);
    }

    @GetMapping("/avatar/{userId}")
    public ResponseEntity<byte[]> getAvatar(@PathVariable Long userId) {
        try {
            // Tìm user dựa trên userId
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User không tồn tại với ID: " + userId));

            // Lấy đường dẫn ảnh từ avatarUrl
            String avatarUrl = user.getAvatarUrl();
            if (avatarUrl == null || avatarUrl.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            // Trích xuất fileName từ avatarUrl (loại bỏ "/uploads/")
            String fileName = avatarUrl.replace("/uploads/", "");
            File file = new File(UPLOAD_DIR + fileName);

            // Kiểm tra file tồn tại
            if (!file.exists()) {
                System.err.println("File không tồn tại tại: " + file.getAbsolutePath());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            // Đọc file thành byte array
            byte[] fileContent = Files.readAllBytes(file.toPath());

            // Thiết lập header cho response
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG); // Điều chỉnh theo loại file (JPEG/PNG)
            headers.setContentLength(fileContent.length);

            return new ResponseEntity<>(fileContent, headers, HttpStatus.OK);
        } catch (IOException e) {
            System.err.println("Lỗi khi đọc file: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            System.err.println("Lỗi khi lấy avatar: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("{id}/change-name")
    public ResponseEntity<?> changeName(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newName = body.get("username");
        if (newName == null || newName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Tên không được để trống!");
        }
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setUsername(newName);
            userRepository.save(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}