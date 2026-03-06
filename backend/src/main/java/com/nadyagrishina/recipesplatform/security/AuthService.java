package com.nadyagrishina.recipesplatform.security;

import com.nadyagrishina.recipesplatform.dto.auth.AuthRequest;
import com.nadyagrishina.recipesplatform.dto.auth.AuthResponse;
import com.nadyagrishina.recipesplatform.dto.auth.RegisterRequest;
import com.nadyagrishina.recipesplatform.entity.User;
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

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        var user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        String jwt = jwtService.generateToken(user.getUsername());

        return AuthResponse.builder()
                .token(jwt)
                .expiresIn(jwtService.getJwtExpiration())
                .build();
    }

    public AuthResponse authenticate(AuthRequest request){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userRepository.findUserByUsername(request.getUsername())
                .orElseThrow();
        var jwt = jwtService.generateToken(user.getUsername());
        return AuthResponse.builder()
                .token(jwt)
                .expiresIn(jwtService.getJwtExpiration())
                .build();
    }
}
