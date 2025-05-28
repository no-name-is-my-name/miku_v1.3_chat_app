package com.example.chat.controller;

import com.example.chat.entity.User;
import com.example.chat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserRepository userRepository;

    private static final String UPLOAD_DIR = "D:\\miku_chat_app v1.3\\miku_v1.3_chat_app\\chat\\src\\main\\resources\\static\\uploads\\";
    //Đường dẫn lưu avatar của người dùng

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser != null && existingUser.getPassword().equals(user.getPassword())) {
            existingUser.setOnlineStatus(true);
            userRepository.save(existingUser);
            return ResponseEntity.ok(existingUser);
        }
        return ResponseEntity.badRequest().body(null);
    }

    @PostMapping("logout")
    public ResponseEntity<String> logout(@RequestBody User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser != null) {
            existingUser.setOnlineStatus(false);
            userRepository.save(existingUser);
            return ResponseEntity.ok("Đăng ký thành công");
        }
        return ResponseEntity.badRequest().body(null);
    }

    @PostMapping("/register")
    public ResponseEntity<String> uploadAvatar(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        try {
            if (userRepository.findByUsername(username) != null) {
                return ResponseEntity.badRequest().body("Username đã tồn tại");
            }
            User user = new User();
            user.setUsername(username);
            user.setPassword(password);
            user.setOnlineStatus(false);

            String avatarUrl = null;
            if (avatar != null && !avatar.isEmpty()) {
                String fileName = UUID.randomUUID().toString() + "_" + avatar.getOriginalFilename();
                String uploadPath = UPLOAD_DIR + fileName;

                // Tạo thư mục nếu chưa tồn tại
                java.io.File directory = new java.io.File(UPLOAD_DIR);
                if (!directory.exists()) {
                    directory.mkdirs();
                }

                avatar.transferTo(new java.io.File(uploadPath));
                avatarUrl = "/uploads/" + fileName;
                user.setAvatarUrl(avatarUrl);
            }

            User savedUser = userRepository.save(user);
            return ResponseEntity.ok("Đăng ký thành công");
        } catch (IOException e) {
            return ResponseEntity.status(500).body(("Lỗi khi lưu avatar: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi đăng ký: " + e.getMessage());
        }
    }
}