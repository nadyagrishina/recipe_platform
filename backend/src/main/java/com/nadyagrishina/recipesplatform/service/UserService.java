package com.nadyagrishina.recipesplatform.service;

import com.nadyagrishina.recipesplatform.dto.request.UpdateUserRequestDTO;
import com.nadyagrishina.recipesplatform.dto.request.UserRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.UserResponseDTO;

public interface UserService {

    UserResponseDTO getCurrentUser(String username);

    UserResponseDTO updateCurrentUser(String username, UpdateUserRequestDTO request);

    void deleteCurrentUser(String username);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}