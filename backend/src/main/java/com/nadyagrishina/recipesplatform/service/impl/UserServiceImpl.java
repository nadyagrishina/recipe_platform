package com.nadyagrishina.recipesplatform.service.impl;

import com.nadyagrishina.recipesplatform.dto.request.UpdateUserRequestDTO;
import com.nadyagrishina.recipesplatform.dto.request.UserRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.UserResponseDTO;
import com.nadyagrishina.recipesplatform.entity.User;
import com.nadyagrishina.recipesplatform.exception.ConflictException;
import com.nadyagrishina.recipesplatform.exception.ResourceNotFoundException;
import com.nadyagrishina.recipesplatform.mapper.UserMapper;
import com.nadyagrishina.recipesplatform.repository.UserRepository;
import com.nadyagrishina.recipesplatform.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO getCurrentUser(String username) {
        log.info("Fetching current user by username {}", username);
        return userMapper.toResponseDTO(findUserByUsername(username));
    }

    @Transactional
    @Override
    public UserResponseDTO updateCurrentUser(String username, UpdateUserRequestDTO request) {
        log.info("Updating current user by username {}", username);

        User user = findUserByUsername(username);

        if (request.getEmail() != null &&
                !user.getEmail().equals(request.getEmail()) &&
                existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already in use.");
        }

        if (request.getUsername() != null &&
                !user.getUsername().equals(request.getUsername()) &&
                existsByUsername(request.getUsername())) {
            throw new ConflictException("Username already in use.");
        }

        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }

        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.changePassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);

        return userMapper.toResponseDTO(updatedUser);
    }

    @Transactional
    @Override
    public void deleteCurrentUser(String username) {
        log.info("Deleting current user by username {}", username);
        User user = findUserByUsername(username);
        userRepository.delete(user);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    private User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User with username: " + username + " not found"));
    }
}