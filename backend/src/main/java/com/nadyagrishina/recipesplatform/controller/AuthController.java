package com.nadyagrishina.recipesplatform.controller;

import com.nadyagrishina.recipesplatform.dto.auth.AuthRequest;
import com.nadyagrishina.recipesplatform.dto.auth.AuthResponse;
import com.nadyagrishina.recipesplatform.dto.auth.RegisterRequest;
import com.nadyagrishina.recipesplatform.security.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody @Valid RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticate(@RequestBody @Valid AuthRequest request) {
        return ResponseEntity.ok(authService.authenticate(request));
    }
}