package com.nadyagrishina.recipesplatform.dto.response;

import com.nadyagrishina.recipesplatform.entity.MeasurementUnitSystem;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettingsResponseDTO {
    private String name;
    private String surname;
    private String description;
    private String imageUrl;
    private MeasurementUnitSystem measurementUnitSystem;
}
