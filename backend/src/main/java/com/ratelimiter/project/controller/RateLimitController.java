package com.ratelimiter.project.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.ratelimiter.project.entity.RateLimitRule;
import com.ratelimiter.project.repository.RateLimitRepository;

import java.util.List;

@RestController
@RequestMapping("/rate-limit")
@RequiredArgsConstructor
public class RateLimitController {

    private final RateLimitRepository rateLimitRepository;

    // ✅ CREATE
    @PostMapping("/create")
    public RateLimitRule createRule(@RequestBody RateLimitRule rule) {
        return rateLimitRepository.save(rule);
    }

    // ✅ GET ALL
    @GetMapping
    public List<RateLimitRule> getAllRules() {
        return rateLimitRepository.findAll();
    }


    // ✅ UPDATE
    @PutMapping("/{id}")
    public RateLimitRule updateRule(@PathVariable Long id,
                                    @RequestBody RateLimitRule updatedRule) {

        RateLimitRule rule = rateLimitRepository.findById(id)
                .orElseThrow();

        rule.setLimitCount(updatedRule.getLimitCount());
        rule.setTimeWindow(updatedRule.getTimeWindow());
        rule.setEndpoint(updatedRule.getEndpoint());

        return rateLimitRepository.save(rule);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public String deleteRule(@PathVariable Long id) {
        rateLimitRepository.deleteById(id);
        return "Rate limit rule deleted ✅";
    }
}