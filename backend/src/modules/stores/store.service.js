const AppError = require('../../shared/errors/AppError');
const ListQueryDto = require('../../shared/dto/ListQueryDto');
const storeRepository = require('./store.repository');
const ratingRepository = require('../ratings/rating.repository');
const StoreBrowseResponseDto = require('./dto/StoreBrowseResponseDto');
const { SubmitRatingDto, RatingResponseDto } = require('../ratings/dto/RatingDto');

class StoreService {
  async browseStores(userId, query) {
    const listQuery = ListQueryDto.fromRequest(query);
    const filters = {
      name: listQuery.name,
      address: listQuery.address,
    };

    const stores = await storeRepository.findAllForUser(
      userId,
      filters,
      listQuery.sortBy,
      listQuery.sortOrder
    );

    return { stores: StoreBrowseResponseDto.fromEntities(stores) };
  }

  async submitRating(userId, storeId, body) {
    const dto = SubmitRatingDto.fromRequest(body);
    const store = await storeRepository.findById(storeId);

    if (!store) {
      throw new AppError('Store not found', 404);
    }

    const rating = await ratingRepository.upsert(userId, storeId, dto.rating);

    return { rating: RatingResponseDto.fromEntity(rating) };
  }
}

module.exports = new StoreService();
