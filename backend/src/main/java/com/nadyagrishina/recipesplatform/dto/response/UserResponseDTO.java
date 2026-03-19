package com.nadyagrishina.recipesplatform.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long id;
    private String username;
    private String name;
    private String surname;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserSettingsResponseDTO userSettingsDTO;
}