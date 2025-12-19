package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.request.UserRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.UserResponseDTO;

import java.util.List;

public interface UserService {
    List<UserResponseDTO> getAllUsers();
    UserResponseDTO getUserById(Long id);
    UserResponseDTO createUser(UserRequestDTO request);
    UserResponseDTO updateUser(Long id, UserRequestDTO request);
    void deleteUser(Long id);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
