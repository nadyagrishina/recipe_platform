package com.nadyagrishina.recipesplatform.controller;

import com.nadyagrishina.recipesplatform.dto.request.UserRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.UserResponseDTO;
import com.nadyagrishina.recipesplatform.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@Validated
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<UserResponseDTO> getAllUsers(){
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public UserResponseDTO getUserById(@PathVariable Long id){
        return userService.getUserById(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public UserResponseDTO createUser(@Valid @RequestBody UserRequestDTO request){
        return userService.createUser(request);
    }

    @PutMapping("/{id}")
    public UserResponseDTO updateUser(@PathVariable Long id, @Valid @RequestBody UserRequestDTO request){
        return userService.updateUser(id,request);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
    }
}
