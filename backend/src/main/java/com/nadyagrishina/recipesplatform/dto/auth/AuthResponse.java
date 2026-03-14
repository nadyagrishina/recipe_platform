package com.nadyagrishina.recipesplatform.dto.auth;

import com.nadyagrishina.recipesplatform.dto.response.UserResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private long expiresIn;
    private UserResponseDTO user;
}