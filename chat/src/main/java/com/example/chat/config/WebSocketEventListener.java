package com.example.chat.config;

import com.example.chat.entity.User;
import com.example.chat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {
    @Autowired
    private UserRepository userRepository;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        System.out.println("User kết nối WebSocket: " + headerAccessor.getUser().getName());
        String username = headerAccessor.getUser().getName();
        User user = userRepository.findByUsername(username);
        if (user != null) {
            user.setOnlineStatus(true);
            userRepository.save(user);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = headerAccessor.getUser().getName();
        User user = userRepository.findByUsername(username);
        if (user != null) {
            user.setOnlineStatus(false);
            userRepository.save(user);
        }
    }
}