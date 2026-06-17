class OwnerDashboardDto {
  static from({ store, averageRating, raters }) {
    return {
      store,
      averageRating,
      raters: raters.map((rater) => ({
        id: rater.id,
        name: rater.name,
        email: rater.email,
        address: rater.address,
        rating: parseInt(rater.rating, 10),
        updatedAt: rater.updated_at,
      })),
    };
  }
}

module.exports = OwnerDashboardDto;
