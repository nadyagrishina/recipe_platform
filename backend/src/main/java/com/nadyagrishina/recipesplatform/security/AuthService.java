package com.nadyagrishina.recipesplatform.security;

import com.nadyagrishina.recipesplatform.dto.auth.AuthRequest;
import com.nadyagrishina.recipesplatform.dto.auth.AuthResponse;
import com.nadyagrishina.recipesplatform.dto.auth.RegisterRequest;
import com.nadyagrishina.recipesplatform.entity.User;
import com.nadyagrishina.recipesplatform.exception.ConflictException;
import com.nadyagrishina.recipesplatform.mapper.UserMapper;
import com.nadyagrishina.recipesplatform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email already exists.");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Username already exists.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .name(request.getName())
                .surname(request.getSurname())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        String jwt = jwtService.generateToken(savedUser.getUsername());

        return AuthResponse.builder()
                .token(jwt)
                .expiresIn(jwtService.getJwtExpiration())
                .user(userMapper.toDto(savedUser))
                .build();
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        String jwt = jwtService.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(jwt)
                .expiresIn(jwtService.getJwtExpiration())
                .user(userMapper.toDto(user))
                .build();
    }
}