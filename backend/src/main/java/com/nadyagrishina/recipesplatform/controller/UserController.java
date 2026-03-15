package com.nadyagrishina.recipesplatform.controller;

import com.nadyagrishina.recipesplatform.dto.request.UpdateUserRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.UserResponseDTO;
import com.nadyagrishina.recipesplatform.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@Validated
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserResponseDTO getCurrentUser(Authentication authentication) {
        log.info("Fetching current user {}", authentication.getName());
        return userService.getCurrentUser(authentication.getName());
    }

    @PutMapping("/me")
    public UserResponseDTO updateCurrentUser(
            Authentication authentication,
            @Valid @RequestBody UpdateUserRequestDTO request
    ) {
        return userService.updateCurrentUser(authentication.getName(), request);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/me")
    public void deleteCurrentUser(Authentication authentication) {
        userService.deleteCurrentUser(authentication.getName());
    }
}