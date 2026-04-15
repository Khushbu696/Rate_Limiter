package com.ratelimiter.project.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class RequestLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

     @Column(name = "user_id")
    private Long userId;

    private String apiKey;
    private String endpoint;
    private String method;
    private int status;
    private LocalDateTime timestamp;
}