package com.nadyagrishina.recipesplatform.service.impl;

import com.nadyagrishina.recipesplatform.dto.request.UserRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.UserResponseDTO;
import com.nadyagrishina.recipesplatform.exception.ConflictException;
import com.nadyagrishina.recipesplatform.exception.NotFoundException;
import com.nadyagrishina.recipesplatform.mapper.UserMapper;
import com.nadyagrishina.recipesplatform.model.User;
import com.nadyagrishina.recipesplatform.repository.UserRepository;
import com.nadyagrishina.recipesplatform.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public List<UserResponseDTO> getAllUsers() {
        log.info("Fetching all users");
        return  userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        log.info("Fetching user {}", id);
        return userMapper.toDto(findUserById(id));
    }

    @Transactional
    @Override
    public UserResponseDTO createUser(UserRequestDTO request) {
        if (existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already in use.");
        }
        if (existsByUsername(request.getUsername())){
            throw new ConflictException("Username already in use.");
        }
        log.info("Creating new user {}", request.getEmail());
        User user = userMapper.toEntity(request);
        //TODO: HASH
        user.setPasswordHash(request.getPassword());
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    @Transactional
    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO request) {
        log.info("Updating user {}", id);

        User user = findUserById(id);

        if (!user.getEmail().equals(request.getEmail()) && existsByEmail(request.getEmail())){
            throw new ConflictException("Email already in use.");
        }
        if (!user.getUsername().equals(request.getUsername()) && existsByUsername(request.getUsername())){
            throw new ConflictException("Username already in use.");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setSurname(request.getSurname());
        
        User updatedUser = userRepository.save(user);
        return userMapper.toDto(updatedUser);
    }

    @Transactional
    @Override
    public void deleteUser(Long id) {
        log.info("Deleting user {}", id);
        userRepository.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    private User findUserById(Long id){
        return userRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("User " + id + " not found"));
    }
}