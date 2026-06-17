class CreateStoreDto {
  constructor({ name, email, address, ownerId }) {
    this.name = name?.trim();
    this.email = email?.trim().toLowerCase();
    this.address = address?.trim();
    this.ownerId = ownerId ? Number(ownerId) : null;
  }

  static fromRequest(body) {
    return new CreateStoreDto(body);
  }

  toPersistence() {
    return {
      name: this.name,
      email: this.email,
      address: this.address,
      ownerId: this.ownerId,
    };
  }
}

module.exports = CreateStoreDto;
