const ListQueryDto = require('../../shared/dto/ListQueryDto');
const storeRepository = require('../stores/store.repository');
const ratingRepository = require('../ratings/rating.repository');
const OwnerDashboardDto = require('./dto/OwnerDashboardDto');

class OwnerService {
  async getDashboard(ownerId, query) {
    const store = await storeRepository.findByOwnerId(ownerId);

    if (!store) {
      return OwnerDashboardDto.from({
        store: null,
        averageRating: null,
        raters: [],
      });
    }

    const listQuery = ListQueryDto.fromRequest(query);
    const [averageRating, raters] = await Promise.all([
      ratingRepository.getAverageByStoreId(store.id),
      ratingRepository.findRatersByStoreId(
        store.id,
        listQuery.sortBy,
        listQuery.sortOrder
      ),
    ]);

    return OwnerDashboardDto.from({ store, averageRating, raters });
  }
}

module.exports = new OwnerService();
