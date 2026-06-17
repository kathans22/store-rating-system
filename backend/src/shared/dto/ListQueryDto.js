class ListQueryDto {
  constructor(query = {}) {
    this.name = query.name?.trim() || undefined;
    this.email = query.email?.trim() || undefined;
    this.address = query.address?.trim() || undefined;
    this.role = query.role || undefined;
    this.sortBy = query.sortBy || 'name';
    this.sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';
  }

  static fromRequest(query) {
    return new ListQueryDto(query);
  }

  getFilters() {
    return {
      name: this.name,
      email: this.email,
      address: this.address,
      role: this.role,
    };
  }
}

module.exports = ListQueryDto;
