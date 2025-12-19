package com.nadyagrishina.recipesplatform.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRequestDTO {
    @NotBlank
    @Size(min = 3, max = 255)
    private String username;

    @NotBlank
    @Size(min = 6, max = 255)
    private String password;

    @Size(min = 1, max = 255)
    private String name;

    @Size(min = 1, max = 255)
    private String surname;

    @NotBlank
    @Email
    @Size(min = 3, max = 255)
    private String email;
}
