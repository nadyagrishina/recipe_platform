package com.nadyagrishina.recipesplatform.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank
    @Size(min = 3, max = 255)
    private String username;

    @NotBlank
    @Size(min = 6, max = 255)
    private String password;

    @Email
    @NotBlank
    @Size(max = 255)
    private String email;
}