const AppError = require('../../shared/errors/AppError');
const { hashPassword, comparePassword } = require('../../shared/utils/password');
const { generateToken } = require('../../shared/utils/jwt');
const userRepository = require('../users/user.repository');
const { RegisterUserDto } = require('../users/dto/CreateUserDto');
const { LoginDto, UpdatePasswordDto } = require('./dto/AuthDto');
const UserResponseDto = require('../users/dto/UserResponseDto');
const { AuthResponseDto, MessageResponseDto } = require('./dto/AuthResponseDto');

class AuthService {
  async register(body) {
    const dto = RegisterUserDto.fromRequest(body);
    const existing = await userRepository.findByEmail(dto.email);

    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await userRepository.create(dto.toPersistence(passwordHash));
    const token = generateToken(user);

    return AuthResponseDto.fromSession(user, token);
  }

  async login(body) {
    const dto = LoginDto.fromRequest(body);
    const user = await userRepository.findByEmail(dto.email);

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isValid = await comparePassword(dto.password, user.password_hash);
    if (!isValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const { password_hash, ...safeUser } = user;
    const token = generateToken(safeUser);

    return AuthResponseDto.fromSession(safeUser, token);
  }

  async updatePassword(userId, body) {
    const dto = UpdatePasswordDto.fromRequest(body);
    const currentHash = await userRepository.findPasswordHashById(userId);

    if (!currentHash) {
      throw new AppError('User not found', 404);
    }

    const isValid = await comparePassword(dto.currentPassword, currentHash);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    const newHash = await hashPassword(dto.newPassword);
    await userRepository.updatePassword(userId, newHash);

    return MessageResponseDto.from('Password updated successfully');
  }

  async getProfile(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return { user: UserResponseDto.fromEntity(user) };
  }
}

module.exports = new AuthService();
