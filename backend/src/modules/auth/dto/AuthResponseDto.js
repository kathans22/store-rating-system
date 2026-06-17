const UserResponseDto = require('../../users/dto/UserResponseDto');

class AuthResponseDto {
  static fromSession(user, token) {
    return {
      user: UserResponseDto.fromEntity(user),
      token,
    };
  }
}

class MessageResponseDto {
  static from(message) {
    return { message };
  }
}

module.exports = { AuthResponseDto, MessageResponseDto };
