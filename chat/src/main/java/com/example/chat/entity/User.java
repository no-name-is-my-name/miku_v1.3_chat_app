package com.example.chat.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;
    private String password;
    private String avatarUrl;
    private boolean onlineStatus;
    @ElementCollection
    @CollectionTable(name = "user_friends", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "friend_id")
    private List<Long> friendIds = new ArrayList<>();

    // Getters và Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getAvatarUrl() {return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public boolean isOnlineStatus() { return onlineStatus; }
    public void setOnlineStatus(boolean onlineStatus) { this.onlineStatus = onlineStatus; }
    public List<Long> getFriendIds() { return friendIds; }
    public void setFriendIds(List<Long> friendIds) { this.friendIds = friendIds; }
}
