const { ROLES } = require('../../../shared/constants/roles');

class CreateUserDto {
  constructor({ name, email, address, password, role }) {
    this.name = name?.trim();
    this.email = email?.trim().toLowerCase();
    this.address = address?.trim();
    this.password = password;
    this.role = role;
  }

  static fromRequest(body) {
    return new CreateUserDto(body);
  }

  toPersistence(passwordHash) {
    return {
      name: this.name,
      email: this.email,
      address: this.address,
      passwordHash,
      role: this.role,
    };
  }
}

class RegisterUserDto {
  constructor({ name, email, address, password }) {
    this.name = name?.trim();
    this.email = email?.trim().toLowerCase();
    this.address = address?.trim();
    this.password = password;
    this.role = ROLES.USER;
  }

  static fromRequest(body) {
    return new RegisterUserDto(body);
  }

  toPersistence(passwordHash) {
    return {
      name: this.name,
      email: this.email,
      address: this.address,
      passwordHash,
      role: this.role,
    };
  }
}

module.exports = { CreateUserDto, RegisterUserDto };
