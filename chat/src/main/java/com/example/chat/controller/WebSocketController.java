package com.example.chat.controller;

import com.example.chat.entity.Message;
import com.example.chat.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@Controller
public class WebSocketController {
    @Autowired
    private MessageRepository messageRepository;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/send")
    public void sendMessage(@Payload Message message) {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (message.getSender() == null || message.getSender().getId() == null ||
                    message.getSender().getUsername() == null ||
                    message.getReceiver() == null || message.getReceiver().getId() == null ||
                    message.getReceiver().getUsername() == null ||
                    message.getContent() == null || message.getContent().trim().isEmpty()) {
                System.out.println("Dữ liệu tin nhắn không hợp lệ: " + message);
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
        } catch (Exception e) {
            System.out.println("Lỗi khi gửi tin nhắn: " + e.getMessage());
            e.printStackTrace();
        }
    }
}