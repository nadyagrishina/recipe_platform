package com.nadyagrishina.recipesplatform.mapper;

import com.nadyagrishina.recipesplatform.dto.request.UserRequestDTO;
import com.nadyagrishina.recipesplatform.dto.response.UserResponseDTO;
import com.nadyagrishina.recipesplatform.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    //DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "recipes", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    User toEntity(UserRequestDTO dto);

    //Entity -> DTO
    UserResponseDTO toDto(User entity);

}
