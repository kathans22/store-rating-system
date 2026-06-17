const UserResponseDto = require('./UserResponseDto');

class UserDetailResponseDto {
  static fromEntity(user, storeRating = null) {
    const base = UserResponseDto.fromEntity(user);
    if (user.role === 'STORE_OWNER') {
      return { ...base, storeRating };
    }
    return base;
  }
}

module.exports = UserDetailResponseDto;
