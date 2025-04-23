package com.example.chat.controller; // Đảm bảo package đúng

import com.example.chat.entity.Message;
import com.example.chat.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody Message message) {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (message.getSender() == null || message.getSender().getId() == null ||
                    message.getSender().getUsername() == null ||
                    message.getReceiver() == null || message.getReceiver().getId() == null ||
                    message.getReceiver().getUsername() == null ||
                    message.getContent() == null || message.getContent().trim().isEmpty()) {
                System.out.println("Dữ liệu tin nhắn không hợp lệ: " + message);
                return ResponseEntity.badRequest().body("Dữ liệu tin nhắn không hợp lệ (thiếu id, username hoặc content)");
            }

            System.out.println("Nhận tin nhắn: " + message.getContent() +
                    ", Sender ID: " + message.getSender().getId() +
                    ", Sender Username: " + message.getSender().getUsername() +
                    ", Receiver ID: " + message.getReceiver().getId() +
                    ", Receiver Username: " + message.getReceiver().getUsername());

            // Gán thời gian và lưu tin nhắn
            message.setCreatedAt(LocalDateTime.now());
            Message savedMessage = messageRepository.save(message);
            System.out.println("Đã lưu tin nhắn, ID: " + savedMessage.getId());
            System.out.println("Tin nhắn đã lưu: " + savedMessage);

            // Gửi tin nhắn đến người nhận
            try {
                messagingTemplate.convertAndSendToUser(
                        message.getReceiver().getUsername(),
                        "/queue/messages",
                        savedMessage
                );
                System.out.println("Đã gửi tin nhắn đến receiver: " + message.getReceiver().getUsername());
                System.out.println(message.getContent());
            } catch (Exception e) {
                System.out.println("Lỗi khi gửi tin nhắn đến receiver: " + message.getReceiver().getUsername() + ", Lỗi: " + e.getMessage());
                e.printStackTrace();
            }

            // Gửi tin nhắn đến người gửi
            try {
                messagingTemplate.convertAndSendToUser(
                        message.getSender().getUsername(),
                        "/queue/messages",
                        savedMessage
                );
                System.out.println("Đã gửi tin nhắn đến sender: " + message.getSender().getUsername());
            } catch (Exception e) {
                System.out.println("Lỗi khi gửi tin nhắn đến sender: " + message.getSender().getUsername() + ", Lỗi: " + e.getMessage());
                e.printStackTrace();
            }

            return ResponseEntity.ok("Tin nhắn đã được gửi");
        } catch (Exception e) {
            System.out.println("Lỗi khi gửi tin nhắn: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam("user1") Long user1,
            @RequestParam("user2") Long user2
    ) {
        try {
            System.out.println("Lấy lịch sử tin nhắn giữa user1: " + user1 + " và user2: " + user2);
            List<Message> messages = messageRepository.findBySenderIdAndReceiverIdOrSenderIdAndReceiverId(
                    user1, user2, user2, user1
            );
            System.out.println("Số tin nhắn tìm thấy: " + messages.size());
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            System.out.println("Lỗi khi lấy lịch sử tin nhắn: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    // Endpoint kiểm tra tạm thời
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Endpoint /api/messages/test hoạt động");
    }
}