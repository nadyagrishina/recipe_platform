package com.nadyagrishina.recipesplatform.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateUserRequestDTO {

    @Size(min = 3, max = 255)
    private String username;

    @Size(min = 6, max = 255)
    private String password;

    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String surname;

    @Email
    @Size(max = 255)
    private String email;
}