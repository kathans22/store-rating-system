class StoreResponseDto {
  static fromEntity(store) {
    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      ownerId: store.owner_id ?? store.ownerId ?? null,
      rating: store.rating !== undefined && store.rating !== null
        ? parseFloat(store.rating)
        : null,
    };
  }

  static fromEntities(stores) {
    return stores.map(StoreResponseDto.fromEntity);
  }
}

module.exports = StoreResponseDto;
