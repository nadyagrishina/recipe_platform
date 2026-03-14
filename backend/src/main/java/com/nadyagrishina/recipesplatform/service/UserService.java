package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.request.UpdateUserRequestDTO;
import com.nadyagrishina.recipesplatform.dto.request.UserRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.UserResponseDTO;

public interface UserService {

    UserResponseDTO getCurrentUser(String email);
    UserResponseDTO updateCurrentUser(String email, UpdateUserRequestDTO request);
    void deleteCurrentUser(String email);
    UserResponseDTO createUser(UserRequestDTO request);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}