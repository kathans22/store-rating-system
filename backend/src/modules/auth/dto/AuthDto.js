class LoginDto {
  constructor({ email, password }) {
    this.email = email?.trim().toLowerCase();
    this.password = password;
  }

  static fromRequest(body) {
    return new LoginDto(body);
  }
}

class UpdatePasswordDto {
  constructor({ currentPassword, newPassword }) {
    this.currentPassword = currentPassword;
    this.newPassword = newPassword;
  }

  static fromRequest(body) {
    return new UpdatePasswordDto(body);
  }
}

module.exports = { LoginDto, UpdatePasswordDto };
