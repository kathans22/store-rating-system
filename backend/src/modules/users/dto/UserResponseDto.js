class UserResponseDto {
  static fromEntity(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };
  }

  static fromEntities(users) {
    return users.map(UserResponseDto.fromEntity);
  }
}

module.exports = UserResponseDto;
