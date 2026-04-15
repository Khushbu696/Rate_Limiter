package com.ratelimiter.project.filter;

import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

import com.ratelimiter.project.entity.User;
import com.ratelimiter.project.repository.UserRepository;
import com.ratelimiter.project.service.RateLimiterService;
import com.ratelimiter.project.service.LogService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class RateLimiterFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;
    private final RateLimiterService rateLimiterService;
    private final LogService logService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ Skip public/admin endpoints
        if (shouldSkipFilter(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String apiKey = request.getHeader("API-KEY");

        // ❌ Missing API Key
        if (apiKey == null || apiKey.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // ❌ Invalid API Key
        User user = userRepository.findByApiKey(apiKey).orElse(null);
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // ❌ Rate limit exceeded
        boolean allowed = rateLimiterService.isAllowed(user.getId(), apiKey, path);
        if (!allowed) {
            response.setStatus(429);
            logService.log(user.getId(), apiKey, request, 429);
            return;
        }

        // ✅ Proceed request
        filterChain.doFilter(request, response);

        // ✅ Log after response
        logService.log(user.getId(), apiKey, request, response.getStatus());
    }

    // 🔥 Skip rate limiting for public and administrative endpoints
    private boolean shouldSkipFilter(String path) {
        return path.startsWith("/auth") || 
               path.startsWith("/rate-limit") ||
               path.startsWith("/analytics") ||
               path.startsWith("/logs") ||
               path.equals("/test");
    }
}