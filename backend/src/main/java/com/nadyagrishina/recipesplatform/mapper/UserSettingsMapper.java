package com.nadyagrishina.recipesplatform.mapper;

import com.nadyagrishina.recipesplatform.dto.request.UserSettingsRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.UserSettingsResponseDTO;
import com.nadyagrishina.recipesplatform.entity.UserSettings;
import org.springframework.stereotype.Component;

@Component
public class UserSettingsMapper {

    public UserSettingsResponseDTO toResponseDTO(UserSettings userSettings) {
        if (userSettings == null) {
            return null;
        }
        return UserSettingsResponseDTO.builder()
                .name(userSettings.getName())
                .surname(userSettings.getSurname())
                .description(userSettings.getDescription())
                .imageUrl(userSettings.getImageUrl())
                .measurementUnitSystem(userSettings.getMeasurementUnitSystem())
                .build();
    }

    public UserSettings toEntity(UserSettingsRequestDTO userSettingsRequestDTO) {
        if (userSettingsRequestDTO == null) {
            return null;
        }

        return UserSettings.builder()
                .name(userSettingsRequestDTO.getName())
                .surname(userSettingsRequestDTO.getSurname())
                .description(userSettingsRequestDTO.getDescription())
                .imageUrl(userSettingsRequestDTO.getImageUrl())
                .measurementUnitSystem(userSettingsRequestDTO.getMeasurementUnitSystem())
                .build();
    }
}
