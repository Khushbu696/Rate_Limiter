package com.ratelimiter.project.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.ratelimiter.project.entity.RequestLog;
import com.ratelimiter.project.repository.RequestLogRepository;

import jakarta.servlet.http.HttpServletRequest;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LogService {

    private final RequestLogRepository logRepository;

    public void log(Long userId, String apiKey, HttpServletRequest request, int status) {
        RequestLog log = new RequestLog();

        log.setUserId(userId);
        log.setApiKey(apiKey);
        log.setEndpoint(request.getRequestURI());
        log.setMethod(request.getMethod());
        log.setStatus(status);
        log.setTimestamp(LocalDateTime.now());

        logRepository.save(log);
    }
}
