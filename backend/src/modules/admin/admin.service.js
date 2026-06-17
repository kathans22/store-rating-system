const AppError = require('../../shared/errors/AppError');
const { hashPassword } = require('../../shared/utils/password');
const ListQueryDto = require('../../shared/dto/ListQueryDto');
const userRepository = require('../users/user.repository');
const storeRepository = require('../stores/store.repository');
const ratingRepository = require('../ratings/rating.repository');
const { CreateUserDto } = require('../users/dto/CreateUserDto');
const UserResponseDto = require('../users/dto/UserResponseDto');
const UserDetailResponseDto = require('../users/dto/UserDetailResponseDto');
const CreateStoreDto = require('../stores/dto/CreateStoreDto');
const StoreResponseDto = require('../stores/dto/StoreResponseDto');
const DashboardStatsDto = require('./dto/DashboardStatsDto');

class AdminService {
  async getDashboardStats() {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      userRepository.countAll(),
      storeRepository.countAll(),
      ratingRepository.countAll(),
    ]);

    return DashboardStatsDto.from({ totalUsers, totalStores, totalRatings });
  }

  async createUser(body) {
    const dto = CreateUserDto.fromRequest(body);
    const existing = await userRepository.findByEmail(dto.email);

    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await userRepository.create(dto.toPersistence(passwordHash));

    return { user: UserResponseDto.fromEntity(user) };
  }

  async getManagedUsers(query) {
    const listQuery = ListQueryDto.fromRequest(query);
    const users = await userRepository.findManagedUsers(
      listQuery.getFilters(),
      listQuery.sortBy,
      listQuery.sortOrder
    );

    return { users: UserResponseDto.fromEntities(users) };
  }

  async getAllUsers(query) {
    const listQuery = ListQueryDto.fromRequest(query);
    const users = await userRepository.findAll(
      listQuery.getFilters(),
      listQuery.sortBy,
      listQuery.sortOrder
    );

    return { users: UserResponseDto.fromEntities(users) };
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    let storeRating = null;
    if (user.role === 'STORE_OWNER') {
      storeRating = await storeRepository.getAverageRatingByOwnerId(id);
    }

    return { user: UserDetailResponseDto.fromEntity(user, storeRating) };
  }

  async createStore(body) {
    const dto = CreateStoreDto.fromRequest(body);
    const existing = await storeRepository.findByEmail(dto.email);

    if (existing) {
      throw new AppError('Store email already exists', 409);
    }

    if (dto.ownerId) {
      const isValidOwner = await userRepository.existsStoreOwnerById(dto.ownerId);
      if (!isValidOwner) {
        throw new AppError('Invalid store owner', 400);
      }
    }

    const store = await storeRepository.create(dto.toPersistence());

    return { store: StoreResponseDto.fromEntity(store) };
  }

  async getStores(query) {
    const listQuery = ListQueryDto.fromRequest(query);
    const stores = await storeRepository.findAllWithRatings(
      listQuery.getFilters(),
      listQuery.sortBy,
      listQuery.sortOrder
    );

    return { stores: StoreResponseDto.fromEntities(stores) };
  }

  async getStoreOwners() {
    const owners = await userRepository.findStoreOwners();
    return { owners };
  }
}

module.exports = new AdminService();
