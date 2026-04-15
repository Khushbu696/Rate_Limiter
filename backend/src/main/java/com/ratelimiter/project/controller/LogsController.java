package com.ratelimiter.project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import com.ratelimiter.project.entity.RequestLog;
import com.ratelimiter.project.repository.RequestLogRepository;

import java.util.List;

@RestController
@RequestMapping("/logs")
@RequiredArgsConstructor
public class LogsController {

    private final RequestLogRepository logRepository;

    @GetMapping
    public List<RequestLog> getAllLogs() {
        return logRepository.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<RequestLog> getLogsByUser(@PathVariable Long userId) {
        return logRepository.findAll()
                .stream()
                .filter(log -> log.getUserId().equals(userId))
                .toList();
    }
}