class StoreBrowseResponseDto {
  static fromEntity(store) {
    return {
      id: store.id,
      name: store.name,
      address: store.address,
      overallRating: store.overall_rating
        ? parseFloat(store.overall_rating)
        : null,
      userRating: store.user_rating ? parseInt(store.user_rating, 10) : null,
    };
  }

  static fromEntities(stores) {
    return stores.map(StoreBrowseResponseDto.fromEntity);
  }
}

module.exports = StoreBrowseResponseDto;
