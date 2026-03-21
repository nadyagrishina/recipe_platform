package com.nadyagrishina.recipesplatform.controller;

import com.nadyagrishina.recipesplatform.dto.request.UserSettingsRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.UserSettingsResponseDTO;
import com.nadyagrishina.recipesplatform.entity.User;
import com.nadyagrishina.recipesplatform.service.UserSettingsService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RequiredArgsConstructor
@Validated
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/users/me")
public class UserSettingsController {

    private final UserSettingsService userSettingsService;

    @GetMapping("/settings")
    public UserSettingsResponseDTO getUserSettings(Authentication authentication) {
        log.info("Fetching current user settings");
        User user = (User) authentication.getPrincipal();
        return userSettingsService.getCurrentUserSettings(user);
    }

    @PutMapping("/settings")
    public UserSettingsResponseDTO updateUserSettings(Authentication authentication, @RequestBody UserSettingsRequestDTO request) {
        log.info("Updating current user settings");
        User user = (User) authentication.getPrincipal();
        return userSettingsService.updateCurrentUserSettings(user, request);
    }

    @PostMapping(value = "/settings/avatar", consumes = "multipart/form-data")
    public UserSettingsResponseDTO uploadAvatar(
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return userSettingsService.uploadAvatar(user, file);
    }
}
