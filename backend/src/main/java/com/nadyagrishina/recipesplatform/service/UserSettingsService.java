package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.request.UserSettingsRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.UserSettingsResponseDTO;
import com.nadyagrishina.recipesplatform.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserSettingsService {
    UserSettingsResponseDTO getCurrentUserSettings(User user);
    UserSettingsResponseDTO updateCurrentUserSettings(User user, UserSettingsRequestDTO request);
    UserSettingsResponseDTO uploadAvatar(User user, MultipartFile file);
}
