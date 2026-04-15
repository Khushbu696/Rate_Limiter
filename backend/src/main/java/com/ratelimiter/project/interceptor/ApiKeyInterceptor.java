package com.ratelimiter.project.interceptor;

import com.ratelimiter.project.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class ApiKeyInterceptor implements HandlerInterceptor {

    private final UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getRequestURI();
        String method = request.getMethod();

        // Skip auth routes
        if (path.startsWith("/auth/")) {
            return true;
        }

        // Check for API-KEY header
        String apiKey = request.getHeader("API-KEY");
        if (apiKey == null || apiKey.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing API-KEY header");
            return false;
        }

        // Validate API Key and Fetch User
        var userOptional = userRepository.findByApiKey(apiKey);
        if (userOptional.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid API-KEY");
            return false;
        }

        com.ratelimiter.project.entity.User user = userOptional.get();

        // ADMIN ONLY ENDPOINTS
        // POST /rate-limit, PUT /rate-limit/**, DELETE /rate-limit/**
        boolean isAdminEndpoint = path.startsWith("/rate-limit") && 
                                  (method.equals("POST") || method.equals("PUT") || method.equals("DELETE"));

        if (isAdminEndpoint && !"ADMIN".equalsIgnoreCase(user.getRole())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Forbidden: Admin access required. Current role: " + user.getRole());
            return false;
        }

        return true;
    }
}
