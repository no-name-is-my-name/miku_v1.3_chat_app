package com.example.chat.controller;

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
}