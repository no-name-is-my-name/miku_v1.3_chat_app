package com.example.chat.config;

import com.example.chat.config.UserPrincipal;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            System.out.println("Received STOMP CONNECT frame: " + accessor);
            String username = accessor.getFirstNativeHeader("username");
            System.out.println("Username from header: " + username);
            if (username != null && !username.isEmpty()) {
                accessor.setUser(new UserPrincipal(username));
                System.out.println("WebSocket authenticated user: " + username);
            } else {
                System.out.println("WebSocket connect without username");
                return null;
            }
        }
        return message;
    }
}