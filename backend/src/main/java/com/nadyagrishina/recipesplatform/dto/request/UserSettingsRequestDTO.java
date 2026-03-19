package com.nadyagrishina.recipesplatform.dto.request;

import com.nadyagrishina.recipesplatform.entity.MeasurementUnitSystem;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettingsRequestDTO {
    @Size(max = 255)
    private String name;

    @Size(max = 255)
    private String surname;

    private String description;

    private String imageUrl;

    private MeasurementUnitSystem measurementUnitSystem;
}
