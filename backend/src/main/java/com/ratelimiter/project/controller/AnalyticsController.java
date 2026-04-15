package com.ratelimiter.project.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.ratelimiter.project.repository.RequestLogRepository;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final RequestLogRepository logRepository;

    @GetMapping("/summary")
    public long totalRequests() {
        return logRepository.count();
    }

    @GetMapping("/user/{userId}")
    public long userRequests(@PathVariable Long userId) {
        return logRepository.countByUserId(userId);
    }
}