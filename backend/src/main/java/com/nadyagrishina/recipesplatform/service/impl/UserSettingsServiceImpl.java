package com.nadyagrishina.recipesplatform.service.impl;

import com.nadyagrishina.recipesplatform.dto.request.UserSettingsRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.UserSettingsResponseDTO;
import com.nadyagrishina.recipesplatform.entity.User;
import com.nadyagrishina.recipesplatform.entity.UserSettings;
import com.nadyagrishina.recipesplatform.exception.ResourceNotFoundException;
import com.nadyagrishina.recipesplatform.mapper.UserSettingsMapper;
import com.nadyagrishina.recipesplatform.repository.UserRepository;
import com.nadyagrishina.recipesplatform.repository.UserSettingsRepository;
import com.nadyagrishina.recipesplatform.service.UserSettingsService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
public class UserSettingsServiceImpl implements UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final UserSettingsMapper userSettingsMapper;
    private final UserRepository userRepository;

    public UserSettingsServiceImpl(UserSettingsRepository userSettingsRepository, UserSettingsMapper userSettingsMapper,  UserRepository userRepository) {
        this.userSettingsRepository = userSettingsRepository;
        this.userSettingsMapper = userSettingsMapper;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserSettingsResponseDTO updateCurrentUserSettings(User user, UserSettingsRequestDTO request) {
        User managedUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserSettings userSettings = userSettingsRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("UserSettings was not found"));

        if (userSettings.getImageUrl() != null &&
                (request.getImageUrl() == null || request.getImageUrl().isEmpty() || !request.getImageUrl().equals(userSettings.getImageUrl()))) {
            deletePhysicalFile(userSettings.getImageUrl());
        }

        userSettings.setName(request.getName());
        userSettings.setSurname(request.getSurname());
        userSettings.setDescription(request.getDescription());
        userSettings.setImageUrl(request.getImageUrl());
        userSettings.setMeasurementUnitSystem(request.getMeasurementUnitSystem());
        UserSettings updatedUserSettings = userSettingsRepository.save(userSettings);
        managedUser.setUpdatedAt(LocalDateTime.now());
        userRepository.save(managedUser);

        return userSettingsMapper.toResponseDTO(updatedUserSettings);
    }

    private void deletePhysicalFile(String relativePath) {
        try {
            String pathOnDisk = relativePath.startsWith("/") ? relativePath.substring(1) : relativePath;
            Path filePath = Paths.get(pathOnDisk);
            Files.deleteIfExists(filePath);
            log.info("Physical file deleted: {}", pathOnDisk);
        } catch (IOException e) {
            log.error("Failed to delete physical file: {}", relativePath, e);
        }
    }

    @Override
    public UserSettingsResponseDTO getCurrentUserSettings(User user) {
        User userEntity = userRepository.findById(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User was not found"));
        UserSettings userSettings = userSettingsRepository.findByUser(userEntity)
                .orElseThrow(() -> new ResourceNotFoundException("UserSettings was not found"));
        return userSettingsMapper.toResponseDTO(userSettings);
    }

    @Override
    @Transactional
    public UserSettingsResponseDTO uploadAvatar(User user, MultipartFile file) {
        try {
            User managedUser = userRepository.findById(user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            UserSettings settings = userSettingsRepository.findByUser(managedUser)
                    .orElseThrow(() -> new ResourceNotFoundException("Settings not found"));

            if (settings.getImageUrl() != null && !settings.getImageUrl().isEmpty()) {
                deletePhysicalFile(settings.getImageUrl());
            }

            String uploadDir = "uploads/avatars";
            Path copyLocation = Paths.get(uploadDir);
            if (!Files.exists(copyLocation)) {
                Files.createDirectories(copyLocation);
            }

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path targetPath = copyLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/uploads/avatars/" + fileName;
            settings.setImageUrl(imageUrl);

            UserSettings updatedSettings = userSettingsRepository.save(settings);

            managedUser.setUpdatedAt(LocalDateTime.now());
            userRepository.save(managedUser);

            return userSettingsMapper.toResponseDTO(updatedSettings);
        } catch (Exception e) {
            log.error("Could not store file", e);
            throw new RuntimeException("Could not store file. Error: " + e.getMessage());
        }
    }
}
