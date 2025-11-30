package com.nadyagrishina.recipesplatform.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class UserResponseDTO {
    private Long id;
    private String username;
    private String name;
    private String surname;
    private String email;
}
