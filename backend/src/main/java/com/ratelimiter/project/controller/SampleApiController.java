package com.ratelimiter.project.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api") // This path is NOT skipped by the filter
public class SampleApiController {

    @GetMapping("/data")
    public Map<String, String> getSampleData() {
        return Map.of(
                "status", "Success",
                "message", "This is protected data from the API!",
                "note", "You can only see this if you are within your rate limit.");
    }
}
